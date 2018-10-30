import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import {
    Container, CheckBox, Header, Content, Form,
    Item, Input, Label, Left, Button, Icon, Text, Body, Title, Right
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { MapView,  Constants, Location, Permissions } from 'expo';
import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import update from 'immutability-helper'; // 2.6.5


export default class MapLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            idSaveChecked: false,
            Region: {
                latitude: Number(this.props.pointXy[1]),
                longitude :  Number(this.props.pointXy[0]),
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421
            },
            error: null,
            isLoading: true,
        };

    }


    // componentWillMount() {
    //     if (Platform.OS === 'android' && !Constants.isDevice) {
    //       this.setState({
    //         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
    //       });
    //     } else {
    //       this._getLocationAsync();
    //     }
    //   }
    
    // _getLocationAsync = async () => {
    //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //     if (status !== 'granted') {
    //       this.setState({
    //         errorMessage: 'Permission to access location was denied',
    //       });
    //     }
    
    //     let location = await Location.getCurrentPositionAsync({});
    //     this.setState({ location });
    //     this.setState({ 
    //         Region : update(this.state.Region, { 
    //             latitude : {$set:location.coords.latitude},
    //             longitude : {$set:location.coords.longitude},
    //         }),
    //     });

    //     console.log('로케이션',location.coords.latitude)
    // };



    // fetchMarkerData() {
    //   //제이슨 형태로 자전거의 위치를 반환함 같은형태로 데이터를 가공하여 받아 사용하여 마커 생성 가능.
    //   fetch("https://feeds.citibikenyc.com/stations/stations.json")
    //     .then(response => response.json())
    //     .then(responseJson => {
    //       console.log(responseJson.stationBeanList)
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#0099ff", }}>
                <BackGroundImage />
                <Head
                    title={"지도보기"}
                    openDrawer={this.props.openDrawer}
                    closeDrawerHome={this.props.closeDrawer}
                    beforePage={() => Actions.Main()}
                />
                <MapView
                    style={{ flex: 1 }}
                    region={this.state.Region}
                    loadingEnabled={true}
                >
                    
                    <MapView.Marker
                        // key={index}
                        coordinate={
                            {
                                latitude: Number(this.props.pointXy[1]),
                                longitude :  Number(this.props.pointXy[0]),
                            }
                        }
                        title={this.props.comData.store}
                        description={this.props.comData.jibun}
                    />
     
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loginSubText: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 15,
    }
});

