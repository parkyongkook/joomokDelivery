
// import React, { Component } from 'react';
// import { WebView, View, Linking, StyleSheet } from 'react-native';

// import Head from './Head';
// import BackGroundImage from './util/backGroundImage';
// import { Actions } from 'react-native-router-flux';
// import { Constants, WebBrowser } from 'expo';

// let result;

// export default class MyWeb extends Component {
//   state = {
//     result: null,
//   };

//   render() {

//     return (        
//         <View style={{ flex: 1, backgroundColor: "#0099ff", }}>
//             <BackGroundImage />
//             <Head
//                 openDrawer={this.props.openDrawer}
//                 closeDrawerHome={this.props.closeDrawer}
//                 beforePage={() => Actions.OrderMain()}
//             />
//             <WebView
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 key={this.state.key}
//                 source={{ uri: this.props.url }}
//                 onNavigationStateChange={this.setWebViewUrlChanged}
//             />
//         </View>
//     );
//   }

//   _handlePressButtonAsync = async () => {
//     let result = await WebBrowser.openBrowserAsync('https://expo.io');
//     this.setState({ result });
//   };

// }


import React, { Component } from 'react';
import { WebView, View, Linking, StyleSheet } from 'react-native';

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import { Actions } from 'react-native-router-flux';
import { WebBrowser } from 'expo';

export default class MyWeb extends Component {

    state = {
        result: null,
        key: 1,
        isWebViewUrlChanged: false
    };

    async componentWillMount() {
        if(this.props.card === "card" || this.props.version){
            let result = await WebBrowser.openBrowserAsync(url.data.url);
            this.setState({ result }); 
        } 
        // ? Linking.openURL(this.props.url) : null


    }

    resetWebViewToInitialUrl = () => {
        if (this.state.isWebViewUrlChanged) {
            this.setState({
                key: this.state.key + 1,
                isWebViewUrlChanged: false
            });
        }
    };

    setWebViewUrlChanged = webviewState => {

        if( webviewState.title.length !== 0 ){

            if( webviewState.title.length === 23 ){
                fetch("http://pay.joomok.net/certify/result/"+webviewState.title, {
                    headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if( responseData.code === 200 ){
                                Actions.SignUp_Information({
                                    userName : responseData.data.name,
                                    userBirth : responseData.data.birthdate,
                                    mobile : responseData.data.mobileno
                                })
                            }
                        })
                        .catch((error) => {
                            Actions.SIgnUp_Policy();
                            return alert('실명인증실패');
                        })
                .done();
            }

            if (webviewState.title === 'Finish') {
                Actions.Main();
            }
        }
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#0099ff", }}>
                <BackGroundImage />
                <Head
                    openDrawer={this.props.openDrawer}
                    closeDrawerHome={this.props.closeDrawer}
                    beforePage={() => Actions.OrderMain()}
                />
                <WebView
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    key={this.state.key}
                    source={{ uri: this.props.url }}
                    onNavigationStateChange={this.setWebViewUrlChanged}
                />
            </View>
        );
    }
}

