//
//  RCTAMap.h
//  carBlog
//
//  Created by liduoxing on 2019/10/11.
//  Copyright © 2019年 Facebook. All rights reserved.
//


#import "RCTAMapManager.h"
#import <MAMapKit/MAMapKit.h>

@interface RCTAMap : MAMapView

@property (nonatomic, assign) BOOL hasUserLocationPointAnnotaiton;

@property (nonatomic, copy) RCTBubblingEventBlock onDidMoveByUser;

@property (nonatomic,copy) RCTBubblingEventBlock onSingleTappedAtCoordinate;

@property (nonatomic, copy) NSString *centerMarker;

- (id)initWithManager: (RCTAMapManager*)manager;

//-(void)setFrame:(CGRect)frame;

@end

