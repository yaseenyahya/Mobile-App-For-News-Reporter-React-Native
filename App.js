global.__rootSiblingsDisabled = true;
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  Alert,
  AppRegistry
} from "react-native";

import { AppLoading, SplashScreen } from "expo";
import MainLoginOrSignUpScreen from "./src/components/signupOrLoginScreen/MainLoginOrSignUpScreen";
import { AsyncStorage } from "react-native";
import { Scene, Router, Stack } from "react-native-router-flux";
import { Asset } from "expo-asset";
import Snackbar from "./src/SnackBar";
import ResourcesData from "./src/ResourcesData";
import ApiCalls from "./src/api/ApiCalls";
import Includes from "./src/Includes";
import MainViewScreen from "./src/components/mainView/MainViewScreen";
import HistoryView from "./src/components/historyView/HistoryView";
import CameraView from "./src/components/cameraView/CameraView";
import { RootSiblingParent } from "react-native-root-siblings";
import { ReModalProvider } from "react-native-remodal";
import UploadView from "./src/components/uploadView/UploadView";
import { KeyboardStatusContextProvider } from './src/context/KeyboardStatusContextProvider'
//import RNFileShareIntent from 'react-native-file-share-intent';
AppRegistry.registerComponent('Appname', () => App);
export default class App extends Component {
  state = {
    isSplashReady: false,
    isAppReady: false,

    initialIsMainView: false,

    alertOnStartupMessage: null,
    fileUrl: null,

  };

  componentDidMount() {

    // new PermissionsGrant().getApplicationPermissions();
    // if(RNFileShareIntent){
    //   RNFileShareIntent.getFilepath((url) => {
    //     this.setState({ fileUrl: url });
    //     })
    // }
  }


  _cacheSplashResourcesAsync = async () => {
    const gif = require("./assets/Splash.gif");
    return Asset.fromModule(gif).downloadAsync();
  };
  _cacheResourcesAsync = async () => {
    await ResourcesData.loadLoginScreenResources();

    try {
      const username = await AsyncStorage.getItem("username", (err, result) => {
        return result;
      });
      const password = await AsyncStorage.getItem("password", (err, result) => {
        return result;
      });

      if (username != null && password != null) {
        await ApiCalls.callLoginApi(username, password)
          .then(response => {
            if (response.status == "404") {
              SplashScreen.hide();
              this.setState({
                alertOnStartupMessage: "Invalid username or password",
                isAppReady: true
              });
            } else {
              response.json().then(responseJson => {
                SplashScreen.hide();

                ResourcesData.loadMainViewScreenResources(responseJson).then(
                  () => {
                    this.setState({
                      initialIsMainView: true,
                      isAppReady: true
                    });
                  }
                );
              });
            }
          })

          .catch(error => {

            Includes.resolveErrorMessage(error.message).then(errorMessage => {
              SplashScreen.hide();
              this.setState({
                alertOnStartupMessage: {
                  message: errorMessage,
                  username: username,
                  password: password
                },
                isAppReady: true
              });
            });
          });
      } else {

        SplashScreen.hide();
        this.setState({ isAppReady: true });
      }
    } catch (error) {
      Alert.alert("Error occured.Please contact admin.", error.message);

      SplashScreen.hide();
      this.setState({ isAppReady: true });
    }
  };

  render() {

    //console.disableYellowBox = true;
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({ isSplashReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    if (!this.state.isAppReady) {
      return (
        <View style={styles.splashContainer}>
          <Image
            source={require("./assets/Splash.gif")}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }

    return (
      <RootSiblingParent>
        <StatusBar hidden={true} />
        <KeyboardStatusContextProvider>

          <View forceInset={{ top: "never" }} style={{ flex: 1 }}>
            <ReModalProvider >


              <Router>
                <Stack key="root">
                  <Scene
                    key="MainLoginOrSignUpScreen"
                    hideNavBar={true}
                    component={MainLoginOrSignUpScreen}
                    alertOnStartupMessage={this.state.alertOnStartupMessage}
                  />
                  <Scene
                    key="mainView"
                    initial={this.state.initialIsMainView}
                    title="home"
                    hideNavBar={true}
                    component={MainViewScreen}
                  />
                  <Scene
                    key="historyView"
                    title="Reports History"
                    hideNavBar={true}
                    component={HistoryView}
                  />
                  <Scene
                    key="cameraView"
                    title="Camera"
                    hideNavBar={true}
                    component={CameraView}
                  />
                </Stack>
              </Router>

              <Snackbar id={"Root_App"} />
              <UploadView></UploadView>
            </ReModalProvider>
          </View>

        </KeyboardStatusContextProvider>
      </RootSiblingParent>

    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  container: {
    flex: 1
  }
});


