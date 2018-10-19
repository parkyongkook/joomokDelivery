import React, { Component } from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import SlidelList_delList from './listComponent/SlidelList_delList';
import BackGroundImage from './util/backGroundImage';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Head from './Head';
import {Icon} from 'native-base';
import {items} from './jsonData/jsonData.json';

const stanDardDate = "2018-10-19"
var dateArr = {};

LocaleConfig.locales['en'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
  dayNamesShort: ['월.','화.','수.','목.','금.','토.','일.']
};

LocaleConfig.defaultLocale = 'en';

class AgendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: items
    };
  }

  componentWillMount(){
    //로그인 완료 후 메인 진입시 업체 데이터 가져오기
    fetch('http://dnbs.joomok.net/tasks')
    .then((response) => response.json())
    .then((response)=>{
        
      let dateData = response.data.rs
      this.props.dateDataUpdate(dateData);

      //날자 데이터가 존재하는 경우 마킹을 할 빈객체 만들기.
      for(let k in dateData){
        dateArr[k] = {}
      }

      //배송완료 미완료에 따른 도트 색상값 변경옵션 
      const payBackNotComplete = {key:'vacation', color: '#000', selectedDotColor: '#000'};
      const payBackComplete = {key:'massage', color: 'orange', selectedDotColor: 'orange'};


      let count = 0;
      let paybackCount = 0;
      let isPayBack = 0;

      

      //만들어진 빈 객체 가공
      for(let dateKey in dateArr){
        for(let Key in dateData){
          if( dateKey == Key ){


              //2. 각 날짜의 배열안의 status값이 모두 true면 배송완료 마킹 색상을 넣어줌.
              function func(arr){
                let len = arr.length;

                //카운트값들 초기화
                count = 0;
                paybackCount = 0;
                isPayBack = 0;

                for(var i = 0 ; i < len ; i++ ){
                  //배송 완료여부
                  arr[i].status === 90 ? count = count+1 : null
                  //환불 금액이 있느지 여부
                  arr[i].payback !== 0 ? paybackCount = paybackCount+1 : null
                  //환불 완료 여부
                  arr[i].isPayback === true ? isPayBack = isPayBack+1 : null
                }

                //배송목록의 배송이 모두 완료면 
                if( count == arr.length ){
                  //배송 완료 환불 금액 있음.
                  if( paybackCount !== 0 ){
                    if( isPayBack == arr.length ){
                      //배송완료, 환불금액있고,  환불도 완료.
                      return "deliveryFinishHavePaybackTrue"
                    }else{
                      //배송완료, 환불금액있고,  환불 미완료.
                      return "deliveryFinishHavePaybackFalse"
                    }
                  }
                  //배송완료 환불금액 없음.
                  return "deliveryFinish"
                //배송 미완료  
                }else{
                  //배송미완료,  이전 날짜
                  if(stanDardDate.replace(/-/gi,"") > Key.replace(/-/gi,"")){
                    //배송미완료, 이전 날짜, 환불 금액 있음.
                    if( paybackCount !== 0 ){
                        return "deliveryNotHavePayTrueBeforeData"
                    }
                    //배송미완료, 이전 날짜, 환불 금액 없음.
                    return "deliveryNotTrueBeforeData"
                  }
                  // 배송미완료, 현재날짜 또는 미래날짜 , 환불 금액 있음.
                  if( paybackCount !== 0 ){
                    //배송미완료 환불 금액 있음.
                    return "deliveryNotFinishHavePaybackTrue"
                  }
                  //배송미완료, 현재날짜 또는 미래날짜, 환불 없음.
                  return "deliveryNotFinishHavePaybackfalse"
                }
              }

               /*  배송 완료  */
               //배송완료, 환불금액 없음
              if( func(dateData[Key][0].delList) == "deliveryFinish" ){
                dateArr[dateKey] = { selected:true, selectedColor: '#64c690' }
              }  

              //배송완료, 환불금액있고,  환불 미완료.
              if( func(dateData[Key][0].delList) == "deliveryFinishHavePaybackFalse" ){
                dateArr[dateKey] = { selected:true, selectedColor: '#64c690',  marked:true, dots: [payBackNotComplete] }
              }  

              //배송완료, 환불금액있고,  환불도 완료.
              if( func(dateData[Key][0].delList) == "deliveryFinishHavePaybackTrue" ){
                dateArr[dateKey] = { selected:true, selectedColor: '#64c690', marked:true, dots: [payBackComplete] }
              }  

              /*  배송 미완료  */
              //배송미완료 , 이전날짜  환불금액 없음.
              if( func(dateData[Key][0].delList) == "deliveryNotTrueBeforeData" ){
                dateArr[dateKey] = { selected:true, selectedColor: 'red'}
              }  

              //배송미완료 , 이전날짜  환불금액 있음.
              if( func(dateData[Key][0].delList) == "deliveryNotHavePayTrueBeforeData" ){
                dateArr[dateKey] = { selected:true, selectedColor: 'red', marked:true,  dots: [payBackNotComplete]}
              }  

              //배송미완료 환불금액 없음.
              if( func(dateData[Key][0].delList) == "deliveryNotFinishHavePaybackfalse" ){
                dateArr[dateKey] = { selected:true, selectedColor: '#4eaae5'}
              }  

              // 배송미완료 환불금액 있음.
              if( func(dateData[Key][0].delList) == "deliveryNotFinishHavePaybackTrue" ){
                dateArr[dateKey] = { selected:true, selectedColor: '#4eaae5', marked:true, dots: [payBackNotComplete] }
              }  


          }
        }
      }


    })  
  }

  mapToSlidelList_delList = (data) => {
      return data.map((comData, i) => {
          return (
              <SlidelList_delList
                  comData={comData}
                  key={i}
                  i={i}
              />);
      })
  }


  mapToProductList = (data) => {
    let arr = data.split(",")
    return arr.map((productData, i) => {
        return (
          <View key={i}> 
            <Text style={{fontSize:12, color:'#777',}} key={i}>{productData} </Text>
          </View>

        )
    })
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text style={{fontSize:12, color:'#999',}}>배송정보가 존재하지 않습니다.</Text></View>
    );
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
        <Agenda
        items={this.props.dateData}
        selected={'2018-10-18'}
        minDate={'2018-10-17'}
        maxDate={'2018-10-19'}
        renderItem={ (item )=> this.renderItem( item) }
        // 어젠다 슬라이드 버튼
        renderKnob={() => {return (
            <View style={{width:50, height:20, justifyContent:'center', alignItems:'center', backgroundColor:'#0099ff', borderRadius:7, }}>
                <Icon style={{color:'#fff', fontWeight:'bold', marginTop:-5,}} type="FontAwesome" name="angle-down" />
            </View>    
            );
        }}
        renderEmptyDate = {this.renderEmptyDate.bind(this)}
        renderEmptyData = {this.renderEmptyDate.bind(this)}
        rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
        markingType={'multi-dot'}
        onRefresh={() => console.log('refreshing...')}
        refreshing={false}
        refreshControl={null}
        pastScrollRange={50}
        futureScrollRange={50}
        markedDates={dateArr}
        theme={{
        //   agendaDayTextColor: 'yellow',
        //   agendaDayNumColor: 'green',
        //   agendaTodayColor: 'red',
        //   agendaKnobColor: 'blue'
        }}
      />
    </View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
        <View style={{ marginTop:20, marginRight:10, paddingBottom:10, paddingTop:10, backgroundColor:'#fff',}}>

            <View style={{  justifyContent: 'center',alignItems: 'center',}}>

                <View style={{ width:'100%', alignItems:'center'}}>

                    <View  style={styles.delInfo}>
                        <View style={{ justifyContent:'center',}}>  
                            <Text style={styles.textStyle}>배달건수:{item.delData.delCount}</Text>
                        </View>

                        <View style={{justifyContent:'center',}}>
                            <Text style={styles.textStyle}>완료건수:{item.delData.compCount}</Text>
                        </View>
                    </View>

                    <View  style={{  
                        width:'96%',
                        borderWidth:0.3, 
                        borderColor:'#999', 
                        paddingLeft:10,
                        paddingTop:5,
                        paddingBottom:5
                    }}>
                        { this.mapToProductList(item.delData.product)}
                    </View>

                </View>

                <View style={{marginTop:20, alignItems:'center',}}>

                    <Text style={{marginLeft:15, alignSelf:'flex-start', color:'#777',}}>배송목록</Text>

                    { this.mapToSlidelList_delList(item.delList)}

                </View>

            </View>

        </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    marginTop:20,
    justifyContent:'center',
  },
  delInfo:{
    width:'96%', 
    paddingTop:5,
    paddingBottom:5,
    flexDirection:'row', 
    borderWidth:0.3, 
    borderColor:'#999', 
  },
  textStyle:{
    marginLeft:10, fontSize:12, color:'#777',
  }
});


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


export default connect(mapStateToProps, mapDispatchToProps)(AgendarView);

