import React, { Component, useEffect, useState, useRef, useContext } from "react";
import {
  KeyboardAvoidingView,
  ImageBackground,

  LayoutAnimation,
  Alert,
  Platform,
  StyleSheet,
  UIManager,
  AsyncStorage
} from "react-native";
import { Image, View, Text } from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import imgLogo from "../../../assets/fastapplogo.png";
import Includes from "../../Includes";
import metrics from "../../config/metrics";
import { showSnackBar } from "../../SnackBar";
import SelectionView from "./SelectionView";
import SignupForm from "./SignupForm";
import SafeAreaView from "react-native-safe-area-view";
import LoginForm from "./LoginForm";
import ApiCalls from "../../api/ApiCalls";
import ResourcesData from "../../ResourcesData";
import { Actions } from "react-native-router-flux";
import { KeyboardStatusContext } from '../../context/KeyboardStatusContextProvider'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.8;

if (Platform.OS === "android")
  UIManager.setLayoutAnimationEnabledExperimental(true);

const MainLoginOrSignUpScreen = (props) => {
  const initialUsername =
    props.alertOnStartupMessage != null
      ? props.alertOnStartupMessage.username
      : null;
  const initialPassword =
    props.alertOnStartupMessage != null
      ? props.alertOnStartupMessage.password
      : null;
  const { keyboardHidden, keyboardHeight } = useContext(KeyboardStatusContext)


  const [visibleForm, setVisibleForm] = useState(props.alertOnStartupMessage != null ? "LOGIN" : null)
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef(null);
  const logoImgRef = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (props.alertOnStartupMessage != null) {
        showSnackBar({
          message: props.alertOnStartupMessage.message,
          position: "top",
          confirmText: "OK",
          backgroundColor: "#c62828",
          duration: 1500
        });

      }
    }, 900);
    if (props.switchAccountDetails != undefined) {
      if (props.switchAccountDetails.switchUser != undefined) {
        setVisibleForm("LOGIN");
          let username = props.switchAccountDetails.switchUser.username;
          let password = props.switchAccountDetails.switchUser.password;
          props.switchAccountDetails.switchUser = undefined;
          login(username, password, true);
       
      }
      if (props.switchAccountDetails.loggedUser != undefined) {
        if (props.switchAccountDetails.loggedBack) {

          setVisibleForm("LOGIN")
            let username = props.switchAccountDetails.loggedUser.username;
            let password = props.switchAccountDetails.loggedUser.password;
            props.switchAccountDetails = undefined;
            login(username, password, false);
         
        }
      }
    }
  }, [])



  const _setVisibleForm = async visibleForm => {
    if (visibleForm && formRef.current && formRef.current.hideForm) {
      await formRef.current.hideForm();
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    setVisibleForm(visibleForm);
  };

  const login = (username, password, onSwitchAccount) => {
    setIsLoading(true);
    try {
      ApiCalls.callLoginApi(username, password)
        .then(response => {
          if (response.status == "404") {
          showErrorOnLogin("Invalid username or password");
          } else {
            response.json().then(responseJson => {
              if (!onSwitchAccount) {
                AsyncStorage.setItem("username", username);
                AsyncStorage.setItem("password", password);
              }
              formRef.current._getLoadingBtn().success();
              ResourcesData.loadMainViewScreenResources(responseJson).then(() => {
                setIsLoading(false);
                Actions.replace("mainView",
                  onSwitchAccount
                    ? { switchAccountDetails: props.switchAccountDetails }
                    : undefined);
              });
            });
          }
        })
        .catch(error => {
          Includes.resolveErrorMessage(error.message).then(errorMessage => {
            showErrorOnLogin(errorMessage);
          });
        });
    } catch (ex) {
      Alert.alert("Error occured.Please contact admin.", ex.message);
      setIsLoading(false);
      formRef.current._getLoadingBtn().reset();
    }
  };
  const showErrorOnLogin = message => {
    showSnackBar({
      message: message,
      position: "top",
      confirmText: "OK",
      backgroundColor: "#c62828",
      duration: 6000
    });
    setIsLoading(false);

    formRef.current._getLoadingBtn().error();
    setTimeout(() => {
      formRef.current._getLoadingBtn().reset();
    }, 1200);
  };
  const signup = (fullName, city, mobile, email) => {
    setIsLoading(true);

    ApiCalls.registerUser(fullName, city, mobile, email)
      .then(response => {
        try {
          if (response.status == "200") {
            formRef.current._getLoadingBtn().success();

            Alert.alert(
              //title
              "Success",
              //body
              "We recieved your request. We will get back to you soon.",
              [
                {
                  text: "OK",
                  onPress: () =>{
                    setVisibleForm(null)
                    setIsLoading(false)
                  }
                }
              ],
              { cancelable: true }
            );
          } else {
            showErrorOnLogin("Please try again later.");
          }
        } catch (exception) {
          showErrorOnLogin("Please try again later.");
        }
      })
      .catch(error => {
        Includes.resolveErrorMessage(error.message).then(errorMessage => {
          showErrorOnLogin(errorMessage);
        });
      });
  };

  // The following style is responsible of the "bounce-up from bottom" animation of the form
  const formStyle = !visibleForm ? { height: 0 } : { marginTop: 0 };
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.bgContainer}
        colors={["#E14425", "#ef3c52"]}
      >
        <View style={keyboardHidden ? {flex:1} : null}>
          {keyboardHidden &&
            <Image
              animation={"bounceIn"}
              duration={1200}
              delay={200}
              ref={logoImgRef}
              style={styles.logoImg}
              source={imgLogo}
            />
          }
          {(!visibleForm || visibleForm === "LOGIN") && (
            <Text
              animation={"zoomIn"}
              duration={600}
              delay={400}
              style={[{
                color: "white",
                fontSize: 22,
                textAlign: "center",
                fontFamily: "SegoeUI"
              },!keyboardHidden ? {paddingTop:10} : null]}
            >
              Welcome To media eye services
            </Text>
          )}
        </View>

        {!visibleForm && (
          <SelectionView
            onCreateAccountPress={() => _setVisibleForm("SIGNUP")}
            onSignInPress={() => _setVisibleForm("LOGIN")}
          />
        )}
        <KeyboardAvoidingView
          keyboardVerticalOffset={-100}
          behavior={"margin"}
          style={[formStyle, styles.bottom]}
        >
          {visibleForm === "SIGNUP" && (
            <SignupForm
              ref={formRef}
              onLoginLinkPress={() => _setVisibleForm("LOGIN")}
              onSignupPress={signup}
              isLoading={isLoading}
            />
          )}
          {visibleForm === "LOGIN" && (
            <LoginForm
              initialUsername={initialUsername}
              initialPassword={initialPassword}
              ref={formRef}
              onSignupLinkPress={() => _setVisibleForm("SIGNUP")}
              onLoginPress={login}
              isLoading={isLoading}
            />
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    // width: metrics.DEVICE_WIDTH,
    // height: metrics.DEVICE_HEIGHT,
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: "center",
    resizeMode: "contain"
  },
  bgContainer: {
    flex: 1
  },
  bottom: {}
});
export default MainLoginOrSignUpScreen