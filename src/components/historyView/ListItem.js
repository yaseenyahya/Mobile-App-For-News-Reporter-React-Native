import React, {Component} from 'react';
import { View, StyleSheet, Keyboard
    , TouchableWithoutFeedback, Text
    , KeyboardAvoidingView,TouchableHighlight,FlatList } from 'react-native';
import Ripple from "react-native-material-ripple";
import { LinearGradient } from "expo-linear-gradient";
export default class ListItem extends Component{
    constructor(props){
    super(props);
    this.onPress = this.props.onPress;
    this.title = this.props.title;
    this.value = this.props.value;
    }
    state = {
     selected: false
    }

    setSelected(isSelected){
        this.setState({selected:isSelected});
    }
    onPress_ = (value)=> {
        this.setSelected(true);
        this.onPress && this.onPress(value);
    }
    render(){
        return ( <LinearGradient
              style={styles.container}
              colors={this.state.selected ? ['#499cea', '#599de6', '#207ce5'] : ["#d32f2f", "#d32f2f", "#d32f2f"]}
            >
        <Ripple onPress={()=>{this.onPress_(this.value);}}>
            <Text style={styles.textStyle}>{this.title}</Text>
        </Ripple>
        </LinearGradient>)
    }
}

const styles = StyleSheet.create({
container:{
    borderBottomWidth: 0.5,
    padding:10,
    borderBottomColor: "gray"
},

textStyle:{
    color:"white",
    fontWeight:"bold"
}

});