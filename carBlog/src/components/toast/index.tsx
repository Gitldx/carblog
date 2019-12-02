import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native'

import PropTypes from 'prop-types';

// const ViewPropTypes = RNViewPropTypes || View.propTypes;
export const DURATION = {
    LENGTH_SHORT: 500,
    LENGTH_LONG: 3000,
    FOREVER: 0,
};

export const COLOR = {
    success: "#5cb85c",
    info: "#5bc0de",
    warning: "#f0ad4e",
    danger: "#d9534f",
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
    },
    content: {
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 10,
    },
    text: {
        color: 'white'
    }
});

type Prop = {
    opacity?: number, fadeInDuration?: number,
    defaultCloseDelay?: number, fadeOutDuration?: number,
    position?: string, positionValue?: number, style?: any,
    textStyle?: any
}

type State = {
    opacityValue: Animated.Value
    isShow: boolean
    text: string
}


//react-native-easy-toast
export class Toast extends Component<Prop, State> {

    static defaultProps = {
    position: 'center',
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1
}

    constructor(props: Prop) {
        super(props);
    }


    public state : State = {
        isShow: false,
        text: '',
        opacityValue: new Animated.Value(this.props.opacity),
    }


    private duration: number
    private callback: () => void
    private animation
    private isShow: boolean
    private timer: number
    public show(text, duration, callback?: () => void) {       
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT;
        this.callback = callback;
        this.setState({
            isShow: true,
            text: text,
        });

        this.animation = Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        )
        this.animation.start(() => {
            this.isShow = true;
            if (duration !== DURATION.FOREVER) this.close();
        });
    }

    private close(duration = undefined) {
        let delay = typeof duration === 'undefined' ? this.duration : duration;

        if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;

        if (!this.isShow && !this.state.isShow) return;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.animation = Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0.0,
                    duration: this.props.fadeOutDuration,
                }
            )
            this.animation.start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
                if (typeof this.callback === 'function') {
                    this.callback();
                }
            });
        }, delay);
    }

    componentWillUnmount() {
        this.animation && this.animation.stop()
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let pos;
        switch (this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
            // default:
            //     pos = height / 2;
            //     break;
        }

        const view = this.state.isShow ?
            <View
                style={[styles.container, { top: pos }]}
                pointerEvents="none"
            >
                <Animated.View
                    style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}
                >
                    {React.isValidElement(this.state.text) ? this.state.text : <Text style={this.props.textStyle}>{this.state.text}</Text>}
                </Animated.View>
            </View> : null;
        return view;
    }
}



// Toast.propTypes = {
//     style: ViewPropTypes.style,
//     position: PropTypes.oneOf([
//         'top',
//         'center',
//         'bottom',
//     ]),
//     textStyle: Text.propTypes.style,
//     positionValue:PropTypes.number,
//     fadeInDuration:PropTypes.number,
//     fadeOutDuration:PropTypes.number,
//     opacity:PropTypes.number
// }

// Toast.defaultProps = {
//     position: 'bottom',
//     textStyle: styles.text,
//     positionValue: 120,
//     fadeInDuration: 500,
//     fadeOutDuration: 500,
//     opacity: 1
// }