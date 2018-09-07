 
 import React, { Component } from 'react';
 import { StyleSheet, TouchableOpacity,Modal,View,TouchableHighlight , ScrollView} from 'react-native';
 import { Container, Content, Body, Title , Text, Button, Drawer, Switch,
        Header, Grid, Col, Row, List, ListItem,Icon } from 'native-base';

 import AdressModalList from './listComponent/AdressModalList'; 
 import Head from './Head';

 import {Actions} from 'react-native-router-flux';
 import {connect} from 'react-redux';

 
 class AddressModal extends Component {
    constructor(props) {
      super(props);

    }

    render() {
        const mapToAddressList = (data) => {
            return data.map((addressListData, i) => {
                return (
                    <AdressModalList 
                        jibun={addressListData.jibun}
                        roadbun={addressListData.roadbun}
                        zip={addressListData.zip}
                        selectAdress={this.props.selectAdress}
                        index = {i} 
                        key = {i}
                    />);
            })
        }

      return (
        <View>  
            <Modal
                presentationStyle="pageSheet"
                animationType="fade"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}
               
            >

            <Head
                backgroundColor={true}
            />  

            <View  style={{flex:8, marginTop:20,alignItems:"center", alignContent:"center",}}>
                <ScrollView 
                    showsHorizontalScrollIndicator={false}
                    directionalLockEnabled={true}
                >
                    {   
                        this.props.addressListData? mapToAddressList(this.props.addressListData) : null
                    }
                </ScrollView>
            </View>


             <View style={{ flex:1, justifyContent:"center", alignItems:"center",}}>

                <Button 
                    style={{width:"80%", marginLeft:"10%", justifyContent:"center",}}
                    onPress={
                        ()=> this.props.closeModal()
                    }      
                >
                    <Text>닫기</Text>
                </Button>

             </View>   


        </Modal>
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

export default connect(null, {action})(AddressModal);
 
