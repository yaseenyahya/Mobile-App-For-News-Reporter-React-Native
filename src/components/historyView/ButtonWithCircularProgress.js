import React,{Component} from 'react';
import ProgressCircle from 'react-native-progress-circle';
import {View,TouchableOpacity,StyleSheet,Text} from "react-native";
import PermissionsGrant from "../../PermissionsGrant";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

export default class ButtonWithCircularProgress extends Component {
    constructor(props) {
        super(props);
        this.onPress = this.props.onPress
        this.checkForPersmission = this.props.checkForPersmission;
      }
      static defaultProps = {
        downloadButtonStyle:{padding: 3},
        buttonGradientColor: ["#EDA525", "#FCB12B", "#FCB840"],
        permissionError: 'Download can\'t be started without permission',
        progressTextStyle:{ fontSize: 14,marginLeft:3 },
        statusTextStyle:{fontSize: 14,marginLeft:3},
        downloadButtonContainer:{}
    }

    updateProgress(value){
        this.setState({ progressValue:value});
    }
    initProgress(){
       this.setState({ progressValue:0,
        showProgress:true,showstatusText:false,statusTextColor:"black"});
    }
    initFailed(error){
        this.setState({ progressValue:0,
            showProgress:false,showstatusText:true,statusText:error,statusTextColor:"#CC0000"});
    }
    initComplete(message){
        this.setState({ progressValue:0,
            showProgress:false,showstatusText:true,statusText:message,statusTextColor:"#007E33"});
    }
    state = {
        progressValue:0,
        showProgress:false,
        showstatusText:false,
        statusText:"",
        statusTextColor:"black"
    }

    onPressButton = async ()=> {

        if(this.checkForPersmission){
           if(await new PermissionsGrant().getCameraRollPermission(this.props.permissionError)){

    
            this.onPress && this.onPress();
           }
        }else
        this.onPress && this.onPress();
    }
      render(){
        return   <View style={styles.container}>
     {!this.state.showProgress && <LinearGradient
        colors={this.props.buttonGradientColor}
        style={this.props.downloadButtonContainer}
      >
        <TouchableOpacity activeOpacity={0.6} style={this.props.downloadButtonStyle} onPress={()=>{this.onPressButton();}}>
          <Icon name={this.props.iconName} size={15} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>
     }
      {this.state.showProgress && <ProgressCircle
       percent={this.state.progressValue}
       radius={11}
       borderWidth={4}
       color="#499cea"
       shadowColor="#999"
       bgColor="#fff"
   >
   </ProgressCircle>
      }
   {this.state.showProgress && 
       <Text style={this.props.progressTextStyle}>{`${this.state.progressValue}%`}</Text>
   }

   {
       this.state.showstatusText && 
  <Text style={[this.props.statusTextStyle,{color:this.state.statusTextColor}]}>{this.state.statusText}</Text>
   }
   </View>
      }

}

const styles = StyleSheet.create({
    container:{flexDirection:"row"}

});