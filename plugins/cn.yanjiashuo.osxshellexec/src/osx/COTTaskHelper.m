//
//  TaskHelper.m
//
//  Created by Tyler Hall on 12/8/14.
//  Copyright (c) 2014 Click On Tyler. All rights reserved.
//

#import "COTTaskHelper.h"

@implementation COTTaskHelper

- (void)launch
{
    NSAssert([NSThread isMainThread], @"TaskHelper launch must be called from the main thread.");

    NSPipe *outputPipe = [NSPipe pipe];
    NSPipe *errorPipe = [NSPipe pipe];
    
    [self.task setStandardInput:[NSFileHandle fileHandleWithNullDevice]];
    [self.task setStandardOutput:outputPipe];
    [self.task setStandardError:errorPipe];

    NSFileHandle *fhOut = [outputPipe fileHandleForReading];
    NSFileHandle *fhError = [errorPipe fileHandleForReading];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receivedData:) name:NSFileHandleDataAvailableNotification object:fhOut];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receivedError:) name:NSFileHandleDataAvailableNotification object:fhError];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(complete:) name:NSTaskDidTerminateNotification object:self.task];

    [fhOut waitForDataInBackgroundAndNotify];
    [fhError waitForDataInBackgroundAndNotify];

    [self.task launch];
}

- (void)receivedData:(NSNotification *)notification
{
    NSFileHandle *fh = [notification object];
    NSData *outputData = [fh availableData];

    if(self.outputHandler) {
        self.outputHandler(outputData);
    }

    if(self.task.isRunning) {
        [fh waitForDataInBackgroundAndNotify];
    }
}

- (void)receivedError:(NSNotification *)notification
{
    NSFileHandle *fh = [notification object];
    NSData *errorData = [fh availableData];

    if(self.errorHandler) {
        self.errorHandler(errorData);
    }
    
    if(self.task.isRunning) {
        [fh waitForDataInBackgroundAndNotify];
    }
}

- (void)complete:(NSNotification *)notification
{
    if(self.completionHandler) {
        self.completionHandler();
    }
}

@end