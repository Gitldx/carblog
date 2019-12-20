//
//  NativeAPIBridge.m
//  carBlog
//
//  Created by liduoxing on 2019/11/30.
//  Copyright © 2019年 Facebook. All rights reserved.
//


#import "NativeAPI.h"


@implementation NativeAPI

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(uploadImgQiniu: (NSString *)path token:(NSString *) token key:(NSString *) key resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [QiniuUtil uploadImageToQNFilePath:path token:token key:key size:100 resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(exitApp){
  exit(0);
}

@end
