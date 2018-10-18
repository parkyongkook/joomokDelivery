import React, { Component } from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator, Image, StatusBar, AsyncStorage } from 'react-native';
import {CheckBox,Form,Item, Button, Icon, Text,} from 'native-base';

import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper'; // 2.6.5
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isIdFocus: false,
            isPassFocus: false,
            isLoading: false,
            idSaveChecked: false,
            userData: {
                usrid: null,
                passwd: null,
            }
        }
        this.onChangeInput = this.onChangeInput.bind(this);
        this.login = this.login.bind(this);
    }

    componentWillMount(){

        //로그아웃으로 진입 시 저장되어있는 로컬 정보 삭제.
        if(this.props.logout){
            this.setState({ 
                idSaveChecked : false 
            })
            storage.remove({
                key: "userInfo",
                data: {
                    idSaveChecked: null,
                    userid: null,
                    password: null,
                },
                expires: null
            })
            return
        }

        //로그아웃으로 진입이 아닐 시 로컬에 있는 정보를 가져오기
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
                    usrid: { $set: ret.usrid },
                    passwd: { $set: ret.passwd },
                })
            })

        })
        .then( ()=>this.state.idSaveChecked ? this.login() : null )
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

    login = () => {

        this.setState({
            isLoading : true
        })

        //예외처리
        let usrdta = this.state.userData
        if( usrdta.usrid === null || usrdta.usrid === "" || usrdta.passwd === null || usrdta.passwd === ""){
            usrdta.usrid === null || usrdta.usrid === "" ? alert("아이디 항목이 비어있습니다.") : alert("비밀번호 항목이 비어있습니다.")
        }else{

            if ( this.state.idSaveChecked ) {
                storage.save({
                    key: 'userInfo',
                    data: {
                        idSaveChecked: this.state.idSaveChecked,
                        usrid: this.state.userData.usrid,
                        passwd: this.state.userData.passwd,
                    },
                    expires: null
                });
            }else{
                storage.remove({
                    key: "userInfo",
                    data: {
                        idSaveChecked: null,
                        usrid: null,
                        passwd: null,
                    },
                    expires: null
                })
            } 
    

            fetch('http://dnbs.joomok.net/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.userData)
            })
            .then(response => { 
                if(response.status !== 200 ){
                    return alert('로그인실패 잠시 후 다시 시도해 주십시오.')
                }
                return response.text() 
            })
            .then((response)=>{ 
 
                let usrData = JSON.parse(response);

                if(usrData.code !== 200){
                    return alert(usrData.message)
                }

                Actions.AgendarView({
                    usrData : usrData
                });
                
            }).catch(err => {
               return console.log('로그인실패')
            })  
            .done(()=>
                this.setState({
                    isLoading : false
                })
            );

        }

        this.setState({
            isLoading : false
        })

    }
    
    onChangeInput(text,type) {
        type == "id" ? 
        this.setState({
            userData: update(this.state.userData, {
                usrid: { $set: text },
            })
        })
        :
        this.setState({
            userData: update(this.state.userData, {
                passwd: { $set: text },
            })
        })
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
                            <Text style={{fontSize:12, flex:1, marginTop:-70, color:'#fff', }}>배송앱</Text>
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
                                    onChangeText={(text)=>this.onChangeInput(text,"id")}
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
                                    value={this.state.userData.usrid}
                                />

                                <TouchableOpacity style={{ position: "absolute", right: 0, top: 15, }}
                                    onPress={() => {
                                        this.setState({
                                            userData: update(this.state.userData, {
                                                usrid: { $set: null },
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
                                    onChangeText={(text)=>this.onChangeInput(text,"pass")}
                                    style={{ flex: 1, height: 40, color: "#eee", backgroundColor: this.state.isPassFocus ? 'rgba(0,0,0,0.1)' : null  }}
                                    onBlur={()=> this.setState({ 
                                        inputMargin : false, 
                                        isPassFocus : false,
                                    })}
                                    onFocus={()=> this.setState({ 
                                        inputMargin : true ,
                                        isPassFocus: true
                                    })}
                                    value={this.state.userData.passwd}
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
                            onPress={ this.login }>
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
