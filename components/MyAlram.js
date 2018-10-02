import React, { Component } from 'react';
import { Container, Content, Text} from 'native-base';
import {Actions} from 'react-native-router-flux';

import { View, StyleSheet } from 'react-native';

import Notice_list from './listComponent/Notice_list';
import BackGroundImage from './util/backGroundImage';
import Head from './Head';

export default class MyAlram extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        noticeBoardData : null 
    };
  }
  
componentWillMount(){
    // 제이슨으로 상품 목록 데이터 받아오기
    return fetch('https://api.joomok.net/boards/push?usridx='+this.props.usridx+'&key=title&word=두몫&istart=0&ilimit=10')
    .then((response) => response.json())
    .then((noticeBoardData) => {
        this.setState({
            noticeBoardData: 
            noticeBoardData.data.map((noticeData, i) => {
                return (
                <Notice_list
                    noticeData={noticeData}
                    index={i}
                    key={i}
                />);
            }),
        })
    })
    .catch((error) =>{
        console.error(error);
    });
};

render() {
    return (
      <Container style={{backgroundColor:'#0099ff',}}>

        <BackGroundImage/>

        <Head 
            title={"My알람"}
            openDrawer={this.props.openDrawer} 
            closeDrawerHome={this.props.closeDrawer} 
            beforePage = { ()=> Actions.Main() }
        />

        <View style={{flex:1, backgroundColor:'#eee',}}>
            <View style={{
                flex:1,
                width:'90%',
                marginTop:40,
                marginBottom:20,
                marginLeft:'5%',
            }}>
                <Content>
                    <View style={{
                        flexDirection:"row",
                        paddingTop:10,
                        }}>
                        <View style={[{flex:1 },styles.noticeFormTitle]}><Text allowFontScaling={false} style={{color:"#fff", fontSize:16 }}>메시지</Text></View>
                        {/* <View style={[{flex:2 },styles.noticeFormTitle]}><Text style={{color:"#fff", fontSize:16 }}>종류</Text></View>
                        <View style={[{flex:6 },styles.noticeFormTitle]}><Text style={{color:"#fff", fontSize:16 }}>제목</Text></View> */}
                    </View>
                    { this.state.noticeBoardData }
                </Content>
            </View>
        </View>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
    noticeFormTitle:{
        backgroundColor: "#999",
        paddingBottom: 10, 
        paddingTop: 10,  
        alignItems: "center",
    },
});



