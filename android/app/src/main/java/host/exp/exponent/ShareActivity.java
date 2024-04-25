package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactPackage;

import org.unimodules.core.interfaces.Package;

import java.util.List;

import host.exp.exponent.experience.DetachActivity;
import host.exp.exponent.generated.DetachBuildConstants;

public class ShareActivity extends DetachActivity {
public static ShareActivity instance = null;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // Do some operations here
    }

    @Override
    public void onResume()
    {
        super.onResume();
        instance = this;
    }

    @Override
    public void onPause()
    {
        super.onPause();
    }
  @Override
  public String publishedUrl() {
    return "exp://exp.host/@/FastAppND";
  }

  @Override
  public String developmentUrl() {
   // return DetachBuildConstants.DEVELOPMENT_URL;
   return "exp58dee0118acb4bf2b023822264336a3d://192.168.0.113:19000";
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    return ((MainApplication) getApplication()).getExpoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }
}
