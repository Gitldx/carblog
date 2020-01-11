package com.carblog;

import android.os.Bundle;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactFragmentActivity;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.beta.Beta;

import org.devio.rn.splashscreen.SplashScreen;


public class MainActivity extends ReactFragmentActivity {//ReactActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(null);
        String buglyAppId = "5c4a859ffd";
        Beta.largeIconId = R.mipmap.launcher;
        Beta.smallIconId = R.mipmap.launcher;
        Beta.defaultBannerId = R.mipmap.launcher;
        Bugly.init(getApplicationContext(),buglyAppId,false);

    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "carBlog";
    }


    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}


//public class MainActivity extends AppCompatActivity  implements View.OnClickListener {
//
//    private MapView mapView;
//    private AMap aMap;
//    private Button basicmap;
//    private Button rsmap;
//
//    private RadioGroup mRadioGroup;
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
//        mapView = (MapView) findViewById(R.id.map);
//        mapView.onCreate(savedInstanceState);// 此方法必须重写
//
//        init();
//    }
//
//    /**
//     * 初始化AMap对象
//     */
//    private void init() {
//        if (aMap == null) {
//            aMap = mapView.getMap();
//
//        }
//        basicmap = (Button)findViewById(R.id.basicmap);
//        basicmap.setOnClickListener(this);
//        rsmap = (Button)findViewById(R.id.rsmap);
//        rsmap.setOnClickListener(this);
//
//        mRadioGroup = (RadioGroup) findViewById(R.id.check_language);
//
//        mRadioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
//            @Override
//            public void onCheckedChanged(RadioGroup group, int checkedId) {
//                if (checkedId == R.id.radio_en) {
//                    aMap.setMapLanguage(AMap.ENGLISH);
//                } else {
//                    aMap.setMapLanguage(AMap.CHINESE);
//                }
//            }
//        });
//    }
//
//    /**
//     * 方法必须重写
//     */
//    @Override
//    protected void onResume() {
//        super.onResume();
//        mapView.onResume();
//    }
//
//    /**
//     * 方法必须重写
//     */
//    @Override
//    protected void onPause() {
//        super.onPause();
//        mapView.onPause();
//    }
//
//    /**
//     * 方法必须重写
//     */
//    @Override
//    protected void onSaveInstanceState(Bundle outState) {
//        super.onSaveInstanceState(outState);
//        mapView.onSaveInstanceState(outState);
//    }
//
//    /**
//     * 方法必须重写
//     */
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//        mapView.onDestroy();
//    }
//
//    @Override
//    public void onClick(View v) {
//        switch (v.getId()) {
//            case R.id.basicmap:
//                aMap.setMapType(AMap.MAP_TYPE_NORMAL);// 矢量地图模式
//                break;
//            case R.id.rsmap:
//                aMap.setMapType(AMap.MAP_TYPE_SATELLITE);// 卫星地图模式
//                break;
//        }
//
//    }
//}

