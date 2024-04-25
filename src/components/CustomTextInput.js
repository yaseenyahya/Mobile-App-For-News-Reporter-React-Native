import React, { Component, PropTypes } from "react";
import { Text } from "react-native";
import { Platform, StyleSheet, TextInput } from "react-native";
import { View } from "react-native-animatable";
import { TextInputMask } from 'react-native-masked-text';
const IS_ANDROID = Platform.OS === "android";

export default class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      value: this.props.value,
      error: null
    };
  }
 
  isEmailValid = (text) => {
    let email = text;
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase()) == 1
  }
  focus = () => this.textInputRef.focus();
  _onChangeText = value => {
  
 
   // if (this.props.typeInput != "mobile")
   // value = this.maskInput.getRawValue();
    this.setState({ value });

    this.props.onCustomChangeText(value);
    this._validate();
  };

  _validate() {

    var isValid = true;
    if (this.props.typeInput != "mobile"){
    if (this.props.required && this.props.typeInput != "email") {
      if (!this.state.value || this.state.value.length < 3) {
        isValid = false;
        this.setState({ error: "Length must be greater than 3" });
      } else {
     
        this.setState({ error: null });
        
      }
    }
    if (isValid) {
      if (this.props.typeInput == "email") {
    
        if (!this.isEmailValid(this.state.value)) {
          isValid = false;
          this.setState({ error: "Invalid email address" });
        } else {
          this.setState({ error: null });
        }
      }
    }
  }else{
    
    if(this.maskInput.getRawValue().toString().length < 11){
      isValid = false;
    this.setState({ error: "Number is not valid" });
    } else {
      this.setState({ error: null });
    }
  }

    return isValid;
  }
  render() {
    const { isEnabled, typeInput, editable, ...otherProps } = this.props;

    const { isFocused, error } = this.state;
    const color = isEnabled ? "black" : "red";
    var borderColor = isFocused ? "#F3AA4E" : "#b5b5b5";

    borderColor = error == null ? borderColor : "#ff3333";
    return (
      <View style={styles.container}>
        <View style={[styles.textInputWrapper, { borderColor }]}>
          {this.props.typeInput == "mobile" &&
         <TextInputMask placeholder={"Mobile (92) 333-3333333"}
         type={'custom'}
         ref={(ref) => this.maskInput = ref}
        keyboardType={"number-pad"}
         style={[styles.textInput, { color }]}
         selectionColor={"black"}
         placeholderTextColor={"#545454"}
         value={this.state.value}
         options={{
        
          mask: '(99) 999-9999999',
          getRawValue: function(value, settings) {
            return value.replace("(","").replace(")","").replace("-","").replace(" ","")
          },
        }}

         onChangeText={this._onChangeText}
       />

          }
          {this.props.typeInput != "mobile" &&
            <TextInput  
            {...otherProps}
            value={this.state.value}
              ref={ref => (this.textInputRef = ref)}
              autoCapitalize={"none"}
              autoCorrect={false}
              style={[styles.textInput, { color }]}
              maxLength={32}
              value={this.state.value}
              underlineColorAndroid={"transparent"}
              placeholderTextColor={"#545454"}
              selectionColor={"black"}
              onChangeText={this._onChangeText}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              
            />
          }
        </View>
        <Text style={{ fontSize: 11, color: "#ff3333", alignSelf: "flex-end" }}>
          {this.state.error}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 8
  },
  textInputWrapper: {
    height: 45,
    marginBottom: 2,
    borderBottomWidth: 4
  },
  textInput: {
    flex: 1,

    margin: IS_ANDROID ? -1 : 0,
    height: 42,
    padding: 7
  }
});
