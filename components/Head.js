import React from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Text, Image, Platform } from 'react-native';
import { Header, Button, Left, Right, Body, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import {Notifications } from "expo";
import Toast, { DURATION } from 'react-native-easy-toast'
import {connect} from 'react-redux';

export default  class Head extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            logoTitle: "JOOMOK",
        };
    }

    componentDidMount() {
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
        this.props.title ? this.setState({ logoTitle: this.props.title }) : this.setState({ logoTitle: "JOOMOK" })
    }

    _handleNotification = (notification) => {
        let that = this;
        if(notification.origin === "received"){
            return fetch('https://api.joomok.net/boards/push?usridx='+this.props.usridx+'&key=title&word=두몫&istart=0&ilimit=10')
            .then((response) => response.json())
            .then((pushData) => {
                that.onPushTosatMessage(pushData.data[0].content) 
            })
            .catch((error) =>{
                console.error(error);
            });
        } 
    };

    onPushTosatMessage(msg){
        this.refs.toast.show(msg)
    }

    render() {
        const beforePage = (
            <Button transparent 
                onPress={() => {
                    if( this.props.stateOfComponent === true ){
                       return this.props.changeStateOfComponent()
                    }
                    Actions.pop()
                } 
                    }
                >
                <Icon type="EvilIcons" name='arrow-left'
                    style={{ color: "#fff", fontSize: 40, }}
                />
            </Button>
        )

        return (
            <Header noShadow style={{
                height: Platform.OS === "ios" ? 80 : 70,
                backgroundColor: this.props.backgroundColor ? "#0099ff" : "rgba(0,0,0,0)",
            }}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />

                <Left style={{ flex: 2, 
                    marginTop: Platform.OS === 'ios' ? 10 : 0, 
                    }}>
                    {this.props.beforePage ? beforePage : null}
                </Left>

                <Body style={{ flex: 5, flexDirection: "row", justifyContent: "center", }}>
                    <View style={{ flex: 3, justifyContent: 'center', flexDirection: "row", alignItems: "center", position: "relative", }}>
                        {
                            this.props.title ?
                                <Text
                                    allowFontScaling={false} 
                                    style={{ fontSize: 26, color: "#fff",
                                    marginTop: Platform.OS === 'ios' ? 10 : 0, 
                                }}>
                                    {this.props.title}
                                </Text>
                                :
                                <Image
                                    style={{
                                        flex: 1,
                                        resizeMode: "contain",
                                        justifyContent: 'flex-start',
                                    }}
                                    source={require('../assets/img/logo.png')}
                                />
                        }
                    </View>
                </Body>

                <Right style={{ flex: 2, 
                     marginTop: Platform.OS === "ios" ? 0 : 0, 
                    }}>
                    {this.props.hideMenu ? null :
                        <TouchableOpacity
                            style={{
                                width: 50,
                                height: 30,
                                marginTop: 15,
                                alignItems:'center',
                            }}
                            onPress={
                                this.props.openDrawer
                            }
                        >
                            <View style={styles.rightMenuButton} />
                            <View style={styles.rightMenuButton} />
                            <View style={styles.rightMenuButton} />
                        </TouchableOpacity>
                    }
                </Right>
                <Toast 
                    fadeOutDuration={1000}
                    position='top'
                    positionValue={20}
                    ref="toast" 
                />    
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    rightMenuButton: {
        height: 7,
        width: 7,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 2,
    },
});
