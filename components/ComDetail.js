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
            },
            etcMemo : null,
            priceMemo : null
        }
        this.returnTopickerValue = this.returnTopickerValue.bind(this);
        this.returnToTextinput = this.returnToTextinput.bind(this);
        // this.onValueChange = this.onValueChange.bind(this);
    }

    setClipboardContent = (msg) => {
        this.refs.toast.show('복사 되었습니다.')
        Clipboard.setString(msg);
    };

    onValueChange( type, value){
        switch (type) {
            case "esul":
                this.setState({box: update(this.state.box, {esul: { $set: value }})});
                break;
            case "chum":
                this.setState({box: update(this.state.box, { chum: { $set: value }})});
                break;
            case "soju":
                this.setState({emptyBottle: update(this.state.emptyBottle, {soju: { $set: value }})});
                break;
            case "beer":
                this.setState({emptyBottle: update(this.state.emptyBottle, {beer: { $set: value }})});
                break;
            case "liveBeer":
                this.setState({emptyBottle: update(this.state.emptyBottle, {liveBeer: { $set: value }})});
                break;
            case "etc":
                this.setState({emptyBottle: update(this.state.emptyBottle, {etc: { $set: value }})});
                break;
        }
    }

    pickerObject = ( title, stateName , type )=> {
        return (
            <View style={styles.pickerWrapStyle}>
                <Text style={{marginLeft:10, fontSize:12, color:'#999'}} >{title}</Text>
                {this.returnTopickerValue( stateName, type)}
            </View>
        )
    }

    returnTopickerValue(selectedValue, type){
        const items = []; 
        for(var i = 1 ; i < 32 ; i++ ){ items.push(i)}
        
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
            {items.map((items, i) => {
                return (<Picker.Item label={i} value={i} key={i} />);
            })}
        </Picker>
    }

    onChangeMemo = (text,type) => {
        type == 'etc' ? this.setState({ etcMemo : text }) : this.setState({ priceMemo : text })
    }

    returnToTextinput (placeHolder, type) {
        return (
            <TextInput 
                allowFontScaling={false}
                placeholder={placeHolder}
                multiline={true} 
                onChangeText={ (text)=> this.onChangeMemo(text,type) } 
                underlineColorAndroid={"#fff"}
                style={styles.textInput} 
            />
        )
    }

    render() {
        console.log( '프랍스 컴데이터', this.props.comData )
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
                                <Text style={{flex:1, marginTop:10, fontSize:18,}}>{this.props.comData.date}</Text>
                            </View>

                            <View style={{height:110, marginTop:5,  backgroundColor:'#fff', borderWidth:0.3, borderColor:'#aaa', }}>

                                <View  style={{ height:70,  flexDirection:'row',  borderBottomWidth:0.3, borderBottomColor:'#aaa',}}>

                                    <View style={{flex:3, justifyContent:'center', }}>  
                                        <Text style={{marginLeft:10, fontSize:12,}}>{this.props.comData.store}</Text>
                                        <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}}>{this.props.comData.prodStr}</Text>
                                    </View>

                                    <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>  
                                        <Text style={{marginLeft:10,}}>{this.props.comData.statusStr}</Text>
                                    </View>

                                </View>  


                                <View style={{ flex:1, alignItems:'center',  flexDirection:'row', }}>

                                    <Text style={{flex:4.5, marginLeft:10, fontSize:12,}}>{this.props.comData.road}</Text>

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
                                <Text style={{ marginLeft:10, fontSize:12, color:'#555',}}>메시지 : {this.props.comData.tranMsg}</Text>
                            </View>

                            <View style={{ height:320, marginTop:5, backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>

                                <View style={{ flex:1, justifyContent:'center', }}>
                                    <Text style={{marginLeft:10, marginTop:5, marginBottom:5, fontSize:14, }}>용기 보조금</Text>
                                    <View style={{ flex:1, flexDirection:'row',}}>
                                        { this.pickerObject('참이슬 박스',this.state.box.esul,'esul') }
                                        { this.pickerObject('처음처럼 박스',this.state.box.chum,'chum') }
                                    </View>
                                    <Text style={{marginLeft:10, fontSize:14,}}>공병 보조금</Text>
                                    <View style={{ flex:1, flexDirection:'row', marginBottom:5,}}>
                                        { this.pickerObject('소주 공병',this.state.emptyBottle.soju,'soju') }
                                        { this.pickerObject('맥주 공병',this.state.emptyBottle.beer,'beer') }
                                    </View>
                                    <View style={{ flex:1, flexDirection:'row',}}>
                                        { this.pickerObject('생맥주',this.state.emptyBottle.liveBeer,'liveBeer') }
                                        { this.pickerObject('기타생맥주',this.state.emptyBottle.etc,'etc') }
                                    </View>
                                    <Text style={{marginLeft:10,}}>기타</Text>
                                    <View  style={{ flex:2, flexDirection:'row', borderBottomWidth:0.3, borderBottomColor:'#ddd',}}>
                                        { this.returnToTextinput(`기타용기, 공병의 상품명 및 수량 입력`, "etc") }
                                        { this.returnToTextinput(`금액 입력`, "price") }
                                    </View>

                                    <Text style={{marginLeft:10, marginTop:10, fontSize:12,}}>합계금액(가능금액 : {this.props.comData.payback})</Text>
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
  