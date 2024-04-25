import React, { Component, PropTypes } from "react";
import { StyleSheet, Text } from "react-native";

import ProgressCircle from "react-native-progress-circle";
export default class ProgressView extends Component {
  changeProgess(progressValue) {
    this.setState({ progress: progressValue });
  }
  state = {
    progress: 0
  };
  render() {
    return (
      <ProgressCircle
        percent={this.state.progress}
        radius={30}
        borderWidth={8}
        color="#499cea"
        shadowColor="#999"
        bgColor="rgba(52, 52, 52, 1)"
      >
        <Text style={{ color: "white" }}>{`${this.state.progress}%`}</Text>
      </ProgressCircle>
    );
  }
}
