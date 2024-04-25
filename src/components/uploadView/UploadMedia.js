import ConvertMedia from "./ConvertMedia";
import { UploadFileStatusType } from "./UploadFileStatusType";
import ApiCalls from "../../api/ApiCalls";
import { Upload } from "react-native-tus-client";
import moment from "moment";
import ResourcesData from "../../ResourcesData";
import {UploadFileVersion} from "./UploadFileVersion";
import * as MediaLibrary from "expo-media-library"
export default class UploadMedia {
  init(
    getFileUploadObjectCallBack,
    uploadMediaProgressCallBack,
    uploadMediaCompleteCallBack,
    uploadMediaFailedCallBack,
    compressMediaCompleteCallBack,
    fileIDGeneratedCallBack,
    uploadMediaStartCallBack
  ) {
    this.getFileUploadObjectCallBack = getFileUploadObjectCallBack;
    this.uploadMediaProgressCallBack = uploadMediaProgressCallBack;
    this.uploadMediaCompleteCallBack = uploadMediaCompleteCallBack;
    this.uploadMediaFailedCallBack = uploadMediaFailedCallBack;
    this.compressMediaCompleteCallBack = compressMediaCompleteCallBack;
    this.fileIDGeneratedCallBack = fileIDGeneratedCallBack;
    this.uploadMediaStartCallBack = uploadMediaStartCallBack;
  }
  lastUploadIndex = -1;
  uploadStarted = false;
  tusUploadRef = [];
  async startIfNotStarted() {
    if (!this.uploadStarted) {
      this.uploadStarted = true;
      let uploadFiles = this.getFileUploadObjectCallBack();

      let currentUploadFiles = null;

      let this_ = this;

      if (uploadFiles.length > 0) {
        currentUploadFiles = uploadFiles.filter(function(obj, index) {
          return (
            obj.status == UploadFileStatusType.pending &&
            index > this_.lastUploadIndex
          );
        });

        if (
          !currentUploadFiles ||
          (currentUploadFiles && currentUploadFiles.length == 0)
        ) {
          currentUploadFiles = uploadFiles.filter(function(obj, index) {
            return (
              obj.status == UploadFileStatusType.failed &&
              index > this_.lastUploadIndex
            );
          });
        }

        if (
          !currentUploadFiles ||
          (currentUploadFiles && currentUploadFiles.length == 0)
        ) {
          currentUploadFiles = uploadFiles.filter(function(obj) {
            return obj.status == UploadFileStatusType.pending;
          });
        }
        if (
          !currentUploadFiles ||
          (currentUploadFiles && currentUploadFiles.length == 0)
        ) {
          currentUploadFiles = uploadFiles.filter(function(obj) {
            return obj.status == UploadFileStatusType.failed;
          });
        }
      }

      //console.log(currentUploadFiles);
      if (currentUploadFiles && currentUploadFiles.length > 0) {
        let currentUploadFile = currentUploadFiles[0];
        this.uploadMediaStartCallBack(currentUploadFile.uuID);
        let fileIDGenerated = currentUploadFile.fileIDGenerated;
        if (fileIDGenerated == null) {
          try {
            await ApiCalls.getUploadID().then(response => {
              response.json().then(responseJson => {
                fileIDGenerated = responseJson;
                this.fileIDGeneratedCallBack(
                  currentUploadFile.uuID,
                  responseJson
                );
              });
            });
          } catch (ex) {
            this.uploadMediaFailedCallBack(currentUploadFile.uuID);
          }
        }

        let itemIndex = uploadFiles.findIndex(function(element) {
          return element.uuID == currentUploadFile.uuID;
        });
        this.lastUploadIndex = itemIndex;
        let compressFileUri = currentUploadFile.compressFileUri;

        if (compressFileUri == null) {
          var lastProgressForCompression = 0;
          let convertMediaObject = new ConvertMedia();
          await convertMediaObject.compress(
            currentUploadFile.uuID,
            currentUploadFile.fileUri,(value, uuID)=>{
              value = Math.round(value);
              if (lastProgressForCompression != value && lastProgressForCompression + 2 < value) {
                lastProgressForCompression = value;
            this.uploadMediaProgressCallBack(value, uuID);
            }
          }
          );
        
          compressFileUri = convertMediaObject.newFileUriSource;

          this.compressMediaCompleteCallBack(
            currentUploadFile.uuID,
            convertMediaObject.newFileUriSource
          );
        }
        var fileExtension = null;
        var filename = null;
        if(Platform.OS == "ios"){
          let assetInfo =  await MediaLibrary.getAssetInfoAsync(currentUploadFile.fileUri.slice(5));
          fileExtension = assetInfo.filename.substr(
            assetInfo.filename.lastIndexOf(".") + 1
          );
          filename = assetInfo.filename .replace("." + fileExtension, "");

          fileExtension = fileExtension.toLowerCase() == "heic" ? "jpg" : fileExtension;
         }else{
         fileExtension = currentUploadFile.fileUri.substr(
          currentUploadFile.fileUri.lastIndexOf(".") + 1
        );

         filename = currentUploadFile.fileUri
          .substring(
            currentUploadFile.fileUri.lastIndexOf("/") + 1,
            currentUploadFile.fileUri.length
          )
          .replace("." + fileExtension, "");
          }
        var datetimeNow = moment().format("DD-MM-YYYY_hh-mm-ss_a");

        let filenameCreated =
          fileIDGenerated +
          "_" +
          filename +
          "_NewsDesk_" +
          ResourcesData.MainViewScreenResources.LoginJsonData.name +
          "_" +
          ResourcesData.MainViewScreenResources.LoginJsonData.bureau +
          "_" +
          ResourcesData.MainViewScreenResources.LoginJsonData.station +
          "_ " +
          datetimeNow +
          "." +
          fileExtension;
          filenameCreated = filenameCreated.split(' ').join('_');
        var lastProgressForUpload = 0;

       var metadata =  null;
     
        if(currentUploadFile.version == UploadFileVersion.fastapp){
          metadata = {
            filename: filenameCreated,
            dir: ResourcesData.MainViewScreenResources.LoginJsonData.folderpath,
            uusername:ResourcesData.MainViewScreenResources.LoginJsonData.username,
            upassword:ResourcesData.MainViewScreenResources.LoginJsonData.password
          };
        }else{
          metadata = {
            filename: filenameCreated,
            dir: ResourcesData.MainViewScreenResources.LoginJsonData.folderpath
          };
        }


        console.log(compressFileUri);
       
        const upload = new Upload(compressFileUri, {
          endpoint:
            ResourcesData.MainViewScreenResources.LoginJsonData.asyncurlapp, // use your tus server endpoint instead
          onError: error => {
            console.log(error);
            this.uploadMediaFailedCallBack(currentUploadFile.uuID);
          },

          onSuccess: () => {
            this.uploadMediaCompleteCallBack(currentUploadFile.uuID,filenameCreated);
          },
          onProgress: (uploaded, total) => {
            let value = ((uploaded / total) * 50) | 0;

            value = Math.round(value + 50);
            if (lastProgressForUpload != value && lastProgressForUpload + 2 < value) {
              lastProgressForUpload = value;
              this.uploadMediaProgressCallBack(value, currentUploadFile.uuID);
            }
          },
          metadata: metadata
        });
        this.tusUploadRef[currentUploadFile.uuID] = upload;
        upload.start();
      }
      //name
      //bureau
      //asyncurlapp
      //folderpath
      this.uploadStarted = false;
    }
  }
}
