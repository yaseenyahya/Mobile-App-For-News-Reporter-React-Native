import React, { Component, PropTypes } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-animatable";
import AnimatedLoadingBtn from "../../AnimatedLoadingBtn";

import ValidateTextInput from "../../ValidateTextInput";
import metrics from "../../config/metrics";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.initialUsername,
      password: this.props.initialPassword,
      loginLoadingBtnRef: null
    };
  }
  _setInitialInputFocus() {
    this.usernameInputRef.focus();
  }
  _getLoadingBtn() {
    return this.state.loginLoadingBtnRef;
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
  _login = () => {
    var usernameValid = this.usernameInputRef._validate();
    var passwordValid = this.passwordInputRef._validate();

    if (usernameValid && passwordValid) {
      const { username, password } = this.state;
      this.props.onLoginPress(username, password,false);
    } else {
      this.state.loginLoadingBtnRef.reset();
    }
  };
  render() {
    const { isLoading, onSignupLinkPress, onLoginPress } = this.props;
    
    return (
      <View style={styles.container}>
        <View
          style={styles.form}
          ref={ref => {
            this.formRef = ref;
          }}
        >
          <ValidateTextInput
            value={this.props.initialUsername}
            name={"username"}
            ref={ref => (this.usernameInputRef = ref)}
            placeholder={"Username"}
            keyboardType={"email-address"}
            editable={!isLoading}
            typeInput="default"
            required={true}
            returnKeyType={"next"}
            autoCorrect={false}
            numberOfLines={1}
            multiline={false}
   
            styleItem={styles.inputText}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}

            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            borderColor={"rgba(255, 255, 255, 0.8)"}
            placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
            styleInput={{
              fontFamily: "SegoeUI",
              paddingTop: 0,
              paddingBottom: 0,
              fontSize: 17,
              color: "white"
            }}
            autoFocus={true}
            blurOnSubmit={false}
            withRef={true}
            hiddenIcon={true}
            onSubmitEditing={() => {
              this.passwordInputRef.refInput._root.focus();
            }}
            onChangeTextInput={value => this.setState({ username: value })}
            isEnabled={!isLoading}
          />
          <ValidateTextInput
            value={this.props.initialPassword}
            name={"password"}
            ref={ref => (this.passwordInputRef = ref)}
            placeholder={"Password"}
            required={true}
            typeInput="password"
            hiddenIcon={true}
            numberOfLines={1}
            multiline={false}
            autoCorrect={false}
            backgroundColorErrorView={"rgba(255, 255, 255, 0.7)"}
            colorErrorText={"black"}
            borderColor={"rgba(255, 255, 255, 0.8)"}
            placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
            styleInput={{
              fontFamily: "SegoeUI",
              paddingTop: 0,
              paddingBottom: 0,
              fontSize: 17,
              color: "white"
            }}
            styleItem={styles.inputText}
            typeErrorView={"bottomInput"}
            hiddenIconErrorView={true}
            editable={!isLoading}
            returnKeyType={"done"}
            secureTextEntry={true}
            withRef={true}
            onSubmitEditing={() => this._login()}
            onChangeTextInput={value => this.setState({ password: value })}
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
              label="Log in"
              borderRadiusOnLoading={30}
              onPress={() => this._login()}
              noRadius={false}
              ref={ref => (this.state.loginLoadingBtnRef = ref)}
              successBackgroundColor="#70BBF5"
              successForegroundColor="#FFFFFF"
              errorBackgroundColor="#c62828" // default = red
              errorForegroundColor="#FFFFFF"
              backgroundColor="rgba(236, 236, 236, 0.4)"
              foregroundColor="#FFFFFF"
              style={styles.loginButton}
              bounce={true}
              maxWidth={metrics.DEVICE_WIDTH - 71}
              minWidth={60}
              labelStyle={styles.loginButtonLabel}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Text
            ref={ref => (this.linkRef = ref)}
            style={styles.signupLink}
            onPress={onSignupLinkPress}
            animation={"fadeIn"}
            duration={600}
            delay={400}
          >
            {"Don't have an account? Register here"}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 200,
    justifyContent: "center"
  },
  loginButton: {
    justifyContent: "center",
    borderWidth: 0,
    height: 60,
    borderRadius: 3
  },
  loginButtonText: {
    color: "#3E464D",
    fontWeight: "bold",
    fontSize: 18
  },
  inputText: {
    borderBottomWidth: 1,
    borderRadius: 3,
    padding: 0,
    margin: 0
  },
  signupLink: {
    color: "white",
    alignSelf: "center",
    padding: 20
  },
  loginButtonLabel: {
    fontWeight: "700",
    fontSize: 18
  }
});
