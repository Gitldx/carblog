import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationState } from 'react-navigation';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Button, Text as UiText } from 'react-native-ui-kitten';
import {getThemeValue} from 'react-native-ui-kitten/theme/theme/theme.service'
import { DynamicStatusBar } from '@src/components/common';

import { Router } from './core/navigation/routes';
import { getCurrentStateName } from './core/navigation/util';
import {
    ThemeContext,
    ThemeContextType,
    ThemeKey,
    themes,
    ThemeStore,
    custtomMapping
} from '@src/core/themes';

import { Config } from './core/uitls/config';
// import SplashScreen from 'react-native-splash-screen'
import FlashMessage from "react-native-flash-message";

interface State {
    theme: ThemeKey;
}

export default class App extends React.Component<{}, State>{

    public state: State = {
        theme: 'Eva Light',
    };

    private onTransitionTrackError = (error: any): void => {
        console.warn('Analytics error: ', error.message);
    };

    private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
        const prevStateName: string = getCurrentStateName(prevState);
        const currentStateName: string = getCurrentStateName(currentState);
        
        if (prevStateName !== currentStateName) {
            //   trackScreenTransition(currentStateName)
            //     .catch(this.onTransitionTrackError);
            // console.warn('Analytics error: ', "onNavigationStateChange error");
            // console.warn(`prevStateName:${prevStateName},currentStateName:${currentStateName}`)
        }
    };


    private onSwitchTheme = (theme: ThemeKey) => {
        Config.currentTheme = theme
        ThemeStore.setTheme(theme).then(() => {
            this.setState({ theme });
        });
    };

    public async componentWillMount(){
        const theme : ThemeKey= await ThemeStore.getTheme()
        this.setState({theme})
        Config.currentTheme = theme
    }


    public componentDidMount(): void {
        // SplashScreen.hide()
        
    }


    public render(): React.ReactNode {
        const contextValue: ThemeContextType = {
            currentTheme: this.state.theme,
            toggleTheme: this.onSwitchTheme,
        };
        
        return (

            <ThemeContext.Provider value={contextValue}>

                <ApplicationProvider
                    mapping={mapping}
                    // theme={darkTheme}
                    customMapping = {custtomMapping}
                    theme={themes[this.state.theme]}
                >

                    <DynamicStatusBar currentTheme={this.state.theme} />
                    {/* <Layout style={{ flex: 1, ...styles.container }}> */}
                        <SafeAreaView style={{flex:1,backgroundColor:  this.state.theme == "Eva Light" ? getThemeValue("background-basic-color-1",lightTheme) : getThemeValue("background-basic-color-1",darkTheme) }}>
                            {/* <View style={{ width: Dimensions.get('window').width }}> */}
                            
                                {/* <Icon name="rocket" size={30} color="#900" />
                                <Button onPress={()=>{
                                    console.warn(`app:${StaticObject.num++}`)
                                }}>static</Button> */}
                            {/* </View> */}
                            {/* <UiText category='h4' style={styles.text}>Welcome to UI Kitten</UiText>
                            <Button>BUTTON</Button> */}

                            <Router onNavigationStateChange={this.onNavigationStateChange} />

                            <FlashMessage position="top"/>
                        </SafeAreaView>

                    {/* </Layout> */}

                </ApplicationProvider>

            </ThemeContext.Provider>



        );
    }
}

