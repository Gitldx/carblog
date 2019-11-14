import React from 'react';
import {
    View,
    ViewProps,
} from 'react-native';
import { ThemedComponentProps, withStyles, ThemeType, Text } from 'react-native-ui-kitten';

interface componentProps {
    customTitleBox?: ()=>React.ReactNode,
    icon?: () => React.ReactNode,
    titleLabel?: string,
    titleInfo?: string,
    subTitle?: () => React.ReactNode
    textParagraph?: string,
    paragraphApparent? : "hint" | "default" | "alternative"
    paragraphCategory? : string
}

export type contentBoxProps = ThemedComponentProps & componentProps & ViewProps


export class ContentBoxComponent extends React.Component<contentBoxProps> {



    public render(): React.ReactNode {

        const { themedStyle, customTitleBox, icon, titleLabel, titleInfo, subTitle,textParagraph,paragraphApparent,paragraphCategory, style, ...restProps } = this.props;

        return (
            <View style={[themedStyle.container, style]} {...restProps}>
                {
                    !customTitleBox ?
                        <View style={themedStyle.titleSection}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {icon ? icon() : null}
                                {titleLabel ? <Text category="s2" style={{ marginLeft: icon ? 5 : 0 }}>{titleLabel}</Text> : null}
                            </View>
                            {titleInfo ? <Text appearance="hint" category="p2">{titleInfo}</Text> : null}
                        </View>
                        : customTitleBox()
                }
                {
                    subTitle ?
                    <View style={themedStyle.subTileSection}>
                        {subTitle()}
                    </View>
                    : null
                }
                {
                    textParagraph ?
                        <View style={themedStyle.descriptionSection}>
                            <Text appearance={paragraphApparent ? paragraphApparent : "hint"} category= {paragraphCategory ? paragraphCategory : "p2"} >{textParagraph}</Text>
                            </View>
                        : null
                }
                {this.props.children ? (
                    <View style={themedStyle.contentSection}>{this.props.children}</View>
                ) : null}
            </View>
        );
    }
}



export const ContentBox = withStyles(ContentBoxComponent, (theme: ThemeType) => ({
    container: {
        marginTop: 15,
        backgroundColor: theme['background-basic-color-1'],
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom : 5
    },
    subTileSection : {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom:5
    },
    descriptionSection: {

        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    contentSection: {
        // alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    }
}));