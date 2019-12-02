//
//  QiniuUtil.h
//  carBlog
//
//  Created by liduoxing on 2019/11/30.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <QiniuSDK.h>
#import <React/RCTBridgeModule.h>


@interface QiniuUtil:NSObject
+ (void)uploadImageToQNFilePath:(NSString *)filePath token:(NSString *)token key:(NSString *)key size:(int)size resolver:(RCTPromiseResolveBlock)resolve
                       rejecter:(RCTPromiseRejectBlock)reject;
@end
