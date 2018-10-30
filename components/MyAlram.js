import React from 'react';
import { StyleSheet, View, Text, TextInput,Clipboard, ScrollView} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast'

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import AlramList from './listComponent/AlramList';
import {alramData} from './jsonData/jsonData.json';


export default class Myalram extends React.Component {

    constructor(props) {
        super(props);
        this.state={}
    }

    componentWillMount(){
        fetch('http://dnbs.joomok.net/alarms?word=&istart=0&ilimit=10', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData)
        })
    }

    setClipboardContent = (msg) => {
        this.refs.toast.show('복사 되었습니다.')
        Clipboard.setString(msg);
    };

    mapToAlramInfo = (data) => {
        return data.map((alramData, i) => {
            return (
                <AlramList
                    alramData={alramData}
                    key={i}
                    i={i}
                />);
        })
    }

    render() {

        return (

            <View style={{ flex: 1, backgroundColor: "#0099ff", }}>

                <BackGroundImage />
                <View>
                    <Head
                        openDrawer={this.props.openDrawer}
                        closeDrawerHome={this.props.closeDrawer}
                        beforePage={true}
                    />
                </View>

                <View style={{flex:1, paddingLeft:5, paddingRight:5, paddingBottom:20, justifyContent:'center', backgroundColor:'#fff',}}>

                    {/* <View style={{flex:1, justifyContent:'center', alignItems:'center', }}>
                        <Text style={{fontSize:12,}}>거래처</Text>
                    </View> */}

                    <View style={{flex:10, marginTop:10}}>
                        <View style={{flex:1, flexDirection:'row', backgroundColor:"#0099ff",}}>

                            <View  style={{flex:1.5, justifyContent:'center', alignItems:'center', borderRightWidth:0.3, borderColor:'#fff', }}>
                                <Text style={{color:'#fff', fontSize:12,}}>날짜</Text>
                            </View>
                            <View  style={{flex:1, justifyContent:'center', alignItems:'center', borderRightWidth:0.3, borderColor:'#fff',}}>
                                <Text style={{color:'#fff', fontSize:12,}}>종류</Text>
                            </View>
                            <View  style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:12,}}>제목</Text>
                            </View>
                        </View>

                        <View style={{flex:14}}>
                            {this.mapToAlramInfo(alramData)}
                        </View>

                    </View>

                </View>
                <Toast ref="toast" />    
            </View>
        );
    }
}


  