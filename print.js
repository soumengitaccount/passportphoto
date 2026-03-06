const PDFDocument = require('pdfkit');
const fs = require('fs');
const sharp = require('sharp');

// A4 size in points (300 DPI equivalent scaling)
const A4_WIDTH = 595;   // 8.27 inch
const A4_HEIGHT = 842;  // 11.69 inch

// Passport photo size (35mm x 45mm)
// Convert mm → points (1 mm ≈ 2.835 pt)
const PHOTO_WIDTH = 30 * 2.835;
const PHOTO_HEIGHT = 40 * 2.835;

const PHOTO_COUNT = 4; // 🔹 change this for custom range

async function createA4Print(img, photo_count) {

    if(photo_count==''){
        photo_count = PHOTO_COUNT;
    }
    const doc = new PDFDocument({
        size: 'A4',
        margin: 1
    });
    const FileName = 'passport_A4_print_'+Date.now()+'.pdf' ;

    doc.pipe(fs.createWriteStream('./pdf/'+FileName));

    const imageBuffer = await sharp('uploads/'+img)
        .resize(Math.round(PHOTO_WIDTH), Math.round(PHOTO_HEIGHT))
        .toBuffer();

    const spacing = 10;
    let x = 20;
    let y = 20;
    let placed = 0;

    while (placed < photo_count) {

        doc.image(imageBuffer, x, y, {
            width: PHOTO_WIDTH,
            height: PHOTO_HEIGHT
        });

        x += PHOTO_WIDTH + spacing;

        if (x + PHOTO_WIDTH > A4_WIDTH) {
            x = 20;
            y += PHOTO_HEIGHT + spacing;
        }

        placed++;
    }

    doc.end();
    console.log("A4 Print PDF Created!");
    return FileName;
}
module.exports.createA4Print=createA4Print;
// createA4Print();