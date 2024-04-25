import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
export default class PermissionsGrant {
  getCameraRollPermission = async () => {
    let permissionGranted = false;
    try {
      const { status, expires, permissions } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (status !== "granted") {
        alert("Without permission, you cannot upload files.");
      } else {
        permissionGranted = true;
      }
    } catch (err) {
      console.warn(err);
    }

    return permissionGranted;
  };
  

  getCameraRecordingPermissionANDROID = async () => {
    let permissionGranted = false;
    try {
      const { status, expires, permissions } = await Permissions.askAsync(
        Permissions.CAMERA
      );
      if (status !== "granted") {
        alert("Without permission, you cannot access camera");
      } else {
        permissionGranted = true;
      }
    } catch (err) {
      console.warn(err);
    }

    return permissionGranted;
  };
  getAudioRecordingPermissionANDROID = async () => {
    let permissionGranted = false;
    try {
      const { status, expires, permissions } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      if (status !== "granted") {
        alert("Without permission, you cannot access audio recording");
      } else {
        permissionGranted = true;
      }
    } catch (err) {
      console.warn(err);
    }

    return permissionGranted;
  };

  getAudioCameraRecordingPermission = async () => {
   
      let permissionGrantedAndroid = true;

      permissionGrantedAndroid = await this.getCameraRecordingPermissionANDROID();

      if (!permissionGrantedAndroid) return permissionGrantedAndroid;
      else {
        permissionGrantedAndroid = await this.getAudioRecordingPermissionANDROID();
      }
      return permissionGrantedAndroid;
    
  };
  getApplicationPermissions = async () => {
    await this.getCameraRollPermission();
    await this.getAudioCameraRecordingPermission();
  };
}
