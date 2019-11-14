package com.carblog.rctmodule.amap3d


import com.carblog.rctmodule.amap3d.maps.AMapInfoWindowManager
import com.carblog.rctmodule.amap3d.maps.AMapMarkerManager
import com.carblog.rctmodule.amap3d.maps.AMapViewManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.Collections.emptyList

class AMap3DPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {

//        return listOf(
//                AMapOfflineModule(reactContext)
//        )

        return emptyList()

    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
                AMapViewManager(),
                AMapMarkerManager(),
                AMapInfoWindowManager()
//                AMapPolylineManager(),
//                AMapPolygonManager(),
//                AMapCircleManager(),
//                AMapHeatMapManager(),
//                AMapMultiPointManager()
        )
    }
}
