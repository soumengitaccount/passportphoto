

// const { Rembg } = require("@xixiyahaha/rembg-node");

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { removeBackground } = require('@imgly/background-removal-node');


async function removeBg() {
    // try {
      const inputBuffer = fs.readFileSync("passport_photo-1772687551326.jpeg");
      const FileNameWeb = 'webapp-'+Date.now()+'.webp' ;

       // Convert image to PNG first (fix decode errors)
       const converted = await sharp(inputBuffer).png().toBuffer();
  
      // Remove background (returns transparent PNG buffer)
      const output = await removeBackground(inputBuffer);
      const FileName = 'passport_no_bg-'+Date.now()+'.png' ;
      const FileNameForWihiteBackground = 'passport_white-'+Date.now()+'.jpg' ;
      fs.writeFileSync("output.png", output);
      // Resize to passport size (413x531 for 35mm x 45mm @ 300 DPI)
      await sharp(output)
        .resize(413, 531)
        .png()
        .toFile(FileName);
  
        // await sharp(FileName)
        // .flatten({ background: '#ffffff' })
        // .jpeg({ quality: 100 })
        // .toFile(FileNameForWihiteBackground);
  
      console.log("Background removed successfully!");
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  }
  async function removeBgOLD(){
    const input = sharp("passport_photo-1772687551326.jpeg");

	// optional arguments
	const rembg = new Rembg({
		logging: true,
	});

	const output = await rembg.remove(input);

	await output.webp().toFile("test-output.webp");
  }
  removeBg();