package host.exp.exponent.generated;

import com.facebook.common.internal.DoNotStrip;

import java.util.ArrayList;
import java.util.List;

import host.exp.exponent.BuildConfig;
import host.exp.exponent.Constants;

@DoNotStrip
public class AppConstants {

  public static final String VERSION_NAME = "1.0.0";
  public static String INITIAL_URL = "exp://exp.host/@yaseenyahya021/FastApp";
  public static final String SHELL_APP_SCHEME = "exp58dee0118acb4bf2b023822264336a3d";
  public static final String RELEASE_CHANNEL = "default";
  public static boolean SHOW_LOADING_VIEW_IN_SHELL_APP = false;
  public static boolean ARE_REMOTE_UPDATES_ENABLED = true;
  public static final List<Constants.EmbeddedResponse> EMBEDDED_RESPONSES;
  public static boolean FCM_ENABLED = false;

  static {
    List<Constants.EmbeddedResponse> embeddedResponses = new ArrayList<>();

    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      // ADD EMBEDDED RESPONSES HERE
      // START EMBEDDED RESPONSES
      embeddedResponses.add(new Constants.EmbeddedResponse("https://exp.host/@shr.reports/FastAppND", "assets://shell-app-manifest.json", "application/json"));
      embeddedResponses.add(new Constants.EmbeddedResponse("https://classic-assets.eascdn.net/%40shr.reports%2FFastAppND%2F7.0.0%2Fbf1257ef9738d6799c6590f030de0a55-36.0.0-android.js", "assets://shell-app.bundle", "application/javascript"));
      // END EMBEDDED RESPONSES
    EMBEDDED_RESPONSES = embeddedResponses;
  }

  // Called from expoview/Constants
  public static Constants.ExpoViewAppConstants get() {
    Constants.ExpoViewAppConstants constants = new Constants.ExpoViewAppConstants();
    constants.VERSION_NAME = VERSION_NAME;
    constants.INITIAL_URL = INITIAL_URL;
    constants.SHELL_APP_SCHEME = SHELL_APP_SCHEME;
    constants.RELEASE_CHANNEL = RELEASE_CHANNEL;
    constants.SHOW_LOADING_VIEW_IN_SHELL_APP = SHOW_LOADING_VIEW_IN_SHELL_APP;
    constants.ARE_REMOTE_UPDATES_ENABLED = ARE_REMOTE_UPDATES_ENABLED;
    constants.EMBEDDED_RESPONSES = EMBEDDED_RESPONSES;
    constants.ANDROID_VERSION_CODE = BuildConfig.VERSION_CODE;
    constants.FCM_ENABLED = FCM_ENABLED;
    return constants;
  }
}
