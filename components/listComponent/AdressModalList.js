 
 import React, { Component } from 'react';
 import { StyleSheet, TouchableOpacity,Modal,View } from 'react-native';
 import { Container, Content, Body, Title , Text, Button, Drawer, Switch,
        Header, Grid, Col, Row, List, ListItem,Icon } from 'native-base';
 import {Actions} from 'react-native-router-flux';
 import {connect} from 'react-redux';
 
 class AdressModalList extends Component {
    constructor(props) {
      super(props);
      this.state={
          addressListData : this.props.addressListData,
      }
    }

    render() {
      return (
        <View style={{ flex:1, }}>
            <TouchableOpacity onPress={()=>this.props.selectAdress(this.props.jibun,this.props.zip)} >
                <View style={{ flex:1, marginTop:5, borderBottomWidth:1, borderBottomColor:"#ddd", }}>
                    <Text style={{fontSize:12, margintop:10,}}>지번 : {this.props.jibun} </Text>
                    <Text style={{fontSize:12, marginTop:3,}}>신주소 : {this.props.roadbun} </Text>
                    <Text style={{fontSize:12, marginTop:3, marginBottom:5,}}>우편번호 : {this.props.zip} </Text>
                </View>
            </TouchableOpacity>
        </View>
      )
    }
 }
 
 const action = (data) => {
  return {
      type: 'data',
      payload: data
  };
};

export default connect(null, {action})(AdressModalList);
 
