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

var dateArr = [];

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
    .then((dateData)=>{
      let v = dateData.data.rs

      //키이름으로 내려주는 날짜명을 delist 안에다가 삽입
      for(let k in v){
        let delList = v[k][0].delList;
        for(let i in delList){
          delList[i].date = k 
        }
      }
      this.props.dateDataUpdate(v);
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
        // loadItemsForMonth={this.loadItems.bind(this)}
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

        onRefresh={() => console.log('refreshing...')}
        refreshing={false}
        refreshControl={null}

        // renderEmptyDate={this.renderEmptyDate.bind(this)}
        // rowHasChanged={this.rowHasChanged.bind(this)}
        // items={this.state.items}
        // loadItemsForMonth={(month) => {console.log('trigger items loading')}}
        // onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
        // onDayPress={(day)=>{console.log('day pressed')}}
        // onDayChange={(day)=>{console.log('day changed')}}
        // selected={'2017-05-22'}
        // minDate={'2017-05-10'}
        // maxDate={'2017-06-30'}
        pastScrollRange={50}
        futureScrollRange={50}
        // renderItem={this.renderItem.bind(this)}
        // renderEmptyDate={this.renderEmptyDate.bind(this)}
       

        // hideKnob={false}

        //배송이 안되었을경우 빨간색으로 셀렉트 한다.
        markedDates={{
          '2017-05-22': { selected: true, marked: true, selectedColor: 'red' },
          '2017-05-23': { marked: true },
          '2017-05-24': { disabled: true }
        }}

        theme={{
        //   agendaDayTextColor: 'yellow',
        //   agendaDayNumColor: 'green',
        //   agendaTodayColor: 'red',
        //   agendaKnobColor: 'blue'
        }}
        // style={{backgroundColor:'#000',}}
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
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
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

