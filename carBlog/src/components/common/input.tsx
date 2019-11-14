import React from 'react';
import {
    TextInputProps,

} from 'react-native';

import { withStyles, ThemeType, ThemedComponentProps, InputProps, Input as TextInput } from 'react-native-ui-kitten';




interface propType {
    
}


export type InputType = InputProps & ThemedComponentProps & propType


export class InputComponet extends React.Component<InputType> {

    public render(): React.ReactElement<InputType> {

        const { themedStyle, style,textStyle,...restProps } = this.props

        return (
            <TextInput size="small" style={[themedStyle.input,style]} textStyle = {[{padding:0},textStyle]} {...restProps}/>
        );
    }
}



export const Input = withStyles(InputComponet, (theme: ThemeType) => ({
    input: {
        // padding: 10,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // backgroundColor: theme['background-basic-color-1'],
        // borderBottomColor: theme['border-basic-color-3'],
    },
}));
