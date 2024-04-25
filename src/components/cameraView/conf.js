import { Dimensions } from "react-native";

let conf = {};

// Returns the recommended scaling based on screen dimensions
// as a string
const recommendedScaling = () => {
  try {
    const baseWidth = 375;
    const factor = 0.3; // resize factor

    let res = "1.0"; // our normal sizing

    let { width, height } = Dimensions.get("window");
    let value = Math.min(width, height); // just in case the device starts up rotated.

    let scale, moderateScale;
    if (value != 0) {
      scale = value / baseWidth;
      moderateScale = 1 + (scale - 1) * factor;

      // map our ratio to our internal scaling values
      if (moderateScale >= 2.5) {
        res = "2.5";
      } else if (moderateScale <= 0.7) {
        // should never happen unless using a tiny phone
        res = "0.7";
      } else {
        res = (Math.round(moderateScale * 10) / 10).toFixed(1);
      }
    } else {
      console.warn(
        "Warning, failed to get device screen ratio for scaling calculations, it was 0."
      );
    }

    return res;
  } catch (err) {
    console.error(
      "CRITICAL: Failed to get recommended scaling",
      err.message || err
    );
  }
};

conf.sizeScaling = parseFloat(recommendedScaling()) || 1;

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;
let platform = Platform.OS;
let isIphoneX =
  platform === "ios" &&
  (deviceHeight === 812 ||
    deviceWidth === 812 ||
    deviceHeight === 896 ||
    deviceWidth === 896);
let Inset = isIphoneX
  ? {
      portrait: {
        topInset: 32,
        leftInset: 0,
        rightInset: 0,
        bottomInset: 20
      },
      landscape: {
        topInset: 15,
        leftInset: 0,
        rightInset: 0,
        bottomInset: 10
      }
    }
  : Platform.OS == "ios"
  ? {
      portrait: {
        topInset: 20, // to account for portrait status bar
        leftInset: 0,
        rightInset: 0,
        bottomInset: 0
      },
      landscape: {
        topInset: 0,
        leftInset: 0,
        rightInset: 0,
        bottomInset: 0
      }
    }
  : {
      // so we don't need to check for iphoneX or not
      portrait: {
        topInset: 0, // Android toolbar/notch does not interfere with screen
        leftInset: 0,
        rightInset: 0,
        bottomInset: 0
      },
      landscape: {
        topInset: 0,
        leftInset: 0,
        rightInset: 0,
        bottomInset: 0
      }
    };

conf.Inset = Inset;
conf.isIphoneX = isIphoneX;

export default conf;
