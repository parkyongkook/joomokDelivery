import React from 'react';
import { BackHandler, Alert } from 'react-native';
import { Drawer} from 'native-base';
import { Font, AppLoading } from "expo";

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { Scene, Actions, Router, ActionConst } from 'react-native-router-flux';

import Main from './components/Main';
import Login from './components/Login';
import MenuSlider from './components/MenuSlider';
import ComDetail from './components/ComDetail';
import MapLocation from './components/MapLocation';
import CalendarView from './components/Calendar';
import AgendarView from './components/AgendarView';
import Accounts from './components/Accounts';
import Myalram from './components/Myalram';

import _ from 'lodash';


const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const ReduxRouter = connect((state) => ({ state: state.route }))(Router);
const reducers = require('./reducers').default;

let drawerState = false;
let backButton = false;


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backButton : false,
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
        BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBack())
    }
    
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBack())
    }

    button() {
        Alert.alert(
            'Alert Title',
            'Alert message here...',
            [
                {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
                {text: 'YES', onPress: () => console.warn('YES Pressed')},
            ]
        );
    }

    handleAndroidBack = () =>{
       
        if( drawerState === true ){
            this.closeDrawer()
            return true
        }


        if( Actions.currentScene === 'SignUp_Information'){

            Alert.alert(
                '회원가입폼 화면을 나가시겠습니까?',
                '승인하시면 작성하던 내용은 모두 삭제되며 전단계로 뒤돌아갑니다.',
                [
                    {text: '거절', onPress: () => true },
                    {text: '승인', onPress: () =>  Actions.pop() },
                ]
            );
            
            return true
        }

        if( Actions.currentScene === 'OrderMain' && backButton === true ){
            Actions.OrderMain({ goOrdermain: true })
            backButton = false
            return true
        }

        if( Actions.currentScene === 'SIgnUp_Policy' ){
            Actions.pop()
            return true
        }
 
        if ( Actions.currentScene === 'Main' || Actions.currentScene === 'Login'  ) {
            BackHandler.exitApp ();
            return true
        }
        Actions.pop()
        return true
    }
    //안드로이드 하드웨어 백버튼 앱종료 방지 끝

    backButtonHandller(){
       backButton = true
    }

    resetOrderMainProps(){
        Actions.OrderMain({ goOrdermain: false })
    }

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
                    openDrawerOffset={0.3}
                    side={"right"}
                >
                    <ReduxRouter
                        backAndroidHandler = {this.handleAndroidBack}
                    >
                        <Scene key='root'
                            panHandlers={null}
                            type={ActionConst.RESET}
                        >
                            <Scene key='Main'
                                component={Main}
                                hideNavBar={true}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                            />
                            <Scene key='Login'
                                component={Login}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

                            <Scene key='ComDetail'
                                component={ComDetail}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

                            <Scene key='MapLocation'
                                component={MapLocation}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

                            <Scene key='CalendarView'
                                component={CalendarView}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

                            <Scene key='AgendarView'
                                component={AgendarView}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                                initial={true} 

                            />

                            <Scene key='Accounts'
                                component={Accounts}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

                            <Scene key='Myalram'
                                component={Myalram}
                                openDrawer={this.openDrawer}
                                closeDrawerHome={this.closeDrawer}
                                hideNavBar={true}
                            />

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
