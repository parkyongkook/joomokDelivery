import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class SlidelList_delList extends React.Component {

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

    render() {
        console.log("메인에서의",this.props.comData)
        return (
            <TouchableOpacity onPress={()=>Actions.ComDetail({
                comData : this.props.comData
            })}>
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




  