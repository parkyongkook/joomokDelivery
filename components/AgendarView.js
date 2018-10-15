// import React from 'react';
// import { Text, View, StyleSheet,TouchableOpacity} from 'react-native';
// import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
// import update from 'immutability-helper'; // 2.6.5
// import * as actions from '../actions';

// import BackGroundImage from './util/backGroundImage';
// import Head from './Head';


// LocaleConfig.locales['en'] = {
//   monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
//   monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
//   dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
//   dayNamesShort: ['월.','화.','수.','목.','금.','토.','일.']
// };

// LocaleConfig.defaultLocale = 'en';

// export default class AgendarView extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//         items: {}
//       };

//   };

//   render() {
//     return (
//         <Agenda
//         items={this.state.items}
//         loadItemsForMonth={this.loadItems.bind(this)}
//         selected={'2017-05-16'}
//         renderItem={this.renderItem.bind(this)}
//         renderEmptyDate={this.renderEmptyDate.bind(this)}
//         rowHasChanged={this.rowHasChanged.bind(this)}
//       />
//     );
//   }
//   loadItems(day) {
//     setTimeout(() => {
//       for (let i = -15; i < 85; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = this.timeToString(time);
//         if (!this.state.items[strTime]) {
//           this.state.items[strTime] = [];
//           const numItems = Math.floor(Math.random() * 5);
//           for (let j = 0; j < numItems; j++) {
//             this.state.items[strTime].push({
//               name: 'Item for ' + strTime,
//               height: Math.max(50, Math.floor(Math.random() * 150))
//             });
//           }
//         }
//       }
//       //console.log(this.state.items);
//       const newItems = {};
//       Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
//       this.setState({
//         items: newItems
//       });
//     }, 1000);
//     // console.log(`Load Items for ${day.year}-${day.month}`);
//   }

//   renderItem(item) {
//     return (
//       <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
//     );
//   }

//   renderEmptyDate() {
//     return (
//       <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
//     );
//   }

//   rowHasChanged(r1, r2) {
//     return r1.name !== r2.name;
//   }

//   timeToString(time) {
//     const date = new Date(time);
//     return date.toISOString().split('T')[0];
//   }
// }

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17
//   },
//   emptyDate: {
//     height: 15,
//     flex:1,
//     paddingTop: 30
//   }
// });







import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {Agenda, LocaleConfig} from 'react-native-calendars';
import SlidelList_delList from './listComponent/SlidelList_delList';
import BackGroundImage from './util/backGroundImage';
import Head from './Head';
import {Icon} from 'native-base';

import {items} from './jsonData/jsonData.json';


LocaleConfig.locales['en'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
  dayNamesShort: ['월.','화.','수.','목.','금.','토.','일.']
};

LocaleConfig.defaultLocale = 'en';

export default class AgendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: items
    };
  }


    mapToSlidelList_delList = (data ) => {
        return data.map((comData, i) => {
            return (
                <SlidelList_delList
                    comData={comData}
                    key={i}
                    i={i}
                />);
        })
    }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text style={{fontSize:12, color:'#999',}}>배송정보가 존재하지 않습니다.</Text></View>
    );
  }

  render() {
      console.log('아이템들',items)
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
        items={this.state.items}
        // loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-05-24'}
        minDate={'2017-05-10'}
        maxDate={'2017-06-30'}
        renderItem={this.renderItem.bind(this)}
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
          '2017-05-24': {disabled: true}
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
    console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
        <View style={{ marginTop:20, marginRight:10, paddingBottom:10, paddingTop:10, backgroundColor:'#fff',}}>

            <View style={{ flex: 1, justifyContent: 'center',alignItems: 'center',}}>

                <View style={{flex:3, width:'100%', alignItems:'center'}}>

                    <View  style={styles.delInfo}>

                        <View style={{flex:1, justifyContent:'center',}}>  
                            <Text style={styles.textStyle}>배달건수:{item.delData.delCount}</Text>
                        </View>

                        <View style={{flex:1, justifyContent:'center',}}>
                            <Text style={styles.textStyle}>완료건수:{item.delData.compData}</Text>
                        </View>

                    </View>
                    
                    <View  style={[styles.delInfo,{marginTop:5,}]}>
                        <View style={{flex:1, justifyContent:'center',}}>  
                            <Text style={styles.textStyle}>{item.delData.product}</Text>
                        </View>
                    </View>
                </View>

                <View style={{flex:7, marginTop:20, alignItems:'center',}}>
                    <Text style={{marginLeft:15, alignSelf:'flex-start', color:'#777',}}>배송목록</Text>
                    {this.mapToSlidelList_delList(item.delList)}
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
    height:30, width:'96%', flexDirection:'row', 
    borderWidth:0.3, borderColor:'#999', 
  },
  textStyle:{
    marginLeft:10, fontSize:12, color:'#777',
  }
});

