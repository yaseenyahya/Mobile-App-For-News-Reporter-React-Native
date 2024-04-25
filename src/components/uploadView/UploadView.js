import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import ProgressView from "./ProgressView";
import PermissionsGrant from "../../PermissionsGrant";
import Icon from "react-native-vector-icons/FontAwesome";
import Ripple from "react-native-material-ripple";
import Modal from "../modalBox";
import UploadMedia from "./UploadMedia";
import { UploadFileStatusType } from "./UploadFileStatusType";
import { UploadFileVersion } from "./UploadFileVersion";
import uuid from "react-native-uuid";
import RNThumbnail from "react-native-thumbnail";
import PhotoModalPage from "../../ImagePicker/PhotoModalPage";
import RootSiblings from "react-native-root-siblings";
import { LinearGradient } from "expo-linear-gradient";

export default class UploadView extends Component {
  self_ = null;
  static uploadViewAttachmentFileUploadChangeCallBack = null;
  static UploadViewInit(uploadViewAttachmentFileUploadChangeCallBack) {
    UploadView.uploadViewAttachmentFileUploadChangeCallBack = uploadViewAttachmentFileUploadChangeCallBack;
  }
  static showCurrentStateCallBack = null;
  static showCurrentState(showCurrentStateCallBack) {
    UploadView.showCurrentStateCallBack = showCurrentStateCallBack;
  }
  static getModalState = ()=>{
    return self_.state.isUploadDrawerOpen;
  }
  static showModal = (showMediaTab, modalPosition, modalBackgroundColor) => {
    self_.modalBox.refresh(modalPosition);

    self_.setState({
      modalPosition: modalPosition,
      isUploadDrawerOpen: true,
      showMediaTab: showMediaTab,
      modalBackgroundColor: modalBackgroundColor
    });
  };
  static hideModal = () => {
    self_.setState({ isUploadDrawerOpen: false });
  };
  constructor(props) {
    super(props);
    self_ = this;
  }
  state = {
    uploadFiles: [],
    showMediaTab: true,
    isUploadDrawerOpen: false,
    allowImagePickerEdit: false,
    modalPosition: "top",
    modalBackgroundColor: "white"
  };
  static getUploadedAttachemntsOnly() {
    return self_.state.uploadFiles.filter(
      itm =>
        itm.status == UploadFileStatusType.uploaded &&
        itm.version == UploadFileVersion.attachment
    );
  }
  static getPendingOrUploadingAttachemntsOnly() {
    return self_.state.uploadFiles.filter(
      itm =>
        itm.status == UploadFileStatusType.pending || 
        itm.status == UploadFileStatusType.uploading
    );
  }
  static getFailedAttachemntsOnly() {
    return self_.state.uploadFiles.filter(
      itm =>
        itm.status == UploadFileStatusType.failed 
    );
  }
  static resetUploadFiles() {
    self_.setState({ uploadFiles: [] });
  }
  UploadMediaObj = null;
  componentDidMount() {
    this.UploadMediaObj = new UploadMedia();

    this.UploadMediaObj.init(
      this.getFileUploadObjectCallBack,
      this.uploadMediaProgressCallBack,
      this.uploadMediaCompleteCallBack,
      this.uploadMediaFailedCallBack,
      this.compressMediaCompleteCallBack,
      this.fileIDGeneratedCallBack,
      this.uploadMediaStartCallBack
    );

    this.UploadMediaObj.startIfNotStarted();

 
  }
  fileIDGeneratedCallBack = (uuID, fileIDGenerated) => {
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    this.state.uploadFiles[itemIndex].fileIDGenerated = fileIDGenerated;

    this.setState({ uploadFiles: this.state.uploadFiles });
  };
  uploadMediaStartCallBack = uuID => {
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    if (itemIndex != -1) {
      if (
        this.uploadFilesFlatListProgressViewItem[`progressView${uuID}`] != null
      ) {
        this.uploadFilesFlatListProgressViewItem[
          `progressView${uuID}`
        ].changeProgess(0);

        
      }
      this.state.uploadFiles[itemIndex].status = UploadFileStatusType.uploading;
      this.setState({ uploadFiles: this.state.uploadFiles });

      UploadView.showCurrentStateCallBack &&  UploadView.showCurrentStateCallBack(
        {
          deleted:false,
          data:this.state.uploadFiles[itemIndex]
        }
      )
    }
  };
  goBack = ()=>{
    this.setState({ isUploadDrawerOpen: false });
  }
  getFileUploadObjectCallBack = () => {
    return this.state.uploadFiles;
  };
  uploadMediaFailedCallBack = uuID => {
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    if (itemIndex != -1) {
      if (
        this.uploadFilesFlatListProgressViewItem[`progressView${uuID}`] != null
      ) {
        this.uploadFilesFlatListProgressViewItem[
          `progressView${uuID}`
        ].changeProgess(0);
      }
      this.state.uploadFiles[itemIndex].progress = 0;
      this.state.uploadFiles[itemIndex].status = UploadFileStatusType.failed;
      this.setState({ uploadFiles: this.state.uploadFiles });

      UploadView.showCurrentStateCallBack &&  UploadView.showCurrentStateCallBack(
        {
          deleted:false,
          data:this.state.uploadFiles[itemIndex]
        }
      )
    }
    
    this_ = this;
    setTimeout(function() {
      this_.UploadMediaObj.startIfNotStarted();
    }, 1500);
  };
  uploadMediaCompleteCallBack = (uuID, filenameCreated) => {
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    if (itemIndex != -1) {
      if (
        this.uploadFilesFlatListProgressViewItem[`progressView${uuID}`] != null
      ) {
        this.uploadFilesFlatListProgressViewItem[
          `progressView${uuID}`
        ].changeProgess(100);
      }
      this.state.uploadFiles[itemIndex].progress = 100;
      this.state.uploadFiles[itemIndex].status = UploadFileStatusType.uploaded;
      this.state.uploadFiles[itemIndex].filenameCreated = filenameCreated;

      this.setState({ uploadFiles: this.state.uploadFiles });
     
     

      UploadView.uploadViewAttachmentFileUploadChangeCallBack &&
      UploadView.uploadViewAttachmentFileUploadChangeCallBack();

      UploadView.showCurrentStateCallBack &&  UploadView.showCurrentStateCallBack(
        {
          deleted:false,
          data:this.state.uploadFiles[itemIndex]
        }
      )
    }
    this.UploadMediaObj.startIfNotStarted();
  };
  lastProgressBar = null;
  lastUUIDProgressBar = null;
  lastItemIndex = -1;
  uploadMediaProgressCallBack = async (value, uuID) => {
    //  if (this.lastProgressBar == null || this.lastUUIDProgressBar != uuID) {
    this.lastProgressBar = this.uploadFilesFlatListProgressViewItem[
      `progressView${uuID}`
    ];
    this.lastUUIDProgressBar = uuID;
    this.lastItemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    // }

    if (this.lastItemIndex != -1) {
      if (this.lastProgressBar != null) {
        this.lastProgressBar.changeProgess(value);
      }
      this.state.uploadFiles[this.lastItemIndex].progress = value;

      UploadView.showCurrentStateCallBack &&  UploadView.showCurrentStateCallBack(
        {
          onProgress:true,
          deleted:false,
          data:this.state.uploadFiles[this.lastItemIndex]
        }
      )
    }

    // this.setState({ uploadFiles: this.state.uploadFiles });
  };
  compressMediaCompleteCallBack = (uuID, compressFileUri) => {
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });
    if (itemIndex != -1) {
      this.state.uploadFiles[itemIndex].compressFileUri = compressFileUri;
      this.setState({ uploadFiles: this.state.uploadFiles });
    }
  };
  deleteUploadFiles = uuID => {
    if (this.UploadMediaObj.tusUploadRef[uuID] != undefined)
      this.UploadMediaObj.tusUploadRef[uuID].abort();
    var itemIndex = this.state.uploadFiles.findIndex(function(element) {
      return element.uuID == uuID;
    });

    if (itemIndex != -1) {
      this.state.uploadFiles.splice(itemIndex, 1);
      this.setState({ uploadFiles: this.state.uploadFiles });
      UploadView.uploadViewAttachmentFileUploadChangeCallBack &&
      UploadView.uploadViewAttachmentFileUploadChangeCallBack();

      UploadView.showCurrentStateCallBack &&  UploadView.showCurrentStateCallBack(
        {
          deleted:true,
          data:this.state.uploadFiles[this.itemIndex]
        }
      )
    }
  };
  static async addUploadFilesByUri(uri, version) {
    let sourceUri = uri;
    let uuID = uuid.v1();


    let thumbnail = sourceUri;
    let isVideo = sourceUri.toString().endsWith("mp4");
    if (isVideo) {
      await RNThumbnail.get(sourceUri).then(result => {
        thumbnail = result.path; // thumbnail path
      });
    }

    let fileObject = {
      uuID: uuID,
      fileUri: sourceUri,
      compressFileUri: null,
      status: UploadFileStatusType.pending,
      progress: 0,
      thumbnail: thumbnail,
      fileIDGenerated: null,
      version: version
    };
    
    self_.state.uploadFiles.unshift(fileObject);
  
  }
  static forceStateAndStartUpload() {
    self_.setState({
      uploadFiles: self_.state.uploadFiles
    });
    self_.UploadMediaObj.startIfNotStarted();
  }
  photoModalPageRootControl = null;
  uploadFilesFlatListProgressViewItem = [];
  render() {
    return (
      <Modal
        ref={ref => {
          this.modalBox = ref;
        }}
        entry={this.state.modalPosition}
        position={this.state.modalPosition}
        isOpen={this.state.isUploadDrawerOpen}
        onClosed={() => this.setState({ isUploadDrawerOpen: false })}
        style={[
          styles.uploadModal,
          { backgroundColor: this.state.modalBackgroundColor }
        ]}
        backdropPressToClose={true}
        swipeToClose={false}
      >
        {this.state.showMediaTab ? (
          <LinearGradient
            style={{}}
            colors={["#E14425", "#ef3c52"]}
            start={[0, 1]}
            end={[1, 0]}
          >
            <View
              style={{
                backgroundColor:"red",
                marginHorizontal: 5,
                flexDirection:"row",
              
              }}
            >
              <View  style={{flex:.5,justifyContent:"center"}}>
               <TouchableOpacity
          activeOpacity={0.3}
          onPress={this.goBack}
          style={{ marginLeft: 0,width:42 }}
        >
          <Icon
            name="arrow-left"
            type="FontAwesome5"
            style={{ color: "white", fontSize: 40 }}
          />
        </TouchableOpacity>
        </View>
              {
                //   <FlipToggle
                //     value={this.state.allowImagePickerEdit}
                //     buttonWidth={80}
                //     buttonHeight={40}
                //     buttonRadius={50}
                //     sliderWidth={25}
                //     sliderHeight={25}
                //     sliderRadius={50}
                //     onLabel={"On"}
                //     offLabel={"Off"}
                //     labelStyle={{ color: "white", fontSize: 12 }}
                //     onToggle={newState =>
                //       this.setState({ allowImagePickerEdit: newState })
                //     }
                //   />
              }
               <View  style={{flex:.5,alignItems:"flex-end" }}>
              <Ripple
                
                onPress={async () => {
                  const isPermissionGranted = await new PermissionsGrant().getCameraRollPermission();
                  if (isPermissionGranted) {
                    if (this.photoModalPageRootControl != null) return;
                    this.photoModalPageRootControl = new RootSiblings(
                      (
                        <PhotoModalPage
                          maxSize={20}
                          initialRouteName={"AlbumListPage"}
                          onDestroy={() => {
                            this.photoModalPageRootControl &&
                              this.photoModalPageRootControl.destroy();
                            this.photoModalPageRootControl = null;
                          }}
                          callback={async data => {
                            for (let result of data) {
                              let sourceUri = result.uri;
                            
                              await UploadView.addUploadFilesByUri(
                                sourceUri,
                                UploadFileVersion.attachment
                              );
                            }
                            UploadView.forceStateAndStartUpload();
                          }}
                        />
                      )
                    );
                  }
                }}
              >
                <Icon name="plus-circle" size={45} color="white" />
              </Ripple>
              </View>
            </View>
          </LinearGradient>
        ) : null}
        <FlatGrid
          items={this.state.showMediaTab ? this.state.uploadFiles.filter(
            itm =>
              itm.version == UploadFileVersion.attachment 
          ) :this.state.uploadFiles }
          style={styles.flatGridView}
          // fixed

          renderItem={({ item: uploadFilesObj, index }) => (
            <ImageBackground
              source={{ isStatic: true, uri: uploadFilesObj.thumbnail }}
              imageStyle={this.state.showMediaTab ? { borderRadius: 7 } : {borderTopRightRadius: 7,borderTopLeftRadius: 7}}
              style={[styles.flatGridItemImageBackground,this.state.showMediaTab ? { borderRadius: 7 } : {borderTopRightRadius: 7,borderTopLeftRadius: 7}]}
            >
              <View
                style={[{
                  flex: 1,
                  alignSelf: "stretch",
                  backgroundColor: "rgba(43, 43, 43, 0.58)",
                  justifyContent: "center",
                  alignItems: "center",
                  
                  height: 130,
                  width: null
                },this.state.showMediaTab ? { borderRadius: 7 } : {borderTopRightRadius: 7,borderTopLeftRadius: 7}]}
              >
                {uploadFilesObj.status == UploadFileStatusType.uploading && (
                  <ProgressView
                    ref={ref =>
                      (this.uploadFilesFlatListProgressViewItem[
                        `progressView${uploadFilesObj.uuID}`
                      ] = ref)
                    }
                  ></ProgressView>
                )}
                {uploadFilesObj.status == UploadFileStatusType.pending && (
                  <Text
                    style={{
                      backgroundColor: "rgba(52, 52, 52, 0.5)",
                      color: "white",
                      padding: 7,
                      borderRadius: 10
                    }}
                  >
                    {"Pending..."}
                  </Text>
                )}
                {uploadFilesObj.status == UploadFileStatusType.failed && (
                  <Text
                    style={{
                      backgroundColor: "rgba(52, 52, 52, 0.5)",
                      color: "white",
                      padding: 7,
                      borderRadius: 10
                    }}
                  >
                    {"Retrying..."}
                  </Text>
                )}
                {uploadFilesObj.status == UploadFileStatusType.uploaded && (
                  <Text
                    style={{
                      backgroundColor: "rgba(52, 52, 52, 0.5)",
                      color: "white",
                      padding: 7,
                      borderRadius: 10
                    }}
                  >
                    {"Completed"}
                  </Text>
                )}
                {uploadFilesObj.version == UploadFileVersion.attachment && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 5
                    }}
                    onPress={() => {
                      this.deleteUploadFiles(uploadFilesObj.uuID);
                    }}
                  >
                    <Text
                      style={{
                        padding: 7,
                        backgroundColor: "#E14425",
                        color: "white",
                        borderRadius: 3
                      }}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {!this.state.showMediaTab && (
                <Text
                  style={{
                    padding: 7,
                    backgroundColor: "#499cea",
                    color: "white",
                    alignSelf: "stretch",
                    textAlign: "center"
                  }}
                >
                  {uploadFilesObj.version == UploadFileVersion.attachment
                    ? "Attachment"
                    : "Fastapp"}
                </Text>
              )}
            </ImageBackground>
          )}
        />
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  uploadModal: {
    height: 300
  },
  flatGridItemImageBackground: {
    flex: 1,

    height: 130,

    alignItems: "center",
    justifyContent: "center"
  },
  flatGridView: {
    flex: 1
  }
});
