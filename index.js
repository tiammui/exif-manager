//
// Piexifjs exercise
// =================
//

// Reading a Photo’s Exif Data
// ---------------------------

// Modules required for most of these exercises
const { readFileSync } = require('fs');
const { load, TAGS, ImageIFD, ExifIFD, GPSIFD } = require('piexifjs');

// Handy utility functions
const getBinaryDataFromJpegFile = (filename) =>
  readFileSync(filename).toString('binary');
const getExifFromBase64File = (filename) =>
  load(getBinaryDataFromBase64Data('./images/img.base64'));
const getExifFromJpegFile = (filename) =>
  load(getBase64DataFromJpegFile(filename));

const getBinaryDataFromBase64Data = (filename) => {
  let data = readFileSync(filename);
  return Buffer.from(data.toString(), 'base64').toString('binary');
};

// console.log(getData('./images/img.base64'));
// console.log(readFileSync('./images/img.base64').toString());

// Get the Exif data for the palm tree photos
// (Assumes that the photos “palm tree 1.jpg” and “palm tree 2.jpg”
// are in a directory named “images”)
const palm1Exif = getExifFromJpegFile('./images/palm tree 1.jpg');
const palm2Exif = getExifFromJpegFile('./images/palm tree 2.jpg');
const palmExifs = [palm1Exif, palm2Exif];

// Show the Exif data for the two palm tree photos:
console.log(palm1Exif);
console.log(palm2Exif);

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

// Show the Exif data for the two palm tree photos in
// an easier to read format:
console.log(palm1Exif);
console.log(palm2Exif);

// What Device Took the Photo, and What OS Version Did It Use?
// -----------------------------------------------------------

// Show the make, model, and OS versions of the devices that
// took the palm tree photos
for (const [index, exif] of palmExifs.entries()) {
  console.log(`Device information - Image ${index}`);
  console.log('----------------------------');
  console.log(`Make: ${exif['0th'][ImageIFD.Make]}`);
  console.log(`Model: ${exif['0th'][ImageIFD.Model]}`);
  console.log(`OS version: ${exif['0th'][ImageIFD.Software]}\n`);
}

// When was the Photo Taken?
// -------------------------

// Show the dates and times when the palm tree photos were taken
for (const [index, exif] of palmExifs.entries()) {
  const dateTime = exif['0th'][ImageIFD.DateTime];
  const dateTimeOriginal = exif['Exif'][ExifIFD.DateTimeOriginal];
  const subsecTimeOriginal = exif['Exif'][ExifIFD.SubSecTimeOriginal];

  console.log(`Date/time taken - Image ${index}`);
  console.log('-------------------------');
  console.log(`DateTime: ${dateTime}`);
  console.log(`DateTimeOriginal: ${dateTimeOriginal}.${subsecTimeOriginal}\n`);
}

// Where was the Photo Taken?
// --------------------------

// Show the latitudes and longitudes where the palm tree photos were taken
for (const [index, exif] of palmExifs.entries()) {
  const latitude = exif['GPS'][GPSIFD.GPSLatitude];
  const latitudeRef = exif['GPS'][GPSIFD.GPSLatitudeRef];
  const longitude = exif['GPS'][GPSIFD.GPSLongitude];
  const longitudeRef = exif['GPS'][GPSIFD.GPSLongitudeRef];

  console.log(`Coordinates - Image ${index}`);
  console.log('---------------------');
  console.log(`Latitude: ${latitude} ${latitudeRef}`);
  console.log(`Longitude: ${longitude} ${longitudeRef}\n`);
}
