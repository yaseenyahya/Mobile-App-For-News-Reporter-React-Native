import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Switch,
  Text,Platform,
  AsyncStorage,
  ImageBackground
} from "react-native";
import Camera from "./Camera";
import RNThumbnail from "react-native-thumbnail";
import UploadView from "../uploadView/UploadView";
import ProgressView from "../uploadView/ProgressView";
import { UploadFileVersion } from "../uploadView/UploadFileVersion";
import { UploadFileStatusType } from "../uploadView/UploadFileStatusType";
export default class CameraView extends Component {
  state = {
    isUploadDrawerOpen: false,
    togglefastapp: true,
    uploadFilesObjthumbnail: null,
    uploadFilesObjuuID: null,
    uploadFilesObjstatus: null,
    uploadFilesObjversion: null
  };
  onDropdownPress = () => {
    UploadView.showModal(false, "top", "#ffffff6b");
  };
  componentWillUnmount() {
    UploadView.showCurrentState(null);
  }
  componentDidMount() {
    UploadView.showCurrentState(this.showCurrentStateCallBack);
    AsyncStorage.getItem("attachmentSwitch", (err, result) => {
      if (result != null) {
        this.setState({ togglefastapp: result == "on" ? true : false });
      }
    });
  }
  showCurrentStateCallBack = uploadFilesObj => {
    if (!uploadFilesObj.data.deleted) {
      if (uploadFilesObj.onProgress) {
        if (this.state.uploadFilesObjuuID == null) {
          this.setState({
            uploadFilesObjthumbnail: uploadFilesObj.data.thumbnail,
            uploadFilesObjuuID: uploadFilesObj.data.uuID,
            uploadFilesObjstatus: uploadFilesObj.data.status,
            uploadFilesObjversion: uploadFilesObj.data.version
          });
        }else{
          if (this.ProgressView != null)
          this.ProgressView.changeProgess(uploadFilesObj.data.progress);
        }
      } else {
        this.setState({
          uploadFilesObjthumbnail: uploadFilesObj.data.thumbnail,
          uploadFilesObjuuID: uploadFilesObj.data.uuID,
          uploadFilesObjstatus: uploadFilesObj.data.status,
          uploadFilesObjversion: uploadFilesObj.data.version
        });
      }
     
    } else {
      if (this.state.uploadFilesObjuuID == uploadFilesObj.data.uuID)
        this.setState({ uploadFilesObjuuID: null });
    }
  };

  onMediaSelected = async data => {
    for (let result of data) {
      let sourceUri = result.uri;

      await UploadView.addUploadFilesByUri(
        sourceUri,
        this.state.togglefastapp
          ? UploadFileVersion.fastapp
          : UploadFileVersion.attachment
      );
    }
    UploadView.forceStateAndStartUpload();
  };
  onVideoCapture = async uri => {
    await UploadView.addUploadFilesByUri(
      uri,
      this.state.togglefastapp
        ? UploadFileVersion.fastapp
        : UploadFileVersion.attachment
    );
    UploadView.forceStateAndStartUpload();
  };
  onPictureCapture = async uri => {
    await UploadView.addUploadFilesByUri(
      uri,
      this.state.togglefastapp
        ? UploadFileVersion.fastapp
        : UploadFileVersion.attachment
    );
    UploadView.forceStateAndStartUpload();
  };

  render() {
    let currentUploadStatusView = this.state.uploadFilesObjuuID != null &&
      this.state.uploadFilesObjstatus != UploadFileStatusType.uploaded && (
        <View style={{ position: "absolute", top: 80, left: 9 }}>
          <ImageBackground
            source={{ isStatic: true, uri: this.state.uploadFilesObjthumbnail }}
            imageStyle={{ borderTopRightRadius: 7, borderTopLeftRadius: 7 }}
            style={{
              flex: 1,
              height: 130,
              width: 110,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 7,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                backgroundColor: "rgba(43, 43, 43, 0.58)",
                justifyContent: "center",
                alignItems: "center",
                borderTopRightRadius: 7,
                borderTopLeftRadius: 7,
                height: 130,
                width: null
              }}
            >
              {this.state.uploadFilesObjstatus ==
                UploadFileStatusType.uploading && (
                <ProgressView
                  ref={ref => (this.ProgressView = ref)}
                ></ProgressView>
              )}
              {this.state.uploadFilesObjstatus ==
                UploadFileStatusType.pending && (
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
              {this.state.uploadFilesObjstatus ==
                UploadFileStatusType.failed && (
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
              {this.state.uploadFilesObjstatus ==
                UploadFileStatusType.uploaded && (
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
            </View>

            <Text
              style={{
                padding: 7,
                backgroundColor: "#499cea",
                color: "white",
                alignSelf: "stretch",
                textAlign: "center"
              }}
            >
              {this.state.uploadFilesObjversion == UploadFileVersion.attachment
                ? "Attachment"
                : "Fastapp"}
            </Text>
          </ImageBackground>
        </View>
      );
    return (
      <View style={{ flex: 1 }}>
        <Camera
          onDropdownPress={this.onDropdownPress}
          onVideoCapture={this.onVideoCapture}
          onPictureCapture={this.onPictureCapture}
          onMediaSelected={this.onMediaSelected}
        ></Camera>
        <View
          style={{
            position: "absolute",
            bottom: 130,
            Right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Switch 
            thumbColor={this.state.togglefastapp ? "#499cea" : "white"}
            trackColor={"#8ac0f3"}
            onValueChange={value => {
              this.setState({ togglefastapp: value });
              AsyncStorage.setItem("attachmentSwitch", value ? "on" : "off");
            }}
            value={this.state.togglefastapp}
          />
          <Text style={{ color: "white", marginBottom: 3,marginLeft:Platform.OS == "ios" ? 4 : 0 }}>
            {this.state.togglefastapp ? "on fastapp" : "on attachments"}
          </Text>
        </View>
        {currentUploadStatusView}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
