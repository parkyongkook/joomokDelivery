import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity,TextInput, ActivityIndicator} from 'react-native';
import { Container, CheckBox, Content, Item, Button, Icon, Text, Picker} from 'native-base';

import { Actions } from 'react-native-router-flux';

import AddressModal from './AddressModal';
import BackGroundImage from './util/backGroundImage';
import Head from './Head';
import ModalDropdown from 'react-native-modal-dropdown';

import update from 'immutability-helper'; // 2.6.5
import { ImagePicker, Permissions } from 'expo';
import PolicyModal from './PolicyModal';

let serial1;
let serial2;
let serial3;

export default class SignUp_Information extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            companySerial : {
                serial1: null,
                serial2: null,
                serial3: null,
            },
            drinkSerial:{
                serial1: null,
                serial2: null,
                serial3: null,
            },
            photos: [],
            localNum: {
                localNumArr: [
                    "02",
                    "031",
                    "032",
                    "033",
                    "041",
                    "042",
                    "043",
                    "044",
                    "051",
                    "052",
                    "053",
                    "054",
                    "055",
                    "061",
                    "062",
                    "063",
                    "064",
                    "070",
                ],
                localNumIndex: 0,
                phone_a: null,
                phone_b: null
            },
            birthTab: {
                year: "출생년도",
                month: "월",
                day: "일",
            },
            policyModal: false,
            policyType: null ,
            modalVisible: false,
            Checked1: false,
            Checked2: false,
            comSerialVal : false,
            image: null,
            imageText: "no image",
            selected2: undefined,
            idOverwrapInspect: false,
            addressTxt: null,
            adressDataList: false,
            necessaryUserData: {
                userid: null,

                username: this.props.userName,
                mobile: this.props.mobile,
                birth: this.props.userBirth,
                
                // birth: '19820523',
                // mobile: '01089528963',
                // username: '박용국',

                password: null,
                passConfirm: null,
                email: null,
                recommander: null,
                com_name: null,
                com_addr: null,
                com_addr1: null,
                com_zipcode: null,
                com_phone: null ,
                com_serial: null,
                com_certify: null,
                com_category: null,
                isagree_rule: 0,
                isagree_info: 0
            }
        };
        this.confirmSignup = this.confirmSignup.bind(this);
        this.checkStrType = this.checkStrType.bind(this);
        this.adressSearch = this.adressSearch.bind(this);
        this.selectAdress = this.selectAdress.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.isValEmail = this.isValEmail.bind(this);
        this.phonNumberChanger = this.phonNumberChanger.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.companyValidation = this.companyValidation.bind(this);
        this.policyCheckBox = this.policyCheckBox.bind(this);
    }

    phonNumberChanger(type, text) {
        if (type === "front") {
            this.setState({
                localNum: update(this.state.localNum, {
                    phone_a: { $set: text },
                }),
                necessaryUserData: update(this.state.necessaryUserData, {
                    com_phone: {
                        $set: this.state.localNum.localNumArr[this.state.localNum.localNumIndex] +
                            text + this.state.localNum.phone_b
                    }
                })
            })
        } else {
            this.setState({
                localNum: update(this.state.localNum, {
                    phone_b: { $set: text },
                }),
                necessaryUserData: update(this.state.necessaryUserData, {
                    com_phone: {
                        $set: this.state.localNum.localNumArr[this.state.localNum.localNumIndex] +
                            this.state.localNum.phone_a + text
                    }
                })
            })
        }
    }

    isValEmail(email) {
        regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return regEmail.test(email) ? true : false
    }

    onValueChange(value: string) {
        this.setState({
            necessaryUserData: update(this.state.necessaryUserData, {
                com_category: { $set: value }
            })
        })
    }

    checkStrType(data, type) {
        const str = data;
        var err = 0;

        for (var i = 0; i < str.length; i++) {
            var chk = str.substring(i, i + 1);
            if (!chk.match(/[0-9]|[a-z]|[A-Z]|[!]|[-]|[_]/)) {
                err = err + 1;
            }
        }
        if (err > 0) {
            alert(type + "숫자 및 영문, 일부특수 문자(!,_,-)만 입력가능합니다.");
            return true;
        }
    }

    overlapCheck(userId) {
        //숫자 및 영문만 사용가능하도록 체크.
        if (userId === null) {
            return alert("아이디 항목이 비어있습니다.")
        }
        if (!this.checkStrType(userId, "아이디는 ")) {
            if (userId !== null) {
                if (userId.length < 5) {
                    return alert("5자이상 가능합니다.")
                }
                if (userId.length > 20) {
                    return alert("20자 이하 가능합니다.")
                }
                return fetch('https://api.joomok.net/members/validid?userid=' + userId + "&debug=y")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({
                            idOverwrapInspect: true
                        })
                        alert(responseJson.message)
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                return alert("아이디 항목이 비어있습니다.")
            }
        }
    }

    confirmSignup(formState) {

        //아이디 항목검사
        if( formState.userid === null || formState.userid === '' ){
            return alert('아이디 항목이 비어있습니다.')
        }

        //아이디 중복확인
        if (!this.state.idOverwrapInspect) {
            return alert("아이디 중복확인은 필수입니다.")
        }

        //비밀번호 검증
        if( formState.password === null || formState.password === '' || formState.passConfirm === null || formState.passConfirm === '' ){
            return alert('비밀번호 항목이 비어있습니다.')
        }

        if (formState.password.length < 8 || formState.password.length > 20) {
            return alert("비밀번호는 8자 이상 20자 이하의 특수문자, 영문만 가능합니다.")
        }
        if ( this.checkStrType(formState.password, "비밀번호")) {
            return this.checkStrType( formState.password, "비밀번호")
        }
        if ( formState.password.length < 8 || formState.password.length > 20) {
            return alert("비밀번호는 8자 이상 20자 이하의 영문,숫자,특수문자만 가능합니다.")
        }
        if ( formState.password !== formState.passConfirm) {
            return alert("비밀번호가 일치하지 않습니다.")
        }

        //이메일검증
        if (!this.isValEmail( formState.email)) {
            return alert("이메일항목이 비어있거나 올바르지 않습니다.")
        }

        if (!this.isValEmail( formState.email)) {
            return alert("잘못된 형식의 이메일 입니다.")
        }

        if( formState.com_addr === null || formState.com_addr === '' ){
            return alert('사업장주소를 입력해 주세요')
        }

        if( formState.com_addr1 === null || formState.com_addr1 === ''  ){
            return alert('상세주소를 입력해 주세요')
        }

        //사업장명 검증
        if( formState.com_name === null || formState.com_name === '' ){
            return alert('사업장명은 필수항목 입니다.')
        }

        //사업장 전화번호
        if( formState.com_phone === null || formState.com_phone === ''  ){
            return alert('사업장 전화번호는 필수항목 입니다.')
        }

        //사업장 전화번호
        if( formState.com_phone.length < 9 ){
            return alert('올바른 사업장 전화번호를 적어주세요')
        }

        //사업자 번호
        if( formState.com_serial === null || formState.com_serial === '' ){
            return alert('사업자 번호는 필수 항목입니다.')
        }

        if( this.state.comSerialVal === false ){
            return alert('사업자의 유효성 검사를 해주세요')
        }

        //주류판매 번호
        if( formState.com_certify === null || formState.com_certify === ''  ){
            return alert('주류판매 번호는 필수 항목입니다.')
        }

        this.setState({
            necessaryUserData: update(this.state.necessaryUserData, {
                com_certify: { $set: this.state.drinkSerial.serial1+this.state.drinkSerial.serial2+this.state.drinkSerial.serial3 }
            })
        })

        //사업자 등록증 첨부 확인
        // if ( this.state.image == null) {
        //     return alert("사업자등록증 첨부는 필수 입니다.")
        // }
        
        // if (this.state.imageText ==  "no image") {
        //     return alert("사업자등록증 첨부는 필수 입니다.")
        // }

        if ( formState.com_category == null || formState.com_category == 0 ) {
            return alert("사업장 분류를 선택해주세요")
        }

        //이용약관 검증
        if (!formState.isagree_info || !formState.isagree_rule) {
            return alert("이용약관및 개인정보 수집에 동의해주세요")
        }
        
        this.setState({
            necessaryUserData : update(this.state.necessaryUserData, {
                com_certify: { $set: this.state.drinkSerial.serial1+this.state.drinkSerial.serial2+this.state.drinkSerial.serial3 }
            })
        },)

        this.fileUpload()

    }

    adressSearch(address) {
        this.setState({
            isLoading:true
        })
        fetch('https://api.joomok.net/members/search?com_addr='+address)
            .then((response) => response.json())
            .then((adressDataList) => {

                if(adressDataList.code == 404){
                    return alert('검색된 주소가 없습니다.')
                }

                if(adressDataList.code !== 200){
                    return alert('주소찾기 오류 관리자에게 문의하세요')
                }

                this.setState({
                    adressDataList: adressDataList.data,
                    modalVisible: true
                })
            })
            .catch((error) => {
                console.error(error);
            })
            .done(()=>this.setState({isLoading:false,})
        );
    }

    selectAdress(address, zip) {
        this.setState({
            modalVisible: false,
            necessaryUserData: update(this.state.necessaryUserData, {
                com_addr: { $set: address },
                com_zipcode: { $set: zip }
            })
        })
    }

    closeModal(type) {
        type == 'policyModal' ?         
        this.setState({
            policyModal: false
        })
        :
        this.setState({
            modalVisible: false
        })
    }

    //이미지 업로드 함수 
    _pickImage = async () => {
        const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            console.log('granted')
            await Permissions.askAsync(Permissions.CAMERA_ROLL)
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            // aspect: [4, 6],
        });

        if (!result.cancelled) {
            console.log('cancelled')
            this.setState({
                image: result.uri,
                imageText: "이미지가 첨부되었습니다."
            });
        }
    };

    fileUpload() {

        let comSerial = this.state.companySerial;

        if ( comSerial.serial1.length !== 3 || comSerial.serial2.length !== 2 || comSerial.serial3.length !== 5 ) {
            return alert('사업자등록번호 오류 자릿수를 다시 확인하세요')
        }

        if ( this.state.necessaryUserData.com_certify.length !== 9 ) {
            return alert('주류판매번호 자릿수를 확인하세요')
        }

        this.setState({
            isLoading : true
        });

        fetch('https://api.joomok.net/members', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.necessaryUserData)
        })
        .then((response) => response.json())
        .then((responseData) => {

            if (responseData.code === 401) {
                console.log(responseData)
                return alert(responseData.message)
                return false
            }

            if (responseData.code === 500) {
                console.log(responseData)
                alert(responseData.message)
                return alert(responseData.code+responseData.message)
                return false
            }

            if (responseData.code === 412) {
                console.log(responseData)
                return alert(responseData.message)
                return
            }

            if (responseData.code === 404) {
                console.log('404메시지', responseData, responseData.data)
                return alert(responseData.message)
                return false
            }

            
            if (responseData.code !== 200) {
                console.log( responseData, responseData.data)
                return alert(responseData.code+ responseData.message)
                return false
            }

            //파일업로드 시작
            if( this.state.image !== null || this.state.imageText !== "no image" ){

                let localUri = this.state.image;
                let filename = localUri.split('/').pop();
    
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                const data = new FormData();

                data.append('serial', {
                    uri: localUri,
                    type: type,
                    name: filename,
                })
    
                data.append('usridx', responseData.data.result)
                data.append('userid', this.state.necessaryUserData.userid)
    
                fetch('http://pay.joomok.net/serialpic', {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code === 401) {
                         console.log(responseData);
                        // return alert(responseData.message);
                    }
                    if (responseData.code !== 200) {
                         console.log(responseData);
                        // return alert(responseData.message);
                    }
                })
                .catch((error) => {
                     console.log('error', error);
                })
                .done();
            }

            //파일업로드 끝
            Actions.Login();
            alert("회원가입이 성공하였습니다.");
            return
6
        })
        .catch((error) => {

            alert(error);
        })
        .done(()=>{
            this.setState({
                isLoading : false
            })
        });
    }

    companyValidation(){

        this.setState({
            isLoading: true,
        })

        let companySerial = this.state.companySerial.serial1+this.state.companySerial.serial2+this.state.companySerial.serial3

        fetch('https://api.joomok.net/members/serials?com_serial='+companySerial, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseData) => {

                if( responseData.code === 412 ){
                    return alert('유효하지 않은 사업자 번호입니다.')
                }

                if(responseData.code === 409){
                    return alert('이미지 등록된 사업자 번호입니다.')
                }

                return alert('정상적인 사업자 입니다.')
            })
            .catch((error) => {
                return alert('유효하지 않은 사업자 번호입니다.')
                console.log('error', error);
            })
        .done(()=>
            this.setState({ 
                isLoading:false,
                comSerialVal : true, 
                necessaryUserData: update(this.state.necessaryUserData, {
                    com_serial: { $set: companySerial }
                })
            })
        );
        
    }

    policyCheckBox(type){
        if( type == 'isagree_info' ){
            this.state.necessaryUserData.isagree_info !== 1 ?
            this.setState({
                necessaryUserData: update(this.state.necessaryUserData, {
                    isagree_info: { $set: 1 }
                })
            })
            :
            this.setState({
                necessaryUserData: update(this.state.necessaryUserData, {
                    isagree_info: { $set: 0 }
                })
            })
            return
        }else{
            this.state.necessaryUserData.isagree_rule !== 1 ?
            this.setState({
                necessaryUserData: update(this.state.necessaryUserData, {
                    isagree_rule: { $set: 1 }
                })
            })
            :
            this.setState({
                necessaryUserData: update(this.state.necessaryUserData, {
                    isagree_rule: { $set: 0 }
                })
            })
        }
    }

    render() {

        let serialState = this.state.companySerial;
        let mergeSerial = serialState.serial1+serialState.serial2+serialState.serial3

        return (
            <Container style={{
                backgroundColor: "#0099ff",
            }}>

                <BackGroundImage />

                <Head
                    title={"회원가입"}
                    hideMenu={true}
                    openDrawer={this.props.openDrawer}
                    closeDrawerHome={this.props.closeDrawer}
                    beforePage={
                        () => {this.state.stateOfComponent ? this.setState({ stateOfComponent: false }) :Actions.SignUp_Authentication()}
                    }
                />

                <Content style={{ backgroundColor: '#fff', }}>

                    <View style={{ width: '90%', marginLeft: '5%', marginTop: 10, marginBottom: 10, flexDirection: 'row', }}>
                        <View style={{ flex: 1, height: 50, borderBottomWidth: 1, marginBottom:5, borderBottomColor: '#0099ff', }}>
                            <Text style={{ fontSize: 24, marginBottom:5, color: '#0099ff', }}>회원정보입력</Text>
                            <Text style={{ fontSize: 10,  color: '#0099ff', }}>*파란색 색상은 필수 항목입니다.</Text>
                        </View>
                        <View style={{ flex: 1, height: 50, borderBottomWidth: 1, borderBottomColor: '#ddd', }}></View>
                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}>
                            <Text style={styles.loginSubText}>이름</Text>
                        </View>
                        <View style={styles.SignUpSubText}><Text style={[styles.loginSubText,{color:'#000'}]}>{this.state.necessaryUserData.username}</Text></View>
                    </View>
                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}>
                            <Text style={styles.loginSubText}>휴대폰</Text>
                        </View>
                        <View style={styles.SignUpSubText}><Text style={[styles.loginSubText,{color:'#000'}]}>{this.state.necessaryUserData.mobile}</Text></View>
                    </View>
                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText} >아이디</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={{ flex: 4, height: 25, marginRight: 10, backgroundColor: "#fff", borderRadius: 5, }} >
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    placeholder={"아이디 입력"}
                                    onChangeText={
                                        text => {
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    userid: { $set: text }
                                                }),
                                                idOverwrapInspect: false
                                            })

                                        }}
                                    style={styles.textInput}
                                />
                            </Item>
                            <Button style={[styles.inputButton, {
                                flex: 2,
                                backgroundColor: "rgba(0,0,0,0)",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#777",
                                justifyContent: "center",
                            }]} onPress={
                                () => {
                                    this.overlapCheck(this.state.necessaryUserData.userid)
                                }
                            }>
                                <Text style={{ fontSize: 11, textAlign: "center", color: '#777', }}>중복확인</Text>
                            </Button>
                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}>
                            <Text style={styles.loginSubText}>생년월일</Text>
                        </View>
                        <View style={styles.SignUpSubText}><Text style={[styles.loginSubText,{color:'#000'}]}>{this.state.necessaryUserData.birth}</Text></View>
                    </View>

                    <View style={styles.SignUpFormParent}>

                        <View style={styles.SignUpTitle}>
                            <Text style={styles.loginSubText} >비밀번호</Text>
                        </View>

                        <View style={styles.SignUpSubText}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    placeholder={"비밀번호 10자이상"}
                                    secureTextEntry={true}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    password: { $set: text }
                                                })
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                        </View>
                    </View>
                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText} >비밀번호확인</Text></View>
                        <View style={styles.SignUpSubText}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    placeholder={"비밀번호 확인"}
                                    secureTextEntry={true}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    passConfirm: { $set: text }
                                                })
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                        </View>
                    </View>
                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText}>이메일</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                <TextInput
                                    keyboardType={'email-address'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    style={styles.textInput}
                                    placeholder={"예시) sample@email.com"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    email: { $set: text }
                                                })
                                            })
                                    }
                                />
                            </Item>
                        </View>
                    </View>


                    <View style={styles.SignUpFormParent}>

                        <View style={styles.SignUpTitle}>
                            <Text style={styles.loginSubText}>사업장주소</Text>
                        </View>

                        <View style={{
                            flex: 5,
                            height: 55,
                            marginRight: 15,
                        }}>

                            <View style={{ flex: 1, height: 25, flexDirection: "column", }}>

                                <View style={{ flex: 1, height: 25, flexDirection: "row", }} >

                                    <Item Regular style={{
                                        flex: 4,
                                        height: 25,
                                        marginRight: 10,
                                        backgroundColor: "#fff",
                                        borderRadius: 5,
                                    }}>
                                        <TextInput
                                            value={
                                                this.state.necessaryUserData.com_addr ? this.state.necessaryUserData.com_addr : null
                                            }
                                            // editable={this.state.isChangeToPhoneNum}
                                            selectionColor={"#555"}
                                            placeholder={"검색할 주소를 입력"}
                                            underlineColorAndroid='transparent'
                                            style={{ flex: 4, marginRight: 10, }}
                                            onChangeText={
                                                (text) =>
                                                    this.setState({
                                                        necessaryUserData: update(this.state.necessaryUserData, {
                                                            com_addr: { $set: text }
                                                        })
                                                    })
                                            }
                                            style={styles.textInput}
                                        />
                                    </Item>

                                    <Button onPress={
                                        () => {
                                            this.state.necessaryUserData.com_addr !== null ?
                                                this.adressSearch(this.state.necessaryUserData.com_addr)
                                                : alert("주소를 입력하세요")
                                        }
                                    }
                                        style={[styles.inputButton, {
                                            flex: 2,
                                            backgroundColor: "rgba(0,0,0,0)",
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: "#777",
                                        }]}
                                    >
                                        <Text style={{ fontSize: 11, textAlign: "center", color: '#777', }}>우편번호</Text>
                                    </Button>
                                </View>

                                <View style={{ height: 25, }} >
                                    <Item Regular style={{ flex: 1, height: 25, backgroundColor: "#fff", borderRadius: 5, }}>
                                        <TextInput
                                            underlineColorAndroid='transparent'
                                            selectionColor={"#555"}
                                            placeholder={"상세주소"}
                                            onChangeText={
                                                (text) =>
                                                    this.setState({
                                                        necessaryUserData: update(this.state.necessaryUserData, {
                                                            com_addr1: { $set: text }
                                                        })
                                                    })
                                            }
                                            style={styles.textInput}
                                        />
                                    </Item>
                                </View>

                            </View>


                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText} >사업장명</Text></View>
                        <View style={styles.SignUpSubText}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    com_name: { $set: text }
                                                })
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>

                        <View style={{
                            flex: 2.04,
                            height: 25,
                            marginLeft: 15,
                            justifyContent: "center",
                        }}>
                            <Text style={styles.loginSubText} >사업장전화</Text></View>

                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>

                            <View style={{
                                flex: 3,
                                backgroundColor: "#eee",
                                borderRadius: 5,
                                marginRight: 2,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <Text style={{ fontSize: 14, flex: 3, textAlign: "center", color: "#70aed5", }}>
                                    {
                                        this.state.localNum.localNumArr[this.state.localNum.localNumIndex]
                                    }
                                </Text>
                                <ModalDropdown

                                    onSelect={
                                        (i, v) => this.setState({
                                            localNum: update(this.state.localNum, {
                                                localNumIndex: { $set: i }
                                            })
                                        })
                                    }
                                    dropdownStyle={{ width: 85, marginLeft: -64, }}
                                    options={this.state.localNum.localNumArr}
                                    style={{
                                        height: 20, marginRight: 5, flex: 1,
                                        justifyContent: "center", alignItems: "center",
                                        flexDirection: "row",
                                        backgroundColor: '#eee',
                                    }}
                                >
                                    <Icon type="FontAwesome" name="caret-down"
                                        style={{
                                            fontSize: 18,
                                            color: "#0099ff"
                                        }}
                                    />
                                </ModalDropdown>
                            </View>

                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#fff", borderRadius: 5, }}>
                                <TextInput
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.phonNumberChanger("front", text)
                                    }
                                    style={styles.textInput}
                                />
                            </Item>

                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#fff", borderRadius: 5, }}>
                                <TextInput
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.phonNumberChanger("back", text)
                                    }
                                    style={styles.textInput}
                                />
                            </Item>

                        </View>

                    </View>


                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}>< Text style={styles.loginSubText} >사업자번호</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={3}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                companySerial: update(this.state.companySerial, {
                                                    serial1: { $set: text }
                                                }),
                                                necessaryUserData : update(this.state.necessaryUserData, {
                                                    com_serial: { $set: mergeSerial }
                                                }),
                                                comSerialVal: false,
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={2}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                companySerial: update(this.state.companySerial, {
                                                    serial2: { $set: text }
                                                }),
                                                necessaryUserData : update(this.state.necessaryUserData, {
                                                    com_serial: { $set: mergeSerial }
                                                }),
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                            <Item Regular style={{ flex: 3, height: 25, marginRight: 5, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={5}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                companySerial: update(this.state.companySerial, {
                                                    serial3: { $set: text }
                                                }),
                                                necessaryUserData : update(this.state.necessaryUserData, {
                                                    com_serial: { $set: mergeSerial }
                                                }),
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                            <Button style={[styles.inputButton, {
                                                flex: 4.6,
                                                backgroundColor: "rgba(0,0,0,0)",
                                                borderRadius: 5,
                                                borderWidth: 1,
                                                borderColor: "#777",
                                                paddingLeft:0,
                                                paddingRight:0,
                                            }]}
                                    onPress={ this.companyValidation }        
                            >
                                <Text style={{ fontSize: 10, textAlign: "center", color: '#777', }}>유효검사</Text>
                            </Button>
                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText} >주류판매번호</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={3}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    onChangeText={
                                        (text) =>{
                                                    serial1 = text
                                                    this.setState({
                                                        drinkSerial: update(this.state.drinkSerial, {
                                                            serial1: { $set: text }
                                                        }),
                                                        necessaryUserData : update(this.state.necessaryUserData, {
                                                            com_certify: { $set: serial1+serial2+serial3 }
                                                        }),
                                                    })
                                                }
                                        }
                                    style={styles.textInput}
                                />
                            </Item>
                            <Item Regular style={{ flex: 3, height: 25, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={1}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    value={serial2}
                                    onChangeText={
                                        (text) =>{
                                                    serial2 = text
                                                    this.setState({
                                                        drinkSerial: update(this.state.drinkSerial, {
                                                            serial2: { $set: text }
                                                        }),
                                                        necessaryUserData : update(this.state.necessaryUserData, {
                                                            com_certify: { $set: serial1+serial2+serial3 }
                                                        }),
                                                    })
                                                }
                                            }
                                    style={styles.textInput}
                                />
                            </Item>
                            <Item Regular style={{ flex: 3, height: 25, marginRight: 5, backgroundColor: "#eee", borderRadius: 5, }}>
                                <TextInput
                                    maxLength={5}
                                    keyboardType={'numeric'}
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}

                                    onChangeText={
                                        (text) =>{
                                            serial3 = text
                                            this.setState({
                                                drinkSerial: update(this.state.drinkSerial, {
                                                    serial3: { $set: text }
                                                }),
                                                necessaryUserData : update(this.state.necessaryUserData, {
                                                    com_certify: { $set: serial1+serial2+serial3 }
                                                }),
                                            })
                                        }    
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>

                        <View style={styles.SignUpTitle}><Text style={[styles.loginSubText,{color:'#000'}]} >사업자등록증</Text></View>

                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={{ flex: 4, height: 25, marginRight: 5, backgroundColor: "#eee", borderRadius: 5, }}>
                                <Text style={{ marginLeft: 10, fontSize: 14, color: "#bbb", }}>{this.state.imageText}</Text>
                            </Item>
                            <Button style={[styles.inputButton, {
                                flex: 2,
                                backgroundColor: "rgba(0,0,0,0)",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#777",
                            }]}
                                onPress={this._pickImage} >
                                <Text style={{ fontSize: 11, textAlign: "center", color: '#777' }}>파일첨부</Text>
                                {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                    {image && <Image source={{ url: image }} style={{ height: 100 }} />}
                                </View> */}
                            </Button>

                        </View>

                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={styles.loginSubText} >사업장 분류</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                    <Picker
                                        mode="dropdown"
                                        placeholder="업종선택"
                                        placeholderStyle={{ color: "#bfc6ea", fontSize: 14, }}
                                        style={{ backgroundColor: '#eee', height: 26, width: '100%' }}
                                        selectedValue={this.state.necessaryUserData.com_category}
                                        onValueChange={this.onValueChange.bind(this)}
                                    >
                                        <Picker.Item label="업종을 선택해주세요" value="0" />
                                        <Picker.Item label="소매(일반음식점)" value="20" />
                                        <Picker.Item label="소매(주점)" value="30" />
                                        <Picker.Item label="소매(유흥)" value="40" />
                                        <Picker.Item label="일반(마트,편의점)" value="10" />

                                    </Picker>
                            </Item>
                        </View>
                    </View>

                    <View style={styles.SignUpFormParent}>
                        <View style={styles.SignUpTitle}><Text style={[styles.loginSubText,{color:'#000'}]}>추천인</Text></View>
                        <View style={{ flex: 5, height: 25, marginRight: 15, flexDirection: "row", }}>
                            <Item Regular style={styles.SignUpMobileInput}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    selectionColor={"#555"}
                                    placeholder={"추천인 아이디 입력"}
                                    onChangeText={
                                        (text) =>
                                            this.setState({
                                                necessaryUserData: update(this.state.necessaryUserData, {
                                                    recommander: { $set: text }
                                                })
                                            })
                                    }
                                    style={styles.textInput}
                                />
                            </Item>
                        </View>
                    </View>

                    <View style={{ flex:1, flexDirection:'row', justifyContent:'space-between',}}>

                        <TouchableOpacity style={{ flexDirection:'row', flex:7, height:30, }} onPress={() => this.policyCheckBox()}>                    
                            <CheckBox
                                color="skyblue"
                                checked={this.state.necessaryUserData.isagree_rule === 1}
                                //체크박스 옵션
                                onPress={() => this.policyCheckBox()}
                                style={{  marginTop:5, }}
                            />
                            <View style={{ marginTop: 7, marginLeft:15,}}>
                                <Text style={styles.checkBoxFont}>이용약관</Text>
                            </View>
                        </TouchableOpacity> 

                        <TouchableOpacity 
                            style={{ flex: 2, marginLeft: 10, justifyContent: "center"}}
                            onPress={()=>this.setState({
                                policyModal: true,
                                policyType : 1
                            })}
                        >
                            <Text style={styles.loginSubText}>펼쳐보기</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex:1, flexDirection:'row', justifyContent:'space-between',}} >

                        <TouchableOpacity style={{ flexDirection:'row', flex:7, height:30, }} onPress={() => this.policyCheckBox('isagree_info')}>

                            <CheckBox
                                color="skyblue"
                                checked={this.state.necessaryUserData.isagree_info === 1}
                                //체크박스 옵션
                                onPress={() => this.policyCheckBox('isagree_info')}
                                style={{ marginTop:5, }}
                            />
                            <View style={{ marginTop: 7, marginLeft:15,}}>
                                <Text style={styles.checkBoxFont}>개인정보 처리방침 안내</Text>
                            </View>

                        </TouchableOpacity> 

                        <TouchableOpacity 
                            style={{ flex: 2, marginLeft: 10,justifyContent: "center"}}
                            onPress={()=>this.setState({
                                policyModal: true,
                                policyType : 2
                             })}
                        >
                            <Text style={styles.checkBoxFont}>펼쳐보기</Text>
                        </TouchableOpacity>

                    </View>


                    <View style={{ flexDirection: "row", marginTop: 30, marginBottom: 30, justifyContent: "space-around", }}>

                        <Button style={{
                            width: "45%",
                            height: 60,
                            justifyContent: "center",
                            backgroundColor: "#0099ff",
                        }}
                            onPress={
                                () => {
                                    this.confirmSignup(this.state.necessaryUserData)
                                }
                            }>
                            <Text style={{ color: "#fff", fontSize: 20, }}>확인</Text>
                        </Button>
                        <Button style={{
                            width: "45%",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,0)",
                            borderRadius: 4,
                            borderWidth: 2,
                            borderColor: "#0099ff",
                            height: 60,
                            padding:0
                        }}
                            onPress={
                                () => {
                                    Actions.Login()
                                }
                            }
                        >
                            <Text style={{ color: '#0099ff', fontSize: 20, }}>취소</Text>
                        </Button>
                    </View>
                </Content>
                {
                    this.state.isLoading ?
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            style={{
                                width: "100%",
                                height: "100%", position: "absolute",
                                backgroundColor: "#fff", opacity: 0.5,
                            }}
                        />
                        :
                        null
                }

                <AddressModal
                    modalVisible={this.state.modalVisible}
                    addressListData={this.state.adressDataList}
                    selectAdress={this.selectAdress}
                    closeModal={this.closeModal}
                />

                <PolicyModal
                    policyModal={this.state.policyModal}
                    closeModal={()=>this.closeModal('policyModal')}
                    type={this.state.policyType}
                />

            </Container >
        );
    }
}

const styles = StyleSheet.create({
    checkBoxFont: {
        fontSize: 14,
        color: "#0099ff",
    }, 
    loginSubText: {
        fontSize: 14,
        color: "#0099ff",
    }, SignUpFormParent: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 7,
    }, SignUpTitle: {
        flex: 2,
        height: 25,
        marginLeft: 15,
        justifyContent: "center",

    }, SignUpSubText: {
        flex: 5,
        height: 25,
        marginRight: 15,
        justifyContent: "center",

    }, SignUpMobileInput: {

        flex: 4,
        height: 25,
        width: '100%',
        backgroundColor: "#eee",
        borderRadius: 5,

    }, ItemTitle: {
        flex: 20,
        height: 25,
        marginRight: 10,
        marginLeft: 15,
        justifyContent: "center"

    }, ItemText: {
        flex: 5,
        height: 25,
        marginLeft: 10,
        justifyContent: "center"
    },
    textInput: {
        flex: 1,
        height: 25,
        paddingLeft: 10,    
        backgroundColor: '#eee',
        borderBottomWidth: 0,
    },
    inputButton: {
        flex: 10,
        height: 25,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft:0,
        paddingRight:0,
        marginLeft:0,
        marginRight:0,
    },
    birthDropBox: {
        flex: 1,
        backgroundColor: "#eee",
        borderRadius: 5,
        marginRight: 2,
        flexDirection: "row",
        alignItems: "center",
    }
});

