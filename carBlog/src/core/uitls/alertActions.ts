import { Alert } from 'react-native'


export function simpleAlert(title : string, message : string, actionText? : string, action? : () => void) {
    Alert.alert(title || "提示", message, [
        {
            text: actionText || "关闭",
            onPress: action ? action : ()=>{}
        }
    ])
}

export function towActionAlert(title : string, message : string, actionText1 : string, action1 : () => void ,
                                actionText2 : string, action2 : () => void) {
    Alert.alert(title||"提示", message, [
        {
            text: actionText1,
            onPress: action1 ? action1 : ()=>{}
        },
        {
            text: actionText2,
            onPress: action2 ? action2 : ()=>{}
        }
    ])
}



export function threeActionAlert(title : string, message : string, actionText1 : string, action1 : () => void ,
                actionText2 : string, action2 : () => void, actionText3 : string, action3 : () => void) {
    Alert.alert(title, message, [
        {
            text: actionText1,
            onPress: action1 ? action1 : ()=>{}
        },
        {
            text: actionText2,
            onPress: action2 ? action2 : ()=>{}
        },
        {
            text: actionText3,
            onPress: action3 ? action3 : ()=>{}
        }
    ])
}