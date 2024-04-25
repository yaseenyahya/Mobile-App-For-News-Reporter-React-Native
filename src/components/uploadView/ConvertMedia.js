import RNVideoHelper from "react-native-video-helper";
import ImageResizer from "react-native-image-resizer";
import { copyFile, CachesDirectoryPath } from "react-native-fs";
export default class ConvertMedia {
  uuID = null;
  OriginalFileUriSource = null;
  newFileUriSource = null;
  isVideo = false;
  IsImage = false;
  async compress(uuID, sourceUri, compressMediaProgressCallBack) {
    this.uuID = uuID;
    this.OriginalFileUriSource = sourceUri;
    let sourceUriToLowerCase = sourceUri.toLowerCase().toString();
    this.IsVideo = sourceUriToLowerCase.endsWith("mp4");
    this.IsImage =
      sourceUriToLowerCase.endsWith("jpg") ||
      sourceUriToLowerCase.endsWith("jpeg") ||
      sourceUriToLowerCase.endsWith("bmp") ||
      sourceUriToLowerCase.endsWith("png") ||
      sourceUriToLowerCase.endsWith("gif");

    if (this.IsVideo) {
      try {
        await RNVideoHelper.compress(sourceUri, {
          // startTime: 10, // optional, in seconds, defaults to 0
          // endTime: 100, //  optional, in seconds, defaults to video duration
          quality: "low", // default low, can be medium or high
          defaultOrientation: 0, // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
        })
          .progress((value) => {
            compressMediaProgressCallBack(value * 50, uuID);
          })
          .then((compressedUri) => {
            this.newFileUriSource = compressedUri;
          });
      } catch (Exception) {
        compressMediaProgressCallBack(50, uuID);
        this.newFileUriSource = sourceUri;
      }
    } else if (this.IsImage) {
      await ImageResizer.createResizedImage(
        sourceUri,
        1080.0,
        720.0,

        "JPEG",
        30,
        0,
        null
      )
        .then((response) => {
          compressMediaProgressCallBack(50, uuID);

          this.newFileUriSource = response.path;
        })
        .catch((err) => {
          console.log(err);
          compressMediaProgressCallBack(50, uuID);
          this.newFileUriSource = sourceUri;
        });
    } else {
      let newFileSource = CachesDirectoryPath + uuID;
      try {
        await copyFile(sourceUri, newFileSource);
        this.newFileUriSource = newFileSource;
      } catch (e) {
        alert(
          "Memory full. Please cleanup some memory to for further process."
        );
      }
    }
  }
}
