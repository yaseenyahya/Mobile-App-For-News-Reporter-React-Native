package host.exp.exponent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import android.app.Activity;
public class SharePackage implements ReactPackage {
  
    public SharePackage() {
      super();

    
  }

 @Override
   public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
     return Arrays.<NativeModule>asList(new ShareModule(reactContext));
   }

   public List<Class<? extends JavaScriptModule>> createJSModules() {
       return Collections.emptyList();
   }

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }
}
