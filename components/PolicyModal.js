 
 import React, { Component } from 'react';
 import { Modal,View, ScrollView} from 'react-native';
 import {  Body,  Text, Button } from 'native-base';

 import Head from './Head';

 import {Actions} from 'react-native-router-flux';
 import {connect} from 'react-redux';
 import * as userInfo from './Terms'
 
 class PolicyModal extends Component {
    constructor(props) {
      super(props);

    }

    render() {
      return (
        <View>  
            <Modal
                presentationStyle="pageSheet"
                animationType="fade"
                transparent={false}
                visible={this.props.policyModal}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}
               
            >
            <Head
                backgroundColor={true}
            />  

            { 
                this.props.type ==1 ? 
                <ScrollView >
                    <Body scrollEnabled={true}>
                        <Text style={{marginLeft:5, marginTop:5, marginRight:5, marginBottom:5, }}>
                            {userInfo.Terms1}
                        </Text>
                        <Text style={{marginLeft:5, marginTop:5, marginRight:5, marginBottom:5, }}>
                            {userInfo.Terms2}
                        </Text>
                    </Body>
                </ScrollView>
                : 
                <ScrollView >
                    <Body scrollEnabled={true}>
                        <Text style={{marginLeft:5, marginTop:5, marginRight:5, marginBottom:5,}}>
                            {userInfo.Privacy}
                        </Text>
                    </Body>
                </ScrollView>
            }

            <View style={{ justifyContent:"center", alignItems:"center",marginTop:10, marginBottom:10, }}>
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

export default connect(null, {action})(PolicyModal);
 
