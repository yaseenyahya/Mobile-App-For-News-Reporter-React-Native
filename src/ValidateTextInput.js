import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Platform,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Text
} from "react-native";

import {
  Content,
  Form,
  Item,
  Input,
  Col,
  Row,
  Grid,
  Icon,
  Button
} from "native-base";
import { TextInputMask } from "react-native-masked-text";

const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_HEIGHT_NO_STATUS_BAR = WINDOW_HEIGHT - STATUS_BAR_HEIGHT;

export default class ValidateTextInput extends Component {
  static propTypes = {
    backgroundTextInput: PropTypes.string,
    autoCapitalize: PropTypes.string,
    autoFocus: PropTypes.bool,
    editable: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    underlineColorAndroid: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    maxLength: PropTypes.number,
    disableFullscreenUI: PropTypes.bool,
    allowFontScaling: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    caretHidden: PropTypes.bool,
    enablesReturnKeyAutomatically: PropTypes.bool,
    styleInputDefault: PropTypes.any,
    styleInputEmail: PropTypes.any,
    styleInputPassword: PropTypes.any,
    styleItem: PropTypes.any,
    styleIcon: PropTypes.any,
    styleInput: PropTypes.any,
    errorItem: PropTypes.string,
    onChange: PropTypes.func,
    valueInput: PropTypes.string,
    onChangeText: PropTypes.func,
    typeInput: PropTypes.string,
    hiddenIcon: PropTypes.bool,
    renderIcon: PropTypes.func,
    backgroundColorErrorView: PropTypes.string,
    colorErrorText: PropTypes.string,
    customValidate: PropTypes.bool
  };

  static defaultProps = {
    backgroundTextInput: "transparent",
    autoCapitalize: "none",
    autoFocus: false,
    editable: true,
    secureTextEntry: false,
    underlineColorAndroid: "transparent",
    placeholder: "Nhập nội dung...",
    placeholderTextColor: "gray",
    multiline: true,
    maxLength: 10000,
    hiddenIconErrorView:false,
    hiddenBorderErrorView:false,
    disableFullscreenUI: false,
    allowFontScaling: true,
    autoCorrect: true,
    caretHidden: false,
    enablesReturnKeyAutomatically: false,
    styleInputDefault: {
      color: "#000",

      fontSize: 14,
      // width: WINDOW_WIDTH,
      backgroundColor: "transparent",
      paddingLeft: 10
    },

    styleInputEmail: {
      color: "#000",

      fontSize: 14,
      // width: WINDOW_WIDTH,
      backgroundColor: "transparent",
      paddingLeft: 10
    },

    styleInputPassword: {
      color: "#000",

      fontSize: 14,
      // width: WINDOW_WIDTH,
      backgroundColor: "transparent",
      paddingLeft: 10
    },

    styleItem: {
      alignItems: "center",
      borderWidth: 1,
      backgroundColor: "#ededed",
      borderRadius: 5
    },

    styleIcon: {
      color: "#CC990A",
      fontSize: 22,
      backgroundColor: "transparent",
      alignItems: "center",
      marginRight: 5,
      marginLeft: 5
    },

    errorItem: "",
    valueInput: "",
    typeInput: "default",
    hiddenIcon: false,
    backgroundColorErrorView: "#ea4335",
    colorErrorText: "#fff",
    customValidate: false
  };

  constructor(props) {
    super(props);
    this.state = {
      errorText: "",
      valueInput: this.props.value,
      focus: this.props.autoFocus
    };
  }
  refInput = null;
  _validate = () => {
   
    this._onProcessTextChange(this.state.valueInput);
    return  this.state.errorText == "";
  };
  reset = () => {
    return this.setState({valueInput:""});
  };
  _renderIcon() {
    return (
      <Icon
        name={
          this.props.typeInput == "email"
            ? "ios-person"
            : this.props.typeInput == "password"
            ? "ios-lock"
            : "ios-person"
        }
        style={this.props.styleIcon}
      />
    );
  }

  showCustomError(errorText) {
    this.setState({
      errorText: errorText
    });
  }
  isEmailValid = text => {
    let email = text;
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase()) == 1;
  };
  _onProcessTextChange(currentText) {
    if (!this.props.customValidate) {
      if (this.props.typeInput == "email") {
        if (!currentText) {
          this.setState({
            errorText: "This field is required"
          });
        } else if (!this.isEmailValid(currentText)) {
          this.setState({
            errorText: "Invalid email address"
          });
        } else {
          this.setState({
            errorText: ""
          });
        }
      }
      if (this.props.typeInput == "default") {
        if (!currentText) {
          this.setState({
            errorText: "This field is required"
          });
        } else if (currentText.length < 3 && currentText) {
          this.setState({
            errorText: "Length must be greater than 3"
          });
        } else {
          this.setState({
            errorText: ""
          });
        }
      }
      if (this.props.typeInput == "password") {
        if (!currentText) {
          this.setState({
            errorText: "This field is required"
          });
        } else if (currentText.length < 3 && currentText.length > 0) {
          this.setState({
            errorText: "Length must be greater than 3"
          });
        } else {
          this.setState({
            errorText: ""
          });
        }
      }

      if (this.props.typeInput == "phone") {
        if (!currentText) {
          this.setState({
            errorText: "This field is required"
          });
        } else if (this.refInput.getRawValue().toString().length < 11 ) {
          this.setState({
            errorText: "Number is not valid"
          });
        } else {
          this.setState({
            errorText: ""
          });
        }
      }
    } else {
      this.setState({
        errorText: this.props.errorItem
      });
    }
  }

  componentDidMount() {}

  onFocus() {
    this.setState({
      focus: true
    });
  }

  onBlur() {
    this.setState({
      focus: false
    });
  }

  render() {
    return (
      <View style={{ flexDirection: "column", marginBottom: 20 }}>
        <View
          style={[
            this.props.styleItem,
            {
              borderColor: this.state.errorText
                ? (this.props.hiddenBorderErrorView ? this.props.borderColor : this.props.backgroundColorErrorView )
                : this.props.borderColor,
              zIndex: 0,

              paddingVertical: 5,

              margin: 0,
              flexDirection: "row",
              zIndex: 100
            }
          ]}
        >
          {!this.props.hiddenIcon ? (
            this.props.renderIcon ? (
              this.props.renderIcon
            ) : (
              <View
                style={{
                  backgroundColor: "transparent",
                  width: 50,

                  justifyContent: "center",
                  alignItems: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#FFBC00"
                }}
              >
                {this._renderIcon()}
              </View>
            )
          ) : null}
          {this.props.typeInput == "phone" && (
            <TextInputMask
            ref={ref=> this.refInput = ref}
              placeholder={"Mobile (92) 333-3333333"}
              type={"custom"}
              keyboardType={"number-pad"}
              style={[this.props.styleInputDefault,this.props.styleInput,{paddingBottom:7,flex:1,paddingTop:7},]}
              selectionColor={"black"}
              onSubmitEditing={this.props.onSubmitEditing}
              blurOnSubmit={false}
              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus()}
              placeholderTextColor={this.props.placeholderTextColor}
              value={this.state.valueInput}
              options={{
                mask: "(99) 999-9999999",
                getRawValue: function(value, settings) {
                  return value
                    .replace("(", "")
                    .replace(")", "")
                    .replace("-", "")
                    .replace(" ", "");
                }
              }}
              onChange={this.props.onChange}
              onChangeText={text => {
                this._onProcessTextChange(text);
                this.setState({
                  valueInput: text
                });

                this.props.onChangeTextInput &&
                  this.props.onChangeTextInput(text);
              }}
            />
          )}
          {this.props.typeInput != "phone" && (
            <Input
            ref={ref=> this.refInput = ref}
              autoCapitalize={this.props.autoCapitalize}
              value={this.state.valueInput}
              underlineColorAndroid={this.props.underlineColorAndroid}
              autoFocus={this.props.autoFocus}
              onSubmitEditing={this.props.onSubmitEditing}
              editable={this.props.editable}
              returnKeyType={this.props.returnKeyType}
              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus()}
              secureTextEntry={
                this.props.secureTextEntry
                  ? this.props.secureTextEntry
                  : this.props.typeInput == "password"
                  ? true
                  : false
              }
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              multiline={this.props.multiline}
              blurOnSubmit={false}
              numberOfLines={this.props.numberOfLines}
              disableFullscreenUI={this.props.disableFullscreenUI}
              autoCorrect={this.props.autoCorrect}
              caretHidden={this.props.caretHidden}
              enablesReturnKeyAutomatically={
                this.props.enablesReturnKeyAutomatically
              }
              style={[
                this.props.typeInput == "email"
                  ? this.props.styleInputEmail
                  : this.props.typeInput == "password"
                  ? this.props.styleInputPassword
                  : this.props.styleInputDefault,
                this.props.styleInput
              ]}
              onChange={this.props.onChange}
              onChangeText={text => {
                this._onProcessTextChange(text);
                this.setState({
                  valueInput: text
                });

                this.props.onChangeTextInput &&
                  this.props.onChangeTextInput(text);
              }}
            />
          )}
          {this.state.errorText && !this.props.hiddenIconErrorView ? (
            <Icon
              active
              style={{ color: this.props.backgroundColorErrorView, fontSize: 18, marginRight: 15,marginTop:6 }}
              name="md-alert"
            />
          ) : null}
        </View>

        {this.state.errorText ? (
        //  this.state.focus ? (
            <View style={{ zIndex: 200 }}>
              <View
                style={{
                  top: -13,
                  right: 20,
                  position: "absolute",

                  borderColor: "transparent",
                  borderBottomWidth: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: this.props.backgroundColorErrorView,
                  padding: 7,
                  borderRadius: 5
                }}
              >
                <Icon
                  active
                  style={{
                    zIndex: 1,
                    color: "#fff",
                    fontSize: 16,
                    marginRight: 5
                  }}
                  name="md-alert"
                />
                <Text
                  style={{
                    zIndex: 1,
                    fontSize: 14,
                    color: this.props.colorErrorText,
                    marginRight: 5
                  }}
                >
                  {this.state.errorText}
                </Text>
              </View>
              <View style={[styles.talkBubbleTriangle,{borderBottomColor:this.props.backgroundColorErrorView}]} />
            </View>
   
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden"
  },

  plhIcon: {
    color: "white",
    fontSize: 20,
    backgroundColor: "transparent",
    alignItems: "center"
  },

  talkBubbleTriangle: {
    position: "absolute",
    bottom: 10,
    right: 30,
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderLeftWidth: 18,
    borderBottomWidth: 18,
   
    borderRightWidth: 0,
    borderRightColor: "transparent"
  }
});
