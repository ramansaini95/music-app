import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  FlatList,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCall } from "../components/ApiCall";
import { COLORS } from "../components/colors";
import { HeaderFile } from "../components/HeaderFile";
import { Loader } from "../components/Loader";

export default class searchBy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOffset: 0,
      data: [
        // { id: 1, song: "Common Here", singer: "Experience Surprise" },
        // { id: 2, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
        // { id: 3, song: "Feeeeel", singer: "Adrie Nguyen" },
        // { id: 4, song: "Overnight Package For The W…", singer: "Dana DeMule" },
        // { id: 5, song: "Lethargic", singer: "Leona Grace-Finn" },
      ],
      tracksView:false,
      artistview : true,
      search:'',
      isLoading:false,
      type:'artists'
    };
  }
  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };
  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardOffset: 0,
    });
  };
  _keyboardDidShow = (event) => {
    this.setState({
      keyboardOffset:
        Platform.OS == "android"
          ? event.endCoordinates.height / 1.1
          : event.endCoordinates.height / 1,
    });
  };

  SearchTracks = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "search",
      {
        type:this.state.type,
         params:this.state.search
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        // this.setState({
        //   isLoading:false,
          
        // })
        if (responseJson.data.status == true) {
          //AsyncStorage.setItem("token", responseJson.data);
          this.setState({
            
            data:responseJson.data.data,
            isLoading:false
          });
          console.log(responseJson.data.data);
        } else {
          this.setState({
            isLoading: false,
            // show: true,
            // Passerr: responseJson.data.error.slice(5, 200),
          });
          //alert(responseJson.data.error);
        }
      }
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <HeaderFile
          name={"Search"}
          back={"Back"}
          onClick={() => {
            Navigation.dismissModal(this.props.componentId);
          }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {this.state.artistview &&
            <View style={{ flex: 1 }}>
              <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        width: "92%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        marginTop: 20,
                        alignItems: "center",
                      }}
                      onPress={()=>{
                        Navigation.dismissModal(this.props.componentId);
                        if(this.props.searchData != null) {
                          this.props.searchData(item._id, item.username)
                        }
                      }}
                    >
                      {/* <View> */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            width: '90%',
                            marginBottom: 5,
                          }}
                        >

                        {/* </View> */}

                        <Text
                          style={{
                            fontSize: 21,
                            color: COLORS.appWhite,
                            fontFamily:
                              Platform.OS == "ios"
                                ? "SF Pro Display"
                                : "SfProDisplay",

                            marginLeft: 8,
                            width:'80%'
                          }}
                        >
                          {item.username}
                        </Text>


                      </View>

                      <Image
                        source={require("../assets/right_arrow.png")}
                        style={{
                          tintColor: COLORS.appGray,
                          width: 20,
                          height: 20,
                          resizeMode:'contain'
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
  }

{this.state.tracksView &&
            <View style={{ flex: 1 }}>
              <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        width: "92%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        marginTop: 20,
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            width: '90%',
                            marginBottom: 5,
                          }}
                        >

                        </View>

                        <Text
                          style={{
                            fontSize: 21,
                            color: COLORS.appWhite,
                            fontFamily:
                              Platform.OS == "ios"
                                ? "SF Pro Display"
                                : "SfProDisplay",

                            marginLeft: 8,
                            //width:'70%'
                          }}
                        >
                          {item.track_name}
                        </Text>

                        <Text
                          style={{
                            fontSize: 14,
                            color: COLORS.appGray,
                            fontFamily:
                              Platform.OS == "ios"
                                ? "SF Pro Display"
                                : "SfProDisplay",

                            marginLeft: 8,
                          }}
                        >
                         
                         {
                           item.user_id!='' && item.user_id!=null?item.user_id.username:''
                         }
                        </Text>
                      </View>

                      <Image
                        source={require("../assets/dots.png")}
                        style={{
                          tintColor: COLORS.appGray,
                          width: 18,
                          height: 4,
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>
  }
          </ScrollView>

          <View
            style={{
              width: "100%",
              height: 110,
              backgroundColor: "#000",
              alignItems: "center",
              marginBottom:20
            }}
          >
            <View
              style={{
                height: 50,
                width: "100%",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: "50%",
                  justifyContent: "center",
                }}
              >
               {this.state.artistview &&
                <View style={{ height: 2, backgroundColor: "#fff" }}></View>
                  }
                <TouchableOpacity
                onPress ={()=>{
                    if(this.state.artistview == true){
                        this.setState({
                            artistview:false,
                            tracksView: true,
                            type:'tracks'
                        },()=>{
                          this.SearchTracks()
                        })
                    }else{
                        this.setState({
                            artistview:true,
                            tracksView: false,
                            type:'artists'
                        },()=>{
                          this.SearchTracks()
                        }) 
                    }
                }}
                  style={{
                    height: "98%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#fff",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                          opacity:this.state.tracksView == true? 0.3: 1
                    }}
                  >
                    Artists
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "50%",
                  justifyContent: "center",
                }}
              >
                  {this.state.tracksView &&
                <View style={{ height: 2, backgroundColor: "#fff" }}></View>
                  }
                <TouchableOpacity
                 onPress ={()=>{
                    if(this.state.tracksView == true){
                        this.setState({
                            artistview:true,
                            tracksView: false,
                            type:'artists'
                        },()=>{
                          this.SearchTracks()
                        })
                    }else{
                        this.setState({
                            artistview:false,
                            tracksView: true,
                            type:'tracks'
                        },()=>{
                          this.SearchTracks()
                        }) 
                    }
                }}
                  style={{
                    height: "98%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#fff",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                          opacity:this.state.artistview == true? 0.3: 1
                    }}
                  >
                    Tracks
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder={"Search artists or tracks"}
                placeholderTextColor={COLORS.appGray}
                onChangeText={(text) => {
                  this.setState({
                    search: text,
                  },()=>{
                    this.SearchTracks();
                  });
                }}
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.appGray,
                  width: "80%",
                  height: 40,
                  backgroundColor: "black",
                  borderRadius: 10,
                  paddingLeft: 15,
                  color: COLORS.appWhite,
                  paddingRight: 15,
                  marginLeft: 25,
                }}
              />
              <TouchableOpacity
                style={{
                  height: 50,
                  width: "15%",
                  justifyContent: "center",
                  marginLeft: 10,
                  marginTop:-5
                }}
                onPress={() => {
                  Navigation.dismissModal(this.props.componentId);
                }}
              >
                <Image
                  source={require("../assets/close.png")}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}
