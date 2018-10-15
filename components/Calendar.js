import React from 'react';
import { Text, View, StyleSheet,TouchableOpacity} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import update from 'immutability-helper'; // 2.6.5
import * as actions from '../actions';

import BackGroundImage from './util/backGroundImage';
import Head from './Head';


LocaleConfig.locales['en'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
  dayNamesShort: ['월.','화.','수.','목.','금.','토.','일.']
};

LocaleConfig.defaultLocale = 'en';

export default class CalendarView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};

  };

  render() {
    return (
      <View style={styles.container}>

        <BackGroundImage />
        <View>
            <Head
                openDrawer={this.props.openDrawer}
                closeDrawerHome={this.props.closeDrawer}
                beforePage={true}
            />
        </View>
       
        <View style={styles.calendar}>
          <Calendar
            markedDates={
              this.props.markedDates
            }
            onDayPress={this.onDayPressBasic}
            style={{ paddingTop: 50, flex: 1 }}
            monthFormat={'yyyy MM'}
          />
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent: "center" ,
    backgroundColor: '#0099ff'
  },
  calendar : {
    flex : 15,
    backgroundColor: '#fff'
  },
});

