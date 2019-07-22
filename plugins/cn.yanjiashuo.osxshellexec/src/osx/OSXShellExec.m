//
//  TestPlugin.m
//  HelloWorldCordova
//
//  Created by wangyatao on 17/2/7.
//
//

#import "OSXShellExec.h"

@implementation OSXShellExec
-(void)readTextFile:(CDVInvokedUrlCommand *)command{
    @try{
        if (command.arguments.count>0) {
            NSString *str=[NSString stringWithContentsOfFile:command.arguments[0] encoding:NSUTF8StringEncoding error:nil];
            
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:str];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }else{
            //如果没有入参,则回调JS失败函数
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未找到文件地址"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }@catch (NSException *exception) {
        NSLog(@"%@", exception);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exception.reason];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }@finally {
        NSLog(@"finally");
    }
}
-(void)saveTextFile:(CDVInvokedUrlCommand *)command{
    @try{
        if (command.arguments.count>1) {
            NSString *str=[NSString stringWithContentsOfFile:command.arguments[1] encoding:NSUTF8StringEncoding error:nil];
            NSString *path =[NSString stringWithContentsOfFile:command.arguments[0] encoding:NSUTF8StringEncoding error:nil];
            
            [str writeToFile: path atomically: NO ];
            
           
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"success"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }else{
            //如果没有入参,则回调JS失败函数
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未找到文件地址或要写入的内容"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }@catch (NSException *exception) {
        NSLog(@"%@", exception);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exception.reason];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }@finally {
        NSLog(@"finally");
    }
}
-(void)readPlist:(CDVInvokedUrlCommand *)command{
    @try{
        if (command.arguments.count>0) {
            NSDictionary *readData=[NSDictionary dictionaryWithContentsOfFile:command.arguments[0]];
            
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:readData];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }else{
            //如果没有入参,则回调JS失败函数
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未找到plist地址"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }@catch (NSException *exception) {
        NSLog(@"%@", exception);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exception.reason];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }@finally {
        NSLog(@"finally");
    }
}
-(void)savePlist:(CDVInvokedUrlCommand *)command{
    @try{
        if (command.arguments.count>1) {
            NSString *jsonStr = command.arguments[0];
            NSData *data = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *tempDictQueryDiamond = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            [tempDictQueryDiamond writeToFile:command.arguments[1] atomically:YES];
            
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"success"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }else{
            //如果没有入参,则回调JS失败函数
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"未找到plist地址"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }@catch (NSException *exception) {
        NSLog(@"%@", exception);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exception.reason];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }@finally {
        NSLog(@"finally");
    }
}
-(void)exec:(CDVInvokedUrlCommand *)command{
    // UIAlertController *ac = [UIAlertController alertControllerWithTitle:@"提示" message:@"testPluginFunction" preferredStyle:UIAlertControllerStyleAlert];
    
    // UIAlertAction *aa = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:nil];
    // [ac addAction:aa];
    // [self.viewController presentViewController:ac animated:YES completion:nil];
    @try{
        if (command.arguments.count>0) {
            //获取当前app的路径
            //NSString *resourcePath=[[NSBundle mainBundle] resourcePath];
            
            NSTask *task;
            task = [[NSTask alloc] init];
            [task setLaunchPath: @"/bin/bash"];
            
            NSMutableArray *mArr = [NSMutableArray array];
            
            for (int i = 1; i<[command.arguments count]; i++) {
                NSString *obj = command.arguments[i];
                [mArr addObject: obj];
            }
            
            [task setArguments: @[@"-c", command.arguments[0]]];
            
            NSPipe *pipe;
            pipe = [NSPipe pipe];
            [task setStandardOutput: pipe];
            
            NSFileHandle *file;
            file = [pipe fileHandleForReading];
            
            [task launch];
            
            NSData *data;
            data = [file readDataToEndOfFile];
            
            NSString *result;
            result = [[NSString alloc] initWithData: data
                                           encoding: NSUTF8StringEncoding];
            NSLog (@"woop!  got\n%@", result);
            
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: result];
            //通过cordova框架中的callBackID回调至JS的回调函数上
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            NSLog (@"finish");
        }else{
            //如果没有入参,则回调JS失败函数
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"错误的shell命令"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }@catch (NSException *exception) {
        NSLog(@"%@", exception);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:exception.reason];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }@finally {
        NSLog(@"finally");
    }
}

@end
