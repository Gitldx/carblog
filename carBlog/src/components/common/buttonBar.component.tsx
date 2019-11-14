import React from 'react';
import {
    ScrollView,
    ScrollViewProps,
    ViewProps,
    TouchableOpacityProps,
    View,
    StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withStyles, ThemeType, ThemedComponentProps, Text } from 'react-native-ui-kitten';
import { MaterialCommunityIcons } from '@src/assets/icons';



interface propType {
    leftText?: string,
    rightText?: string,
    showIcon?: boolean,
    leftKit?: () => React.ReactNode,
    rightKit?: () => React.ReactNode,
}


export type ButtonBarType = TouchableOpacityProps & ThemedComponentProps & propType


export class ButtonBarComponet extends React.Component<ButtonBarType> {

    public render(): React.ReactElement<ScrollViewProps> {

        const { themedStyle, style, onPress, leftText, rightText, showIcon = true, leftKit, rightKit } = this.props

        return (
            <TouchableOpacity
                activeOpacity={0.65}
                // {...this.props}
                style={[themedStyle.section, style]}
                onPress={onPress}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {leftText ?
                        <Text
                            category='p1'>
                            {leftText}
                        </Text> : null
                    }
                    {leftKit ? leftKit() : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0 }}>
                        {rightText ?
                            <Text
                                category='p2'>
                                {rightText}
                            </Text> : null
                        }
                        {rightKit ? rightKit() : null}
                        {
                            showIcon ? <MaterialCommunityIcons name="chevron-right" size={30} color="grey" /> : null
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}



export const ButtonBar = withStyles(ButtonBarComponet, (theme: ThemeType) => ({
    section: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: theme['background-basic-color-1'],
        borderBottomColor: theme['border-basic-color-3'],
    },
}));
