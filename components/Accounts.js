import React from 'react';
import { StyleSheet, View, Text, TextInput,Clipboard, ScrollView} from 'react-native';
import { Button } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast'

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import ComList from './listComponent/ComList';
import {comInfo} from './jsonData/jsonData.json';


export default class Accounts extends React.Component {

    constructor(props) {
        super(props);
        this.state={}
    }

    setClipboardContent = (msg) => {
        this.refs.toast.show('복사 되었습니다.')
        Clipboard.setString(msg);
    };

    mapToComInfo = (data) => {
        return data.map((comData, i) => {
            return (
                <ComList
                    setClipboardContent = {this.setClipboardContent.bind(this)}
                    comData={comData}
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
                    />
                </View>

                <View style={{flex:1, paddingLeft:5, paddingRight:5, paddingBottom:20, justifyContent:'center', backgroundColor:'#fff',}}>

                    {/* <View style={{flex:1, justifyContent:'center', alignItems:'center', }}>
                        <Text style={{fontSize:12,}}>거래처</Text>
                    </View> */}

                    <View style={{flex:10, marginTop:10}}>
                        <View style={{flex:1, flexDirection:'row', backgroundColor:"#0099ff",}}>
                            <View  style={{flex:1, justifyContent:'center', alignItems:'center', 
                                            borderRightWidth:0.3, borderColor:'#fff',}}>
                                <Text style={{color:'#fff', fontSize:12,}}>지역</Text>
                            </View>
                            <View  style={{flex:6, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'#fff', fontSize:12,}}>거래처정보</Text>
                            </View>
                        </View>
                        <View style={{flex:14}}>
                            {this.mapToComInfo(comInfo)}
                        </View>
                    </View>

                </View>
                <Toast ref="toast" />    
            </View>
        );
    }
}


// const styles = StyleSheet.create({})
  