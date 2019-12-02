//
//  PictureUtils.swift
//  carBlog
//
//  Created by liduoxing on 2019/11/30.
//  Copyright © 2019年 Facebook. All rights reserved.
//

import Foundation
import UIKit


extension UIImage {
  
  // MARK: - 降低质量,最大不超过 maxSize Kb  目前采用这个方法
  class func resetSizeOfKb(source_image: UIImage, maxSize: Int) -> Data {
    
    //先调整分辨率
    var newSize = CGSize.init(width: source_image.size.width, height: source_image.size.height)
    
    let tempHeight = newSize.height / 1024
    let tempWidth  = newSize.width / 1024
    
    if tempWidth > 1.0 && tempWidth > tempHeight {
      newSize = CGSize.init(width: source_image.size.width / tempWidth,height: source_image.size.height / tempWidth)
    }
    else if tempHeight > 1.0 && tempWidth < tempHeight {
      newSize = CGSize.init(width: source_image.size.width / tempHeight,height: source_image.size.height / tempHeight)
    }
    
    // 等比例缩放
    //    UIGraphicsBeginImageContext(newSize)
    //    source_image.drawAsPattern(in: CGRect.init(x: 0, y: 0, width: newSize.width, height: newSize.height))
    //    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    //    UIGraphicsEndImageContext()
    
    
    // 等比例缩放
    UIGraphicsBeginImageContext(newSize)
    source_image.draw(in: CGRect.init(x: 0, y: 0, width: newSize.width, height: newSize.height))
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    
    //先判断当前质量是否满足要求，不满足再进行压缩
    var finallImageData = UIImageJPEGRepresentation(newImage!,1.0)
    let sizeOrigin      = Int64((finallImageData?.count)!)
    let sizeOriginKB    = Int(sizeOrigin / 1024)
    if sizeOriginKB <= maxSize {
      return finallImageData!
    }
    
    //保存压缩系数
    let compressionQualityArr = NSMutableArray()
    let avg = CGFloat(1.0/250)//let avg = CGFloat(1.0/10000)
    var value = avg
    
    for i in stride(from: 250, to: 1, by: -1){//for i in stride(from: 10000, to: 1, by: -1){
      value = CGFloat(i)*avg
      compressionQualityArr.add(value)
    }
    
    //    for i in 250..<1 {
    //      value = CGFloat(i)*avg
    //      compressionQualityArr.add(value)
    //    }
    
    //调整大小
    //说明：压缩系数数组compressionQualityArr是从大到小存储。
    //思路：折半计算，如果中间压缩系数仍然降不到目标值maxSize，则从后半部分开始寻找压缩系数；反之从前半部分寻找压缩系数
    //    finallImageData = UIImageJPEGRepresentation(newImage!, CGFloat(compressionQualityArr[125] as! NSNumber))finallImageData = UIImageJPEGRepresentation(newImage!, CGFloat(compressionQualityArr[5000] as! NSNumber))
    if Int(Int64((UIImageJPEGRepresentation(newImage!, CGFloat(compressionQualityArr[125] as! NSNumber))?.count)!)/1024) > maxSize {//if Int(Int64((UIImageJPEGRepresentation(newImage!, CGFloat(compressionQualityArr[5000] as! NSNumber))?.count)!)/1024) > maxSize {
      //从后半部分开始
      for idx in 126..<250 {//for idx in 5001..<10000 {
        let value = compressionQualityArr[idx]
        let sizeOrigin   = Int64((finallImageData?.count)!)
        let sizeOriginKB = Int(sizeOrigin / 1024)
//        print("当前降到的质量：\(sizeOriginKB)")
        if sizeOriginKB > maxSize {
//          print("\(idx)----\(value)")
          finallImageData = UIImageJPEGRepresentation(newImage!, CGFloat(value as! NSNumber))
        } else {
          break
        }
      }
    } else {
      //从前半部分开始
      for idx in 0..<125 {//for idx in 0..<5000 {
        let value = compressionQualityArr[idx]
        let sizeOrigin   = Int64((finallImageData?.count)!)
        let sizeOriginKB = Int(sizeOrigin / 1024)
//        print("当前降到的质量：\(sizeOriginKB)")
        if sizeOriginKB > maxSize {
//          print("\(idx)----\(value)")
          finallImageData = UIImageJPEGRepresentation(newImage!, CGFloat(value as! NSNumber))
        } else {
          break
        }
      }
    }
    return finallImageData!
  }
  
  
}
