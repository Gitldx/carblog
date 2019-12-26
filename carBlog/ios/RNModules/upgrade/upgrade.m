#import "upgrade.h"

#import "AppDelegate.h"
#import <React/RCTBridgeModule.h>


@implementation upgrade


RCT_EXPORT_MODULE(upgrade)

RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)callback)
{
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
  callback(@[[NSNull null],version]);
}

RCT_EXPORT_METHOD(openAPPStore:(NSString *)storeappID ){
  //push 样式的 App Store应用 打开下载界面 scheme > itms-apps://
  NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"itms-apps://itunes.apple.com/cn/app/%@?mt=8", storeappID]];

  [[UIApplication sharedApplication] openURL:url];

  
}

@end
