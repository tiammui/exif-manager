const { readFileSync } = require('fs');
const piexif = require('piexifjs');
const { load, TAGS, ImageIFD, ExifIFD, GPSIFD } = require('piexifjs');

// Handy utility functions
const getBinaryDataFromJpegFile = (filename) =>
  readFileSync(filename).toString('binary');
const getBinaryDataFromBase64File = (filename) => {
  let data = readFileSync(filename);
  return Buffer.from(data.toString(), 'base64').toString('binary');
};
const getBinaryDataFromBase64Data = (base64Data) => {
  return Buffer.from(base64Data, 'base64').toString('binary');
};

const getExifFromBase64File = (base64Filename) =>
  load(getBinaryDataFromBase64File(base64Filename));
const getExifFromBinaryData = (binaryData) => load(binaryData);
const getExifFromJpegFile = (filename) =>
  load(getBinaryDataFromJpegFile(filename));

// console.log(getExifFromBase64File('./images/img.base64'));


// Making Exif Data Easier to Read
// -------------------------------
// Given a Piexifjs object, this function displays its Exif tags
// in a human-readable format
function debugExif(exif) {
  for (const ifd in exif) {
    if (ifd == 'thumbnail') {
      const thumbnailData = exif[ifd] === null ? 'null' : exif[ifd];
      console.log(`- thumbnail: ${thumbnailData}`);
    } else {
      console.log(`- ${ifd}`);
      for (const tag in exif[ifd]) {
        console.log(`    - ${TAGS[ifd][tag]['name']}: ${exif[ifd][tag]}`);
      }
    }
  }
}

/**
 *
 * @param binaryData binary format of the image to be updated (can use getBinaryDataFromBase64Data)
 * @param mapInfo {string} JSON version of the map info
 *
 * @return the base64 of the updated image
 */
function updateUserComment(binaryData, mapInfo) {
  // Load hotel photo
  // (Assumes that the photo “hotel original.jpg”
  // is in a directory named “images”)
  const imageExif = getExifFromBinaryData(binaryData);

  // Copy the original photo’s picture and Exif data, with UserComment
  const newExif = {
    '0th': { ...imageExif['0th'] },
    Exif: { ...imageExif['Exif'] },
    GPS: { ...imageExif['GPS'] },
    Interop: { ...imageExif['Interop'] },
    '1st': { ...imageExif['1st'] },
    thumbnail: null,
  };

  newExif['Exif'][piexif.ExifIFD.UserComment] = mapInfo;

  debugExif(newExif)

  // Convert the new Exif object into binary form
  const newExifBinary = piexif.dump(newExif);

  // Embed the Exif data into the image data
  const newPhotoData = piexif.insert(newExifBinary, binaryData);

  // return the new photo as base64
  return Buffer.from(newPhotoData, 'binary').toString('base64');
}

