package com.carblog.biz.upgrade;

import android.app.Activity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import static com.carblog.biz.upgrade.UpdateDialog.goToDownload;


public class AndroidAutoUpdateModule extends ReactContextBaseJavaModule implements LifecycleEventListener{

    public AndroidAutoUpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
        final ReactApplicationContext ctx = reactContext;
        ctx.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "AndroidAutoUpdate";
    }


    @ReactMethod
    public void goToDownloadApk(String url) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        goToDownload(activity,url);
    }


    @ReactMethod
    public void getAppVersionCode(Callback callback) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        int versionCode =AppUtils.getVersionCode(activity);
        callback.invoke(versionCode);
    }

    @ReactMethod
    public void getVersionName(Callback callback) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        String versionName = AppUtils.getVersionName(activity);
        callback.invoke(versionName);
    }
    @Override
    public @Nullable Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();

        return constants;
    }

    @Override
    public void onHostResume() {

    }
    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
    }
}