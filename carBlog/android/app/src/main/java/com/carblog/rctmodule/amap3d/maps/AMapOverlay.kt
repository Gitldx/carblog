package com.carblog.rctmodule.amap3d.maps

import com.amap.api.maps.AMap

interface AMapOverlay {
    fun add(map: AMap)
    fun remove()
}