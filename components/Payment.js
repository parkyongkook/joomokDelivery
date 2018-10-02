import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Dimensions, AsyncStorage, TextInput } from 'react-native';
import { Container, CheckBox, Content, Card, Item, Button, Text, Row, Col } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import PaymentModal from './PaymentModal';
import BackGroundImage from './util/backGroundImage';
import Head from './Head';
export const { width } = Dimensions.get('window');
import { WebBrowser } from 'expo';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

let htmlRender;

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          focusMemoInput : false,
          result: null,
          onChangeMemo : null,
          modalVisible: false, 
          deliveryCheckd: null,
          saveDeliveryInfo : false,
          FinalPriceData : this.props.FinalPriceData,  
          paymentButtonBlock : false
        };
        this.startPayment = this.startPayment.bind(this);
        this.renderHtmlMoadal= this.renderHtmlMoadal.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.onChangeMemo = this.onChangeMemo.bind(this);
        this.joinTopushData = this.joinTopushData.bind(this);
    }

    componentWillMount(){
        storage.load({
            key: 'delevery',
            autoSync: true,
            syncParams: {
                extraFetchOptions: {
                },
                someFlag: true,
            },
        }).then(ret => {
            this.setState({
                onChangeMemo : ret.memo,
                deliveryCheckd : ret.delay,
                saveDeliveryInfo : ret.saveDeliveryInfo
            }) 
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        })
    
    }

    joinTopushData(type){  
        let prodcuctData = this.props.cartProductData;
        if(prodcuctData.length < 2){
            if(type == 'title'){
                return this.props.midx+prodcuctData[0].title
            }
            if(type == 'code'){
                return prodcuctData[0].code
            }
            if(type == 'qty'){
                return prodcuctData[0].qty
            }
        }else{
            let arrData = [];
            for( const i in prodcuctData){
                if(type == 'title'){
                    arrData.push(this.props.midx+prodcuctData[i].title)
                }
                if(type == 'code'){
                    arrData.push(prodcuctData[i].code)
                }
                if(type == 'qty'){
                    arrData.push(prodcuctData[i].qty)
                }
            }
            return arrData.join('||')
        }
    }
    
    startPayment(paymentType){

        let formdata = new FormData();
        //체크박스 확인

        if( this.state.deliveryCheckd === null ){   
            this.setState({
                paymentButtonBlock : false
            })
            return alert("배송일을 선택해주세요")
        }

        //배송정보 저장
        if( this.state.saveDeliveryInfo){   
            storage.save({
                key: 'delevery',
                data: {
                    saveDeliveryInfo: this.state.saveDeliveryInfo,
                    delay: this.state.deliveryCheckd,
                    memo: this.state.onChangeMemo,
                },
                expires: null
            });
        }else{
            storage.remove({
                key: 'delevery',
                data: {
                    saveDeliveryInfo: null,
                    delay: null,
                    memo: null,
                },
                expires: null
            });
        }


        if(paymentType){
            
            fetch('https://api.joomok.net/purchases/paygate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( { usridx : this.props.userData.usridx } )
            })
            .then((response) => response.json())
            .then((responseData) => {
                var filnalPrice = this.props.FinalPriceData.finalTotalPrice.replace(/\,/g,'');
                var filnalVat = this.props.FinalPriceData.vat.replace(/\,/g,'');
                /*  기본필수정보 */
                formdata.append('allat_shop_id', 'doomok0130') //상점 아이디
                formdata.append('allat_amt', filnalPrice) //총 결제금액
                formdata.append('amt_vat', filnalVat) //부가세 

                formdata.append('allat_product_cd', this.joinTopushData('code') ) //상품코드
                formdata.append('allat_product_nm', this.joinTopushData('title') ) //상품명
                formdata.append('product_ea', this.joinTopushData('qty') ) //상품수량

                formdata.append('midx', this.props.midx ) // 도매상 사용자 index   
                formdata.append('sidx', this.props.userData.usridx ) // 소매상 사용자 index
                formdata.append('allat_buyer_nm',  this.props.userData.name ) //결제자 성명
                formdata.append('allat_recp_nm',  this.props.userData.store ) //수취인 성명
                formdata.append('allat_recp_addr', this.props.userData.address ) //수취인주소
                formdata.append('allat_pay_type', 'CARD') //결제방법 선택 - 카드인증, 카드인반, 기타결제(무통장,휴대폰,상품권)
                formdata.append('allat_email_addr', this.props.userData.email) // 이메일
                formdata.append('shop_receive_url', 'http://pay.joomok.net/paygate/procr') // 인증정보수신URL(shop_receive_url)

                //서버요청 후 받는 데이터
                formdata.append('allat_pmember_id', responseData.data.usrid) //아이디
                formdata.append('allat_order_no', responseData.data.ordcd) //주문번호
                formdata.append('allat_birth_ymd', responseData.data.birth ) //생년월일
                formdata.append('order_type', this.state.deliveryCheckd ) // 주문종류
                formdata.append('order_msg', this.state.onChangeMemo ) // 주문시 요청사항

                /* 카드 일반 결제 시  */
                // formdata.append('allat_card_no', '5433330550726514') // 카드 번호
                // formdata.append('allat_cardvalid_ym', '2109') // 카드 유효기간
                // formdata.append('allat_passwd_no', '59') // 카드 비밀번호
                // formdata.append('allat_business_type', '0') // 결제자 카드종류
                // formdata.append('allat_biz_no', '3084000454') // 사업자번호
                // formdata.append('allat_sell_mm', '02') // 00,0,01,1 : 일시불 (할부 사용시 2개월 이상으로 설정 )

                fetch('http://pay.joomok.net/paygate/required',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                }).then(response => { 

                    if( response.status !== 200 ){
                        console.log(response)
                        return alert('결제실패 잠시 후 다시 시도해 주십시오.')
                    }
                    return response.text() 

                }).then( async (text)=>{ 
                    JSON.stringify(text)
                    let url = JSON.parse(text)
                    let result = await WebBrowser.openBrowserAsync(url.data.url);
                    this.setState({ result });

                }).catch(err => {
                    console.log('-------------------------------------------------------')
                    console.log('에러1',err)
                    return alert('결제실패 잠시 후 다시 시도해 주십시오.')
                })  
            })
            .catch((error) => {
                console.log('에러2',error)
                return alert('결제실패 잠시 후 다시 시도해 주십시오.')
            })
            .done(()=>{
                    this.setState({ paymentButtonBlock : false })
                }
            );
        } 

    }

    setModalVisible(visible) {
        this.setState({ 
          modalVisible: visible
        });
    }

    renderHtmlMoadal(html){
        htmlRender = html
        this.setModalVisible(true);
    }


    onChangeMemo(txt){
        this.setState({
            onChangeMemo : txt
        })
    }

    render() {
        let that = this;
        return (
          <Container style={{backgroundColor:"#0099ff",}}>
            <BackGroundImage/>
            <Head 
                title={"결제하기"}
                openDrawer={this.props.openDrawer} 
                closeDrawerHome={this.props.closeDrawer} 
                beforePage = { ()=> Actions.Cart() }
            /> 
            <View style={{flex:1, backgroundColor:'#eee',}}>
                <Content style={{ flex:1, width:"94%", marginLeft:"3%", marginBottom:5, borderRadius:10,}}>
                    <Card style={{marginTop:20, backgroundColor:"#fff", }}>
                        <Col> 
                            <Row style={{ alignItems:"center", flexDirection:"column", marginTop:10, marginBottom:10, }}>

                                <View style={{ width:"92%", height:40,  flexDirection:"row", justifyContent:"space-between", 
                                                borderBottomWidth:1, borderBottomColor:'#aaa', marginBottom:10, marginTop:10,
                                            }}>
                                    <Text allowFontScaling={false} style={{fontSize:20,}}>최종결제금액</Text>
                                </View>
                                <View style={styles.detailText}>
                                    <Text allowFontScaling={false} style={{color:'#777',}}>공급가액</Text>
                                    <Text allowFontScaling={false} >{this.state.FinalPriceData.sales}원</Text>
                                </View>
                                <View style={styles.detailText}>
                                    <Text allowFontScaling={false} style={{color:'#777',}}>부가세액</Text>
                                    <Text allowFontScaling={false} >{this.state.FinalPriceData.vat}원</Text>
                                </View>
                                <View style={styles.detailText}>
                                    <Text allowFontScaling={false} style={{color:'#777',}}>소계</Text>
                                    <Text allowFontScaling={false} >{this.state.FinalPriceData.total}원</Text>
                                </View>
                                <View style={styles.detailText}>
                                    <Text allowFontScaling={false} style={{color:'#777',}}>비주류금액(공병)</Text>
                                    <Text allowFontScaling={false} >{this.state.FinalPriceData.bottle}원</Text>
                                </View>
                                <View style={styles.detailText}>
                                    <Text allowFontScaling={false} style={{color:'#777',}}>비주류금액(박스)</Text>
                                    <Text allowFontScaling={false} >{this.state.FinalPriceData.box}원</Text>
                                </View>

                                <View style={{
                                    width:"96%", 
                                    flexDirection:"row", 
                                    justifyContent:"space-between", 
                                    alignItems:'center',
                                    marginTop:10,
                                    height:50,
                                    backgroundColor:'#e1f2fe',
                                }}>
                                    <Text allowFontScaling={false} style={styles.paymentTxt}>최종결제금액</Text>
                                    <Text allowFontScaling={false} style={styles.paymentTxt}>{this.state.FinalPriceData.finalTotalPrice}원</Text>
                                </View>

                            </Row>
                        </Col> 
                    </Card>

                    <View style={{ 
                        height:30, marginTop:10, backgroundColor:'#eee', 
                        flexDirection:"row", justifyContent:"space-between", 
                    }}>

                        <View style={{flexDirection:"row",}}>
                            <TouchableOpacity
                               onPress={ ()=>{this.setState({deliveryCheckd: "0"})}}
                               style={{ flexDirection:'row', }}
                            >
                                <CheckBox 
                                    checked={ this.state.deliveryCheckd === "0" } 
                                    onPress={ ()=>{this.setState({deliveryCheckd: "0"})}}
                                    //체크박스 옵션
                                />
                                <Text allowFontScaling={false} style={{marginLeft:15, fontSize:14,}}>긴급(당일/익일)</Text>
                            </TouchableOpacity>    
                        </View>

                        <View  style={{flexDirection:"row",}}>
                            <TouchableOpacity
                               onPress={ ()=>{this.setState({deliveryCheckd: "3"})}}
                               style={{ flexDirection:'row', }}
                            >
                                <CheckBox 
                                    checked={ this.state.deliveryCheckd === "3" } 
                                    onPress={ ()=>{this.setState({deliveryCheckd: "3"})}}
                                    //체크박스 옵션
                                />
                                <Text allowFontScaling={false} style={{ marginLeft:15, fontSize:14,}}>3일이내</Text>
                            </TouchableOpacity>    
                        </View>

                        <View  style={{flexDirection:"row", marginRight:5,}}>
                            <TouchableOpacity
                               onPress={ ()=>{this.setState({deliveryCheckd: "5"})}}
                               style={{ flexDirection:'row', }}
                            >
                                <CheckBox 
                                    checked={ this.state.deliveryCheckd === "5" } 
                                    onPress={ ()=>{this.setState({deliveryCheckd: "5"})}}
                                    //체크박스 옵션
                                />
                                <Text allowFontScaling={false} style={{marginLeft:15,fontSize:14,}}>5일이내</Text>
                            </TouchableOpacity>    
                        </View>

                    </View>
                    <Item regular style={{marginTop:10, height:120, backgroundColor:'#fff',}}>
                        <TextInput 
                            allowFontScaling={false}
                            underlineColorAndroid={"#fff"}
                            placeholder='메모를 작성해 주세요'
                            multiline={true} 
                            style={{height:120, width:'100%',}} 
                            onChangeText={ this.onChangeMemo } 
                            value={this.state.onChangeMemo}
                            onBlur={()=> this.setState({focusMemoInput : false})}
                            onFocus={()=> this.setState({focusMemoInput : true})}
                            returnKeyType ={'done'}
                        />
                    </Item>

                    <View  style={{ flexDirection:"row", height:50, marginTop:10,  }}>
                        <TouchableOpacity
                             onPress={ ()=>{ this.setState({saveDeliveryInfo: !this.state.saveDeliveryInfo}) }
                            } 
                            style={{ flexDirection:'row', }}
                        >
                            <CheckBox 
                                checked={this.state.saveDeliveryInfo} 
                                onPress={ ()=>{ this.setState({saveDeliveryInfo: !this.state.saveDeliveryInfo}) }}
                                //체크박스 옵션
                            />
                            <Text 
                                allowFontScaling={false} 
                                style={{ 
                                marginLeft:15,
                                fontSize:14,
                            }}>
                                배송정보저장
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Content>

                <View style={{ 
                    width: Platform.ios? "94%" : '98%', 
                    marginLeft: Platform.ios? "3%" : '1%', 
                    marginTop:10, marginBottom:20, 
                    justifyContent:'center', 
                    display:this.state.focusMemoInput ? 'none' : null, 
                }}>

                    <View style={{  flexDirection:"row", justifyContent:"space-around",}}>
                        <Button
                            onPress={()=> {this.setState({paymentButtonBlock : true})
                                          that.startPayment("card")}}
                            style={styles.paymentButton}
                        >
                            <Text allowFontScaling={false} style={{color:'#0099ff', fontSize:16,}}>신용카드결제</Text>
                        </Button>
                    </View>

                </View>
            </View>
            {
                this.state.paymentButtonBlock ?  
                <TouchableOpacity>
                    <View
                        style={{
                            width:'100%',
                            height:2000,
                            position:'absolute',
                            backgroundColor:'rgba(0,0,0,0.5)',
                            bottom:0,
                        }}
                    /> 
                 </TouchableOpacity>    
                :
                null
            }
            <PaymentModal 
                modalVisible={this.state.modalVisible}
                setModalVisible={this.setModalVisible}
                htmlRender = {htmlRender}
            />
          </Container>
        );
    }ㅊuserBirth
}

const styles = StyleSheet.create({
    Chart:{
        width:"100%",
        height:15,
        marginTop:10,
        backgroundColor:"#ddd",
    },chartInnerPay:{
        width:"80%",
        height:15,
        backgroundColor:"yellow",
    },chartInnerDay:{
        width:"50%",
        height:15,
        backgroundColor:"skyblue",
    },BuyButton:{
        width:"48%",
        justifyContent:"center",
    },detailText:{
        marginLeft:10,
        marginRight:10,
        marginBottom:7,
        width:"92%", 
        flexDirection:"row", 
        justifyContent:"space-between", 
    },
    paymentButton:{
        flex:1, 
        height:80,
        marginLeft:5,
        marginRight:5,
        justifyContent:'center', 
        flexDirection:'column',
        backgroundColor:"rgba(0,0,0,0)",
        borderRadius: 4,
        borderWidth: 2,
        borderColor:"#0099ff",
    },
    paymentTxt:{
        marginTop:10,
        marginLeft:10, 
        color:"#0099ff", 
        fontSize:18, 
        fontWeight:"bold"
    }

  });

const mapStateToProps = (state) => {
    return {
        userData : state.reducers.userData
    }; 
};

export default connect(mapStateToProps, null)(Payment);