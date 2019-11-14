import React from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewPropTypes,
} from 'react-native';

// import Color from '../data/Colors';


interface Props {
    hasMore : boolean
    getMore():boolean
}

interface State{
    hasMore : boolean
}

export default class EarlierLoader extends React.Component<Props,State> {

    // count = 0;

    constructor(props) {
        super(props);
        this.state = {
            // isLoading: false,
            hasMore : true
        }
    }

    public render() {

        if(!this.props.hasMore){
            return null
        }

        return (

            <TouchableOpacity
                style={styles.container}
                onPress={
                    this.getMore
                }
            // disabled={this.props.isLoadingEarlier === true}
            >
                <View style={styles.wrapper}>
                    {this.renderLoading()}
                </View>
            </TouchableOpacity>
        )
    }

    private getMore = () => {
        if(!this.state.hasMore){
            return;
        }
        // this.count++;
        // this.setState({ isLoading: !this.state.isLoading })
        const hasMore = this.props.getMore()
        this.setState({hasMore})
    }



    private renderLoading() {
        if (!this.state.hasMore) {
            return (
                <Text style={styles.text}>
                    没有更多消息了
                </Text>
            );
        }
        
        return (
            <View>
                <Text style={styles.text}>
                    更多消息
                </Text>
                {/* {
                    this.state.isLoading &&
                    <ActivityIndicator
                        color="white"
                        size="small"
                        style={[styles.activityIndicator, this.props.activityIndicatorStyle]}
                    />
                } */}

            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b2b2b2',
        borderRadius: 15,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        backgroundColor: "transparent",
        color: "#fff",
        fontSize: 12,
    },
    activityIndicator: {
        marginTop: Platform.select({
            ios: -14,
            android: -16,
        }),
    },
});
