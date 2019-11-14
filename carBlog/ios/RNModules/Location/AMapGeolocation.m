//
//  AMapGeolocation.m
//  carBlog
//
//  Created by liduoxing on 2019/10/15.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <React/RCTUIManager.h>
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapLocationKit/AMapLocationKit.h>
#import <React/RCTEventEmitter.h>

#import <AMapSearchKit/AMapSearchKit.h>
#import <MAMapKit/MAMapKit.h>

@interface AMapGeolocation
  : RCTEventEmitter <RCTBridgeModule, AMapLocationManagerDelegate,AMapSearchDelegate>
  @end

@implementation AMapGeolocation {
  AMapLocationManager *_manager;
  AMapSearchAPI *search;
}
  
  RCT_EXPORT_MODULE()
  
  RCT_REMAP_METHOD(init,
                   : (RCTPromiseResolveBlock)resolve
                   : (RCTPromiseRejectBlock)reject) {
//    [AMapServices sharedServices].apiKey = key;
    if (!_manager) {
      _manager = [AMapLocationManager new];
      _manager.delegate = self;
      
      
    }
    
    if(!search){
      search = [[AMapSearchAPI alloc] init];
      search.delegate = self;
    }
    
    resolve(nil);
  }
  
  RCT_EXPORT_METHOD(start) { [_manager startUpdatingLocation]; }
  
  RCT_EXPORT_METHOD(stop) { [_manager stopUpdatingLocation]; }
  
  RCT_EXPORT_METHOD(setLocatingWithReGeocode : (BOOL)value) {
    [_manager setLocatingWithReGeocode:value];
  }
  
  RCT_EXPORT_METHOD(setAllowsBackgroundLocationUpdates : (BOOL)value) {
    [_manager setAllowsBackgroundLocationUpdates:value];
  }
  
  RCT_EXPORT_METHOD(setPausesLocationUpdatesAutomatically : (BOOL)value) {
    [_manager setPausesLocationUpdatesAutomatically:value];
  }
  
  RCT_EXPORT_METHOD(setDesiredAccuracy : (int)value) {
    [_manager setDesiredAccuracy:value];
  }
  
  RCT_EXPORT_METHOD(setDistanceFilter : (int)value) {
    [_manager setDistanceFilter:value];
  }
  
  RCT_EXPORT_METHOD(setGeoLanguage : (int)value) {
    [_manager setReGeocodeLanguage:(AMapLocationReGeocodeLanguage)value];
  }
  
  RCT_EXPORT_METHOD(setReGeocodeTimeout : (int)value) {
    [_manager setReGeocodeTimeout:value];
  }
  
  RCT_EXPORT_METHOD(setLocationTimeout : (int)value) {
    [_manager setLocationTimeout:value];
  }


RCT_EXPORT_METHOD(getAddress : (NSDictionary *)params){
    AMapReGeocodeSearchRequest *regeo = [[AMapReGeocodeSearchRequest alloc] init];
  
    CGFloat lat = [RCTConvert CGFloat : params[@"latitude"]];
  CGFloat lng = [RCTConvert CGFloat: params[@"longitude"]];
    
    regeo.location                    = [AMapGeoPoint locationWithLatitude:lat longitude:lng];
    regeo.requireExtension            = YES;
    [search AMapReGoecodeSearch:regeo];
  }


RCT_EXPORT_METHOD(getDistance:(NSDictionary *) location1 : (NSDictionary *) location2
                 : (RCTPromiseResolveBlock)resolve
                 : (RCTPromiseRejectBlock)reject) {
  CGFloat lat1 = [RCTConvert CGFloat : location1[@"latitude"]];
  CGFloat lng1 = [RCTConvert CGFloat : location1[@"longitude"]];
  CGFloat lat2 = [RCTConvert CGFloat : location2[@"latitude"]];
  CGFloat lng2 = [RCTConvert CGFloat : location2[@"longitude"]];
  MAMapPoint point1 = MAMapPointForCoordinate(CLLocationCoordinate2DMake(lat1,lng1));
  MAMapPoint point2 = MAMapPointForCoordinate(CLLocationCoordinate2DMake(lat2,lng2));
  //2.计算距离
  CLLocationDistance distance = MAMetersBetweenMapPoints(point1,point2);
  resolve(@(distance));
}


  
- (id)json:(CLLocation *)location reGeocode:(AMapLocationReGeocode *)reGeocode {
  if (reGeocode) {
    return @{
             @"errorCode": @(0),
             @"accuracy" : @(location.horizontalAccuracy),
             @"latitude" : @(location.coordinate.latitude),
             @"longitude" : @(location.coordinate.longitude),
             @"altitude" : @(location.altitude),
             @"speed" : @(location.speed),
             @"heading" : @(location.course),
             @"timestamp" : @(location.timestamp.timeIntervalSince1970 * 1000),
             @"address" : reGeocode.formattedAddress ? reGeocode.formattedAddress : @"",
             @"poiName" : reGeocode.POIName ? reGeocode.POIName : @"",
             @"country" : reGeocode.country ? reGeocode.country : @"",
             @"province" : reGeocode.province ? reGeocode.province : @"",
             @"city" : reGeocode.city ? reGeocode.city : @"",
             @"cityCode" : reGeocode.citycode ? reGeocode.citycode : @"",
             @"district" : reGeocode.district ? reGeocode.district : @"",
             @"street" : reGeocode.street ? reGeocode.street : @"",
             @"streetNumber" : reGeocode.number ? reGeocode.number : @"",
             @"adCode" : reGeocode.adcode ? reGeocode.adcode : @"",
             };
  } else {
    return @{
             @"errorCode": @(0),
             @"accuracy" : @(location.horizontalAccuracy),
             @"latitude" : @(location.coordinate.latitude),
             @"longitude" : @(location.coordinate.longitude),
             @"altitude" : @(location.altitude),
             @"speed" : @(location.speed),
             @"direction" : @(location.course),
             @"timestamp" : @(location.timestamp.timeIntervalSince1970 * 1000),
             };
  }
}
  
- (void)amapLocationManager:(AMapLocationManager *)manager
          didUpdateLocation:(CLLocation *)location
                  reGeocode:(AMapLocationReGeocode *)reGeocode {
  id json = [self json:location reGeocode:reGeocode];
  [self sendEventWithName:@"AMapGeolocation" body:json];
}
  
- (void)amapLocationManager:(AMapLocationManager *)manager
           didFailWithError:(NSError *)error {
  [self sendEventWithName:@"AMapGeolocation"
                     body:@{
                            @"errorCode" : @(error.code),
                            @"errorInfo" : error.localizedDescription,
                            }];
}
  
- (void)amapLocationManager:(AMapLocationManager *)manager doRequireLocationAuth:(CLLocationManager *)locationManager{
  [locationManager requestAlwaysAuthorization];
}
  
- (NSArray<NSString *> *)supportedEvents {
  return @[ @"AMapGeolocation",@"onRegeocodeSearched" ];
}


#pragma mark - AMapSearchDelegate
- (void)AMapSearchRequest:(id)request didFailWithError:(NSError *)error
{
  
}

/* 逆地理编码回调. */
- (void)onReGeocodeSearchDone:(AMapReGeocodeSearchRequest *)request response:(AMapReGeocodeSearchResponse *)response
{
  if (response.regeocode != nil)
  {
    [self sendEventWithName:@"onRegeocodeSearched"
                       body:@{
                              @"address" : response.regeocode.formattedAddress ? response.regeocode.formattedAddress : @"",
                              @"city" : response.regeocode.addressComponent.city,
                              @"citycode" : response.regeocode.addressComponent.citycode
                              }];
  }
 
}

  
  @end

