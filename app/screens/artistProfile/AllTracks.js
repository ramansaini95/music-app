import React, { PureComponent } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import Player from "../../components/player";
import TrackPlayer from "react-native-track-player";
import { ApiCall } from "../../components/ApiCall";
import { Loader } from "../../components/Loader";

export default class AllTracks extends PureComponent {
  state = {
    data: [
      // { id: 1, song: "Common Here", singer: "Experience Surprise" },
      // { id: 2, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
      // { id: 3, song: "Feeeeel", singer: "Adrie Nguyen" },
      // { id: 4, song: "Overnight Package For The W…", singer: "Dana DeMule" },
      // { id: 5, song: "Lethargic", singer: "Leona Grace-Finn" },
    ],
    duration: 0,
    position: 0,
    artist: "Masked wolf",
    title: "Astronout",
    isLoading:false,
    follow_status:this.props.follow_status
  };
  componentDidMount() {
    this.AllTracks();
    this.getPosition();
  }
  Follow = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "follow",
      {
        follow_id: this.props.id,
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          //alert(responseJson.data.message);
          this.setState({
          follow_status:true,
            isLoading: false,
          });
          this.GetArtistProfile()
          console.log(responseJson.data.data);
        } else {
          //Alert.alert("", responseJson.data.error);
          this.setState({
            isLoading: false,
          });
          //alert(responseJson.data.error);
        }
      }
    );
  };
  getPosition = async () => {
    setInterval(async () => {
      this.setState({
        position: await TrackPlayer.getPosition(),
        duration: await TrackPlayer.getDuration(),
      });
    }, 500);
  };

  PlaySong = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(this.props.data);
    await TrackPlayer.play();
  };

  AllTracks = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "artisttracklist",
      {
        user_id: this.props.id,
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({
          isLoading:false,
          
        })
        if (responseJson.data.status == true) {
          //AsyncStorage.setItem("token", responseJson.data);
          this.setState({
            
            data:responseJson.data.data
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
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        ></StatusBar>

        <HeaderFile
          name={"All Tracks"}
          back={"Back"}
          onClick={() => {
            Navigation.pop(this.props.componentId);
          }}
        />
        <View style={{ flex: 1 }}>
          {
            this.state.data==''
            ?
            <View
            style={{ flex: 1,justifyContent:'center' }}
            >
              <Text
                 style={{
                   textAlign:'center',
                   fontSize:20
                 }}
              >
                No Tracks
              </Text>
              </View>
          :
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
                    <Text
                      style={{
                        fontSize: 21,
                        color: COLORS.appWhite,
                        fontFamily:
                          Platform.OS == "ios"
                            ? "SF Pro Display"
                            : "SfProDisplay",

                        marginLeft: 8,
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
                      {item.user_id.username}
                    </Text>
                  </View>

                  {/* <Image
                    source={require("../../assets/dots.png")}
                    style={{
                      tintColor: COLORS.appGray,
                      width: 18,
                      height: 4,
                    }}
                  /> */}
                </View>
              );
            }}
          />}
          {
            this.state.data!='' &&
          
          <View
            style={{
              width: width,
              height: 189,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              alignItems: "center",
              position: "absolute",
              bottom: 0,
              right: 0,
              left: 0,
            }}
          >
            <View
              style={{
                height: 55,
                width: "92%",
                flexDirection: "row",
                marginVertical: 5,
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
               {
                this.props.follow &&
              
              <TouchableOpacity
                style={{
                  width: 131,
                  height: 40,
                  backgroundColor: this.state.follow_status 
                  ? "#000"
                  : COLORS.appPurple,
                  borderColor:
                    this.state.follow_status
                      ? "#fff"
                      : COLORS.appPurple,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  borderWidth:
                    this.state.follow_status  ? 1 : 0,
                    flexDirection:'row'
                }}
                onPress={()=>{
                  this.Follow()
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appWhite,
                    fontFamily:
                      Platform.OS == "ios"
                        ? "SF Pro Display Bold"
                        : "SfProDisplayBold",
                  }}
                >
                  {this.state.follow_status?'Following':'Follow'}
                </Text>
                {this.state.follow_status && 
                  <Image
                    style={{
                      width: 14,
                      height: 14,
                      tintColor: "#fff",
                      marginLeft: 5,
                    }}
                    source={require("../../assets/check_mark.png")}
                  />
                }
              </TouchableOpacity>}
              <TouchableOpacity
                style={{
                  width: 131,
                  height: 40,
                  backgroundColor: COLORS.appWhite,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appBlack,
                    fontFamily:
                      Platform.OS == "ios"
                        ? "SF Pro Display Bold"
                        : "SfProDisplayBold",
                  }}
                >
                  Shuffle Play
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 30,
                  justifyContent: "center",
                }}
                onPress={() => {
                  Navigation.pop(this.props.componentId);
                }}
              >
                <Image
                  source={require("../../assets/close.png")}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>
            </View>
          </View>}
          <Loader  visible={this.state.isLoading}/>
          <Player
            artistName={this.state.artist}
            title={this.state.title}
            value={this.state.position}
            maximumValue={this.state.duration}
            onValueChange={(value) => {
              TrackPlayer.seekTo(value);
            }}
            playTrack={async () => {
              let state = await TrackPlayer.getState();
              if (state == "idle") {
                this.PlaySong();
              } else if (state == "paused") {
                await TrackPlayer.play();
              } else {
                await TrackPlayer.pause();
              }
            }}
          />
        </View>
      </View>
    );
  }
}
