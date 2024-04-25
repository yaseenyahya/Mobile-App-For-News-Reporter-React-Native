import * as Font from "expo-font";
import { AsyncStorage } from "react-native";
import { Asset } from "expo-asset";

export default class ResourcesData {
  static MainViewScreenResources = {
    LoginJsonData: null
  };

  static loadLoginScreenResources = async () => {
    await Font.loadAsync({
      SegoeUI: require("../assets/fonts/SegoeUI.ttf")
    });
    const logo = require("../assets/fastapplogo.png");
    await Asset.fromModule(logo).downloadAsync();
  };

  static loadMainViewScreenResources = async LoginJsonData => {
   
    this.MainViewScreenResources.LoginJsonData = LoginJsonData;

  };
}
