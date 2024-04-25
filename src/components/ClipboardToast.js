import React from 'react';
import { TouchableOpacity, Text, Clipboard, ToastAndroid } from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";


const ClipboardToast = ({
  showIcon = true,
  textToShow = "",
  textToCopy = '',
  toastText = 'Text is copied',
  containerStyle = {},
  textStyle = {},
  id = 'someKey',
  accessibilityLabel,
  toastDuration = 750,
  toastPosition,
  toastDelay = 0,
  toastAnimation = true,
  toastHideOnPress = true,
  toastBackgroundColor = null,
  toastTextColor = null,
  toastOnShow = () => { },
}) => {
  const convertPosition = () => {
    switch ((toastPosition || '').toLowerCase()) {
      case 'top':
        return Toast.positions.TOP;
      case 'center':
        return Toast.positions.CENTER;
      default:
        return Toast.positions.BOTTOM;
    }
  };

  const onCopyToClipBoard = (clipboardText) => {
    Clipboard.setString(clipboardText);
    let toast = ToastAndroid.showWithGravityAndOffset(toastText,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      25
    );


  };

  return (
    <TouchableOpacity
      key={id}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
      style={containerStyle}
      onPress={() => onCopyToClipBoard(textToCopy)}
    >
      {showIcon &&
        <Icon name="copy" size={25} color="white" />}
      {textToShow != "" && <Text style={textStyle}>{textToShow}</Text>}
    </TouchableOpacity>
  );
};


export default ClipboardToast;