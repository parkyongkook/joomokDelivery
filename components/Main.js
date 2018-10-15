import React from 'react';
import { StyleSheet, View, Text} from 'react-native';

import Head from './Head';
import BackGroundImage from './util/backGroundImage';
import Toast, { DURATION } from 'react-native-easy-toast'
import Swiper from 'react-native-swiper';
import SlidelList from './listComponent/SlidelList';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateData : [
                {
                    date:'2018.10.03',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                                '카스 후레쉬 - 2box ',
                                '카스 후레쉬 - 3box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
                {
                    date:'2018.10.04',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
                {
                    date:'2018.10.05',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
                {
                    date:'2018.10.06',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
                {
                    date:'2018.10.07',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
                {
                    date:'2018.10.08',
                    delData:{
                        delCount : 3,
                        compData : 1,
                        product: '소주 2, 수입맥주 2, 생맥주 1',
                    },
                    delList : [
                        {
                            com: '쭈꾸미식당 노블레스 오블레쮸',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '하바나',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송중',
                        },
                        {
                            com: '라살사',
                            product: [
                                '뉴 참이슬 후레쉬(병)360 - 2box ',
                                '카스 후레쉬 - 1box ',
                            ],
                            delState : '배송완료',
                        },
                    ]
                },
            ]
        };
    }

    mapToSlideList = (data) => {
        return data.map((dateData, i) => {
            return (
                <SlidelList
                    dateData={dateData}
                    key={i}
                    i={i}
                />);
        })
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

                 <Swiper style={styles.wrapper} showsButtons={true}>
                    {this.mapToSlideList(this.state.dateData)}
                </Swiper>

            </View>

        );
    }
}


const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
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
  