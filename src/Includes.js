import { Linking } from "react-native";
import { checkInternetConnection } from "react-native-offline";
export default {
  checkInternet: async function() {
    let isConnected = false;
    await Linking.canOpenURL("https://google.com").then(connection => {
      if (!connection) {
        isConnected = false;
      } else {
        isConnected = true;
      }
    });
    if (isConnected) {

      try {
        isConnected =   await checkInternetConnection(
            "https://google.com",
            5000,
           true
          );
      } catch (e) {
        isConnected = false;
      }
    }
    return isConnected;
  },
  resolveErrorMessage: async function(errorMessage) {
    if (errorMessage == "Network request failed") {
      let isConnected = await this.checkInternet();

      if (isConnected) errorMessage = "No connectivity. Contact to admin";
      else errorMessage = "No internet";
    } else return errorMessage;

    return errorMessage;
  }
};
