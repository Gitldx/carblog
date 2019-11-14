//
//  RCTAMap.m
//  carBlog
//
//  Created by liduoxing on 2019/10/11.
//  Copyright © 2019年 Facebook. All rights reserved.
//


#import "RCTAMap.h"

@interface RCTAMap ()

@property (nonatomic, weak) RCTAMapManager *manager;

@end

@implementation RCTAMap

- (id)initWithManager:(RCTAMapManager*)manager
{
  
  if ((self = [super init])) {
    self.manager = manager;
    
  }
  return self;
  
}

//-(void)setFrame:(CGRect)frame{
//  [super setFrame:frame];
//}

@end
