import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import metrics from "../../config/metrics";
import ListItem from "./ListItem";
import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import Modal from "react-native-modalbox";
import { UploadType } from "./UploadType";
import ImageZoom from "react-native-image-pan-zoom";
import Icon from "react-native-vector-icons/FontAwesome";
import ResourcesData from "../../ResourcesData";
import { LinearGradient } from "expo-linear-gradient";
import ButtonWithCircularProgress from "./ButtonWithCircularProgress";
import * as MediaLibrary from 'expo-media-library';

export default class MediaPlayerModal extends Component {
  uploadFiles = null;
  constructor(props) {
    super(props);
  }
  videoPlayerRef = null;
  state = {
    modalVisible: false,
    mediaPlayerWidth: 100,
    mediaPlayerHeight: 100,
    fileSource: null,
    downloadButtonWithCircularProgress: null,
    shareButtonWithCircularProgress: null,
    filename: null
  };

  close() {
    this.prevListItemUploadFileObject = null;
    this.listRefs = new Array();
    if (this.downloadResumable != null) {
      try {
        this.downloadResumable.pauseAsync();
      } catch (ex) {
        console.log(ex);
      }
      this.downloadResumable = null;
    }
    this.setState({ modalVisible: false, fileSource: null, filename: null });
  }
  callBackVisibeModal = null;
  setModalVisible = (uploadFiles, callBackVisibeModal) => {
    this.callBackVisibeModal = callBackVisibeModal;
    this.uploadFiles = uploadFiles;
    
    this.setState({ modalVisible: true });
  };
  prevListItemUploadFileObject = null;
  onPress = uploadFileObject => {
    // console.log(ResourcesData.MainViewScreenResources.LoginJsonData.Data);
    if (this.prevListItemUploadFileObject != null) {
      let item =  this.listRefs[
        `listItem${this.prevListItemUploadFileObject.fileName}`
      ];
      if(item != null)
      item.setSelected(false);
    }
    this.prevListItemUploadFileObject = uploadFileObject;
    this.resolveObject(uploadFileObject);
  };
  hasImageExtension(source) {
    source = source.toLowerCase();
    return (
      source.endsWith(".png") ||
      source.endsWith(".jpg") ||
      source.endsWith(".jpeg") ||
      source.endsWith(".bmp") ||
      source.endsWith(".tif") ||
      source.endsWith(".gif")
    );
  }
  hasAudioVideoExtension(source) {
    source = source.toLowerCase();

    return (
      source.endsWith(".aif") ||
      source.endsWith(".mp4") ||
      source.endsWith(".wav") ||
      source.endsWith(".flv") ||
      source.endsWith(".wmv") ||
      source.endsWith(".mov") ||
      source.endsWith(".3gp")
    );
  }
  resolveObject(uploadFileObject) {
    var fileSource =
    ResourcesData.MainViewScreenResources.LoginJsonData.mediaurl +
      uploadFileObject.fileSource;

    this.setState({
      fileSource: fileSource,
      filename: uploadFileObject.fileName
    });
  }
  onMediaPlayerInnerLayout = event => {
    const { width, height } = event.nativeEvent.layout;

    this.setState({ mediaPlayerWidth: width, mediaPlayerHeight: height });
  };
  switchToLandscape = () => {
    // ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);
  };
  downloadCompleteCallbackShare =(uri)=>{
    const shareOptions = {
      title: "Sent from AxonMobile",
      message: this.state.fileSource,

     uri:uri
    };
    Sharing.shareAsync(uri);
  }
  onSharePress = async () => {
  
      this.onDownloadPress(
        this.state.shareButtonWithCircularProgress,
        "",
        "Unable to share",
        this.downloadCompleteCallbackShare,
        false
      );
  
    
  };
  downloadResumable = null;
  onDownloadPress = async (
    buttonWithCircularProgress,
    downloadCompleteMessage,
    downloadFailedMessage,
    downloadCompleteCallback,
    saveAssetToGallery
  ) => {
    buttonWithCircularProgress.initProgress();

    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      if (buttonWithCircularProgress != null)
        buttonWithCircularProgress.updateProgress(Math.round(progress * 100));
    };

    this.downloadResumable = FileSystem.createDownloadResumable(
      encodeURI(this.state.fileSource != null ? this.state.fileSource : ""),
      FileSystem.documentDirectory + this.state.filename,
      {},
      callback
    );

    try {
      const { uri } = await this.downloadResumable.downloadAsync();
      this.downloadResumable = null;

      if (buttonWithCircularProgress != null)
        buttonWithCircularProgress.initComplete(downloadCompleteMessage);
      if (saveAssetToGallery) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("FastApp", asset);
      }
   
      downloadCompleteCallback && downloadCompleteCallback(uri);
    } catch (e) {
      console.log(e);
      if (buttonWithCircularProgress != null)
        buttonWithCircularProgress.initFailed(downloadFailedMessage);
    }
  };
  refcheck = ref => {
    this.videoPlayerRef = ref;
  };

  switchToPortrait = () => {
    // ScreenOrientation.unlockAsync(ScreenOrientation.Orientation.LANDSCAPE);
  };
  listRefs = new Array();
  render() {
    
    const videoPlayer = this.state.fileSource != null ? (
      <VideoPlayer
        key={this.state.fileSource}
        width={this.state.mediaPlayerWidth}
        height={this.state.mediaPlayerHeight}
        showFullscreenButton={false}
        errorCallback={error => {}}
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source: {
            uri: encodeURI(this.state.fileSource )
          },
          ref: this.refcheck
        }}
        inFullscreen={false}
      />
    ) : null;

    const imageViewer = (
    
        <Image
          style={{
            width: this.state.mediaPlayerWidth,
            height: this.state.mediaPlayerHeight
          }}
          source={{
            uri: this.state.fileSource != null ? this.state.fileSource : "",
          }}
        />
   
    );

    return (
      <Modal
        position={"center"}
        isOpen={this.state.modalVisible}
        onClosed={() =>  this.callBackVisibeModal && this.callBackVisibeModal()}
        backdropPressToClose={false}
        swipeToClose={false}
        style={{height: metrics.DEVICE_HEIGHT - 20,width: metrics.DEVICE_WIDTH - 20}}
        transparent={true}

      >
        <View
          style={[
            styles.container,
           
          ]}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.close();
            }}
          >
            <LinearGradient
              style={styles.closeButton}
              colors={["#d32f2f", "#d32f2f"]}
            >
              <Icon name="times" size={21} color="#ffffff" />
            </LinearGradient>
          </TouchableWithoutFeedback>
          <View style={styles.bodyContainer}>
            <View style={styles.listContainer}>
              <FlatList
                style={styles.flatList}
                data={this.uploadFiles}
                renderItem={({ item }) => (
                  <ListItem
                    ref={ref => {
                      this.listRefs[`listItem${item.fileName}`] = ref;
                    }}
                    onPress={dataObject => {
                      this.onPress(dataObject);
                    }}
                    title={item.fileName}
                    value={item}
                  />
                )}
                keyExtractor={item => item.fileName}
              />
            </View>

            <View style={styles.mediaPlayerContainer}>
              <View
                style={styles.mediaPlayerInnerContainer}
                onLayout={this.onMediaPlayerInnerLayout}
              >
                {this.state.fileSource != null && this.state.fileSource != "" &&
                this.hasAudioVideoExtension(this.state.fileSource)
                  ? videoPlayer
                  : imageViewer}
              </View>

              {this.state.fileSource != null && (
                <View style={styles.buttonContainer}>
               <ButtonWithCircularProgress
                  ref={(ref) => {
                    this.state.shareButtonWithCircularProgress = ref;
                  }}
                  onPress={this.onSharePress}
                  iconName={"share-alt"}
                  buttonGradientColor={["#E14425", "#CF3719", "#E14425"]}
                  permissionError={
                    "Sharing can't be started without permission"
                  }
                  checkForPersmission={true}
                />
                <View
                  style={{
                    backgroundColor: "#c5c5c5",
                    width: 2,
                    marginHorizontal: 12,
                    marginVertical: 2,
                  }}
                ></View>
                <ButtonWithCircularProgress
                  ref={(ref) => {
                    this.state.downloadButtonWithCircularProgress = ref;
                  }}
                  onPress={() => {
                    this.onDownloadPress(
                      this.state.downloadButtonWithCircularProgress,
                      "Saved to gallery",
                      "Failed to save file",
                      null,
                      true
                    );
                  }}
                  iconName={"download"}
                  buttonGradientColor={["#E14425", "#CF3719", "#E14425"]}
                  permissionError={
                    "Download can't be started without permission"
                  }
                  checkForPersmission={true}
                ></ButtonWithCircularProgress>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    flex:1
  },
  closeButton: {
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    position: "absolute",
    top: 0,
    right: 0
  },
  mediaPlayerContainer: {
    flex: 0.6
  },
  mediaPlayerInnerContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  listContainer: {
    flex: 0.4,
    marginTop: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderEndColor: "black"
  },
  flatList: {},
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: "flex-end"
  },
  shareButtonContainer: {},
  shareButton: {
    padding: 3
  },
  bodyContainer: {
    flexDirection: "column",
    flex: 1
  }
});
