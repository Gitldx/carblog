//
//  NativeAPI.swift
//  carBlog
//
//  Created by liduoxing on 2019/11/30.
//  Copyright © 2019年 Facebook. All rights reserved.
//

import Foundation
import UIKit


@objc(SwiftAPI)
class SwiftAPI: NSObject {
  
  
  @objc(resizeImg:size:)
  func resizeImg(path : String,size : Int) -> Data {
    //    NSLog("ldx ---> path:");
    //    NSLog(path);
    
    let img =  UIImage(named:path)
    let imageData :Data? = UIImage.resetSizeOfKb(source_image: img!, maxSize: size)
    
    return imageData!;
    
  }
  
  
  
}

