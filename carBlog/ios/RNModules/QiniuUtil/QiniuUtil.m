//
//  QiniuUtil.m
//  carBlog
//
//  Created by liduoxing on 2019/11/30.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "QiniuUtil.h"
#import <UIKit/UIKit.h>
#import "carBlog-Swift.h"





@interface QiniuUtil()


@end

@implementation QiniuUtil



+ (void)uploadImageToQNFilePath:(NSString *)filePath token:(NSString *)token key:(NSString *)key size:(int)size resolver:(RCTPromiseResolveBlock)resolve
                       rejecter:(RCTPromiseRejectBlock)reject {
  
  
  
  QNUploadOption *opt = [[QNUploadOption alloc] initWithMime:nil progressHandler:^(NSString *key, float percent) {
    NSLog(@"percent == %.2f", percent);
  } params:nil checkCrc:NO cancellationSignal:nil];
  QNUploadManager *upManager = [[QNUploadManager alloc] init];
  
  NSData *resizedImg = [[SwiftAPI alloc] resizeImg:filePath size:size];
  
  [upManager /*putFile:filePath*/ putData:resizedImg key:key token:token complete:^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
    if(info.ok)
    {
      NSLog(@"请求成功");
      resolve([NSNumber numberWithInt:YES]);
    }
    else{
      NSLog(@"失败");
      resolve([NSNumber numberWithInt:NO]);
      //如果失败，这里可以把info信息上报自己的服务器，便于后面分析上传错误原因
    }
    NSLog(@"info ===== %@", info);
    NSLog(@"resp ===== %@", resp);
  }
                                   option:opt];
}

//+(void)uploadImageToQNFilePath:(NSArray *)photos success:(QNSuccessBlock)success failure:(QNFailureBlock)failure{
//
//  NSMutableArray *imageAry =[NSMutableArray new];
//  NSMutableArray *imageAdd = [NSMutableArray new];
//  for (ZLPhotoAssets *status in photos) {
//    [imageAry addObject:[status aspectRatioImage]];
//  }
//  //主要是把图片或者文件转成nsdata类型就可以了
//  QNConfiguration *config = [QNConfiguration build:^(QNConfigurationBuilder *builder) {
//    builder.zone = [QNZone zone0];}];
//  QNUploadManager *upManager = [[QNUploadManager alloc] initWithConfiguration:config];
//  QNUploadOption *uploadOption = [[QNUploadOption alloc] initWithMime:nil
//                                                      progressHandler:^(NSString *key, float percent) {
//                                                        NSLog(@"上传进度 %.2f", percent);
//                                                      }
//                                                               params:nil
//                                                             checkCrc:NO
//                                                   cancellationSignal:nil];
//  [imageAry enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//    NSLog(@"%ld",idx);
//    NSData *data;
//    if (UIImagePNGRepresentation(obj) == nil){
//      data = UIImageJPEGRepresentation(obj, 1);
//    } else {
//      data = UIImagePNGRepresentation(obj);}
//    [upManager putData:data key:[QiniuLoad qnImageFilePatName] token:[QiniuLoad makeToken:accessKey secretKey:secretKey] complete:^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
//      NSLog(@"%@",resp[@"key"]);
//      if (info.isOK) {
//        [imageAdd addObject:[NSString stringWithFormat:@"%@%@",kQNinterface,resp[@"key"]]];}else{
//          [imageAdd addObject:[NSString stringWithFormat:@"%ld",idx]];}
//      if (imageAdd.count == imageAry.count) {
//        if (success) {
//          success([imageAdd componentsJoinedByString:@";"]);}}}
//                option:uploadOption];}];}


@end

