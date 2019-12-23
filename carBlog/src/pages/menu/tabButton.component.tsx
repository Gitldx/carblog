import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import {
    Text,
} from 'react-native-ui-kitten/ui';
import { ThemeService } from '@src/core/themes';


interface TabButtonrops extends TouchableOpacityProps {
    children?: React.ReactElement;
    onSelect?: (selected: boolean) => void;
    selected?: boolean,
    lable: string,
    badge?: string
}

export class TabButton extends React.Component<TabButtonrops> {


    public render() {
        const iconElement = React.cloneElement(this.props.children, { color: this.props.selected ? "#12c700" : "#90a4ae" })
        return (
            <TouchableOpacity
                activeOpacity={0.65}
                {...this.props}
                onPress={() => { this.props.onSelect(!this.props.selected) }}
            >
                <View style={{ alignItems: 'center' }}>
                    {iconElement}

                    <Text style={{ color: this.props.selected ? "#12c700" : "#90a4ae" }} category="c1">{this.props.lable}</Text>


                    {Number(this.props.badge) > 0 && (
                        <View style={{
                            position: 'absolute',
                            // right: -5,
                            // top: -3,
                            right: 0,
                            top: 0,
                            backgroundColor: 'red',
                            // borderRadius: 8,
                            // width: 16,
                            // height: 16,
                            borderRadius: 4,
                            width: 8,
                            height: 8,
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            padding:0
                        }}>
                            {/* <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold',margin:0,textAlignVertical:'center' }}>{this.props.badge}</Text> */}
                        </View>
                    )}

                </View>


            </TouchableOpacity>
        );
    }


};