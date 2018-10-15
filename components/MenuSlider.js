import React, { Component } from 'react';
import { StyleSheet, Text,View, TouchableHighlight, Image, Platform } from 'react-native';
import {Header,ListItem, Icon} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';


class MenuSlider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: this.props.userData,
            modalVisible: false,
            alram1: false,
            alram2: false,
        };
        
        this.setModalVisible = this.setModalVisible.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    logOut() {
        const that = this;

        const userData = {
            usridx: this.props.userData.usridx
        }

        fetch('https://api.joomok.net/auth/signout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
            .then((response) => {

                if(response.status !== 200 ){
                   return alert('로그아웃 실패 관리자에게 문의하세요')
                }

                Actions.reset('Login',{
                    isLogout: "true"
                });

                alert("로그아웃 되었습니다.")
                that.props.closeDrawer()  
                
                
                //토큰 초기화
                // firebase.auth().onAuthStateChanged(function (user) {
                //     if(user){
                //         firebase.database().ref('users/' + user.uid ).set({
                //             email: user.email,
                //             uid : user.uid
                //         });
                //     }
                // });
        
            })
            .catch((error) => {
                alert(error);
            })
            .done();
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: "#fff", }}>
                <Header style={{ backgroundColor: "#0099ff", }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        flexDirection: "row",
                        alignItems: "center",
                        position: "relative",
                    }}>
                        <TouchableHighlight
                            style={{ position: "absolute", left: 0, top: 10 }}
                            onPress={() => {
                                this.props.closeDrawer()
                            }}
                        >
                            <Icon type="FontAwesome" name='times-circle'
                                style={{
                                    width: 24, height: 24, fontSize: 24,
                                    color: "#fff",
                                }}
                            />
                        </TouchableHighlight>
                        <Image
                            style={{
                                width: 180,
                                resizeMode: "contain",
                                justifyContent: 'flex-start',
                                marginBottom: 20,
                            }}
                            source={require('../assets/img/doomokLogo.png')}
                        />
                    </View>
                </Header>

                <View style={{ flex:1, backgroundColor:'#fff' }}>

                    <View style={{ flex:4.5}}>

                        <View style={{ marginTop: 20, marginBottom: 20, marginLeft:30, }}>
                            <Text allowFontScaling={false} style={{ fontSize: 26, }}>
                                {this.props.userData !== null ? this.props.userData.store : null}
                            </Text>
                            <Text allowFontScaling={false} style={{ fontSize: 18, fontWeight: "100", color: "#333", marginTop: 10, }}>
                                {this.props.userData !== null ? this.props.userData.name : null} 업주님 환영합니다.
                            </Text>
                        </View>

                        <ListItem style={styles.listItemHeader}>
                            <Image
                                style={styles.iconImage}
                                source={require('../assets/img/slideMenu_1.jpg')}
                            />
                            <Text allowFontScaling={false} style={styles.slideTitleText}>메뉴</Text>
                        </ListItem>

                        <TouchableHighlight
                            onPress={() => {
                                Actions.AgendarView();
                                this.props.closeDrawer();
                            }}
                            underlayColor ={'#eee'} 
                        >
                            <View style={styles.listItem}>
                
                                    <Text allowFontScaling={false} style={styles.slideText}>-달력</Text>
                            
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => {
                                Actions.Accounts();
                                this.props.closeDrawer();
                            }}
                            underlayColor ={'#eee'}
                        >
                            <View style={styles.listItem}>
                                
                                    <Text allowFontScaling={false} style={styles.slideText}>-거래처</Text>
                                
                            </View>
                        </TouchableHighlight>
                    </View>

                    <View style={{ flex:1.5, backgroundColor:'#fff' }}>
                        <View style={{ flex: 1 }}>
                            <ListItem style={styles.listItemHeader}>
                                <Image
                                    style={styles.iconImage}
                                    source={require('../assets/img/slideMenu_2.jpg')}
                                />
                                <Text allowFontScaling={false} style={styles.slideTitleText}>알림 센터</Text>
                            </ListItem>
                            <TouchableHighlight
                                onPress={() => {
                                    Actions.Myalram();
                                    this.props.closeDrawer();
                                }}
                                underlayColor ={'#eee'} 
                            >
                                <View style={styles.listItem}>
                                    <Text allowFontScaling={false} style={styles.slideText}>-My알람</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{flex:6}}/>                

                </View>   

            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    listItemHeader: {
        height: Platform.OS === 'android' ? 15 : 45,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        justifyContent: "flex-start",
        marginTop: Platform.OS === "ios" ? 0 : 13,
    },

    listItem: {
        height:27,
        marginLeft:20,
        justifyContent:'center',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        // marginTop: Platform.OS === "ios" ? -10 : -20,
    },
    slideTitleText: {
        fontSize: 18,
        color: "#0099ff",
        marginLeft: 10,
    },
    slideText: {
        fontSize: 16,
        color: "#555",
        marginLeft: 35,
    },
    iconImage: {
        width: 24,
        height: 25,
        resizeMode: "contain",
        justifyContent: 'flex-start',
    }

})

const mapStateToProps = (state) => {
    return {
        userData: state.reducers.userData
    };
};

const action = (data) => {
    return {
        type: 'data',
        payload: data
    };
};

export default connect(mapStateToProps, { action })(MenuSlider);
