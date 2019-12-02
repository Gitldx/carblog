import React from 'react'
import { View } from 'react-native';
import { Text, TextProps } from 'react-native-ui-kitten';


type Props = { carNumber: string }

export class LicensePlate extends React.Component<Props & TextProps>{

    public render() {
        const {category,carNumber,style}  = this.props
        return (
            <View style={[{ backgroundColor: "#1E90FF", justifyContent:'center',alignItems: 'center',paddingHorizontal:5,borderRadius:3 },style]}>
                <Text category={category} style={{ color: "white" }}>{carNumber}</Text>
            </View>
        )
    }
}