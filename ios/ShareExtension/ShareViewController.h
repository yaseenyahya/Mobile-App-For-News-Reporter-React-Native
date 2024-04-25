#import <Foundation/Foundation.h>

// Need config this two value bellows:

static NSString *const KApp_Scheme = @"main://";

static NSString *const KApp_Group_ID = @"your.group.id";

@interface ShareViewController : NSObject

+ (NSString*)store:(NSString*) urlStr   name:(NSString*) name;

+ (NSString*)storeData:(NSData*) data   name:(NSString*) name ;

+ (NSURL*)combineURL:(NSString*)name;

@end
