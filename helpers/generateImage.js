const Jimp = require("jimp");
const path = require("path");

const createDefaultProfileImage = async (initials) => {
  // Convert initials to uppercase
  const uppercaseInitials = initials.toUpperCase();

  // Load the Monserrat font
//   const fontPath = path.join(__dirname, "../fonts/monserrat.fnt");
//   const font = await Jimp.loadFont(fontPath);

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);


  // Create an image
  const image = new Jimp(100, 100, "#357edd");

  // Print initials on the image
  image.print(
    font,
    0,
    0,
    {
      text: uppercaseInitials,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    100,
    100
  );

  const imagePath = `./uploads/${uppercaseInitials}.png`;
  await image.writeAsync(imagePath);

  return imagePath;
};

module.exports = { createDefaultProfileImage };
