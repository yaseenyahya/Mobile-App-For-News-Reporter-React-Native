import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
  View,
  Alert,
  SafeAreaView,
  AppState,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Slider
} from "react-native";
import PermissionsGrant from "../../PermissionsGrant";
import _ from "underscore";
import { Image } from "react-native-animatable";
import PhotoModalPage from "../../ImagePicker/PhotoModalPage";
import RootSiblings from "react-native-root-siblings";
import CameraRoll from "@react-native-community/cameraroll";
import {
  Container,
  Button,
  Text,
  Icon,
  Spinner,
  connectStyle
} from "native-base";
import { RNCamera } from "react-native-camera";
import { Actions } from "react-native-router-flux";
import { NavigationEvents } from "react-navigation";

import conf from "./conf";
import { getOrientation } from "./baseComponents/orientation";
import KeyboardShiftView from "./baseComponents/KeyboardShiftView";
import ZoomView from "./baseComponents/ZoomView";
import { runAfterInteractions } from "./baseComponents/utils";

const IS_IOS = Platform.OS == "ios";
const touchCoordsSize = 100 * conf.sizeScaling;
const getAudioStrengthIcon = (strength) => {
  if (strength <= 33) {
    return "signal-cellular-outline";
  } else if (strength <= 37) {
    return "signal-cellular-1";
  } else if (strength <= 49) {
    return "signal-cellular-2";
  } else  {
    return "signal-cellular-3";
  }
};
const flashIcons = {
  on: (
    <Icon
      transparent
      style={{ color: "white" }}
      name="flash"
      type="MaterialCommunityIcons"
    ></Icon>
  ),
  auto: (
    <Icon
      transparent
      style={{ color: "white" }}
      name="flash-auto"
      type="MaterialCommunityIcons"
    ></Icon>
  ),
  off: (
    <Icon
      transparent
      style={{ color: "white" }}
      name="flash-off"
      type="MaterialCommunityIcons"
    ></Icon>
  ),
  torch: (
    <Icon
      transparent
      style={{ color: "white" }}
      name="flashlight"
      type="MaterialCommunityIcons"
    ></Icon>
  )
};
const MAX_ZOOM = 8; // iOS only
const ZOOM_F = IS_IOS ? 0.01 : 0.1;
const BACK_TYPE = RNCamera.Constants.Type.back;
const FRONT_TYPE = RNCamera.Constants.Type.front;

const WB_OPTIONS = [
  RNCamera.Constants.WhiteBalance.auto,
  RNCamera.Constants.WhiteBalance.sunny,
  RNCamera.Constants.WhiteBalance.cloudy,
  RNCamera.Constants.WhiteBalance.shadow,
  RNCamera.Constants.WhiteBalance.incandescent,
  RNCamera.Constants.WhiteBalance.fluorescent
];

const WB_OPTIONS_MAP = {
  0: "Auto",
  1: "Sunny",
  2: "Cloudy",
  3: "Shadow",
  4: "Incandescent",
  5: "Fluorescent"
};

const getCameraType = type => {
  if (type == "AVCaptureDeviceTypeBuiltInTelephotoCamera") {
    return "zoomed";
  }
  if (type == "AVCaptureDeviceTypeBuiltInUltraWideCamera") {
    return "wide";
  }

  return "normal";
};

const flex1 = { flex: 1 };

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: "black" },
  actionStyles: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent"
  },
  capturingStyle: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 0,
    position: "absolute",
    top: 60,
    right: 5,
    width: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  capturingTextStyle: {
    color: "white"
  },
  cameraLoading: { flex: 1, alignSelf: "center" },
  cameraNotAuthorized: {
    padding: 20 * conf.sizeScaling,
    paddingTop: 35 * conf.sizeScaling
  },

  cameraButton: {
    flex: 1,
    backgroundColor: "white"
  },

  buttonsView: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  cameraSelectionRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  ratioButton: {
    width: 100 * conf.sizeScaling
  },
  footerButtonContainer: {
    backgroundColor: "#04040485",
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 125,
    flex: 1,
    flexDirection: "row",
    borderWidth: 0,
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  whiteBalanceButtonContainer: {
    alignSelf: "center",
    marginBottom: 30
  },
  whiteBalanceButtonText: {
    color: "white"
  },
  lastCaptureImageButtonContainer: {
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 0.8,
    borderColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
    height: 50,
    width: 50,
    justifyContent: "center",
    overflow: "hidden"
  },
  lastCaptureImageButtonImageView: {
    height: 50,
    width: 50
  },
  footerMiddleCaptureButtonsContainer: {
    flexDirection: "row"
  },
  captureButtonContainer: {
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 2,
    paddingTop: 0,
    paddingBottom: 0,
    height: 80,
    width: 80,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent"
  },
  captureVideoButtonIcon: {
    color: "white",
    fontSize: 46
  },
  footerRightSettingButtonContainer: {
    alignItems: "center",
    alignSelf: "flex-end",
    marginLeft: 2,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 0.8,
    borderColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
    height: 40,
    width: 40,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent"
  },
  flashButtonContainer: {
    alignSelf: "center",
    marginBottom: 30
  },
  cameraSelectorButtonContainer: {
    alignItems: "center",
    alignSelf: "flex-end",
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 0.8,
    borderColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
    height: 50,
    width: 50,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent"
  },
  cameraSelectorButtonIcon: {
    color: "white"
  }
});

const cameraNotAuthorized = (
  <Text transparent style={styles.cameraNotAuthorized}>
    Camera access was not granted. Please go to your phone's settings and allow
    camera access.
  </Text>
);

const defaultCameraOptions = {
  flashMode: "off", // on, auto, off, torch
  wb: 0,
  zoom: 0, // 0-1
  focusCoords: undefined
};

function parseRatio(str) {
  let [p1, p2] = str.split(":");
  p1 = parseInt(p1);
  p2 = parseInt(p2);
  return p1 / p2;
}

class CameraSelectorButton extends React.PureComponent {
  onChange = () => {
    if (!this.props.isSelected) {
      this.props.onChange(this.props.camera.id);
    }
  };

  render() {
    let { camera, isSelected } = this.props;
    let cameraType = camera.cameraType;
    let IconComp;

    if (camera.type == BACK_TYPE) {
      if (cameraType == "wide") {
        IconComp = props => <Icon {...props} name="zoom-out" type="Feather" />;
      } else if (cameraType == "zoomed") {
        IconComp = props => <Icon {...props} name="zoom-in" type="Feather" />;
      } else {
        IconComp = props => (
          <Icon {...props} name="camera-rear" type="MaterialIcons" />
        );
      }
    } else if (camera.type == FRONT_TYPE) {
      IconComp = props => (
        <Icon {...props} name="camera-front" type="MaterialIcons" />
      );
    }
    // should never happen
    else {
      IconComp = props => (
        <Icon {...props} normal name="ios-reverse-camera" type="Ionicons" />
      );
    }

    return (
      <Button transparent rounded onPress={this.onChange} selfCenter>
        <IconComp transparent={!isSelected} warning={isSelected} />
      </Button>
    );
  }
}

class CameraSelector extends React.PureComponent {
  loopCamera = () => {
    let { cameraId, cameraIds, onChange } = this.props;

    if (cameraId != null && cameraIds.length) {
      let newIdx =
        (cameraIds.findIndex(i => i.id == cameraId) + 1) % cameraIds.length;
      onChange(cameraIds[newIdx].id);
    } else {
      // if no available camera ids, always call with null
      onChange(null);
    }
  };

  render() {
    let { cameraId, cameraIds, disable } = this.props;

    // let disable = this.state.takingPic || !this.state.cameraReady;

    if (!cameraIds) {
      return null;
    }
    console.log(cameraIds.length)
    // camera ID is null, means we have no info about the camera.
    // fallback to regular switch
    if (cameraId == null) {
      return (
        <View style={styles.cameraSelectorButtonContainer}>
          <TouchableWithoutFeedback
            onPress={this.loopCamera}
            disabled={disable}
          >
            <Icon
              style={styles.cameraSelectorButtonIcon}
              name="ios-reverse-camera"
              type="Ionicons"
            ></Icon>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    // 0 or 1 cameras, no button
    if (cameraIds.length <= 1) {
      return null;
    }

    // 2 cameras, 1 button, no set default option
    if (cameraIds.length == 2 || cameraIds.length == 4) {
      return (
        <View style={styles.cameraSelectorButtonContainer}>
          <TouchableWithoutFeedback
            onPress={this.loopCamera}
            disabled={disable}
          >
            <Icon
              style={styles.cameraSelectorButtonIcon}
              name="ios-reverse-camera"
              type="Ionicons"
            ></Icon>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    // 3 or more cameras, multiple buttons
    return (
      <React.Fragment>
        {cameraIds.map((v, i) => {
         
          return <CameraSelectorButton
              key={`${i}`}
              camera={v}
              isSelected={cameraId == v.id}
              onChange={this.props.onChange}
            />
              
            
         
        })}
      </React.Fragment>
    );
  }
}

class Camera extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ...defaultCameraOptions,
      orientation: getOrientation(),
      takingPic: false,
      recording: false,
      audioDisabled: false,
      elapsed: 0,
      lastCaptureImage: "",
      cameraReady: false,
      cameraIds: null, // null means not checked, empty list means no results
      cameraType: BACK_TYPE,
      cameraId: null,
      aspectRatioStr: "4:3",
      aspectRatio: parseRatio("4:3"),
      isOnVideo: false,
      cameraShowNotify: false,
      audioApmlitude:0
    };

    this._prevPinch = 1;
  }

  componentDidMount() {
    this.mounted = true;
    AppState.addEventListener("change", this.handleAppStateChange);
    Dimensions.addEventListener("change", this.adjustOrientation);
    this.setLastCaptureImageFromMedia();
  }
  setLastCaptureImageFromMedia() {
    new PermissionsGrant()
      .getCameraRollPermission()
      .then(isPermissionGranted => {
        if (isPermissionGranted) {
          CameraRoll.getPhotos({
            first: 1,
            groupTypes: Platform.OS === "ios" ? "All" : undefined,
            assetType: "All"
          }).then(result => {
            const arr = result.edges.map(item => item.node);
            if (arr.length > 0) {
              this.setState({ lastCaptureImage: arr[0].image.uri });
            }
          });
        }
      });
  }
  componentWillUnmount() {
    this.mounted = false;
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.stopVideo();
  }

  adjustOrientation = () => {
    setTimeout(() => {
      if (this.mounted) {
        this.setState({ orientation: getOrientation() });
      }
    }, 50);
  };

  // audio permission will be android only
  onCameraStatusChange = s => {
    if (s.cameraStatus == "READY") {
      let audioDisabled = s.recordAudioPermissionStatus == "NOT_AUTHORIZED";
      this.setState({ audioDisabled: audioDisabled }, async () => {
        let ids = [];

        // dummy for simulator test
        // uncomment above and below
        // let ids = [
        //   {id: '1', type: BACK_TYPE, deviceType: 'AVCaptureDeviceTypeBuiltInWideAngleCamera'},
        //   {id: '2', type: BACK_TYPE, deviceType: 'AVCaptureDeviceTypeBuiltInTelephotoCamera'},
        //   {id: '3', type: BACK_TYPE, deviceType: 'AVCaptureDeviceTypeBuiltInUltraWideCamera'},
        //   {id: '4', type: FRONT_TYPE, deviceType: 'AVCaptureDeviceTypeBuiltInWideAngleCamera'},
        // ]

        let cameraId = null;

        try {
          ids = await this.camera.getCameraIdsAsync();

          // map deviceType to our types
          ids = ids.map(d => {
            d.cameraType = getCameraType(d.deviceType);
            return d;
          });

          if (ids.length) {
            // select the first back camera found
            cameraId = ids[0].id;

            for (let c of ids) {
              if (c.type == BACK_TYPE) {
                cameraId = c.id;
                break;
              }
            }
          }
        } catch (err) {
          console.error("Failed to get camera ids", err.message || err);
        }

        // sort ids so front cameras are first
        ids = _.sortBy(ids, v => (v.type == FRONT_TYPE ? 0 : 1));

        this.setState({ cameraIds: ids, cameraId: cameraId });
      });
    } else {
      if (this.state.cameraReady) {
        this.setState({ cameraReady: false });
      }
    }
  };

  onCameraReady = () => {
    if (!this.state.cameraReady) {
      this.setState({ cameraReady: true });
    }
  };

  onCameraMountError = () => {
    setTimeout(() => {
      Alert.alert("Error", "Camera start failed.");
    }, 150);
  };

  handleAppStateChange = nextAppState => {};

  onDidFocus = () => {
    this.focused = true;
  };

  onDidBlur = async () => {
    this.focused = false;
    this.stopVideo();
  };

  onPinchProgress = p => {
    let p2 = p - this._prevPinch;

    if (p2 > 0 && p2 > ZOOM_F) {
      this._prevPinch = p;
      this.setState({ zoom: Math.min(this.state.zoom + ZOOM_F, 1) });
    } else if (p2 < 0 && p2 < -ZOOM_F) {
      this._prevPinch = p;
      this.setState({ zoom: Math.max(this.state.zoom - ZOOM_F, 0) });
    }
  };

  onTapToFocus = event => {
    if (!this.cameraStyle || this.state.takingPic) {
      return;
    }

    const { pageX, pageY } = event.nativeEvent;
    let { width, height, top, left } = this.cameraStyle;

    // compensate for top/left changes
    let pageX2 = pageX - left;
    let pageY2 = pageY - top;

    // normalize coords as described by https://gist.github.com/Craigtut/6632a9ac7cfff55e74fb561862bc4edb
    const x0 = pageX2 / width;
    const y0 = pageY2 / height;

    let x = x0;
    let y = y0;

    // if portrait, need to apply a transform because RNCamera always measures coords in landscape mode
    // with the home button on the right. If the phone is rotated with the home button to the left
    // we will have issues here, and we have no way to detect that orientation!
    // TODO: Fix this, however, that orientation should never be used due to camera positon
    if (this.state.orientation.isPortrait) {
      x = y0;
      y = -x0 + 1;
    }

    this.setState({
      focusCoords: {
        x: x,
        y: y,
        autoExposure: true
      },
      touchCoords: {
        x: pageX2 - 50,
        y: pageY2 - 50
      }
    });

    // remove focus rectangle
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = null;
    }
  };

  onTapToFocusOut = () => {
    if (this.state.touchCoords) {
      this.focusTimeout = setTimeout(() => {
        if (this.mounted) {
          this.setState({ touchCoords: null });
        }
      }, 1500);
    }
  };

  onPinchStart = () => {
    this._prevPinch = 1;
  };

  onPinchEnd = () => {
    this._prevPinch = 1;
  };

  onAudioInterrupted = () => {
    this.setState({ audioDisabled: true });
  };

  onAudioConnected = () => {
    this.setState({ audioDisabled: false });
  };

  onPictureTaken = () => {
    this.setState({ takingPic: false });
  };

  goBack = () => {
 
      Actions.pop();
    
  };
  photoModalPageRootControl = null;
  render() {
    let {
      orientation,
      takingPic,
      cameraReady,
      recording,
      audioDisabled,
      zoom,
      wb,
      cameraType,
      cameraId,
      cameraIds,
      flashMode
    } = this.state;
    let { style } = this.props;

    let isPortrait = orientation.isPortrait;

    let disable = takingPic || !cameraReady;
    let disableOrRecording = disable || recording;

    // flag to decide how to layout camera buttons
    let cameraCount = 0;

    let isOnVideo = this.state.isOnVideo;

    // we have queried the list of cameras
    if (cameraIds != null) {
      if (cameraId == null) {
        cameraCount = 2; // no camera id info, assume 2 cameras to switch from back and front
      } else {
        cameraCount = cameraIds.length;
      }
    }
    let topButtons = (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          flexDirection: "row",
          width: orientation.width,
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={this.goBack}
          style={{ marginLeft: 9, marginTop: 18 }}
        >
          <Icon
            name="arrow-left"
            type="FontAwesome5"
            style={{ color: "white", fontSize: 38 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => {
            this.props.onDropdownPress && this.props.onDropdownPress();
          }}
          style={{ marginRight: 9, marginTop: 10 }}
        >
          <Icon
            name="angle-down"
            type="FontAwesome5"
            style={{ color: "white", fontSize: 50 }}
          />
        </TouchableOpacity>
      </View>
    );
    let buttons = (
      <View style={styles.footerButtonContainer}>
        <View>
          {!takingPic &&
          !recording &&
          !this.state.spinnerVisible &&
          cameraReady ? (
            (cameraCount > 1 && cameraCount <= 2) || cameraCount > 2 ? (
              <View style={styles.whiteBalanceButtonContainer}>
                <TouchableWithoutFeedback onPress={this.changeWB}>
                  <Text style={styles.whiteBalanceButtonText} transparent>
                    {WB_OPTIONS_MAP[wb]}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            ) : null
          ) : null}
          <View style={styles.lastCaptureImageButtonContainer}>
            <TouchableWithoutFeedback
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
                          this.props.onMediaSelected &&
                            this.props.onMediaSelected(data);
                        }}
                      />
                    )
                  );
                }
              }}
              disabled={disableOrRecording}
            >
              <Image
                resizeMode={"cover"}
                style={styles.lastCaptureImageButtonImageView}
                source={{
                  isStatic: true,
                  uri: this.state.lastCaptureImage 
                }}
              ></Image>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.footerMiddleCaptureButtonsContainer}>
          <View
            style={[
              styles.captureButtonContainer,
              {
                borderColor:
                  this.state.cameraShowNotify || takingPic ? "#ce5252" : "white"
              }
            ]}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                if (!isOnVideo) {
                  this.takePicture();
                } else if (isOnVideo && !recording) {
                  this.startVideo();
                } else if (recording) {
                  this.stopVideo();
                }
              }}
              disabled={disable}
            >
              <View>
                {!isOnVideo && (
                  <Icon
                    name={disable && !takingPic ? "camera-off" : "camera"}
                    style={styles.captureVideoButtonIcon}
                    type="MaterialCommunityIcons"
                  ></Icon>
                )}
                {isOnVideo && (
                  <Icon
                    name={
                      disable ? "video-slash" : recording ? "stop" : "video"
                    }
                    style={styles.captureVideoButtonIcon}
                    type="FontAwesome5"
                  ></Icon>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.footerRightSettingButtonContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (recording) {
                  this.stopVideo();
                }
                this.setState({ isOnVideo: !isOnVideo });
              }}
              disabled={disableOrRecording}
            >
              <Icon
                name={isOnVideo ? "camera" : "video"}
                style={{ color: "white" }}
                type="MaterialCommunityIcons"
              ></Icon>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View>
          <View style={styles.flashButtonContainer}>
            {!takingPic &&
            !recording &&
            !this.state.spinnerVisible &&
            cameraReady ? (
              <TouchableWithoutFeedback onPress={this.toggleFlash}>
                {flashIcons[flashMode]}
              </TouchableWithoutFeedback>
            ) : null}
          </View>
          {(cameraCount > 1 && cameraCount <= 2) || cameraCount > 2 ? (
            <CameraSelector
              disable={disableOrRecording}
              cameraId={cameraId}
              cameraIds={this.state.cameraIds}
              onChange={this.onCameraChange}
            />
          ) : (
            <View></View>
          )}
        </View>
      </View>
    );

    let cameraStyle;

    // style to cover all the screen exactly
    // leaving footer and extra heights

    let mainViewStyle = {
      flex: 1,
      width: isPortrait
        ? orientation.width
        : orientation.width - style.footerWidth,
      height: orientation.height + (IS_IOS ? 0: StatusBar.currentHeight),
      backgroundColor: "black"
    };

    if (isPortrait) {
      cameraStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: orientation.width,
        height: orientation.height + (IS_IOS ? 0: StatusBar.currentHeight)
      };
    } else {
      let height = orientation.height + (IS_IOS ? 0: StatusBar.currentHeight);
      let width = height * this.state.aspectRatio;

      cameraStyle = {
        position: "absolute",
        top: 0,
        left: Math.max(0, (mainViewStyle.width - width) / 2),
        width: width,
        height: height
      };
    }
   
    this.cameraStyle = cameraStyle;

    return (
      <Container fullBlack>
        <KeyboardShiftView
          style={styles.content}
          keyboardShouldPersistTaps={"never"}
          extraHeight={0}
          bounces={false}
        >
          <NavigationEvents
            onDidFocus={this.onDidFocus}
            onDidBlur={this.onDidBlur}
          />

          <View style={mainViewStyle}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={cameraStyle}
              type={cameraType}
              cameraId={cameraId}
              //useCamera2Api={true}
              onAudioInterrupted={this.onAudioInterrupted}
              onAudioConnected={this.onAudioConnected}
              onPictureTaken={this.onPictureTaken}
              ratio={this.state.aspectRatioStr}
              flashMode={flashMode}
              zoom={zoom}
              maxZoom={MAX_ZOOM}
              whiteBalance={WB_OPTIONS[wb]}
              autoFocusPointOfInterest={this.state.focusCoords}
              androidCameraPermissionOptions={{
                title: "Permission to use camera",
                message: "We need your permission to use your camera",
                buttonPositive: "Ok",
                buttonNegative: "Cancel"
              }}
              androidRecordAudioPermissionOptions={{
                title: "Permission to use audio recording",
                message: "We need your permission to use your audio",
                buttonPositive: "Ok",
                buttonNegative: "Cancel"
              }}
              onStatusChange={this.onCameraStatusChange}
              onCameraReady={this.onCameraReady}
              onMountError={this.onCameraMountError}
              pendingAuthorizationView={
                <View style={styles.cameraLoading}>
                  <Spinner color={style.brandLight} />
                </View>
              }
              notAuthorizedView={<View>{cameraNotAuthorized}</View>}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                style={flex1}
                onPressIn={this.onTapToFocus}
                onPressOut={this.onTapToFocusOut}
                onLongPress={this.takePictureLong}
                delayLongPress={1500}
              >
                <ZoomView
                  onPinchProgress={this.onPinchProgress}
                  onPinchStart={this.onPinchStart}
                  onPinchEnd={this.onPinchEnd}
                  style={flex1}
                >
                  {this.state.touchCoords ? (
                    <View
                      style={{
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: 50,
                        borderColor: takingPic ? "red" : "gray",
                        position: "absolute",
                        top: this.state.touchCoords.y,
                        left: this.state.touchCoords.x,
                        width: touchCoordsSize,
                        height: touchCoordsSize
                      }}
                    ></View>
                  ) : null}
                </ZoomView>
              </TouchableOpacity>
            </RNCamera>
            {recording ? (
              <Icon
                transparent
                style={{ color: "white",  position: "absolute",
                top: 80,
                right: 5,
                fontSize:50}}
                name={getAudioStrengthIcon(20 * Math.log10(this.state.audioApmlitude / 100)   )}
                type={"MaterialCommunityIcons"}
              ></Icon>
            ) : null}
            {recording ? (
              <View style={styles.capturingStyle}>
                <Text style={styles.capturingTextStyle}>{`${
                  audioDisabled ? "(muted) " : ""
                }${("0" + Math.floor(this.state.elapsed / 60)).slice(-2) +
                  ":" +
                  ("0" + Math.floor(this.state.elapsed % 60)).slice(
                    -2
                  )}`}</Text>
              </View>
            ) : null}
          </View>
        </KeyboardShiftView>
        {topButtons}
        <View
          style={{ position: "absolute", bottom: 0, width: orientation.width }}
        >
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              bottom: 310,
              right: -40,
              width: 120,
              height: 30,

              transform: [
                { rotate: "-90deg" },
               IS_IOS ? {scaleX: 1} : { scaleX: 2.3 } ,
               IS_IOS ? {scaleX: 1} : { scaleY: 2.3 }
              ]
            }}
          >
            <Icon
              name={"minus"}
              style={{
                fontSize: IS_IOS ? 19 : 11,
                color: "white",
                transform: [{ rotate: "90deg" }],
                marginRight: IS_IOS ? -2 : -8
              }}
              type="FontAwesome5"
            ></Icon>
            <Slider
              onValueChange={this.onPinchProgress}
              thumbTintColor={"white"}
              tintColor={"white"}
              onTintColor={"white"}
              maximumTrackTintColor="white"
              minimumTrackTintColor="white"
              thumbStyle={{   width: 5,
                height: 5,}}
              style={{
                width: IS_IOS ? 170 : 100,
                height: 30
              }}
            ></Slider>
            <Icon
              name={"plus"}
              style={{
                fontSize: IS_IOS ? 19 : 11,
                color: "white",
                transform: [{ rotate: "0deg" }],
                marginLeft:  IS_IOS ? 0 :  -9
              }}
              type="FontAwesome5"
            ></Icon>
          </View>
          {buttons}
        </View>
      </Container>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      if (
        this.state.takingPic ||
        this.state.recording ||
        !this.state.cameraReady
      ) {
        return;
      }
      // if we have a non original quality, skip processing and compression.
      // we will use JPEG compression on resize.
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
        writeExif: true
      };

      this.setState({ takingPic: true });

      let data = null;

      try {
        data = await this.camera.takePictureAsync(options);
      } catch (err) {
        Alert.alert("Error", "Failed to take picture: " + (err.message || err));
        return;
      }
      this.props.onPictureCapture && this.props.onPictureCapture(data.uri);
      CameraRoll.saveToCameraRoll(data.uri).then(() => {
        this.setLastCaptureImageFromMedia();
      });
    }
  };

  startVideo = async () => {
    if (this.camera && !this.state.recording) {
      // need to do this in order to avoid race conditions
      this.state.recording = true;

      const options = {
        quality: "480p",
        maxDuration: 600,
        maxFileSize: 100 * 1024 * 1024
      };

      this.setState({ recording: true, elapsed: 0 }, async () => {
        let timer = setInterval(() => {
          this.setState({
            elapsed: this.state.elapsed + 1,
            cameraShowNotify: !this.state.cameraShowNotify
          });
          this.getMaxAmplitude();
        }, 1000);

        let result = null;
        try {
          result = await this.camera.recordAsync(options);
        } catch (err) {
          console.warn("VIDEO RECORD FAIL", err.message, err);
          Alert.alert(
            "Error",
            "Failed to store recorded video: " + err.message
          );
        }

        if (result) {
          this.props.onVideoCapture && this.props.onVideoCapture(result.uri);
          CameraRoll.saveToCameraRoll(result.uri).then(() => {
            this.setLastCaptureImageFromMedia();
          });
        }

        // give time for the camera to recover
        setTimeout(() => {
          this.setState({
            recording: false,
            elapsed: 0,
            cameraShowNotify: false
          });
        }, 500);

        clearInterval(timer);
      });
    }
  };
  getMaxAmplitude = async () => {
    this.setState({ audioApmlitude:await this.camera.getMaxAmplitude() });
  };
  stopVideo = () => {
    if (this.camera && this.state.recording) {
      this.camera.stopRecording();
    }
  };

  toggleFlash = () => {
    if (this.state.flashMode === "torch") {
      this.setState({ flashMode: "off" });
    } else if (this.state.flashMode === "off") {
      this.setState({ flashMode: "auto" });
    } else if (this.state.flashMode === "auto") {
      this.setState({ flashMode: "on" });
    } else if (this.state.flashMode === "on") {
      this.setState({ flashMode: "torch" });
    }
  };

  changeWB = () => {
    this.setState({
      wb: (this.state.wb + 1) % WB_OPTIONS.length
    });
  };

  toggleRatio = () => {
    if (this.state.aspectRatioStr == "4:3") {
      this.setState({
        aspectRatioStr: "1:1",
        aspectRatio: parseRatio("1:1")
      });
    } else if (this.state.aspectRatioStr == "1:1") {
      this.setState({
        aspectRatioStr: "16:9",
        aspectRatio: parseRatio("16:9")
      });
    } else {
      this.setState({
        aspectRatioStr: "4:3",
        aspectRatio: parseRatio("4:3")
      });
    }
  };

  onCameraChange = cameraId => {
    this.setState({ cameraReady: false }, () => {
      runAfterInteractions(() => {
        // cameraId will be null if we failed to get a camera by ID or
        // our id list is empty. Fallback to back/front setting

        if (cameraId == null) {
          let cameraType = this.state.cameraType;
          if (cameraType == FRONT_TYPE) {
            this.setState({
              cameraType: BACK_TYPE,
              cameraId: null,
              ...defaultCameraOptions
            });
          } else {
            this.setState({
              cameraType: FRONT_TYPE,
              cameraId: null,
              ...defaultCameraOptions
            });
          }
        } else {
          this.setState({ cameraId: cameraId, ...defaultCameraOptions });
        }
      });
    });
  };

  resetZoom = () => {
    this._prevPinch = 1;
    this.setState({ zoom: 0 });
  };
}

Camera.navigationOptions = ({ navigation }) => {
  return {
    header: props => null
  };
};

Camera = connectStyle("Branding")(Camera);

export default Camera;
