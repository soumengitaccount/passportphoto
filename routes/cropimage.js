const faceapi = require('face-api.js');
const canvas = require('canvas');
// const tf = require('@tensorflow/tfjs-node');
// const tf = require('@tensorflow/tfjs-node-gpu');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { removeBackground } = require('@imgly/background-removal-node');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function generatePassportPhoto(inputimage) {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');

  const img = await canvas.loadImage(inputimage);

  const detections = await faceapi.detectSingleFace(img);

  if (!detections) {
    console.log("No face detected.");
    return;
  }

  const { x, y, width, height } = detections.box;

  // Add padding for proper passport framing
  const pad = height * 0.5;

  const left = Math.max(0, x - pad);
  const top = Math.max(0, y - pad);
  const cropWidth = Math.min(img.width - left, width + pad * 2);
  const cropHeight = Math.min(img.height - top, height + pad * 2);
  const FileName = 'passport_photo_'+Date.now()+'.jpg' ;
  await sharp(inputimage)
    .extract({
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    })
    // Indian passport size 35mm x 45mm at 300 DPI
    .resize(413, 531)
    .jpeg({ quality: 100 })
    .toFile('./uploads/'+FileName);

  console.log("Passport size photo saved!");
  // removeBg(FileName);
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     resolve(FileName);
  //   }, 1500);
  // });
  return FileName;
}


async function removeBg(image) {
  try {
    const inputBuffer = fs.readFileSync(image);
     // Convert image to PNG first (fix decode errors)
     const converted = await sharp(inputBuffer)
      .toColourspace("rgb")  // convert CMYK → RGB
      .png()
      .toBuffer();

    // Remove background (returns transparent PNG buffer)
    const output = await removeBackground(converted);
    const FileName = 'passport_no_bg-'+Date.now()+'.png' ;
    const FileNameForWihiteBackground = 'passport_white-'+Date.now()+'.jpg' ;

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
  } catch (error) {
    console.error("Error:", error);
  }
}
module.exports.generatePassportPhoto= generatePassportPhoto;