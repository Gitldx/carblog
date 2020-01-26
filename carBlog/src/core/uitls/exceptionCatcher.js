import * as React from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native'
// import { statusBarHeight } from 'rn_components/utils'
// import Modal from 'rn_components/rn_modal'
// import NavBar from 'rn_components/navbar'

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#fff',
//         flex: 1,
//         paddingTop: 10//statusBarHeight(),
//     },
//     header: {
//         flexDirection: 'row',
//     },
//     info: {
//         width: '100%',
//         height: 50,
//         justifyContent: 'space-around',
//         alignItems: 'center',
//     },
//     content: {
//         flex: 1,
//         paddingLeft: 10,
//         paddingRight: 10,
//     },
// })




//https://juejin.im/post/5b9c9aaff265da0a951ec8ba    参考网址

function withErrorBoundary(
    WrappedComponent,//: React.ComponentType<CatchCompProps> ,
    errorCallback,//: Function,
    allowedInDevMode,//: boolean,
    opt//: Object = {}
    ) {
    return class extends React.Component {
        state = {
            error: null,
            errorInfo: false,
            visible: false,
        }
        componentDidCatch(error, errorInfo) {
            this.setState({
                error,
                errorInfo,
                visible: true,
            })
            errorCallback && errorCallback(error, errorInfo)
        }
        handleLeft = () => {
            if (this.props._onClose) {
                this.props._onClose()
                return
            }
            this.setState({
                visible: false,
            })
        }
        // render() {
        //     const { title = 'Unexpected error occurred', message = 'Unexpected error occurred' } = opt
        //     return (
        //         this.state.visible && (allowedInDevMode ? true : process.env.NODE_ENV !== 'development') ? (
        //         <Modal 
        //             visible
        //             transparent
        //             animationType={'fade'}>
        //             <View style={styles.container}>
        //                 <View style={styles.header}>
        //                 <NavBar
        //                     title={title}
        //                     leftIcon={'arrow-left'}
        //                     handleLeft={this.handleLeft}/>
        //                 </View>
        //                 <View style={styles.info}>
        //                     <Text>{message}</Text>
        //                 </View> 
        //                 <ScrollView style={styles.content}>
        //                     <Text> { this.state.error && this.state.error.toString()} </Text>
        //                     <Text> { this.state.errorInfo && this.state.errorInfo.componentStack } </Text> 
        //                 </ScrollView>
        //             </View>
        //         </Modal>
        //         ) : <WrappedComponent {...this.props} />
        //     )
        // }

        render(){
            
            return (
                this.state.visible ? (
                    <View style={{flex:1,backgroundColor:'yellow',flexDirection:'column'}}>
                        <Text>{`${this.state.error},${this.state.errorInfo}`}</Text>
                    </View>
                ) :
                <WrappedComponent {...this.props} />
            )
        }
    }
}




const noop = () => {}

const setJSExceptionHandler = (customHandler = noop, allowedInDevMode = false) => {
    if (typeof allowedInDevMode !== 'boolean' || typeof customHandler !== 'function') {
        console.warn('carblog setJSExceptionHandler is called with wrong argument types.. first argument should be callback function and second argument is optional should be a boolean')
        console.warn('carblog  Not setting the JS handler .. please fix setJSExceptionHandler call')
        return
    }
    /* eslint-disable */
    const allowed = allowedInDevMode ? true : !__DEV__
    if (allowed) {
        global.ErrorUtils.setGlobalHandler(customHandler)
        console.error = (message, error) => global.ErrorUtils.reportError(error) // sending console.error so that it can be caught
    } else {
        console.warn('carblog  Skipping setJSExceptionHandler: Reason: In DEV mode and allowedInDevMode = false')
    }
}

const getJSExceptionHandler = () => global.ErrorUtils.getGlobalHandler()

export {
    setJSExceptionHandler,
    getJSExceptionHandler,
    withErrorBoundary
}

