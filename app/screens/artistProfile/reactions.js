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
  ColorPropType,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import Player from "../../components/player";
import TrackPlayer from "react-native-track-player";
import { Loader } from "../../components/Loader";
import { ApiCall } from "../../components/ApiCall";

export default class Reactions extends PureComponent {
  state = {
    // data: [
    //   { id: 1, song: "Common Here", singer: "Experience Surprise" },
    //   { id: 2, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
    //   { id: 3, song: "Feeeeel", singer: "Adrie Nguyen" },
    //   { id: 4, song: "Overnight Package For The W…", singer: "Dana DeMule" },
    //   { id: 5, song: "Lethargic", singer: "Leona Grace-Finn" },
    // ],
    data:this.props.reactedtracks,
    duration: 0,
    position: 0,
    artist: "Masked wolf",
    title: "Astronout",
    follow_status:this.props.follow_status
  };
  componentDidMount() {
    this.getPosition();
    //alert(this.props.id)
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        ></StatusBar>

        <HeaderFile
          name={"Your Reactions"}
          back={"Back"}
          onClick={() => {
            Navigation.pop(this.props.componentId);
          }}
        />
        <View style={{ flex: 1 }}>
          {this.state.data==''?
            <View
               style={{
                 flex:1,
                 justifyContent:'center'
               }}
            >
              <Text
                  style={{
                    fontSize:20,
                    alignSelf:'center',
                    color:COLORS.appWhite,
                    textAlign:'center'
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        width: 80,
                        marginBottom: 5,
                      }}
                    >
                      {
                        item.react_status.clapemoji_status=='1' &&
                      
                      <Image
                        source={require("../../assets/union.png")}
                        style={{
                          width: 11.5,
                          height: 12,
                        }}
                      />}
                       {
                        item.react_status.fireemoji_status=='1' &&
                      <Image
                        source={require("../../assets/ellipse.png")}
                        style={{
                          width: 11,
                          height: 12,
                        }}
                      />}
                       {
                        item.react_status.sademoji_status=='1' &&
                      <Image
                        source={require("../../assets/emoji.png")}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />}
                       {
                        item.react_status.boringemoji_status=='1' &&
                      <Image
                        source={require("../../assets/boringemoji.png")}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />}
                       {
                        item.react_status.laughemoji_status=='1' &&
                      <Image
                        source={require("../../assets/laughemoji.png")}
                        style={{
                          width: 12,
                          height: 12,
                          tintColor:COLORS.appWhite
                        }}
                      />}
                       {
                        item.react_status.heartemoji_status=='1' &&
                      <Image
                        source={require("../../assets/heartemoji.png")}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />}
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
             {this.state.data!='' &&
            <View
              style={{
                // backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            </View>}
          </View>
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
