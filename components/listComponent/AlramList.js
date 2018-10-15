import React from 'react';
import { StyleSheet, View, Text} from 'react-native';
import Accordion from '@ercpereda/react-native-accordion';

export default class AlramList extends React.Component {

    constructor(props) {
        super(props);
        this.state={}
    }

    render() {
        const Headers = ({ isOpen }) =>

        <View style={{ height:35, marginTop:0, flexDirection:'row', backgroundColor:'#eee',}}>
            <View  style={{flex:1.5, justifyContent:'center', alignItems:'center', borderRightWidth:0.3, borderColor:'#fff', }}>
                <Text style={{color:'#333', fontSize:12,}}>{this.props.alramData.day}</Text>
            </View>
            <View  style={{flex:1, justifyContent:'center', alignItems:'center', borderRightWidth:0.3, borderColor:'#fff',}}>
                <Text style={{color:'#333', fontSize:12,}}>{this.props.alramData.category}</Text>
            </View>
            <View  style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'#333', fontSize:12,}}>{this.props.alramData.title}</Text>
            </View>
        </View>

        const Contents = (
        <View style={{
            display: 'flex',
            }}>
            <Text 
            allowFontScaling={false}
            style={{
                paddingTop: 10,
                paddingRight: 15,
                paddingBottom: 10,
                paddingLeft: 15,
                fontSize:14,
            }}>
                {this.props.alramData.contents}
            </Text>
        </View>);

        return (
            <View style={{marginTop:5,}}>
                <Accordion
                    header={Headers}
                    content={Contents}
                    duration={300}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    noticeFormTitle:{
        backgroundColor: "blue",
        paddingBottom: 10, 
        paddingTop: 10,  
        alignItems: "center",
    },
    noticeFormShare:{
        backgroundColor: "#ddd",
        paddingBottom: 10, 
        paddingTop: 10,  
        alignItems: "center",
    },noticeFormSubtitle:{
        borderLeftWidth: 1, 
        borderLeftColor: "#fff", 
    }

});
  
