//
//  TestPlugin.h
//  HelloWorldCordova
//
//  Created by wangyatao on 17/2/7.
//
//

#import <Cordova/CDVPlugin.h>

@interface OSXShellExec : CDVPlugin
-(void)exec:(CDVInvokedUrlCommand *)command;
-(void)readPlist:(CDVInvokedUrlCommand *)command;
-(void)savePlist:(CDVInvokedUrlCommand *)command;
-(void)readTextFile:(CDVInvokedUrlCommand *)command;
-(void)saveTextFile:(CDVInvokedUrlCommand *)command;

@end
