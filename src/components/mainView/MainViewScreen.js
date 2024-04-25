import React, { Component, useEffect, useState, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  KeyboardAvoidingView,
  BackHandler,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
  AppState,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import PermissionsGrant from "../../PermissionsGrant";
import Dropdown from "../../Dropdown/dropdown";
import ResourcesData from "../../ResourcesData";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import Ripple from "react-native-material-ripple";
import TextTicker from "react-native-text-ticker";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { showSnackBar } from "../../SnackBar";
import { LinearGradient } from "expo-linear-gradient";
import ValidateTextInput from "../../ValidateTextInput";
import ApiCalls from "../../api/ApiCalls";
import Spinner from "react-native-loading-spinner-overlay";
import Includes from "../../Includes";
import CacheData from "../../ImagePicker/CacheData";
import UploadView from "../uploadView/UploadView";
import { UploadFileVersion } from "../uploadView/UploadFileVersion";
import ShareExtension from "../../Share";
import { activateKeepAwake } from "expo-keep-awake";
import SwitchAccount from "./SwitchAccount/SwitchAccount";
import ClipboardToast from "../ClipboardToast";
import { KeyboardStatusContext } from '../../context/KeyboardStatusContextProvider'
import { useWindowDimensions } from 'react-native';
const MainViewScreen = (props) => {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const { keyboardHidden, keyboardHeight } = useContext(KeyboardStatusContext)

  const [containerHeight, setContainerHeight] = useState(height)
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false)
  const [contentText, setContentText] = useState("")
  const [sendingReportOverlayLoaderVisible, setSendingReportOverlayLoaderVisible] = useState(false)
  const [visibleTickerContainer, setVisibleTickerContainer] = useState(true)
  const [visibleHeaderContainer, setVisibleHeaderContainer] = useState(true)
  const [uploadAttachmentCount, setUploadAttachmentCount] = useState(0)
  const [appState, setAppState] = useState(AppState.currentState)
  const [tlValue, setTlValue] = useState("00:00")

  const switchAccountModalRef = useRef(null)
  const contentTextInputRef = useRef(null)
  const selectionDropDownInputRef = useRef(null)

  useEffect(() => {
    if (!keyboardHidden) {
      setContainerHeight(height - keyboardHeight)
    } else {
      setContainerHeight(height)
    }
  }, [height, keyboardHeight, keyboardHidden])
  var _backHandlerListener = null;
  useEffect(() => {
    activateKeepAwake();

    _backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      _handleBackPressListener
    );



    new PermissionsGrant().getApplicationPermissions();



    UploadView.UploadViewInit(
      uploadViewAttachmentFileUploadChangeCallBack
    );
    CacheData.getMedia();

    AppState.addEventListener("change", _handleAppStateChangeListener);

    getShareData();

    return () => {
      _backHandlerListener.remove();

      AppState.removeEventListener("change", _handleAppStateChangeListener);
    }
  }, [])

  const _handleAppStateChangeListener = (nextAppState) => {
    if (
      appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      getShareData();
    }
    setAppState(nextAppState);
  };
  const getShareData = async () => {

    setTimeout(() => {
      getShareData_();
    }, 1000);
  };
  const getShareData_ = async () => {
    let data = null;

    try {
      data = await ShareExtension.data2();
    } catch (e) { }

    if (data == null || data == "") {
      try {
        data = await ShareExtension.data();
      } catch (e) { }
    }

    if (data != null && data != "") {
      if (data.images.length > 0) {
        for (var i = 0; i < data.images.length; i++) {
          await UploadView.addUploadFilesByUri(
            data.images[i],
            UploadFileVersion.attachment
          );
        }
        UploadView.forceStateAndStartUpload();
        ShareExtension.clear();
        ShareExtension.close();
      }
      if (data.mixedFiles.length > 0) {
        for (var i = 0; i < data.mixedFiles.length; i++) {
          await UploadView.addUploadFilesByUri(
            data.mixedFiles[i],
            UploadFileVersion.attachment
          );
        }
        UploadView.forceStateAndStartUpload();
        ShareExtension.clear();
        ShareExtension.close();
      }
    }
  };

  useEffect(() => {

    if (!keyboardHidden) {
      setVisibleTickerContainer(false)
      setVisibleHeaderContainer(false)
    }
    else {
      setVisibleTickerContainer(true)
      setVisibleHeaderContainer(true)
    }

  }, [keyboardHidden])



  const onExit = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to close the application?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );

    return true;
  };
  const _handleBackPressListener = () => {
    if (UploadView.getModalState()) {
      UploadView.hideModal();
    } else {

      setUploadAttachmentCount(UploadView.getUploadedAttachemntsOnly().length);

      if (Actions.currentScene == "mainView") onExit();
    }
  };
  const getFirstNStrings = (str, n) => {
    let sArr = str.split(" ");
    let firstStrs = "";
    for (let i = 0; i < n && i < sArr.length; i++) firstStrs += sArr[i] + " ";
    return firstStrs.trim();
  }
  const sendReport = () => {
    setSendingReportOverlayLoaderVisible(true);
    let uploadedFilesOnly = UploadView.getUploadedAttachemntsOnly();
    let fileUploadedNames = uploadedFilesOnly.map(
      (itm) => `"${itm.filenameCreated}"`
    );
    let uploadedFilesOnlyString = null;

    if (fileUploadedNames.length > 0) {
      uploadedFilesOnlyString = "[" + fileUploadedNames.join(",") + "]";
    }

    ApiCalls.addReport(
      ResourcesData.MainViewScreenResources.LoginJsonData.username,
      ResourcesData.MainViewScreenResources.LoginJsonData.password,
      contentText,
      selectionDropDownInputRef.current.getSelectedValue(),
      getFirstNStrings(contentText, 3),
      uploadedFilesOnlyString
    )
      .then((response) => {
        //  console.log(response)

        if (response.status == "200") {
          contentTextInputRef.current.reset();
          selectionDropDownInputRef.current.reset();

          UploadView.resetUploadFiles();


          setSendingReportOverlayLoaderVisible(false)
          setUploadAttachmentCount(0)

        } else {
          showError("Error accured. Please try again later");
          setSendingReportOverlayLoaderVisible(false);
        }
      })
      .catch((error) => {
        Includes.resolveErrorMessage(error.message).then((errorMessage) => {
          showError(errorMessage);
          setSendingReportOverlayLoaderVisible(false);
        });
      });
  }
  const submit = () => {
    let contentTextValid = contentTextInputRef.current._validate();
    let selectionDropDownInputValid = selectionDropDownInputRef.current._validate();

    if (contentTextValid && selectionDropDownInputValid) {
      let pendingFilesOnly = UploadView.getPendingOrUploadingAttachemntsOnly();
      let failedFilesOnly = UploadView.getFailedAttachemntsOnly();
      if (pendingFilesOnly.length > 0 || failedFilesOnly.length > 0) {
        var pendingText =
          pendingFilesOnly.length +
          (pendingFilesOnly.length > 1 ? " files are" : " file is") +
          " uploading. Are you sure want to continue?";

        var failedText =
          failedFilesOnly.length +
          (failedFilesOnly.length > 1 ? " files are" : " file is") +
          " failed uploading. Are you sure want to continue?";
        Alert.alert(
          "Confirm",
          pendingFilesOnly.length > 0 ? pendingText : failedText,
          [
            {
              text: "Continue",
              onPress: () => sendReport(),
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => { },
            },
          ],
          { cancelable: false }
        );
      } else {
        sendReport();
      }
    }
  };

  const showError = (message) => {
    showSnackBar({
      message: message,
      position: "top",
      confirmText: "OK",
      backgroundColor: "#c62828",
      duration: 3000,
    });
  }
  const uploadViewAttachmentFileUploadChangeCallBack = () => {
    setUploadAttachmentCount(UploadView.getUploadedAttachemntsOnly().length,
    );
  };


  const data = [
    { value: "FTP" },
    { value: "News" },
    { value: "Ticker" },
    { value: "Beeper" },
    { value: "OC-Reprt" },
    { value: "OC-VO" },
    { value: "OC-PKG" },
    { value: "OC-Grfx" },
    { value: "As-LIVE" },
  ];

  return (
    <View style={{ height: containerHeight }}>
      <SwitchAccount
        ref={switchAccountModalRef}
      />
      {visibleTickerContainer && (
        <View style={styles.tickerContainer}>
          <TextTicker
            style={styles.ticker}
            duration={3000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
          >
            {ResourcesData.MainViewScreenResources.LoginJsonData.ticker}
          </TextTicker>
        </View>
      )}
      {visibleHeaderContainer && (
        <View style={styles.headerContainer}>
          {ResourcesData.MainViewScreenResources.LoginJsonData
            .accountSwitch && (
              <Ripple
                onPress={() => {
                  switchAccountModalRef.current.setModalVisible();
                }}
                style={styles.switchAccountContainer}
              >
                <Text style={styles.switchAccountButton}>Switch Account</Text>
              </Ripple>
            )}
          <LinearGradient
            style={styles.headerTitle}
            colors={["#d32f2f", "#d32f2f"]}
          >
            <Text numberOfLines={1} style={styles.headerTitleText}>
              {ResourcesData.MainViewScreenResources.LoginJsonData.name}
            </Text>
          </LinearGradient>
          {props.switchAccountDetails != undefined &&
            props.switchAccountDetails.loggedUser ? (
            <Ripple
              onPress={() => {
                props.switchAccountDetails.loggedBack = true;
                Actions.replace("MainLoginOrSignUpScreen", {
                  switchAccountDetails: props.switchAccountDetails,
                });
              }}
              style={styles.headerSwitchAccountBackBtn}
            >
              <Icon name="arrow-left" size={35} color="#ffffff" />
            </Ripple>
          ) : (
            <Ripple
              onPress={() => {
                setLogoutDialogVisible(true);
              }}
              style={styles.headerLogoutBtn}
            >
              <Icon name="sign-out" size={35} color="#ffffff" />
            </Ripple>
          )}
          <ConfirmDialog
            title="Confirm"
            message="Are you sure you want to logout?"
            visible={logoutDialogVisible}
            onTouchOutside={() =>
              setLogoutDialogVisible(false)
            }
            positiveButton={{
              title: "Yes",
              onPress: () => {
                setLogoutDialogVisible(false);
                AsyncStorage.clear();
                Actions.replace("MainLoginOrSignUpScreen");
              },
            }}
            negativeButton={{
              title: "No",
              onPress: () => {
                setLogoutDialogVisible(false);
              },
            }}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <LinearGradient
          style={[styles.buttonContainerLeftBtn, { height: 75 } ]}
          colors={["#E14425", "#ef3c52"]}
          start={[0, 1]}
          end={[1, 0]}
        >
          <Ripple
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch",
            }}
            onPress={() => {
              Actions.jump("historyView");
            }}
          >
            <Icon name="history" size={30} color="#ffffff" />
            <Text style={{ color: "white", marginTop: 5, fontSize: 12 }}>
              History
            </Text>
          </Ripple>
        </LinearGradient>
        <LinearGradient
          style={[styles.buttonContainerCenterBtn, { height: 75 } ]}
          colors={["#F98902", "#ef3c52"]}
          start={[0, 1]}
          end={[1, 0]}
        >
          <Ripple
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch",
            }}
            onPress={() => {
              Keyboard.dismiss();
              UploadView.showModal(true, "bottom", "white");
            }}
          >
         <Icon name="upload" size={30} color="#ffffff" />
            <Text style={{ color: "white", marginTop: 5, fontSize: 12 }}>
              {uploadAttachmentCount} Files Uploaded
            </Text>
          </Ripple>
        </LinearGradient>
        <LinearGradient
          style={[styles.buttonContainerRightBtn,{ height: 75 }]}
          colors={["#E14425", "#ef3c52"]}
          start={[0, 1]}
          end={[1, 0]}
        >
          <Ripple
            style={{
              alignSelf: "stretch",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              const isPermissionGranted = await new PermissionsGrant().getAudioCameraRecordingPermission();
              if (isPermissionGranted) {
                Actions.jump("cameraView");
              }
            }}
          >
           <Icon name="camera" size={30} color="#ffffff" />
            <Text style={{ color: "white", marginTop: 5, fontSize: 12 }}>
              FastApp
            </Text>
          </Ripple>
        </LinearGradient>
      </View>


      <LinearGradient
        style={{ flex: 1, marginTop: 5 }}
        colors={["#E14425", "#ef3c52"]}
        start={[0, 1]}
        end={[1, 0]}
      >
        <Dropdown
          label="Select Newstype"
          data={data}
          ref={selectionDropDownInputRef}
          dropdownOffset={{ top: 25, left: 0 }}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={{ paddingVertical: 16, fontWeight: "700" }}
          triangleStyle={{ backgroundColor: "black" }}
          textColor={"black"}
          baseColor={"#3e3e3e"}
          errorColor={"red"}
          itemColor={"black"}
          required={true}
          backgroundColorErrorView={"#d32f2f"}
          pickerStyle={styles.dropdownPicker}
          hiddenIconErrorView={false}
        />
        <View
          style={{
            flex: 1,

          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (keyboardHidden) {
                contentTextInputRef.current.refInput._root.blur();

                setTimeout(() => {
                  contentTextInputRef.current.refInput._root.focus();
                }, 100);
              }
            }}
          >
            <View style={{
              flex: 1,
              borderColor: "rgba(236, 236, 236, 0.5)",
              backgroundColor: "#ededed",
              marginTop: 6,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderRightWidth: 1,
              borderLeftWidth: 1,
              marginHorizontal: 15,
              borderRadius: 3
            }}>
              <Text style={styles.tlValueContainerText}>
                <Text>Duration: </Text>
                {tlValue}
              </Text>
              <ValidateTextInput
                ref={contentTextInputRef}
                placeholder={"Type Slug"}
                typeInput="default"
                required={true}
                autoCorrect={false}
                numberOfLines={1}
                multiline={true}
                backgroundColorErrorView={"#d32f2f"}
                colorErrorText={"white"}
                typeErrorView={"bottomInput"}
                hiddenBorderErrorView={true}
                hiddenIconErrorView={true}
                borderColor={"#ededed"}
                placeholderTextColor={"#3e3e3e"}
                styleInput={styles.contentText}
                blurOnSubmit={false}
                withRef={true}
                hiddenIcon={true}
                onChangeTextInput={(value) => {
                  let text_ = value == null ? "" : value;
                  text_ = text_.replace(/\s/g, "");

                  let wordCount = (text_.length / 12).toFixed(0);

                  let totalSeconds =
                    wordCount > 0 ? wordCount - 1 : wordCount;
                  let minutes = (totalSeconds / 60).toFixed(0);

                  let seconds = totalSeconds % 60;
                  let tlValue =
                    (minutes > 9 ? "" + minutes : "0" + minutes) +
                    ":" +
                    (seconds > 9 ? "" + seconds : "0" + seconds);
                  setContentText(value)
                  setTlValue(tlValue);
                }}
              />
              <ClipboardToast toastPosition={'bottom'}
                toastDelay={1000} textToCopy={contentText} containerStyle={{ position: "absolute", bottom: 0, backgroundColor: "gray", padding: 5, opacity: 0.7, zIndex: 1000, width: 36 }} />
            </View>
          </TouchableWithoutFeedback>
          <LinearGradient
            style={{
              height: 50,
              marginTop: 6,
              marginHorizontal: 13,
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
            colors={["#F98902", "#F98902"]}
          >
            <Ripple
              style={styles.submitBtnContainer}
              onPress={() => {
                submit();
              }}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </Ripple>
          </LinearGradient>
        </View>

      </LinearGradient>


      <Spinner
        overlayColor={"rgba(0, 0, 0, 0.7)"}
        visible={sendingReportOverlayLoaderVisible}
        textContent={"Sending report please wait..."}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );

}
//registerRootComponent(SiblingsExample);

const styles = StyleSheet.create({
  headerContainer: {
    height: 40,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4.5,
  },

  headerTitle: {
    flex: 1,
    paddingHorizontal: 8,

    height: 40,

    justifyContent: "center",
  },
  headerTitleText: {
    fontFamily: "SegoeUI",
    fontWeight: "bold",
    fontSize: 19,
    color: "white",
  },
  headerLogoutBtn: {
    height: 40,
    justifyContent: "center",
    backgroundColor: "#d32f2f",
    width: 60,
    alignItems: "center",
  },
  headerSwitchAccountBackBtn: {
    height: 40,
    justifyContent: "center",
    backgroundColor: "#d32f2f",
    width: 60,
    alignItems: "center",
  },
  tickerContainer: {
    backgroundColor: "#F98902",
    alignItems: "center",
    paddingVertical: 14,
  },
  ticker: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    fontFamily: "SegoeUI",
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
  },
  buttonContainerLeftBtn: {

    justifyContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    flex: 3,
    marginRight: 5,
    alignItems: "center",
  },
  buttonContainerCenterBtn: {

    justifyContent: "center",
    borderRadius: 12,
    flex: 3,
    marginRight: 5,
    alignItems: "center",
  },
  buttonContainerRightBtn: {

    justifyContent: "center",
    backgroundColor: "#1976D2",
    flex: 3,
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  middleContentContainer: {
    flex: 1,
  },
  submitBtnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  submitBtnText: {
    color: "white",
    fontSize: 20,
  },
  dropdownContainer: {
    borderColor: "rgba(236, 236, 236, 0.5)",
    backgroundColor: "white",
    paddingHorizontal: 17,
    borderRadius: 3,
    marginTop: 6,
    marginHorizontal: 15,
  },
  dropdownPicker: {
    backgroundColor: "white",
    borderColor: "rgba(236, 236, 236, 0.5)",

    borderRadius: 5,
    paddingHorizontal: 10,
    height: 380,
  },
  contentText: {
    borderColor: "rgba(236, 236, 236, 0.5)",
    fontWeight: "700",
    backgroundColor: "#ededed",
    fontSize: 16,
    color: "black",
    textAlignVertical: "top",
    paddingVertical: 10,
    paddingHorizontal: 14,
    textAlign: "right",
    flex: 1
  },

  spinnerTextStyle: {
    fontSize: 18,
    color: "#FFF",
  },
  tlValueContainerText: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 12.5,
    backgroundColor: "green",
    color: "white",
    textAlignVertical: "center",
    textAlign: "center",
    zIndex: 200,
  },
  switchAccountContainer: {
    height: 40,
    justifyContent: "center",
    backgroundColor: "#499cea",
    borderRightWidth: 3,
    borderColor: "white",
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    paddingRight: 7,
  },
  switchAccountButton: {
    fontSize: 15,
    paddingRight: 4,
    paddingLeft: 4,
    color: "white",
  },
});
export default MainViewScreen