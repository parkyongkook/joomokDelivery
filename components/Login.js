import React, { Component } from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, AsyncStorage, 
    TextInput, ActivityIndicator, Image, StatusBar, Alert, Linking} from 'react-native';
import {CheckBox,Form,Item, Button, Icon, Text,} from 'native-base';

import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper'; // 2.6.5
import { connect } from 'react-redux';
import * as actions from '../actions';
import Storage from 'react-native-storage';
import { Permissions, Notifications } from 'expo';
import appJson from '../app.json';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

class Login extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            notification: {},
            isIdFocus: false,
            isPassFocus: false,
            loading: true,
            fontLoaded : false,
            isLoading: false,
            idSaveChecked: false,
            userData: {
                userid: null,
                password: null,
                fb_uid: null,
                tokenid: null,
                width: null,
                height: null,
            }
        }
        this.onChangeInput_Id = this.onChangeInput_Id.bind(this);
        this.onChangeInput_pass = this.onChangeInput_pass.bind(this);
        this.loginActivate = this.loginActivate.bind(this);
    }

    
    onChangeInput_Id(txt) {
        this.setState({
            userData: update(this.state.userData, {
                userid: { $set: txt },
            })
        })
    }

    onChangeInput_pass(txt) {
        this.setState({
            userData: update(this.state.userData, {
                password: { $set: txt },
            })
        })
    }

    loginActivate( user , autoLogin , push ) {

        var currentUser
        var that = this

        if( this.state.userData.userid === null || this.state.userData.userid === '' ){
            this.setState({
                isLoading: false
            })

            if(autoLogin){
                return
            }
            return alert('아이디 항목이 비어있습니다.')
        }


        if( this.state.userData.password === null || this.state.userData.password === '' ){
            this.setState({
                isLoading: false
            })
            if(autoLogin){
                return
            }
            return alert('비밀번호 항목이 비어있습니다.')
        }
        
        if (this.state.idSaveChecked) {
            storage.save({
                key: 'userInfo',
                data: {
                    idSaveChecked: this.state.idSaveChecked,
                    userid: this.state.userData.userid,
                    password: this.state.userData.password,
                    tokenid : this.state.userData.tokenid
                    // fb_uid: user.uid
                },
                expires: null
            });
        } else {
            storage.save({
                key: 'userInfo',
                data: {
                    idSaveChecked: false,
                    userid: null,
                    password: null,
                    tokenid : null
                },
                expires: null
            });
        }

        fetch('https://api.joomok.net/auth/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.userData)
        })
            .then((response) => response.json())
            .then((responseData) => {
                //에러검증

                if ( responseData.code !== 200 ) {
                    return alert(responseData.message)
                }
                if( responseData.code === 404) {
                    return alert(responseData.code)
                }

                if (responseData.code === 401) {
                    return alert("앱 실행중 오류가 발생 했습니다 관리자에게 문의하세요")
                }

                if( responseData.data.result < 0 ){
                    this.setState({
                        isLoading: false
                    })
                    return alert('로그인에 실패 하였습니다 아이디 비밀번호를 다시 확인해 주세요')
                    return
                }else{

                    //파이어베이스에 로그인 되어있고 컴포넌트에 접속이 되어있으면 푸쉬 토큰 등록 함수 시작
                    // listener = firebase.auth().onAuthStateChanged(function (user) {
                    //     if (user != null) {
                    //         currentUser = user
                    //         that.registerForPushNotificationsAsync(currentUser)
                    //     }
                    //     listener();
                    // });
                    if( appJson.expo.version+'b' !== responseData.version ){
                       
                        Alert.alert(
                            '필수사항 트',
                            '더 나은 서비스를 위해 앱을 업데이트 해주세요',
                        [
                            {text: '업데이트', onPress: () => {
                                Platform.OS === 'ios' ? Linking.openURL('https://itunes.apple.com/kr/app/joomok/id1436954278?mt=8')
                                : Linking.openURL('https://play.google.com/store/apps/details?id=co.pyk.joomok')
                            }},
                        ]
                    );
                    }
                    this.props.loginSucess(responseData.data, responseData.data.usridx, this.state.userData)

                    if( push === true ){        
                        Actions.Main({
                            loginMessage: "loginSucess",
                            push : 'dontHave'
                        })
                        return
                    }

                    Actions.Main({
                        loginMessage: "loginSucess"
                    })
                }
            })
            .catch((error) => {
                alert('서버접속실패 관리자에게 문의하세요')
                console.log(error)
            })
            .done(()=> 
            this.setState({
                isLoading: false
            }));
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: "#0099ff",  }}>
                <Image
                    style={{
                        flex: 1,
                        resizeMode: "contain",
                        position: 'absolute',
                        top: -200,
                        justifyContent: 'flex-start',
                        width: '100%',
                    }}
                    source={require('../assets/img/backPatternTop.jpg')}
                />
                <Image
                    style={{
                        flex: 1,
                        resizeMode: "contain",
                        position: 'absolute',
                        bottom: -180,
                        justifyContent: 'flex-start',
                        width: '100%',
                        transform: [{ rotateY: '180deg' }]
                    }}
                    source={require('../assets/img/backPatternTop.jpg')}
                />

                <View style={{ flex: 4, justifyContent: "center", marginTop: this.state.inputMargin ? Platform.OS === "android" ? -60 : null : null   }}>

                    <View style={{ 
                        flex: 3, 
                        justifyContent: 'center', 
                        alignItems: "center", 
                        position: "relative", 
                    }}>
                            <Image
                                style={{
                                    flex: 3,
                                    resizeMode: "contain",
                                    justifyContent: 'flex-start',
                                    width: '70%',
                                    marginTop: Platform.OS === "ios" ? 0 : 25,
                                }}
                                source={require('../assets/img/logo.png')}
                            />
                            <Text style={{flex:1, marginTop:-70, color:'#fff', }}>배송앱</Text>
                    </View>

                    <View style={{ flex: 3, marginLeft:30, marginRight:40, }}>

                        <Form style={{ alignItems: "center", width: "100%", }}>

                            <Item style={{ width: "100%",
                                           borderBottomWidth: 0.5,
                                           borderColor:'#fff',}}>
                                <TextInput
                                    allowFontScaling={false}
                                    placeholder="아이디"
                                    selectionColor='#fff'
                                    placeholderTextColor="#ddd"
                                    onChangeText={this.onChangeInput_Id}
                                    underlineColorAndroid='transparent'
                                    onBlur={()=> this.setState({ 
                                        inputMargin : false, 
                                        isIdFocus : false,
                                    })}
                                    onFocus={()=> this.setState({ 
                                        inputMargin : true ,
                                        isIdFocus: true
                                    })}
                                    style={{
                                        flex: 1,
                                        height: 40,
                                        color: "#eee",
                                        backgroundColor: this.state.isIdFocus ? 'rgba(0,0,0,0.1)' : null 
                                    }}
                                    value={this.state.userData.userid}
                                />

                                <TouchableOpacity style={{ position: "absolute", right: 0, top: 15, }}
                                    onPress={() => {
                                        this.setState({
                                            userData: update(this.state.userData, {
                                                userid: { $set: null },
                                            })
                                        })
                                    }}
                                >
                                    <Icon type="FontAwesome" name='times-circle'
                                        style={{
                                            width: 25,
                                            height: 19,
                                            fontSize: 20,
                                            color: "#fff",
                                        }}
                                    />
                                </TouchableOpacity>

                            </Item>

                            <Item style={{ 
                                marginTop:20,
                                width: "100%", 
                                borderBottomWidth: 0.5,
                                borderColor:'#fff',
                            }}>
                                <TextInput
                                    allowFontScaling={false}
                                    placeholder="비밀번호"
                                    selectionColor='#fff'
                                    placeholderTextColor="#ddd"
                                    onChangeText={this.onChangeInput_pass}
                                    style={{ flex: 1, height: 40, color: "#eee", backgroundColor: this.state.isPassFocus ? 'rgba(0,0,0,0.1)' : null  }}
                                    onBlur={()=> this.setState({ 
                                        inputMargin : false, 
                                        isPassFocus : false,
                                    })}
                                    onFocus={()=> this.setState({ 
                                        inputMargin : true ,
                                        isPassFocus: true
                                    })}
                                    value={this.state.userData.password}
                                    secureTextEntry={true}
                                    underlineColorAndroid='transparent'
                                />
                            </Item>

                            
                        </Form>

                        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginLeft: 5 }}>
    
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    checked={this.state.idSaveChecked}
                                    style={{
                                        marginTop: 9,
                                        width: 17,
                                        height: 17,
                                        borderColor: "#fff",
                                    }}
                                    //체크박스 옵션
                                    onPress={() => {
                                        this.state.idSaveChecked ?
                                            this.setState({
                                                idSaveChecked: false
                                            }) :
                                            this.setState({
                                                idSaveChecked: true
                                            })
                                    }
                                    }
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.state.idSaveChecked ?
                                            this.setState({
                                                idSaveChecked: false
                                            }) :
                                            this.setState({
                                                idSaveChecked: true
                                            })
                                        }
                                    }
                                >
                                    <Text 
                                        allowFontScaling={false} 
                                        style={{
                                        fontSize: 13,
                                        marginTop: 10,
                                        marginLeft: 15,
                                        color: "#fff",
                                    }}>자동 로그인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={{ flex: 2, alignItems: "center",  }}>
                    <Button block style={{ marginLeft: 20, marginRight: 20, backgroundColor: "#fff", }}
                            onPress={ ()=>Actions.Main() }>
                        <Text allowFontScaling={false} style={{ color: "#0099ff" }}>로그인</Text>
                    </Button>
                </View>     
                {
                    this.state.isLoading ?
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            style={{ width: "100%", height: "100%", position: "absolute", backgroundColor: "#fff", opacity: 0.5, }}
                        />
                        :
                        null
                }
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loginSubText: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 15,
        color: "#fff",
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        loginSucess: (userData, usridx, displayInfo) => dispatch(actions.loginSucess(userData, usridx, displayInfo))
    };
};

export default connect(null, mapDispatchToProps)(Login);

