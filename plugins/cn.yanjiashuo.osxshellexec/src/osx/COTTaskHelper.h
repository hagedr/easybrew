//
//  TaskHelper.h
//
//  Created by Tyler Hall on 12/8/14.
//  Copyright (c) 2014 Click On Tyler. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface COTTaskHelper : NSObject

@property (nonatomic, strong) NSTask *task;
@property (nonatomic, copy) void (^outputHandler)(NSData *outputData);
@property (nonatomic, copy) void (^completionHandler)();
@property (nonatomic, copy) void (^errorHandler)(NSData *errorData);

- (void)launch;

@end
