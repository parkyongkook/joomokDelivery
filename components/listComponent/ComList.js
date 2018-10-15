import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';
import { Button } from 'native-base';

export default class ComList extends React.Component {

    constructor(props) {
        super(props);
        this.state={}
    }

    render() {
        return (
            <View style={{ height:70, marginTop:5, flexDirection:'row', backgroundColor:'#eee',}}>
               <View style={[{ flex:1.5},styles.comListTitle]}>
                    <Text style={{fontSize:12, color:'#333'}}>{this.props.comData.area}</Text>
               </View>
               <View style={{flex:9}}>
                    <View style={{flex:1, flexDirection:'row',}}>
                        <View style={[{ flex:3},styles.comListTitle]}> 
                            <Text style={{fontSize:10, color:'#333'} }>{this.props.comData.comName}</Text>
                        </View>
                        <View style={[{ flex:1.5},styles.comListTitle]}>
                            <Text style={{fontSize:10, color:'#333'}}>{this.props.comData.phone}</Text>
                        </View>
                        <View style={{flex:1, alignItems:'center', justifyContent:'center', flexDirection:'row',}}>
                            <Text style={{fontSize:10, color:'#333'}}>{this.props.comData.name}</Text>
                        </View>
                    </View>
                    
                    <View style={{flex:1, flexDirection:'row', borderTopWidth:2, borderColor:'#fff',}}>
                        <View style={[{flex:4}, styles.comListTitle]}>
                            <Text style={{fontSize:10, color:'#333',}}>{this.props.comData.address}</Text>
                        </View>
                        <Button 
                            style={{flex:0.7, height:'100%', alignItems:'center', justifyContent:'center', }}
                            onPress={  ()=> this.props.setClipboardContent(this.props.comData.address) }
                        >
                            <Text style={{fontSize:10, color:'#fff',}}>복사</Text>
                        </Button>
                    </View>
               </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    comListTitle:{
        alignItems:'center', 
        justifyContent:'center', 
        flexDirection:'row', 
        borderRightWidth:2, 
        borderRightColor:'#fff',
    }
})
  