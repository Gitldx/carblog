import React from 'react';
import { StyleSheet, View, Dimensions, Button, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-ui-kitten';

interface Props{
    title : string
}

export class FormRow extends React.Component<Props> {

    render() {
        return (
            <View style={styles.row}>
                {this.props.title ?
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start',alignItems:'center'}}>
                        <Text category="p2">{this.props.title}</Text>
                    </View> : null
                }

                <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    {this.props.children}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    row: {
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0, 0, 0, 0.054)',
    }
})