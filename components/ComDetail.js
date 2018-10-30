import React from 'react';
import { StyleSheet, View, Text, TextInput, Clipboard, ScrollView} from 'react-native';
import { Button, Picker, CheckBox } from 'native-base';

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import Toast, { DURATION } from 'react-native-easy-toast'
import { Actions } from 'react-native-router-flux';
import * as actions from '../actions';
import update from 'immutability-helper'; // 2.6.5
import { connect } from 'react-redux';
import { numberWithCommas } from './Functions'

let arrFinal = [];
let comPaybackData =[];

class ComDetail extends React.Component {

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
                liveBeer2:0,
                etc:0,
            },
            payBackPrice:{
                esul:0,
                chum:0,
                soju:0,
                beer:0,
                liveBeer:0,
                liveBeer2:0,
                etc:0,
            },
            comPayBackSelect:{
                esul:'',
                chum:'',
                soju:'',
                beer:'',
                liveBeer:'',
                liveBeer2:'',
                etc:'',
            },
            etcMemo : null,
            priceMemo : null,
            payBackrequest : {
                ordno :  this.props.comData.ordNo,
                pb_amt : 0,
                pb_msg : '',
                pb_payload : 'null',
            },
            delComp : {
                ordno : this.props.comData.ordNo,
                pb_msg : '',
            },
            delStatus : 80,
            paybackData : this.props.paybackData,
            checkedHandler : {
                botl : this.props.botlArr ,
                case : this.props.caseArr
            }
        }
        // this.returnTopickerValue = this.returnTopickerValue.bind(this);
        this.returnToTextinput = this.returnToTextinput.bind(this);
    }

    componentWillMount(){


        fetch(`http://dnbs.joomok.net/deposits?ordno=${this.props.comData.ordNo}&dtype=`)
        .then((response) => response.json())
        .then((response)=>{
            comPaybackData = response.data.rs
            // console.log('받아오는 페이백 데이터',comPaybackData)
        })



        let date = this.props.date
        let index = this.props.index

        this.setState({ 
            delStatus: this.props.dateData[date][0].delList[index].status 
        })
    }

    sumPrice(){
       let sumPrice = this.state.payBackrequest.pb_amt + 
        this.state.payBackPrice.esul +
        this.state.payBackPrice.chum +
        this.state.payBackPrice.soju +
        this.state.payBackPrice.beer +
        this.state.payBackPrice.liveBeer +
        this.state.payBackPrice.liveBeer2 +
        Number(this.state.priceMemo)
        return sumPrice
    }

    changeCheckedHandler(index, type){

        let pb_amt = this.state.payBackrequest.pb_amt;
        let payback = this.props.paybackData;

        //체크 또는 체크 해제되는 항목이 용기(박스)일 경우
        if( type === 'case' ){

            let caseArr = this.props.paybackData.case;

            //해당 인덱스의 체크박스를 활성화 또는 비활성화  
            this.setState({
                checkedHandler : update( this.state.checkedHandler, { 
                    case: {[index]: {$set: !this.state.checkedHandler.case[index] } }
                })
            })

            //해당 인덱스의 체크박스가 비활성화 상태일때
            if( this.state.checkedHandler.case[index] == false ){

                //빈배열에 스트링세트 삽입.
                let arr = [];
                arr.push('CASE');
                for( let v in caseArr[index] ){
                    if( v !== 'name'  ){
                        arr.push(caseArr[index][v]) 
                    }
                }

                //완성 된 스트링세트를 arrFinal에 삽입.
                arrFinal.push(arr.join('|'));

                //요청시 보낼 데이터 만들기, 가격 더해주기, 완성된 배열 조인하여 넣어주기
                this.setState({
                    payBackrequest : update( this.state.payBackrequest, { 
                        pb_amt: {$set: pb_amt + payback.case[index].price } ,
                        pb_payload : {$set: arrFinal.join(',')} 
                    })
                });

            }else{
                let matchArr = 'CASE|'+caseArr[index].code+'|'+caseArr[index].qty+'|'+caseArr[index].price;
                arrFinal.splice(arrFinal.indexOf(matchArr), 1);

                this.setState({
                    payBackrequest : update( this.state.payBackrequest, { 
                        pb_amt: {$set: pb_amt - payback.case[index].price } ,
                        pb_payload : {$set: arrFinal.join(',')} 
                    })
                });
            }
        }
        //체크 또는 체크 해제되는 항목이 공병일 경우
        if( type === 'botl' ){

            let botlArr = this.props.paybackData.botl;

            //해당 인덱스의 체크박스를 활성화 또는 비활성화  
            this.setState({
                checkedHandler : update( this.state.checkedHandler, { 
                    botl: {[index]: {$set: !this.state.checkedHandler.botl[index] } }
                })
            });

            if( this.state.checkedHandler.botl[index] == false ){
                let arr = [];
                arr.push('BOTL');0

                for( let v in botlArr[index] ){
                    if( v !== 'name' ){
                        arr.push( botlArr[index][v] ) 
                    }
                }

                arrFinal.push(arr.join('|'));

                this.setState({
                    payBackrequest : update( this.state.payBackrequest, { 
                        pb_amt: {$set: pb_amt + payback.botl[index].price },
                        pb_payload : {$set: arrFinal.join(',')} 
                    })
                });

            }else{
            
                let matchArr = 'BOTL|'+botlArr[index].code+'|'+botlArr[index].qty+'|'+botlArr[index].price;
                arrFinal.splice(arrFinal.indexOf(matchArr), 1);

                this.setState({
                    payBackrequest : update( this.state.payBackrequest, { 
                        pb_amt: {$set: pb_amt - payback.botl[index].price },
                        pb_payload : {$set: arrFinal.join(',')}  
                    })
                });

            }
        }

        console.log('arrFinal',arrFinal)
    }

    mapToPaybackList = (data, type) => {
        return data.map((mapToPaybackList, i) => {
            return (
                <View style={{ flex:1, flexDirection:'row',}} key={i} >
                    <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}} key={i}>
                        {mapToPaybackList.name}
                    </Text>
                    <CheckBox 
                        checked={ type === 'case' ? this.state.checkedHandler.case[i] : this.state.checkedHandler.botl[i] } 
                        style={{marginTop:5}} 
                        onPress={()=> this.changeCheckedHandler(i,type) } 
                    />
                </View>
            )
        })
    }



    setClipboardContent = (msg) => {
        this.refs.toast.show('복사 되었습니다.')
        Clipboard.setString(msg);
    };

    onValueChange( type, value){
   
        switch (type) {
            case "esul":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            esul: value == 0 ? {$set:''} : { $set: 'CASE|'+1+'|'+value+'|'+comPaybackData[0].price },
                        }
                    ),
                    box: update(
                        this.state.box, {
                            esul: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            esul: { $set: comPaybackData[0].price * value},
                        }
                    ),
                })
                break;
            case "chum":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            chum: value == 0 ? {$set:''} : { $set: 'CASE|'+2+'|'+value+'|'+comPaybackData[1].price }
                        }
                    ),
                    box: update(
                        this.state.box, {
                            chum: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            chum: { $set: comPaybackData[1].price * value},
                        }
                    ),
                })
                break;
            case "soju":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            soju: value == 0 ? {$set:''} : { $set: 'BOTL|'+3+'|'+value+'|'+comPaybackData[2].price }
                        }
                    ),
                    emptyBottle: update(
                        this.state.emptyBottle, {
                            soju: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            soju: { $set: comPaybackData[2].price * value},
                        }
                    ),
                })
                break;
            case "beer":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            beer: value == 0 ? {$set:''} : { $set: 'BOTL|'+4+'|'+value+'|'+comPaybackData[3].price }
                        }
                    ),
                    emptyBottle: update(
                        this.state.emptyBottle, {
                            beer: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            beer: { $set: comPaybackData[3].price * value},
                        }
                    ),
                })
                break;
            case "liveBeer":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            liveBeer: value == 0 ? {$set:''} : { $set: 'BOTL|'+5+'|'+value+'|'+comPaybackData[4].price }
                        }
                    ),
                    emptyBottle: update(
                        this.state.emptyBottle, {
                            liveBeer: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            liveBeer: { $set: comPaybackData[4].price * value},
                        }
                    ),
                })
                break;
            case "liveBeer2":
                this.setState({
                    comPayBackSelect : update(
                        this.state.comPayBackSelect, {
                            liveBeer2: value == 0 ? {$set:''} : { $set: 'BOTL|'+6+'|'+value+'|'+comPaybackData[5].price }
                        }
                    ),
                    emptyBottle: update(
                        this.state.emptyBottle, {
                            liveBeer2: { $set: value }
                        }
                    ),
                    payBackPrice : update(
                        this.state.payBackPrice, {
                            liveBeer2: { $set: comPaybackData[5].price * value},
                        }
                    ),
                })
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
                return (<Picker.Item label={i+''} value={i+''} key={i} />);
            })}

            {/* <Picker.Item label={'1'} value={'1'} /> */}

        </Picker>
    }

    onChangeMemo = (text, type) => {
        if(  type == 'case'){
            this.setState({ etcMemo : text })
        }else{
            if( isNaN(parseInt(text))){
                return 
            }
            this.setState({ priceMemo : text })
        }
    }

    returnToTextinput (placeHolder, type) {
        return (
            <TextInput 
                allowFontScaling={false}
                placeholder={placeHolder}
                multiline={true} 
                onChangeText={ (text)=> this.onChangeMemo(text,type) } 
                underlineColorAndroid={"#fff"}
                style={[styles.textInput,{ flex: type === 'etc' ? 5 : 2, marginRight:type == 'price' ? 10 : 0 }]} 
            />
        )
    }

    clickToDelComButton(){

        let delComp = this.state.delComp
        fetch('http://dnbs.joomok.net/task/finish', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(delComp)
        })
        .then((response) => response.json())
        .then((responseData) => {
            
             //배송이 완료되면 데이터를 다시 받아와 리듀서에 적용
            fetch('http://dnbs.joomok.net/tasks')
            .then((response) => response.json())
            .then((response)=>{
                
            let dateData = response.data.rs
            this.props.dateDataUpdate(dateData);

            }).done(
                alert('배송이 완료되었습니다.')
            )

        })
        .catch((error) => {
            alert('서버접속실패 관리자에게 문의하세요')
        })
        .done(
            this.props.comData.status = 90
        );

    }   

    paybackRequest(){

        if( this.props.comData.payback.total < this.sumPrice() ){
            return alert('환불요청 금액은 가능금액을 초과할 수 없습니다.')
        }

        let comPayBackSelect = this.state.comPayBackSelect
        let arr = []
        for( let v in comPayBackSelect ){
            if( comPayBackSelect[v].length > 1 ){
                arr.push(comPayBackSelect[v])
            }
        }

        if( arr.length >= 1 ){
            arr = this.state.payBackrequest.pb_payload+','+arr.join(',')
        }else{
            arr = this.state.payBackrequest.pb_payload
        }

        
    
        fetch('http://dnbs.joomok.net/task/payback', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                ordno :  this.state.payBackrequest.ordno,
                pb_amt : this.state.payBackrequest.pb_amt,
                pb_msg : this.state.payBackrequest.pb_msg,
                pb_payload : arr,
            } )
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData)
        })
        .catch((error) => {
            alert('서버접속실패 관리자에게 문의하세요')
        })

    }

    render() {
        // console.log(this.props.comData)
        console.log('컴데이터',this.state);
        // console.log('병배열',this.props.botlArr)
        // console.log('페이백 데이터',this.props.paybackData)

        let date = this.props.date;
        let index = this.props.index;

        return (
            this.state.paybackData !== null ?
                <View style={{flex:1, backgroundColor: "#0099ff", }}>

                    <BackGroundImage />
                    <View>
                        <Head
                            title={'주문상세'}
                            openDrawer={this.props.openDrawer}
                            closeDrawerHome={this.props.closeDrawer}
                            beforePage={true}
                        />
                    </View>

                    <View style={{flex:1, backgroundColor: "#eee", paddingLeft:'2%', paddingRight:'2%',}}>


                        <View style={{height:50, width:'100%', alignItems:'center'}}>
                            <Text style={{flex:1, marginTop:10, fontSize:18,}}>{this.props.date}</Text>
                        </View>


                        <ScrollView 
                            style={{ width:'100%'}}
                        >
                            <View style={{ marginTop:5, backgroundColor:'#fff', borderWidth:0.3, borderColor:'#aaa', }}>
                                <View  style={{ flexDirection:'row',  borderBottomWidth:0.3, borderBottomColor:'#aaa',}}>

                                    <View style={{justifyContent:'center', paddingTop:5, paddingBottom:5,}}>  
                                        <View style={{flexDirection:'row',}}>
                                            <Text style={{marginLeft:10, fontSize:12,}}>{this.props.comData.store}</Text>
                                            <Text style={{marginLeft:10, fontSize:12, color:'#0099ff',}}>{this.props.dateData[date][0].delList[index].statusStr}</Text>
                                        </View>
                                        <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}}>{this.props.comData.prodStr}</Text>
                                    </View>


                                </View>  


                                <View style={{ alignItems:'center',  flexDirection:'row',  paddingTop:5, paddingBottom:5,}}>

                                    <Text style={{flex:4.5, marginLeft:10, fontSize:12,}}>{this.props.comData.road}</Text>

                                    <Button style={styles.addressButton}
                                        onPress={()=>Actions.MapLocation({
                                            comData : this.props.comData,
                                            pointXy : this.props.comData.pointXy
                                        })}
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


                            <View style={{ marginTop:5, paddingTop:5, paddingBottom:7, backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>
                                <View style={{justifyContent:'center', }}>
                                    <Text style={{marginLeft:10, marginTop:5, marginBottom:5, fontSize:14, }}>주문 환불</Text>
                                    <View>
                                        {
                                            this.props.comData.isPayback == false ? <Text style={{color:'#aaa', alignSelf:'center',}}>환불할 품목이 없습니다.</Text> :
                                            this.mapToPaybackList(this.state.paybackData.case,'case')
                                        }
                                    </View>
                                    <View>
                                        {
                                            this.props.comData.isPayback == false ? null :
                                            this.mapToPaybackList(this.state.paybackData.botl,'botl')
                                        }
                                    </View>
                                </View>
                            </View>




                            <View style={{ marginTop:5, backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>

                                <View style={{justifyContent:'center', }}>
                                
                                    <Text style={{marginLeft:10, marginTop:7, marginBottom:5, fontSize:14, }}>용기 보조금</Text>

                                    <View style={{ flex:1, flexDirection:'row',}}>
                                        { this.pickerObject('박스(2,000원)', this.state.box.esul,'esul') }
                                        { this.pickerObject('박스(2,500원)', this.state.box.chum,'chum') }
                                    </View>


                                    <Text style={{marginLeft:10, marginTop:10, fontSize:14,}}>공병 보조금</Text>

                                    <View style={{ flex:1, marginTop:5, flexDirection:'row', marginBottom:5,}}>
                                        { this.pickerObject('공병(소)',this.state.emptyBottle.soju,'soju') }
                                        { this.pickerObject('공병(대)',this.state.emptyBottle.beer,'beer') }
                                    </View>
                                    <View style={{ flex:1, marginTop:5, flexDirection:'row',}}>
                                        { this.pickerObject('생맥(25,000원)',this.state.emptyBottle.liveBeer,'liveBeer') }
                                        { this.pickerObject('생맥(30,000원)',this.state.emptyBottle.liveBeer2,'liveBeer2') }
                                    </View>
                                    
                                    <Text style={{marginLeft:10, marginTop:10, fontSize:14,}}>기타항목</Text>
                                    
                                    <View  style={{ flex:2, flexDirection:'row', borderBottomWidth:0.3, borderBottomColor:'#ddd',}}>
                                        { this.returnToTextinput(`기타용기, 공병의 상품명 및 수량 입력`, "etc") }
                                        { this.returnToTextinput(`금액 입력`, "price") }
                                    </View>

                                    <View  style={{ flex:2,}}>
                                        <Text style={{marginLeft:10, marginTop:10, fontSize:12,}}>합계금액(가능금액 : { numberWithCommas(parseInt(this.props.comData.payback.total))} ) : </Text>
                                        <Text style={{marginLeft:10, marginTop:10, fontSize:12, color: this.props.comData.payback.total < this.sumPrice()? 'red' : '#000'}}>
                                            { numberWithCommas(parseInt(this.sumPrice())) }{this.props.comData.payback.total < this.sumPrice() ? '원(요청금액이 가능금액보다 많습니다)' : '원' }
                                        </Text>
                                    </View>    
                                   
                                    <Button style={{height:30, marginTop:10, marginRight:10, marginBottom:10, 
                                        paddingLeft:10, paddingRight:10, alignSelf:'center', backgroundColor: this.props.comData.isPayback == false ? '#eee' : "#0099ff" ,}}
                                        onPress={
                                            this.props.comData.isPayback == false ? null :
                                            this.paybackRequest.bind(this)
                                        }
                                    >
                                        <Text style={{fontSize:12, color:'#fff',}}>환불요청</Text>
                                    </Button>

                                </View>
                            </View>



                            <View style={{ marginTop:5, paddingTop:10,  paddingBottom:10, justifyContent:'center', alignItems:'center', flexDirection:'row',  backgroundColor:'#fff', borderWidth:0.3, borderColor:'#ddd', }}>
                                <Text style={{ marginLeft:10, fontSize:12, color:'#555',}}>메시지</Text>
                                <TextInput 
                                    allowFontScaling={false}
                                    placeholder={'메시지를 입력'}
                                    multiline={true} 
                                    onChangeText={ 
                                        (text)=>{
                                            this.setState({
                                                payBackrequest : update(this.state.payBackrequest, { 
                                                    pb_msg : {$set:text}
                                                }),
                                                delComp : update(this.state.delComp, { 
                                                    pb_msg : {$set:text}
                                                })
                                            })
                                        }
                                    } 
                                    underlineColorAndroid={"#fff"}
                                    style={{
                                        paddingLeft:5,
                                        fontSize:12,
                                        height:30,
                                        flex:1,
                                        backgroundColor:"#fff", 
                                        marginLeft:10, 
                                        marginRight:10, 
                                        borderWidth:0.3,
                                        borderColor:'#aaa',
                                    }} 
                                />
                            </View>

                            <View style={{ marginBottom:20, marginTop:10, alignSelf:'center', }}>
                                <Button 
                                    style={{ width: 150, justifyContent:'center', backgroundColor:this.props.comData.status === 90 ? '#ddd' : '#0099ff', }}
                                    onPress={
                                        ()=> this.props.comData.status === 90 ? alert('이미 배송완료된 주문입니다.')
                                        : this.clickToDelComButton()
                                    }
                                >
                                    <Text style={{color:'white',}}>배송완료</Text>
                                </Button>
                            </View>  

                        </ScrollView>   

                    </View>

                    <Toast ref="toast" />    
                </View>
            : null                        
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
        width: 50, 
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
        height:30,
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
  

  const mapStateToProps = (state) => {
    return {
      dateData: state.reducers.dateData,
    };
  };


  const mapDispatchToProps = (dispatch) => {
    return {
      dateDataUpdate: (dateData) => dispatch(actions.dateDataUpdate(dateData)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ComDetail);