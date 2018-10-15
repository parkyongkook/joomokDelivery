import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class SlidelList_delList extends React.Component {

    constructor(props) {
        super(props);
    }

    mapToProductList = (data ) => {
        return data.map((productData, i) => {
            return (
                <Text style={{marginLeft:10, marginTop:5, fontSize:12, color:'#777',}} key={i}>
                    {productData}
                </Text>
            )
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={()=>Actions.ComDetail()}>
                <View  style={{width:'96%', marginTop:5, paddingTop:10, paddingBottom:10, flexDirection:'row', borderWidth:0.3, }}>
                    <View style={{flex:3, justifyContent:'center',}}>  
                        <Text style={{marginLeft:10, fontSize:12, color:'#0099ff',}}>{this.props.comData.com} - {this.props.comData.delState}</Text>
                        {this.mapToProductList(this.props.comData.product)}
                    </View>
                </View>  
            </TouchableOpacity>
        );
    }
}




  