import React from 'react';
import {View,Button,Text} from 'react-native'
import EventRegister, { upgradeEvent } from '@src/core/uitls/eventRegister';

export class ModalScreen extends React.Component {

    public state = {
      count:0
    }

    private handler
    componentDidMount(){
        this.handler = EventRegister.addEventListener(upgradeEvent,count=>{
          console.warn(count)
          this.setState({count})
        })
    }

    componentWillUnmount(){
      EventRegister.removeEventListener(this.handler)
    }

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 30 }}>{`这是一个模态屏幕!${this.state.count}`}</Text>
          <Button
            onPress={() => this.props.navigation.goBack()}
            title="关闭"
          />
        </View>
      );
    }
  }