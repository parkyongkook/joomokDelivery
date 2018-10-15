import React from 'react';
import { StyleSheet, View, Text, TextInput, Clipboard, ScrollView} from 'react-native';
import { Button, Picker } from 'native-base';

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import Toast, { DURATION } from 'react-native-easy-toast'
import { Actions } from 'react-native-router-flux';
import update from 'immutability-helper'; // 2.6.5

export default class ComDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            address:'경기도 분당시 서현동',
            box: {
                esul:0,
                chum:0,
            },
            emptyBottle: {
                soju:0,
                beer:0,
                liveBeer:0,
                etc:0,
            }
        }
        this.returnTopickerValue = this.returnTopickerValue.bind(this);
        // this.onValueChange = this.onValueChange.bind(this);
    }

    setClipboardContent = (msg) => {
        this.refs.toast.show('복사 되었습니다.')
        Clipboard.setString(msg);
    };

    onValueChange( type, value){
        if(type === 'esul'){
            this.setState({
                box: update(this.state.box, {
                    esul: { $set: value }
                })
            })
        }
        if(type === 'chum'){
            this.setState({
                box: update(this.state.box, {
                    chum: { $set: value }
                })
            })
        }
        if(type === 'soju'){
            this.setState({
                emptyBottle: update(this.state.emptyBottle, {
                    soju: { $set: value }
                })
            })
        }
        if(type === 'beer'){
            this.setState({
                emptyBottle: update(this.state.emptyBottle, {
                    beer: { $set: value }
                })
            })
        }
        if(type === 'liveBeer'){
            this.setState({
                emptyBottle: update(this.state.emptyBottle, {
                    liveBeer: { $set: value }
                })
            })
        }
        if(type === 'etc'){
            this.setState({
                emptyBottle: update(this.state.emptyBottle, {
                    etc: { $set: value }
                })
            })
        }
    }

    returnTopickerValue(selectedValue, type){
       console.log('selectedValue',selectedValue)
       return <Picker
            allowFontScaling={false} 
            mode="dropdown"
            placeholder="수량"
            placeholderStyle={styles.placeholderStyle}
            style={styles.pickerStyle}
            itemTextStyle={{fontSize: 12,}}
            textStyle={{fontSize: 12,}}
            selectedValue={selectedValue}
            onValueChange={this.onValueChange.bind(this, type)}
        >
            <Picker.Item label="수량" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
        </Picker>
    }

    render() {
        console.log(this.props.openDrawer)
        return (

                <View style={{ flex:1, backgroundColor: "#0099ff", }}>
                    <BackGroundImage />
                    <View>
                        <Head
                            title={'주문상세'}
                            openDrawer={this.props.openDrawer}
                            closeDrawerHome={this.props.closeDrawer}
                            beforePage={true}
                        />
                    </View>

                    <View style={{flex:1, backgroundColor: "#eee",  }}>

                        <ScrollView style={{ width:'100%', paddingLeft:'2%', paddingRight:'2%',}}>

                            <View style={{height:50, width:'100%', alignItems:'center'}}>
                                <Text style={{flex:1, marginTop:10, fontSize:18,}}>2018년 10월 3일</Text>
                            </View>

                            <View style={{height:110, marginTop:5,  backgroundColor:'#fff', borderWidth:0.3, borderColor:'#aaa', }}>

                                <View  style={{ height:70,  flexDirection:'row',  borderBottomWidth:0.3, borderBottomColor:'#aaa',}}>

                                    <View style={{flex:3, justifyContent:'center', }}>  
                                        <Text style={{marginLeft:10, fontSize:12,}}>쭈꾸미식당 노블레스 오블레쭈</Text>
                                        <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}}>뉴 참이슬 후레쉬(병)360 1box</Text>
                                    </View>

                                    <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>  
                                        <Text style={{marginLeft:10,}}>배송중</Text>
                                    </View>

                                </View>  


                                <View style={{ flex:1, alignItems:'center',  flexDirection:'row', }}>

                                    <Text style={{flex:4.5, marginLeft:10, fontSize:12,}}>{this.state.address}</Text>

                                    <Button style={styles.addressButton}
                                        onPress={()=>Actions.MapLocation()}
                                    >
                                        <Text style={{ fontSize:12, color:'#fff', }}>지도</Text>
                                    </Button>

                                    <Button 
                                        style={styles.addressButton}
                                        onPress={  ()=> this.setClipboardContent(this.state.address) }
                                    >
                                        <Text style={{ fontSize:12, color:'#fff', }}>복사</Text>
                                    </Button>

                                </View>

                            </View>                 

                            <View style={{ height:40, marginTop:5, justifyContent:'center',  backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>
                                <Text style={{ marginLeft:10, fontSize:12, color:'#555',}}>메시지 : 업장 현관 비밀번호는 1234 입니다.</Text>
                            </View>

                            <View style={{ height:320, marginTop:5, backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>

                                <View style={{ flex:1, justifyContent:'center', }}>
                                    <Text style={{marginLeft:10, marginTop:5, marginBottom:5, fontSize:14, }}>용기 보조금</Text>
                                    <View style={{ flex:1, flexDirection:'row',}}>
                                        <View style={styles.pickerWrapStyle}>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >참이슬 박스</Text>
                                            {this.returnTopickerValue( this.state.box.esul, 'esul')}
                                        </View>
                                        
                                        <View style={styles.pickerWrapStyle}>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >처음처럼 박스</Text>
                                            {this.returnTopickerValue( this.state.box.chum, 'chum')}
                                        </View>

                                    </View>

                                    <Text style={{marginLeft:10, fontSize:14,}}>공병 보조금</Text>

                                    <View style={{ flex:1, flexDirection:'row', marginBottom:5,}}>
                                        <View style={styles.pickerWrapStyle}>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >소주 공병</Text>
                                            {this.returnTopickerValue( this.state.emptyBottle.soju, 'soju')}
                                        </View>
                                        
                                        <View style={styles.pickerWrapStyle}>
                                        
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >맥주 공병</Text>
                                            {this.returnTopickerValue( this.state.emptyBottle.beer, 'beer')}
                                        </View>

                                    </View>

                                    <View style={{ flex:1, flexDirection:'row',}}>
                                        <View style={styles.pickerWrapStyle}>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >생맥주</Text>
                                            {this.returnTopickerValue( this.state.emptyBottle.liveBeer, 'liveBeer')}
                                        </View>
                                        
                                        <View style={styles.pickerWrapStyle}>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >기타생맥주</Text>
                                            {this.returnTopickerValue( this.state.emptyBottle.etc, 'etc')}
                                        </View>
                                    </View>



                                    <Text style={{marginLeft:10,}}>기타</Text>
                                    <View  style={{ flex:2, flexDirection:'row', borderBottomWidth:0.3, borderBottomColor:'#ddd',}}>
                                        <TextInput 
                                            allowFontScaling={false}
                                            placeholder={`기타용기, 공병의 상품명 및 수량 입력`}
                                            multiline={true} 
                                            onChangeText={ this.memoTextActivate } 
                                            underlineColorAndroid={"#fff"}
                                            style={styles.textInput} 
                                        />
                                        <TextInput 
                                            allowFontScaling={false}
                                            placeholder={`금액 입력`}
                                            multiline={true} 
                                            onChangeText={ this.memoTextActivate } 
                                            underlineColorAndroid={"#fff"}
                                            style={styles.textInput} 
                                        />
                                    </View>

                                    <Text style={{marginLeft:10, marginTop:10, fontSize:12,}}>합계금액(가능금액 : 5,500원)</Text>
                                    <Button style={{height:30, marginTop:10, marginRight:10, marginBottom:10, paddingLeft:10, paddingRight:10, alignSelf:'flex-end',}}>
                                        <Text style={{fontSize:12, color:'#fff',}}>환불요청</Text>
                                    </Button>
                                </View>

                            </View>

                            <View style={{ marginBottom:20, marginTop:10, alignSelf:'center', }}>
                                <Button style={{ width: 150, justifyContent:'center', }}>
                                    <Text style={{color:'white',}}>배송완료</Text>
                                </Button>
                            </View>  

                        </ScrollView>   

                    </View>
                    <Toast ref="toast" />    
                </View>
            

        );
    }
}


const styles = StyleSheet.create({
    pickerWrapStyle:{
        flex:1, 
        alignItems:'center', 
        flexDirection:'row',
        justifyContent:'space-between',
    },
    pickerStyle:{
        height: 26, 
        width: 65, 
        marginRight:10,
        backgroundColor: '#eee', 
        justifyContent:'center',
        paddingTop:0, 
        paddingBottom:0, 
        paddingLeft:0, 
        paddingRight:0
    },
    placeholderStyle : {
        color: "#999", 
        fontSize: 12, 
        paddingTop:0, 
        paddingBottom:0, 
        paddingLeft:0, 
        paddingRight:0
    },
    addressButton:{
        height:30, 
        marginRight:5, 
        flex:1, 
        alignSelf:'center', 
        justifyContent:'center', 
        alignItems:'center'
    },
    textInput:{
        fontSize:12,
        flex:2, 
        backgroundColor:"#fff", 
        marginTop:10,
        marginLeft:10, 
        marginBottom:20,
        paddingLeft:10,
        borderWidth:0.3,
        borderColor:'#aaa',
    }
  })
  