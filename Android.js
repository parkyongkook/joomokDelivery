import React, { PureComponent } from 'react';
import { Platform, BackHandler, ToastAndroid } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import StackScenes from './scene/Scenes';

export default class extends PureComponent {

    constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'Main';
        this.lastBackButtonPress = null;
    }

    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();

        if (Platform.OS === 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.currentRouteName !== 'Main') {
                    return false;
                }

                if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
                    BackHandler.exitApp();
                    return true;
                }
                ToastAndroid.show('Something happened :)', ToastAndroid.SHORT);
                this.lastBackButtonPress = new Date().getTime();

                return true;
            });
        }
    }

    componentWillUnmount() {
        this.backButtonListener.remove();
    }

    render() {
        return (<StackScenes
            onNavigationStateChange={(prevState, currentState, action) => {
                this.currentRouteName = currentState.routes[currentState.index].routeName;
            }}
        />);
    }
}