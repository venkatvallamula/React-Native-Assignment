import React, { Component } from 'react'
import {Alert,View,Image,ImageBackground,Dimensions,Modal,Text,FlatList,TouchableOpacity, Button,StyleSheet, Linking ,I18nManager} from 'react-native';
import { Content,Container, Right, Header, Left, Body} from 'native-base';
import { ProgressDialog } from 'react-native-simple-dialogs';
import NetInfo from "@react-native-community/netinfo";
import { Constant } from '../Global/Constant/Constant.js';
import deleteIcon from '../Global/assets/delete.png';
import CardView from 'react-native-cardview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-popup-dialog';
// BEGIN TO SETUP FONT-TYPE AND FONTSIZE
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
const scale = size => (Dimensions.get("window").width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const font_type = {
    FontLight: 'Helvetica',
    FontBold : 'Helvetica-Bold'
};
export default class PostComment extends Component {
    static navigationOptions = {
        header:  null
    }
    constructor(props, context) {
    super(props, context)
        this.state = {
            progressVisible:false,
            id:'',
            title:'',
            body:'',
            visible:false,
        };
        this.params = this.props.navigation.state.params;
        this.showPost(this.params.id);
   }

    showPost(id){
        console.log(id);
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if(state.isConnected){
            this.setState({progressVisible:true})
            fetch(Constant.BaseUrl+'posts/'+id, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            })
            .then((response) => {
            this.setState({progressVisible:false})
            if(response.status==200){
            response.json()
            .then((responseJson) => {

                this.setState({id:responseJson.id,
                title:responseJson.title,
                body:responseJson.body})
                console.log("response"+""+this.state.body)
            this.setState({progressVisible:false})
            }).catch((error) =>
            {
            this.setState({progressVisible:false})
            console.error("error"+error);
            }
            );
            }
            })
            }else{
            alert('Could Not Connect Internet')
            }
            });
        }
    deletePost(){
        NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        if(state.isConnected){
        this.setState({progressVisible:true})
        fetch(Constant.BaseUrl+'posts/'+this.state.id, {
        method: 'DELETE',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        })
        .then((response) => {
        this.setState({progressVisible:false})
        if(response.status==200){
        response.json()
        .then((responseJson) => {

            console.log("response"+""+JSON.stringify(responseJson))
        this.setState({progressVisible:false,visible:true})
        }).catch((error) =>
        {
        this.setState({progressVisible:false})
        console.error("error"+error);
        }
        );
        }
        })
        }else{
        alert('Could Not Connect Internet')
        }
        });
    }
    ok(){
         this.setState({visible:false})
         this.props.navigation.navigate('PostComment')
        }

    render() {
    return (
        <View style={styles.MainContainer}>
            {/* BEGIN TO SETUP HEADER VIEW */}
            <Header androidStatusBarColor={"#D22E2E"} style={styles.header}>
              {/* BEGIN TO SETUP LEFT VIEW */}
                <Left style={styles.left}>
                  <TouchableOpacity style={styles.back_arrow} onPress={()=> this.props.navigation.goBack()}>
                    <FontAwesome name="angle-left" size={30} color="white" style={{paddingRight: 20}}/>
                  </TouchableOpacity>
                </Left>
              {/* END TO SETUP LEFT VIEW */}

              {/* BEGIN TO SETUP BODY VIEW */}
                <Body style={styles.body}>
                  <Text style={styles.text_title}> Delete Post</Text>
                </Body>
              {/* END TO SETUP BODY VIEW */}

              {/* BEGIN TO SETUP RIGHT VIEW */}
                <Right style={styles.right}></Right>
              {/* END TO SETUP RIGHT VIEW */}
            </Header>
            <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                <View style={{flex:3,flexDirection:'column'}}>
                    <Text style={styles.text_head}>Id :{this.state.id}</Text>
                    <Text numberOfLines={1} style={styles.text_comments}>Title : {this.state.title}</Text>
                    <Text numberOfLines={1} style={styles.text_comments}>Body: {this.state.body}</Text>
                </View>
                <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
                <TouchableOpacity style={styles.item} onPress={this.deletePost.bind(this)}>
                    <Image
                    style={styles.stretch}
                    source={deleteIcon}
                  />
                </TouchableOpacity>
                </View>
            </View>
            <Dialog
                  dialogStyle={{width:'75%',height:'35%',justifyContent: 'center',backgroundColor:'#d1d3d1'}}
                  visible={this.state.visible}
                  onTouchOutside={() => {this.setState({ visible: false });}}
                  >
                  <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                       <Text>Successfully delete post </Text>
                      <TouchableOpacity style={styles.item} onPress={this.ok.bind(this)}>
                          <Text>Ok </Text>
                      </TouchableOpacity>
                  </View>
             </Dialog>

            <ProgressDialog
              visible={this.state.progressVisible}
              title="Progress Dialog"
              message="Please wait..."
              animationType={"fade"}
          />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer :{
  flex:1,
  backgroundColor:'#fff'
  },
  stretch: {
      width: 50,
      height: 50,
      resizeMode: 'stretch',
    },
   header: {
      backgroundColor: "#F34235",
      height: Dimensions.get("window").height * 0.1,
      borderBottomWidth: 0,
      ...Platform.select({
        ios: {
          paddingTop: (Dimensions.get("window").height * 0.02),
        },
        android: {
          paddingTop: Dimensions.get("window").width * 0.04
        }
      }),
      elevation: 0,
      paddingLeft: (Dimensions.get("window").width * 0.05),
      paddingRight: (Dimensions.get("window").width * 0.05),
    },
    left: {
      flex: 0.5,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    back_arrow: {
      justifyContent: 'center',
      alignItems: 'center',
    },
   text_head: {
         color: 'black',
         fontSize: moderateScale(25),
         marginTop:5,
         fontFamily: font_type.FontLight,

       },
   text_comments: {
    color: 'black',
    fontSize: moderateScale(18),
    marginTop:5,
    fontFamily: font_type.FontLight,
  },
   body: {
       flex: 2,
       alignItems: 'center',
       backgroundColor: 'rgba(0,0,0,0)'
     },
text_title: {
        color: 'white',
        fontSize: moderateScale(20),
        alignSelf: 'center',
        fontFamily: font_type.FontLight,
      },
  item:{
    borderColor: "transparent",
    flexDirection:'row',
    marginTop:30,


  },
})
