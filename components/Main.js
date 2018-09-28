import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';
import {Text} from 'native-base';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { Actions } from 'react-native-router-flux';
import CartList from './listComponent/CartList';
import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import AndroidSwiper from './mainSwiper/androidSwiper'
import IosSwiper from './mainSwiper/iosSwiper'
import Toast, { DURATION } from 'react-native-easy-toast'
import call from 'react-native-phone-call'

let iosSlider;
let andSlider;
let newOrderListData = [];

let height = Dimensions.get('window').height;

const args = {
    number: '02-3280-9492',
    prompt: false
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert : false,
            isLoading: null,
            loading: true,
            dataSource: null,
            chartData: {
                Price: [0, 0, 0],
                term: [0, 0, 0],
            },
            iosSlider: null
        };
        this.mapToCartList = this.mapToCartList.bind(this);
        this.reOrderProduct = this.reOrderProduct.bind(this);
        this.numberWithCommas = this.numberWithCommas.bind(this);
        this.marinReorderDataUpdate = this.marinReorderDataUpdate.bind(this);
    }
    componentWillMount() {
        const that = this;
        if (this.props.drinkJsonData === null) {
            if (this.props.usridx) {
                this.setState({
                    isLoading: true
                })
                // 제이슨으로 상품 목록 데이터 받아오기
                //code 부분 수정해야함.
                return fetch('https://api.joomok.net/products?posit=list&usridx='+this.props.usridx+'&istart=0&ilimit=1000&')
                    .then((response) => response.json())
                    .then((drinkListJson) => {
                        this.setState({
                            isLoading: false,
                            dataSource: drinkListJson,
                        },function () {
                            this.props.drinkListUpdate(drinkListJson)
                        })

                        //월별 결제데이터 받아오기
                        fetch('https://api.joomok.net/statistics/monthly', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                usridx: this.props.usridx,
                                status: 90,
                                limit: 3,
                            })
                        })
                        .then((response) => response.json())
                        .then((responseData) => {

                            let arr = {
                                Price: [],
                                term: []
                            };
                            if( responseData.data ){
                                for (const i in responseData.data) {
                                    arr.Price.push(responseData.data[i].ord_sum)
                                    arr.term.push(responseData.data[i].mm)
                                }
                            }
                            iosSlider = <IosSwiper
                                chartData={arr}
                                cartListData={this.props.cartListData}
                                reOrderProduct={this.reOrderProduct}
                                numberWithCommas={this.numberWithCommas}
                                marinReorderDataUpdate = {this.marinReorderDataUpdate}
                            />

                            andSlider = <AndroidSwiper
                                chartData={arr}
                                cartListData={this.props.cartListData}
                                reOrderProduct={this.reOrderProduct}
                                numberWithCommas={this.numberWithCommas}
                                marinReorderDataUpdate = {this.marinReorderDataUpdate}
                            />

                            this.setState({
                                chartData: arr,
                            })

                        })
                        .catch((error) => {
                            console.log(error)
                        })
                        .done();
                    })
                    .catch((error) => {
                        alert('서버접속실패 관리자에게 문의하세요')
                        console.error(error);
                    });
            }
        }
    }

    componentDidMount() {
        if (this.props.loginMessage === "loginSucess") {
            this.props.loginMessage !== null && this.props.loginMessage !== "" ? this.refs.toast.show('로그인 되었습니다') : null
        }
    }

    reOrderProduct(data, title) {

        this.setState({
            isLoading : true
        })

        var cartArr = { 
            carts :[],
            usridx : this.props.usridx 
        };

        for( const idx in data){
            cartArr.carts.push({
                code: data[idx].idx,
                qty : data[idx].ord_qty,
                title : data[idx].pd_str
            })
        }
        const that = this;

        fetch('https://api.joomok.net/merchants/prices', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartArr)
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (title === '수정구매') {
                this.props.reOrderProductUpdate(cartArr.carts)
                Actions.Cart({
                    reOrderCartListData: cartArr.carts,
                    title: title
                })
            } else {
                Actions.BuyProduct({
                    cartListData: responseData.data,
                    mapToCartList: that.mapToCartList,
                    cartProductData: cartArr.carts,
                    reOrderTitle: title ? title : '재주문하기'
                })
            }
        })
        .catch((error) => {
            alert('서버접속실패 관리자에게 문의하세요')
        })
        .done(()=>
            this.setState({
                isLoading : false
            })
        );
    }

    mapToCartList = (data, bool) => {
        return data.map((cartListData, i) => {
            return (
                <CartList
                    modifyCartData={this.modifyCartData}
                    data={cartListData}
                    title={cartListData.title}
                    qty={cartListData.qty}
                    code={cartListData.code}
                    cartCounter={this.cartCounter}
                    allChecked={this.state.allChecked}
                    allCheckedHandler={this.allCheckedHandler}
                    cartListIdsave={this.cartListIdsave}
                    isVisibleItem={bool}
                    index={i}
                    key={i}
                />);
        })
    }

    //재주문 임시코드관련 메소드 끝 (실제데이터가 박히면 지우고 다시 진행)
    _renderItem({ item, index }) {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
        );
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    marinReorderDataUpdate(data){
        newOrderListData = data
    }
    

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#0099ff", }}>

                <BackGroundImage />
                <View style={{flex:1}}>
                    <Head
                        openDrawer={this.props.openDrawer}
                        closeDrawerHome={this.props.closeDrawer}
                    />
                </View>

                <View style={{ flex: height < 590 ? 3.5 : 4, }}>
                    {Platform.OS === "ios" ? iosSlider : andSlider}
                </View>

                <TouchableOpacity
                    style={{ flex: height < 590 ? 0.7 :  1, justifyContent: 'center', marginBottom: 15, }}
                    onPress={

                        () => {
                            Actions.OrderMain({
                                reOrderProduct : this.reOrderProduct,
                                newOrderListData : newOrderListData
                            })
                        }
                    }
                >
                    <View style={styles.orderButton}
                    >
                        <Text style={{ fontSize: 24, color: "#fff", fontWeight: "800", }}>
                            주문하기
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#fff", paddingTop: 15, }}>

                    <TouchableOpacity style={styles.customerButtom}
                        onPress={() => Actions.Notice({
                            usridx: this.props.usridx
                        })}
                    >
                        <Image
                            style={styles.imageStyle}
                            source={require('../assets/img/1.png')}
                        />
                        <Text style={styles.buttonTxt}>my알람</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.customerButtom}
                        onPress={() => this.reOrderProduct( newOrderListData, '수정구매')}
                    >
                        <Image
                            style={styles.imageStyle}
                            source={require('../assets/img/2.png')}
                        />
                        <Text style={styles.buttonTxt}>수정구매</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={
                            () => call(args).catch(console.error)
                        }
                        style={styles.customerButtom}
                    >
                        <Image
                            style={styles.imageStyle}
                            source={require('../assets/img/3.png')}
                        />
                        <Text style={styles.buttonTxt}>문의전화</Text>
                    </TouchableOpacity>


                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', }}>
                    <Text style={{ width: '90%', marginBottom: 10, color: '#555', textAlign: 'center', fontSize: 8, backgroundColor: '#fff', }}>
                        {`주)두몫은 통신판매중개자로서 거래당사자가 아니며 입점 판매자가 등록한 상품,
거래정보 및 거래에 대하여 (주)두몫은 일체의 책임을 지지 않습니다`}
                    </Text>
                </View>

                {
                    this.state.isLoading ?
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            style={{
                                width: "100%",
                                height: "100%", position: "absolute",
                                backgroundColor: "#fff", opacity: 0.5,
                            }}
                        />
                        :
                        null
                }
                <Toast ref="toast" />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    cardHeader: {
        fontSize: 18,
        textAlign: "center",
        color: "#444",
    },
    cardContentsText: {
        fontSize: 14,
    },
    customerButtom: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        marginRight: 3,
        backgroundColor: "#fff",
    },
    buttonTxt: {
        marginTop: 5,
        color: "#000",
        fontSize: 14,
    },
    orderButton: {
        width: "96%",
        height: Platform.OS === 'ios' ? height < 600 ? 50 :  80 : 60,
        marginTop: 10,
        marginLeft: "2%",
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 4,
        borderWidth: 3,
        borderColor: "#fff",
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
        justifyContent: "center",
        alignItems: "center",
    },
    imageStyle: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: 'flex-start',
        width: 60,
    }
});



const mapStateToProps = (state) => {
    return {
        state: state,
        cartListData: state.reducers.cartList,
        usridx: state.reducers.usridx,
        drinkJsonData: state.reducers.drinkJsonData,
        width : state.reducers.displayInfo.width,
        height : state.reducers.displayInfo.height,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        drinkListUpdate: (drinkListData) => dispatch(actions.drinkListUpdate(drinkListData)),
        reOrderProductUpdate : (cartListData) => dispatch( actions.reOrderProductUpdate(cartListData) )
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);