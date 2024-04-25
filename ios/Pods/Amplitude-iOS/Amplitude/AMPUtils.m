f must, may, and should.</t>
							<t>Replaced the link submission "properties" attribute to "schema" attribute.</t>
							<t>Replaced "optional" attribute with "required" attribute.</t>
							<t>Replaced "maximumCanEqual" attribute with "exclusiveMaximum" attribute.</t>
							<t>Replaced "minimumCanEqual" attribute with "exclusiveMinimum" attribute.</t>
							<t>Replaced "requires" attribute with "dependencies" attribute.</t>
							<t>Moved "contentEncoding" attribute to hyper schema.</t>
							<t>Added "additionalItems" attribute.</t>
							<t>Added "id" attribute.</t>
							<t>Switched self-referencing variable substitution from "-this" to "@" to align with reserved characters in URI template.</t>
							<t>Added "patternProperties" attribute.</t>
							<t>Schema URIs are now namespace versioned.</t>
							<t>Added "$ref" and "$schema" attributes.</t>
						</list>
					</t>
					
					<t hangText="draft-02">
						<list style="symbols">
							<t>Replaced "maxDecimal" attribute with "divisibleBy" attribute.</t>
							<t>Added slash-delimited fragment resolution protocol and made it the default.</t>
							<t>Added language about using links outside of schemas by referencing its normative URI.</t>
							<t>Added "uniqueItems" attribute.</t>
							<t>Added "targetSchema" attribute to link description object.</t>
						</list>
					</t>
					
					<t hangText="draft-01">
						<list style="symbols">
							<t>Fixed category and updates from template.</t>
						</list>
					</t>
					
					<t hangText="draft-00">
						<list style="symbols">
							<t>Initial draft.</t>
						</list>
					</t>
				</list>
			</t>
		</section>
		
		<section title="Open Issues">
			<t>
				<list>
					<t>Should we give a preference to MIME headers over Link headers (or only use one)?</t>
					<t>Should "root" be a MIME parameter?</t>
					<t>Should "format" be renamed to "mediaType" or "contentType" to reflect the usage MIME media types that are allowed?</t>
					<t>How should dates be handled?</t>
				</list>
			</t>
		</section>
	</back>
</rfc>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              in array for groupType %@ (received class %@). Please use NSStrings", coercedKey, [i class]);
                }
            }
            dict[coercedKey] = [NSArray arrayWithArray:arr];
        } else if ([value isKindOfClass:[NSNumber class]] || [value isKindOfClass:[NSDate class]]){
            dict[coercedKey] = [self coerceToString:value withName:@"groupName"];
        } else {
            AMPLITUDE_LOG(@"WARNING: Invalid groupName value for groupType %@ (received class %@). Please use NSString or NSArray of NSStrings", coercedKey, [value class]);
        }
    }
    SAFE_ARC_RELEASE(objCopy);
    return [NSDictionary dictionaryWithDictionary:dict];
}

+ (NSString*) platformDataDirectory
{
#if TARGET_OS_TV
    return [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
#else
    return [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
#endif
}

@end
