import React from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { Drawer} from 'native-base';
import { Font, AppLoading } from "expo";

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { Scene, Actions, Router, statusBarStyle, ActionConst } from 'react-native-router-flux';

import Main from './components/Main';
import Login from './components/Login';
import OrderMain from './components/OrderMain';
import Cart from './components/Cart';
import BuyProduct from './components/BuyProduct';
import Payment from './components/Payment';
import SignUp_Authentication from './components/SignUp_Authentication';
import SignUp_Information from './components/SignUp_Information';
import * as firebase from 'firebase';

import SendPushNotification from './components/SendPushNotification';
import MenuSlider from './components/MenuSlider';
import SIgnUp_Policy from './components/SIgnUp_Policy';
import OrderSelect from './components/OrderSelect';
import Notice from './components/Notice';
import Customer from './components/Customer';
import Faq from './components/Faq';
import PaymentList from './components/PaymentList';
import MyWeb from './components/MyWeb';
import ChengeMyInfo from './components/ChengeMyInfo';
import ChangePassword from './components/ChangePassword';


import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};




// import MapLocation from './components/MapLocation';
// import PaymentFinal from './components/PaymentFinal';
// import CameraExample from './components/CameraExample';

const ReduxRouter = connect((state) => ({ state: state.route }))(Router);
const reducers = require('./reducers').default;

let drawerState = false


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false
          };
    }
    
    async componentWillMount() {
        await Font.loadAsync({
          'Roboto_medium': require('./assets/fonts/Roboto_medium.ttf'),
        });
        this.setState({ isReady: true });
      }

    closeDrawer = () => {
        this.drawer._root.close();
        drawerState = false
    };
    
    openDrawer = () => {
        this.drawer._root.open();
        drawerState = true
    };

    //안드로이드 하드웨어 백버튼 앱종료 방지 시작
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack)
    }
    
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack)
    }
    
    handleAndroidBack = () =>{
        if( drawerState === true ){
            this.closeDrawer()
            return true
        }

        if(Actions.currentScene === 'SIgnUp_Policy'){
            Actions.pop()
            return true
        }
 
        if ( Actions.currentScene === 'Main' || Actions.currentScene === 'Login'  ) {
            BackHandler.exitApp ();
            return true
            // return Alert.alert(
            //     '홈화면으로 이동 하시겠습니까?',
            //     '이동을 원하시면 확인을 아니면 취소를 눌러주세요',
            //     [
            //       { text: '취소', onPress: () => {
            //             Actions.Main()
            //         } },
            //       { text: '확인', onPress: () => {
            //             BackHandler.exitApp ();
            //             Actions.reset('Login');
            //         } },
            //     ],
            //     { cancelable: false }
            // ) 
        }
        Actions.pop()
        return true
    }
    //안드로이드 하드웨어 백버튼 앱종료 방지 끝

    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }

        return (
            <Provider store={createStore(reducers, {})}>
                <Drawer
                    ref={(ref) => { this.drawer = ref; }}
                    content={ <MenuSlider navigator={this.navigator} 
                    closeDrawer={this.closeDrawer} 
                    />}
                    onClose={() => this.closeDrawer()}
                    panHandlers={null}
                    openDrawerOffset={0.2}
                    side={"right"}
                >
                    <ReduxRouter
                        backAndroidHandler = {this.handleAndroidBack}
                    >
                        <Scene key='root'
                            panHandlers={null}
                            type={ActionConst.RESET}
                        >
                            <Scene key='MyWeb'
                                component={MyWeb}
                                hideNavBar={true}
                            />
                            <Scene key='Main'
                                component={Main}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='Login'
                                closeDrawerHome={this.closeDrawer}
                                component={Login}
                                hideNavBar={true}
                                initial={true}
                            />
                            <Scene key='OrderMain'
                                component={OrderMain}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='Cart'
                                component={Cart}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='SIgnUp_Policy'
                                component={SIgnUp_Policy}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='SignUp_Authentication'
                                component={SignUp_Authentication}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='SignUp_Information'
                                component={SignUp_Information}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='OrderSelect'
                                component={OrderSelect}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='BuyProduct'
                                component={BuyProduct}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='Payment'
                                component={Payment}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='PaymentList' 
                                component={PaymentList}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                            />
                            <Scene key='Notice' 
                                component={Notice}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                            />
                            <Scene key='ChengeMyInfo'
                                component={ChengeMyInfo}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='ChangePassword'
                                component={ChangePassword}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='Faq' 
                                component={Faq}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                            />
                            <Scene key='Customer' 
                                component={Customer}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                            />
                            <Scene key='SendPushNotification'
                                component={SendPushNotification}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                                closeDrawerHome={this.closeDrawer}
                            />
                        {/* 
                            <Scene key='MapLocation' 
                                component={MapLocation}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='PaymentFinal' 
                                component={PaymentFinal}
                                hideNavBar={true}
                                openDrawer={this.openDrawer} 
                            /> 
                            <Scene key='CameraExample'
                                component={CameraExample}
                                hideNavBar={true}
                            />

                        */}

                        </Scene>
                    </ReduxRouter>
                </Drawer>
            </Provider>
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
}