#import <MAMapKit/MAMapKit.h>

@class AMapMarker;

@interface AMapView : MAMapView

@property(nonatomic, copy) RCTBubblingEventBlock onLocation;
@property(nonatomic, copy) RCTBubblingEventBlock onPress;
@property(nonatomic, copy) RCTBubblingEventBlock onLongPress;
@property(nonatomic, copy) RCTBubblingEventBlock onStatusChange;
@property(nonatomic, copy) RCTBubblingEventBlock onStatusChangeComplete;

@property(nonatomic) BOOL loaded;
@property(nonatomic) MACoordinateRegion initialRegion;

@property(nonatomic) BOOL onlyOneMarker;
@property(nonatomic) BOOL addMarkerOnTap;

- (AMapMarker *)getMarker:(id <MAAnnotation>)annotation;

@end
