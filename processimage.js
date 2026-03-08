const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
// const { removeBackground } = require("./rembg.js");
const { removeBackground } = require("@imgly/background-removal-node");
async function processImage(image,color){

// read image
const buffer = fs.readFileSync("uploads/"+image);
// const buffer = fs.readFileSync("uploads/passport_photo_1772953675376.jpg");

// convert to blob
const blobimagefile = new Blob([buffer], { type: "image/jpeg" });

// remove background
const blob = await removeBackground(blobimagefile);

// convert blob → buffer
const arrayBuffer = await blob.arrayBuffer();
const outputBuffer = Buffer.from(arrayBuffer);

// load image for canvas
const img = await loadImage(outputBuffer);

// create canvas
const canvas = createCanvas(img.width, img.height);
const ctx = canvas.getContext("2d");

// add background color
ctx.fillStyle = color;//? color:"#87CEFA";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// draw foreground image
ctx.drawImage(img, 0, 0);

// save output
const finalBuffer = canvas.toBuffer("image/png");
filename = 'output_' + Date.now() +'.png';

fs.writeFileSync("uploads/"+filename, finalBuffer);

console.log("Image saved: output.png");
return filename;
}
module.exports.processImage = processImage;
// processImage();