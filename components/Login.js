import React, { Component } from 'react';
import {Dimensions, Platform, StyleSheet, View, TouchableOpacity, AsyncStorage, TextInput, ActivityIndicator, Image, StatusBar,} from 'react-native';
import {CheckBox,Form,Item, Button, Icon, Text,} from 'native-base';

import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import update from 'immutability-helper'; // 2.6.5
import { connect } from 'react-redux';
import * as actions from '../actions';
import Storage from 'react-native-storage';
import { Permissions, Notifications } from 'expo';
import Toast, { DURATION } from 'react-native-easy-toast'

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

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
                width: null,
                height: null,
            }
        }
        this.onChangeInput_Id = this.onChangeInput_Id.bind(this);
        this.onChangeInput_pass = this.onChangeInput_pass.bind(this);
        this.loginActivate = this.loginActivate.bind(this);
        this.firebaseLogin = this.firebaseLogin.bind(this);
    }

    componentWillMount() {

        if ( this.props.isLogout === "true" ) {
            storage.remove({
                key: "userInfo",
                data: {
                    idSaveChecked: null,
                    userid: null,
                    password: null,
                    fb_uid: null
                },
                expires: null
            })
        } else {

            this.setState({
                isLoading: true
            })

            storage.load({
                key: 'userInfo',
                autoSync: true,
                syncParams: {
                    extraFetchOptions: {
                    },
                    someFlag: true,
                },
            }).then(ret => {

                this.setState({
                    idSaveChecked: ret.idSaveChecked,
                    userData: update(this.state.userData, {
                        userid: { $set: ret.userid },
                        password: { $set: ret.password },
                        fb_uid: { $set: ret.fb_uid },
                        width: { $set: width },
                        height: { $set: height },
                    })
                })

            }).then(() => {
                this.loginActivate( null, true )
            })
            .catch(err => {
                this.setState({
                    isLoading: false
                })
                switch (err.name) {
                    case 'NotFoundError':
                        break;
                    case 'ExpiredError':
                        break;
                }
            })
        }
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

    loginActivate( user , autoLogin) {

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
                    password: null
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

                    this.registerForPushNotificationsAsync()
                    //파이어베이스에 로그인 되어있고 컴포넌트에 접속이 되어있으면 푸쉬 토큰 등록 함수 시작
                    // listener = firebase.auth().onAuthStateChanged(function (user) {
                    //     if (user != null) {
                    //         currentUser = user
                    //         that.registerForPushNotificationsAsync(currentUser)
                    //     }
                    //     listener();
                    // });
                    this.props.loginSucess(responseData.data, responseData.data.usridx, this.state.userData)
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


    //파이어베이스 엑스포 토큰 등록 함수 
    registerForPushNotificationsAsync = async () => {
        
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
       
        // 사용자 권한을 부여하지 않은경우 여기서 중지
        if (finalStatus !== 'granted') {

            console.log('진입은완료',finalStatus)

            return;
        }
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        // POST the token to our backend so we can use it to send pushes from there
        var updates = {}

        updates['/expoToken'] = token

        console.log('기기의토큰값', token)

        // await firebase.database().ref('/users/' + currentUser.uid).update(updates)
    }

    firebaseLogin() {

        if (this.state.userData.userid === null || this.state.userData.userid === "") {
            this.setState({
                isLoading: false
            })
            return alert("아이디 항목이 비어있습니다.")
        }
        if (this.state.userData.password === null || this.state.userData.password === "") {
            this.setState({
                isLoading: false
            })
            return alert("비밀번호 항목이 비어있습니다.")
        }

        this.setState({
            isLoading: true
        })

        let that = this;
        let lowCaseStr = this.state.userData.userid
        
        //세션 유지, 푸쉬 기능을 위한 파이어베이스 로그인 시작.
        firebase.auth().signInWithEmailAndPassword(this.state.userData.userid + "@joomok.com", lowCaseStr)
            .then((err) => {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        that.loginActivate(user)
                    }
                });
            })
            .catch((err) => {
                console.log(err)
                alert(err)
                // alert("로그인에 실패하였습니다 아이디 또는 비밀번호를 확인해 주세요")
                this.setState({
                    isLoading: false
                })
            })
    }

    render() {
        console.log('현재버전체크', Platform.Version )
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
                                    flex: 1,
                                    resizeMode: "contain",
                                    justifyContent: 'flex-start',
                                    width: '70%',
                                    marginTop: Platform.OS === "ios" ? 0 : 25,
                                }}
                                source={require('../assets/img/logo.png')}
                            />
                    </View>

                    <View style={{ flex: 3, marginLeft:30, marginRight:40, }}>

                        <Form style={{ alignItems: "center", width: "100%", }}>

                            <Item style={{ width: "100%",
                                           borderBottomWidth: 0.5,
                                           borderColor:'#fff',}}>
                                <TextInput
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
                            <TouchableOpacity
                                onPress={
                                    () => Actions.SignUp_Authentication({
                                        title: "아이디 찾기"
                                    })
                                }
                            >
                                <Text style={{
                                    fontSize: 12,
                                    marginTop: 10,
                                    color: "#fff",
                                }}>아이디 찾기</Text>
                            </TouchableOpacity>

                            <Text style={{
                                fontSize: 12,
                                marginLeft: 5,
                                marginTop: 10,
                                color: "#fff",
                            }}>|</Text>

                            <TouchableOpacity
                                onPress={
                                    () => Actions.SignUp_Authentication({
                                        title: "비밀번호 찾기"
                                    })
                                }
                            >
                                <Text style={{ fontSize: 12, marginTop: 10, marginLeft: 5, marginRight: 8, color: "#fff", }}>비밀번호 찾기</Text>
                            </TouchableOpacity>
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
                                    <Text style={{
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
                        onPress={this.loginActivate}>
                        <Text style={{ color: "#0099ff" }}>로그인</Text>
                    </Button>
                    <Button block style={{
                        marginTop: 10,
                        marginLeft: 20,
                        marginRight: 20,
                        backgroundColor: "rgba(0,0,0,0)", 
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: "#fff",
                    }}
                        onPress={() => { Actions.SIgnUp_Policy({ version : Platform.OS ==='android' ? Platform.Version : 30 }) }}>
                        <Text>무료 회원가입</Text>
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

