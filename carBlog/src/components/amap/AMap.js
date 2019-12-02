
import {
    Platform,
} from 'react-native'

// import AndroidAMap from './AMap-android'
import IOSAMap from './AMap-ios'

import MapView from "./maps/MapView";
import Marker from "./maps/Marker";
// import Polyline from "./maps/Polyline";
// import Polygon from "./maps/Polygon";
// import Circle from "./maps/Circle";
// import HeatMap from "./maps/HeatMap";
// import MultiPoint from "./maps/MultiPoint";
// import Offline from "./Offline";

MapView.Marker = Marker;
// MapView.Polyline = Polyline;
// MapView.Polygon = Polygon;
// MapView.Circle = Circle;
// MapView.HeatMap = HeatMap;
// MapView.MultiPoint = MultiPoint;

// export default MapView;
export { MapView, Marker, /* Polyline, Polygon, Circle, HeatMap, MultiPoint, Offline  */};


let AMap

// if(Platform.OS == 'ios') {
//     AMap = IOSAMap
// }
// else {
    AMap = MapView//AndroidAMap
// }

export default AMap