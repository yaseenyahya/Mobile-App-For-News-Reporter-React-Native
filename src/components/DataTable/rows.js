import React, { Component } from "react";
import {
  View,
  ViewPropTypes,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Cell } from "./cell";
import { sum } from "./utils";
import Ripple from "react-native-material-ripple";
export class Row extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
  };
  state = {
    highlightRow: false,
  };
  constructor(props) {
    super(props);
    this.onRowSelected = props.onRowSelected;
    this.rowID = props.rowID;
  }
  highlightRowToggle = (highlight) => {
    this.setState({ highlightRow: highlight });
  };
  onSelected = () => {
    this.onRowSelected && this.onRowSelected(this.rowID);
  };
  render() {
    const {
      data,
      style,
      widthArr,
      height,
      flexArr,
      textStyle,
      ...props
    } = this.props;
    let width = widthArr ? sum(widthArr) : 0;

    return data ? (
      <TouchableWithoutFeedback onPress={this.onSelected}>
        <View style={[height && { height }, width && { width }, style]}>
          <View
            style={[
              height && { height },
              width && { width },
              styles.row,
              this.state.highlightRow ? { backgroundColor: "#9c9c9c8f" } : null,
            ]}
          >
            {data.map((item, i) => {
       
              const flex = flexArr && flexArr[i];
              const wth = widthArr && widthArr[i];
              return item.type != "button" ? (
                <Cell
                  key={i}
                  data={item.text == undefined ? item : item.text}
                  width={wth}
                  height={height}
                  flex={flex}
                  textStyle={textStyle}
                  cellStyle={item.cellStyle}
                  {...props}
                />
              ) : (
                <Ripple
                  onPress={() => {
                    this.props.onCommand &&
                      this.props.onCommand(this.rowID, item.text);
                  }}
                  key={i}
                  style={styles.rowBtn}
                >
                  <Text style={styles.rowBtnText}>{item.text}</Text>
                </Ripple>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : null;
  }
}

export class Rows extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
  };

  render() {
    const {
      data,
      style,
      widthArr,
      heightArr,
      flexArr,
      textStyle,
      ...props
    } = this.props;
    const flex = flexArr ? sum(flexArr) : 0;
    const width = widthArr ? sum(widthArr) : 0;

    return data ? (
      <View style={[flex && { flex }, width && { width }]}>
        {data.map((item, i) => {
          const height = heightArr && heightArr[i];
          return (
            <Row
              key={i}
              data={item}
              widthArr={widthArr}
              height={height}
              flexArr={flexArr}
              style={style}
              textStyle={textStyle}
              {...props}
            />
          );
        })}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    overflow: "hidden",
  },
  rowBtn: {
    borderWidth: 2,
    borderColor: "#c8e1ff",
    backgroundColor: "#E14425",
    justifyContent: "center",
    flex: 1,
  },
  rowBtnText: { textAlign: "center", color: "white" },
});
