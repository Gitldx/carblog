package com.carblog;

import android.app.Application;

import com.carblog.biz.BizPackage;
import com.carblog.rctmodule.amap3d.AMap3DPackage;
import com.carblog.rctmodule.amap3d.AMapGeolocationPackage;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new RNCViewPagerPackage(),
                    new ImagePickerPackage(),
                    new VectorIconsPackage(),
                    new RNScreensPackage(),
                    new RNGestureHandlerPackage(),
                    new ReanimatedPackage(),
                    new AMap3DPackage(),
                    new AMapGeolocationPackage(),
                    new BizPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
