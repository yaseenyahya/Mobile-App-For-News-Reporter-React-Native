import React, { Component, PropTypes } from "react";
import { StyleSheet,Dimensions } from "react-native";
import { Text, View } from "react-native-animatable";
import Ripple from "react-native-material-ripple";

import metrics from "../../config/metrics";

export default class SelectionView extends Component {


  render() {
    return (
      <View style={[styles.container,{ height:  Dimensions.get("window").height ,width:  Dimensions.get("window").width }]}>
        
   
    
        <View animation={"zoomIn"} delay={800} duration={400}>
        <Ripple
            onPress={this.props.onSignInPress}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>
            {"Sign In"}
            </Text>
          </Ripple>
         
        </View>
        <View
          style={styles.separatorContainer}
          animation={"zoomIn"}
          delay={700}
          duration={400}
        >
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>{"Or"}</Text>
          <View style={styles.separatorLine} />
        </View>
        <View animation={"zoomIn"} delay={600} duration={400}>
          <Ripple
            onPress={this.props.onCreateAccountPress}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountButtonText}>
              {"Don't have an account? Sign up"}
            </Text>
          </Ripple>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1,
    justifyContent: "center",
 
  },
  createAccountButton: {
    backgroundColor: "rgba(236, 236, 236, 0.4)",
    paddingHorizontal: 10,
    paddingVertical:18,
    borderWidth: 1,
    borderRadius: 3,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderColor: 'rgba(236, 236, 236, 0.5)'
  },
  createAccountButtonText: {
    color: "white",
    textAlign: 'center',
    fontWeight: '700',
    fontSize:18
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: "rgba(236, 236, 236, 0.5)"
  },
  separatorOr: {
    color: "white",
    marginHorizontal: 8,
    fontSize:15
  },
  signInButton: {
    
    paddingHorizontal: 10,
    paddingVertical:18,
    borderWidth: 1,
    borderRadius: 3,
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderColor: 'rgba(236, 236, 236, 0.5)'
  },
  signInButtonText: {
    color: "white",
    textAlign: 'center',
    fontWeight: '700',
    fontSize:18

  }
});
