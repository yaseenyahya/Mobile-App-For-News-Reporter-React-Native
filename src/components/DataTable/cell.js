import React, { Component } from 'react';
import { View, ViewPropTypes, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
export class Cell extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    borderStyle: ViewPropTypes.style
  };

  constructor(props) {
    super(props);
  
  }


  render() {
    const { data, width, height, flex, style,cellStyle, textStyle, borderStyle, ...props } = this.props;
    const textDom = React.isValidElement(data) ? (
      data
    ) : (
        <Text numberOfLines={1} style={[textStyle, styles.text,cellStyle]} {...props}>
          {data == "showSearchIcon" ?   <Icon name="search" size={15} color="#E14425" /> : data}
        </Text>
      );
    const borderTopWidth = (borderStyle && borderStyle.borderWidth) || 0;
    const borderRightWidth = borderTopWidth;
    const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

    return (
      <View
        style={[cellStyle,
          {
            borderTopWidth,
            borderRightWidth,
            borderColor
          },
          styles.cell,
          width && { width },
          height && { height },
          flex && { flex },
          !width && !flex && !height && !style && { flex: 1 },
          style
        ]}
      >
        {textDom}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cell: { justifyContent: 'center' },
  text: { backgroundColor: 'transparent' }
});