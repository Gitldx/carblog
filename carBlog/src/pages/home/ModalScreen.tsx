import React from 'react';
import { View, Button, Dimensions } from 'react-native'
import EventRegister, { upgradeEvent } from '@src/core/uitls/eventRegister';
import { simpleAlert, towActionAlert } from '@src/core/uitls/alertActions';
import codePush from "react-native-code-push";
import { NavigationScreenProps } from 'react-navigation';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { PageView } from '../pageView';
import { Text } from 'react-native-ui-kitten';

// const NativeAPI = NativeModules.NativeAPI


export class ModalScreen extends React.Component<NavigationScreenProps> {

  public state = {
    totalBytes: 0,
    receivedBytes: 0
  }

  private handler
  private isMandatory: boolean = false
  private isSilent: boolean = false
  componentDidMount() {
    this.isMandatory = this.props.navigation.getParam("isMandatory")
    this.isSilent = this.props.navigation.getParam("isSilent")

    this.handler = EventRegister.addEventListener(upgradeEvent, (data: { eventType: 0 | 1, totalBytes: number, receivedBytes: number }) => {
      if (data.eventType == 0) {
        this.setState({ totalBytes: data.totalBytes, receivedBytes: data.receivedBytes })
      }
      else if (data.eventType == 1) {
        if (this.isMandatory == false && this.isSilent == false) {
          towActionAlert(null, "数据更新成功，重启App后生效", "稍后重启",
            () => { this.props.navigation.goBack() },
            "现在重启", () => { codePush.restartApp() }
          )
        }
        // simpleAlert(null,"更新成功，重启app后生效","好的",()=>NativeAPI.exitApp())
      }
    })

    // let i = 0
    // const t = 2000000
    // const d = setInterval(() => {
    //   i += 50000
    //   if (i > t) {
    //     clearInterval(d)
    //   }
    //   this.setState({ totalBytes: t, receivedBytes: i < t ? i : t })
    // }, 200);
  }


  componentWillUnmount() {
    EventRegister.removeEventListener(this.handler)
  }

  private barWidth = Dimensions.get('window').width - 100;
  private toSize(k) {
    return k >= 1024 ? (k / 1024).toFixed(2) + "M" : k + "k"
  }

  private renderBreakBtn = () => {
    return (
      <View style={{ margin: 10 }}>
        <Button
          onPress={() => codePush.restartApp()}
          title="卡住了？重启APP再试试"
        />
      </View>

    )
  }

  render() {
    const r = (this.state.receivedBytes / 1024).toFixed(0)
    const t = (this.state.totalBytes / 1024).toFixed(0)

    const progress = ((t == "0") ? 0 : Number(r) / Number(t)) * 100

    return (
      <PageView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text category="h5" style={{ marginBottom: 10 }}>更新数据</Text>
        <Text >{`已更新${this.toSize(r)}/总共${this.toSize(t)}`}</Text>

        <ProgressBarAnimated
          width={this.barWidth}
          value={progress}
          backgroundColorOnComplete="#6CC644"
        />

        {/* {!this.isMandatory &&
          <View style={{ margin: 10 }}>
            <Button
              onPress={() => this.props.navigation.goBack()}
              title="返回"
            />
          </View>
        } */}

        {
          this.renderBreakBtn()
        }

      </PageView>
    );
  }
}