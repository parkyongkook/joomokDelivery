import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';


class SlidelList_delList extends React.Component {

    constructor(props) {
        super(props);
    }

    mapToProductList = (data) => {
        let arr = data.split(",")
        return arr.map((productData, i) => {
            return (
                <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}} key={i}>
                    {productData}
                </Text>
            )
        })
    }

    clickToComDetail(){

        let caseArr = [];
        let botlArr = [];

        fetch('http://dnbs.joomok.net/task/deposit?ordno='+this.props.comData.ordNo)
        .then((response) => response.json())
        .then((response)=>{
            if( response.data.rs.botl.length > 0 || response.data.rs.case.length > 0 ){
                let rsDataBotl = response.data.rs.botl
                let rsDataCase = response.data.rs.case

                for( let v in rsDataBotl ){
                    caseArr.push(false)
                }
                for( let v in rsDataCase ){
                    botlArr.push(false)
                }
            }
            return response.data.rs
        })
        .then((paybackData)=>{
            Actions.ComDetail({
                paybackData : paybackData,
                botlArr : botlArr , 
                caseArr : caseArr , 
                comData : this.props.comData,
                date : this.props.date,
                index : this.props.i,
            })

        })



    }

    render() {
        return (
            <TouchableOpacity 
                onPress={this.clickToComDetail.bind(this)}
            >
                <View  style={{width:'96%', marginTop:5, paddingTop:10, paddingBottom:10, flexDirection:'row', borderWidth:0.3, }}>
                    <View style={{flex:3, justifyContent:'center',}}>  
                        <Text style={{marginLeft:10, fontSize:12, color:'#0099ff',}}>{this.props.comData.store} - {this.props.comData.statusStr}</Text>
                        {this.mapToProductList(this.props.comData.prodStr)}  
                    </View>
                </View>  
            </TouchableOpacity>
        );
    }
}


const mapStateToProps = (state) => {
    return {
      dateData: state.reducers.dateData,
    };
};
  
export default connect(mapStateToProps, null)(SlidelList_delList);




  