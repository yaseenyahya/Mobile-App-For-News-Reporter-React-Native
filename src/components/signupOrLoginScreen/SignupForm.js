import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-animatable";
import AnimatedLoadingBtn from "../../AnimatedLoadingBtn";
import CustomTextInput from "../CustomTextInput.js";
import metrics from "../../config/metrics";
import ValidateTextInput from "../../ValidateTextInput";

export default class SignupForm extends Component {
  state = {
   
    fullName: "",
    city :"",
    mobile:"",
    email:""

  };
  _getLoadingBtn() {
    return this.signupLoadingBtnRef;
  }
  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ]);
    }
  };
  _setInitialInputFocus(){
    this.fullnameInputRef.refInput._root.focus();
  }
  _register = ()=>{
    var fullnameValid = this.fullnameInputRef._validate();
    var cityValid = this.cityInputRef._validate();
    var mobileValid = this.mobileInputRef._validate();
    var emailValid = this.emailInputRef._validate();



    if (fullnameValid 
      && cityValid
      && mobileValid
      && emailValid
    ) {

      this.props.onSignupPress(this.state.fullName, 
        this.state.city,
        this.state.mobile,
        this.state.email
        );
    } else {
      this.signupLoadingBtnRef.reset();
    }
  }
  render() {
    const { email, password, fullName } = this.state;
    const { isLoading, onLoginLinkPress, onSignupPress } = this.props;
    const isValid = email !== "" && password !== "" && fullName !== "";
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={ref => (this.formRef = ref)}>
         
             <ValidateTextInput
            ref={ref => (this.fullnameInputRef = ref)}
            placeholder={"Full name"}
            editable={!isLoading}
            typeInput="default"
            required={true}
            returnKeyType={"next"}
            autoCorrect={false}
            numberOfLines={1}
            multiline={false}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17 }}
            styleItem={styles.inputText}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}
            hiddenIcon={false}
            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            borderColor={'rgba(255, 255, 255, 0.8)'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17,color:"white" }}
            autoFocus={true}
            blurOnSubmit={false}
            withRef={true}
            hiddenIcon={true}
           onSubmitEditing={() => this.cityInputRef.refInput._root.focus()}
           onChangeTextInput={value => this.setState({ fullName: value })}
            isEnabled={!isLoading}
          />
           <ValidateTextInput
            ref={ref => (this.cityInputRef = ref)}
            placeholder={"City"}
            editable={!isLoading}
            typeInput="default"
            required={true}
            returnKeyType={"next"}
            autoCorrect={false}
            numberOfLines={1}
            multiline={false}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17 }}
            styleItem={styles.inputText}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}
            hiddenIcon={false}
            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            borderColor={'rgba(255, 255, 255, 0.8)'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17,color:"white" }}
  
            blurOnSubmit={false}
            withRef={true}
            hiddenIcon={true}
          onSubmitEditing={() => this.mobileInputRef.refInput. getElement().focus()}
          onChangeTextInput={value => this.setState({ city: value })}
            isEnabled={!isLoading}
          />
            <ValidateTextInput
            ref={ref => (this.mobileInputRef = ref)}
            placeholder={"Mobile"}
            editable={!isLoading}
            typeInput="phone"
            required={true}
            returnKeyType={"next"}
            autoCorrect={false}
            numberOfLines={1}
            multiline={false}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17 }}
            styleItem={styles.inputText}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}
            hiddenIcon={false}
            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            borderColor={'rgba(255, 255, 255, 0.8)'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17,color:"white" }}
      
            blurOnSubmit={false}
            withRef={true}
            hiddenIcon={true}
          onSubmitEditing={() => this.emailInputRef.refInput._root.focus()}
          onChangeTextInput={value => this.setState({ mobile: value })}
            isEnabled={!isLoading}
          />
          <ValidateTextInput
            ref={ref => (this.emailInputRef = ref)}
            placeholder={"Email"}
            keyboardType={"email-address"}
            editable={!isLoading}
            typeInput="email"
            required={true}
            returnKeyType={"next"}
            autoCorrect={false}
            numberOfLines={1}
            multiline={false}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17 }}
            styleItem={styles.inputText}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}
            hiddenIcon={false}
            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            borderColor={'rgba(255, 255, 255, 0.8)'}
            placeholderTextColor={'rgba(255, 255, 255, 0.6)'}
            styleInput={{ fontFamily: "SegoeUI",paddingTop:0,paddingBottom:0,fontSize:17,color:"white" }}
       
            blurOnSubmit={false}
            withRef={true}
            hiddenIcon={true}
          onSubmitEditing={() => this._register()}
          onChangeTextInput={value => this.setState({ email: value })}
            isEnabled={!isLoading}
          />
    
          <View
            style={{ alignItems: "center" }}
            ref={ref => (this.buttonRef = ref)}
            animation={"bounceIn"}
            duration={600}
            delay={400}
          >
            <AnimatedLoadingBtn
              label={"Create Account"}
              borderRadiusOnLoading={30}
              onPress={() => this._register()}
              ref={ref => (this.signupLoadingBtnRef = ref)}
              successBackgroundColor="#70BBF5"
              successForegroundColor="#FFFFFF"
              errorBackgroundColor="#c62828" // default = red
              errorForegroundColor="#FFFFFF"
              backgroundColor="rgba(236, 236, 236, 0.4)"
              foregroundColor="#FFFFFF"
              style={styles.signupButton}
              bounce={true}
              maxWidth={metrics.DEVICE_WIDTH - 71}
              minWidth={60}
              labelStyle={styles.signupButtonLabel}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Text
            ref={ref => (this.linkRef = ref)}
            style={styles.loginLink}
            onPress={onLoginLinkPress}
            animation={"fadeIn"}
            duration={600}
            delay={400}
          >
            {"Already have an account?"}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
   
  },
  form: {
    marginTop: 20,
    
  },
  footer: {
    height: 200,
    justifyContent: "center"
  },
  createAccountButton: {
    backgroundColor: "white"
  },
  signupButton: {
    justifyContent: "center",
    borderWidth: 0,
    height: 60,
    borderRadius:3
  },
  createAccountButtonText: {
    color: "#3E464D",
    fontWeight: "bold"
  },
  loginLink: {
    color: "white",
    alignSelf: "center",
    padding: 20
    
  },
  signupButtonLabel: {
    fontSize: 18
  },inputText:{
    borderBottomWidth: 1,
    borderRadius: 3,
    padding:0,
    margin:0
  
  }
});
