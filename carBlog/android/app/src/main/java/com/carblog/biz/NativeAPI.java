package com.carblog.biz;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.qiniu.android.common.AutoZone;
import com.qiniu.android.http.ResponseInfo;
import com.qiniu.android.storage.Configuration;
import com.qiniu.android.storage.UpCompletionHandler;
import com.qiniu.android.storage.UploadManager;

import org.json.JSONObject;

import java.io.File;

import top.zibin.luban.CompressionPredicate;
import top.zibin.luban.Luban;
import top.zibin.luban.OnCompressListener;

public class NativeAPI extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    public NativeAPI(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;

    }


    @Override
    public String getName() {
        return "NativeAPI";
    }


    @ReactMethod
    public void backToHome() {
        //启动一个意图,回到桌面
        Intent backHome = new Intent(Intent.ACTION_MAIN);
        backHome.addCategory(Intent.CATEGORY_HOME);
        ActivityCompat.startActivity(getCurrentActivity(), backHome, null);
    }


    @ReactMethod
    public void uploadImgQiniu(String path, String token, String key, final Promise promise) {

        this.uploadAction(100,path,token,key,promise);

    }


    private void deleteImage(String filePath){
        Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
        ContentResolver mContentResolver = this.reactContext.getContentResolver();
        String where = MediaStore.Images.Media.DATA + "='" + filePath + "'";
//删除图片
        mContentResolver.delete(uri, where, null);
        this.updateMediaStore(this.reactContext,filePath);
    }


    private void updateMediaStore(final Context context, final String path) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            MediaScannerConnection.scanFile(context, new String[]{path}, null, new MediaScannerConnection.OnScanCompletedListener() {
                public void onScanCompleted(String path, Uri uri) {
                    Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                    mediaScanIntent.setData(uri);
                    context.sendBroadcast(mediaScanIntent);
                }
            });
        } else {
            File file = new File(path);
            String relationDir = file.getParent();
            File file1 = new File(relationDir);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.fromFile(file1.getAbsoluteFile())));
        }
    }


    private void uploadAction(int size,String path,final String token,final String key, final Promise promise){
        Configuration config = new Configuration.Builder().zone(AutoZone.autoZone).build();
        final UploadManager uploadManager = new UploadManager(config);


//        byte[] data = PictureUpload.compressUpImage2Byte(path,quality);


        File tempFile = null;
        try {
            //创建临时文件
            tempFile = File.createTempFile("upImage", ".jpg");

        } catch (Exception e) {
            e.printStackTrace();
            promise.resolve(0);
            return;
        }

        Luban.with(this.reactContext)
                .load(path)
                .ignoreBy(size)
                .setTargetDir(tempFile.getParent())
                .filter(new CompressionPredicate() {
                    @Override
                    public boolean apply(String path) {
                        return !(TextUtils.isEmpty(path) || path.toLowerCase().endsWith(".gif"));
                    }
                })
                .setCompressListener(new OnCompressListener() {
                    @Override
                    public void onStart() {
                        // TODO 压缩开始前调用，可以在方法内启动 loading UI
                    }

                    @Override
                    public void onSuccess(File file) {
                        if(file == null)
                        {
                            promise.resolve(0);
                            return;
                        }


                        uploadManager.put(file, key, token,
                                new UpCompletionHandler() {
                                    @Override
                                    public void complete(String key, ResponseInfo info, JSONObject res) {
                                        //res包含hash、key等信息，具体字段取决于上传策略的设置
                                        if(info.isOK()) {

                                            Log.i("qiniu", "Upload Success");

                                            NativeAPI.this.deleteImage(file.getAbsolutePath());
                                            promise.resolve(1);
                                        } else {

                                            Log.i("qiniu", "Upload Fail");
                                            //如果失败，这里可以把info信息上报自己的服务器，便于后面分析上传错误原因
                                            promise.resolve(0);
                                        }
                                        Log.i("qiniu", key + ",\r\n " + info + ",\r\n " + res);
                                    }
                                }, null);
                    }

                    @Override
                    public void onError(Throwable e) {
                        // TODO 当压缩过程出现问题时调用
                        e.printStackTrace();
                    }
                }).launch();



    }


    @ReactMethod
    public void exitApp() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

}
