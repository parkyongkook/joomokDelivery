import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import SlidelList_delList from './SlidelList_delList';
import { Actions } from 'react-native-router-flux';



export default class SlidelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        } 
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

    render() {
        console.log(this.props.dateData)
        return (
            <View style={{ flex: 1, backgroundColor: "#0099ff", }}>
                <View style={styles.slide1}>
                    <View style={{flex:2.5, width:'100%', alignItems:'center'}}>
                        
                        <TouchableOpacity style={{flex:1.5, justifyContent:'center',}}
                            onPress={()=>Actions.CalendarView()}
                        >
                            <Text style={{ fontSize:18,}}>{this.props.dateData.date}</Text>
                        </TouchableOpacity>

                        <View  style={{flex:1.5, width:'96%', flexDirection:'row', borderWidth:0.3,  }}>
                            <View style={{flex:1, justifyContent:'center',}}>  
                                <Text style={{marginLeft:20,}}>배달건수: {this.props.dateData.delData.delCount}</Text>
                            </View>

                            <View style={{flex:1, justifyContent:'center',}}>
                                <Text style={{marginLeft:20,}}>완료건수: {this.props.dateData.delData.compData}</Text>
                            </View>

                        </View>

                        <View  style={{flex:1.5, width:'96%', marginTop:5, flexDirection:'row', borderWidth:0.3,  }}>
                            <View style={{flex:1, justifyContent:'center',}}>  
                                <Text style={{marginLeft:10,}}>{this.props.dateData.delData.product}</Text>
                            </View>
                        </View>


                    </View>

                    <View style={{flex:7, marginTop:20, alignItems:'center',}}>

                        <Text style={{marginLeft:15, alignSelf:'flex-start',}}>배송목록</Text>

                        {this.mapToSlidelList_delList(this.props.dateData.delList)}

                        <View style={{flex:3}}>

                        </View>

                    </View>

                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    }
  })
  