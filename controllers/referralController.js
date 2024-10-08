const db = require("../models");
const {
  referralSchema,
  updateReferralSchema,

  updateReferralRequestStatusSchema,
} = require("../validation/referralValidation");
/**
 * @desc Récupérer les Referrals
 * @route GET /api/referrals/
 * @access Private (only logged in user)
 */
const getAllReferrals = async (req, res) => {
  try {
    const referrals = await db.Referral.findAll({
      include: {
        model: db.User,
        as: "sender",
        attributes: {
          exclude: ["password"],
        },
        include: {
          model: db.Profile,
          as: "Profile",
        },
      },
    });
    res.status(200).json(referrals);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * @desc Récupérer un referral par ID
 * @route GET /api/referrals/:id
 * @access Private (only logged in user)
 */

const getReferralById = async (req, res) => {
  try {
    const referral = await db.Referral.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: {
            exclude: ["password"],
          },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.User,
          as: "receiver",
          attributes: {
            exclude: ["password"],
          },
          include: {
            model: db.Profile,
            as: "Profile",
          },
        },
        {
          model: db.Client,
          as: "client",
        },
      ],
    });

    if (!referral) {
      return res.status(404).json({ error: "Referral non trouvé" });
    }
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ eroor: error.message });
  }
};
/**
 * @desc Récupérer mes referral créés
 * @route GET /api/myreferrals/:id
 * @access Private (only user himsSelf)
 */

const getMyReferrals = async (req, res) => {
  const userId = req.user.id;

  try {
    const referrals = await db.Referral.findAll({
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: { exclude: ["password"] },
        },
        {
          model: db.User,
          as: "receiver",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    const sentReferrals = referrals.filter(
      (referral) => referral.senderId === userId
    );
    const receivedReferrals = referrals.filter(
      (referral) => referral.receiverId === userId
    );

    res.status(200).json({ sentReferrals, receivedReferrals });
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
/**
 * @desc Supprime un referral
 * @route DELETE /api/referrals/:id
 * @access Private (only user himself)
 */

const deleteReferral = async (req, res) => {
  const { id } = req.params;

  try {
    const referral = await db.Referral.findOne({
      where: { id },
      include: {
        model: db.User,
        as: "sender",
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!referral) {
      return res.status(404).json({ error: "Referral non trouvé" });
    }
    if (req.user.id !== referral.senderId) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à supprimer le referral",
      });
    }

    // Supprimer le referral de la base de données
    await referral.destroy();
    res.status(200).json({ message: "Referral supprimer aved succé" });
  } catch (error) {
    console.error("Erreur lors de la suppression du referral:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du referral" });
  }
};

/**
 * @desc Créer un referral
 * @route POST /api/referrals
 * @access Private (only logged in user)
 */

const createReferral = async (req, res) => {
  const {
    typeDeReferral,
    natureDuContact,
    lieu,
    commentaire,
    honnoraire,
    price,
    receiverId,
    clientInfo,
  } = req.body;
  const senderId = req.user.id;

  try {
    // Vérifier si le client existe déjà
    let client = await db.Client.findOne({
      where: { email: clientInfo.email },
    });

    // Si le client n'existe pas, le créer
    if (!client) {
      client = await db.Client.create({
        nom: clientInfo.nom,
        email: clientInfo.email,
        telephone: clientInfo.telephone || null,
      });
    }

    // Définir isPending à true si receiverId est fourni
    const isPending = !!receiverId;

    // Créer le Referral en associant le client
    const referral = await db.Referral.create({
      typeDeReferral,
      natureDuContact,
      lieu,
      commentaire,
      honnoraire,
      price,
      senderId,
      receiverId:  null,
      clientId: client.id,
      isPending, // Définit isPending à true si receiverId est présent
    });

    // Si un receiverId est fourni, créer une ligne dans ReferralAttributes
    if (receiverId) {
      await db.ReferralAttributes.create({
        referralId: referral.id,
        senderId,
        receivedId: receiverId,
        status: "pending", // Statut initial dans ReferralAttributes
      });
    }

    res.status(201).json({ message: "Referral créé avec succès", referral });
  } catch (error) {
    console.error("Erreur lors de la création du referral:", error);
    res.status(500).json({ error: "Erreur lors de la création du referral" });
  }
};


const attributeReferral = async (req, res) => {
  const { id } = req.params; // ID of the referral
  const senderId = req.user.id; // The logged-in user (sender)
  const { receivedId } = req.body; // The user who will receive the referral

  try {
    // Check if the referral has already been attributed to this receiver
    const isExistingAttribute = await db.ReferralAttributes.findOne({
      where: { referralId: id, receivedId },
    });

    if (isExistingAttribute) {
      return res
        .status(401)
        .json({ message: "You have already sent a request to this referral" });
    }

    // Fetch the referral with the status "envoyé"
    const referral = await db.Referral.findOne({
      where: { id, status: "envoyé" },
    });

    if (!referral) {
      return res
        .status(404)
        .json({ message: "Referral introuvable ou déjà attribué" });
    }

    // Create a ReferralAttributes entry with "pending" status
    const referralAttribute = await db.ReferralAttributes.create({
      referralId: id,
      receivedId, // The receiving user
      senderId, // The posting user (foreign key)
      status: "pending",
    });

    // Set isPending to true when status is "pending"
    referral.isPending = true;
    await referral.save(); // Save the updated referral

    res.status(201).json({
      message: "Referral request sent successfully and is now pending",
      referralAttribute,
    });
  } catch (error) {
    console.error("Error while sending referral request:", error);
    res.status(500).json({ error: "Error while sending referral request" });
  }
};


/**
 * @desc Demander un referral
 * @route POST /api/referrals/:id/request
 * @access Private (only logged in user)
 */
const requestReferral = async (req, res) => {
  const { id } = req.params; // ID du referral
  const requesterId = req.user.id;

  try {
    const isExistingRequest = await db.ReferralRequest.findOne({
      where: { requesterId, referralId: id },
    });

    if (isExistingRequest) {
      return res
        .status(401)
        .json({ message: "vous avez déja envoyer une demande a ce referral" });
    }
    const referral = await db.Referral.findOne({
      where: { id, status: "envoyé" },
    });
    if (!referral) {
      return res
        .status(404)
        .json({ message: "Referral non trouvé ou déjà attribué" });
    }
    const { senderId } = referral;
    const referralRequest = await db.ReferralRequest.create({
      referralId: id,
      requesterId,
      status: "pending",
      senderId,
    });

    res.status(201).json({
      message: "Demande de referral envoyée avec succès",
      referralRequest,
    });
  } catch (error) {
    console.error("Erreur lors de la demande de referral:", error);
    res.status(500).json({ error: "Erreur lors de la demande de referral" });
  }
};

/**
 * @desc Mettre à jour le statut d'un referral
 * @route PATCH /api/referrals/:id/status
 * @access Private (only logged in user)
 */
const updateReferralStatus = async (req, res) => {
  const { id } = req.params; // id du Referral
  const { status } = req.body;

  // //Validation de la requête
  // const { error } = updateReferralSchema.validate(
  //   { status },
  //   { abortEarly: false }
  // );
  // if (error) {
  //   return res
  //     .status(400)
  //     .json({ message: error.details.map((detail) => detail.message) });
  // }

  try {
    const referral = await db.Referral.findOne({ where: { id } });
    if (!referral) {
      return res.status(404).json({ message: "Referral non trouvé" });
    }
    if (referral.receiverId === null) {
      return res.status(403).json({
        message: "il faut une attribution du referral avant de continuer",
      });
    }

    referral.status = status;
    await referral.save();

    res
      .status(200)
      .json({ message: "Statut du referral mis à jour", referral });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut du referral:",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du statut du referral" });
  }
};
/**
 * @desc Mettre à jour un referral
 * @route PUT /api/referrals/:id
 * @access Private (only logged in user)
 */
const updateReferral = async (req, res) => {
  const { id } = req.params; // ID du referral
  const {
    typeDeReferral,
    natureDuContact,
    lieu,
    commentaire,
    honnoraire,
    price,
    receiverId,
    status,
  } = req.body;

  // // Validation de la requête (décommenter si validation ajoutée)
  // const { error } = updateReferralSchema.validate(req.body, { abortEarly: false });
  // if (error) {
  //   return res.status(400).json({ message: error.details.map((detail) => detail.message) });
  // }

  try {
    // Récupérer le referral existant
    const referral = await db.Referral.findOne({ where: { id } });

    if (!referral) {
      return res.status(404).json({ message: "Referral non trouvé" });
    }

    // Vérification des autorisations (optionnel : à adapter selon les rôles)
    if (req.user.id !== referral.senderId) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce referral",
      });
    }

    // Mise à jour du referral avec les nouvelles données
    referral.typeDeReferral = typeDeReferral || referral.typeDeReferral;
    referral.natureDuContact = natureDuContact || referral.natureDuContact;
    referral.lieu = lieu || referral.lieu;
    referral.commentaire = commentaire || referral.commentaire;
    referral.honnoraire = honnoraire || referral.honnoraire;
    referral.price = price || referral.price;
    referral.receiverId = receiverId || referral.receiverId;
    referral.status = status || referral.status;

    // Sauvegarder les modifications
    await referral.save();

    res
      .status(200)
      .json({ message: "Referral mis à jour avec succès", referral });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du referral:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du referral" });
  }
};

module.exports = {
  createReferral,
  requestReferral,
  updateReferral,
  updateReferralStatus,
  getAllReferrals,
  getReferralById,
  deleteReferral,
  getMyReferrals,
  attributeReferral,
};
