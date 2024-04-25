package host.exp.exponent;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.Arrays;
import java.util.List;

import expo.loaders.provider.interfaces.AppLoaderPackagesProviderInterface;
import host.exp.exponent.generated.BasePackageList;
import okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;
import com.reactnativecommunity.cameraroll.CameraRollPackage;

import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.rnfs.RNFSPackage;
import com.vinzscam.rntusclient.RNTusClientPackage;
import me.hauvo.thumbnail.RNThumbnailPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactlibrary.RNVideoHelperPackage;

public class MainApplication extends ExpoApplication implements AppLoaderPackagesProviderInterface<ReactPackage> {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        // new MainReactPackage(),
        new SharePackage(),
            new CameraRollPackage(),
            new RNCameraPackage(),
            new ReactVideoPackage(),
            new RNFSPackage(),
            new RNTusClientPackage(),
            new RNThumbnailPackage(),
            new ImageResizerPackage(),
            new RNVideoHelperPackage()
    );
  }

  public List<Package> getExpoPackages() {
    return new BasePackageList().getPackageList();
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
}
