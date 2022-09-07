// const fileTypes = [
//     "image/apng",
//     "image/bmp",
//     "image/gif",
//     "image/jpeg",
//     "image/pjpeg",
//     "image/png",
//     "image/svg+xml",
//     "image/tiff",
//     "image/webp",
//     "image/x-icon",
//   ];
//   function validFileType(file) {
//     return fileTypes.includes(file.type);
//   }
//   function setBackGround() {

//     for (const file of curFiles) {
//       if (validFileType(file)) {
//         let backgroundImg = URL.createObjectURL(file);
//         cart.style.backgroundImage = `url(${backgroundImg})`;
//       }
//     }
//   }
