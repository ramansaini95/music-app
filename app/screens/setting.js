import React, { PureComponent } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../components/colors";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
     name:'',
      data: [
        { id: 1, text: "Your Profile", type:'Greg Back'  },
        { id: 2, text: "Account Info", type: "Expired" },
        { id: 3, text: "Notifications", type: "Notifications" },
        { id: 4, text: "About Majesty", type: "Click here" },
      ],
      selectedId: 1,
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
    };
  }
  componentDidMount() {
    
    this.getPosition();
    
  }

  getPosition = async () => {
 let  name=await AsyncStorage.getItem('artistname')
 var artist=[...this.state.data]
 artist[0].type=name
    setInterval(async () => {
      this.setState({
        data:artist,
      
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
        <View
         style={{flex: 1}}
        >
          <View
            style={{
              marginTop: 50,
              marginLeft: 20,
              
            }}
          >
            <Text
              style={{
                color: COLORS.appWhite,
                fontSize: 36,
                fontFamily:
                  Platform.OS == "ios"
                    ? "SF Pro Display Bold"
                    : "SfProDisplayBold",
              }}
            >
              Settings
            </Text>
          </View>

          <FlatList
            data={this.state.data}
            style={{ marginTop: 15 }}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    style={
                      item.id == this.state.selectedId
                        ? {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            alignSelf: "center",
                            width: "95%",
                            height: 80,
                            backgroundColor: COLORS.appPurple + 44,
                            borderRadius: 10,
                            marginBottom: 10,
                            marginTop: 10,
                          }
                        : {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            alignSelf: "center",
                            width: "90%",
                            height: 45,
                          }
                    }
                    onPress={() => {
                      this.setState({
                        selectedId: item.id,
                      });
                      if (index == 0) {
                        
                       Navigation.push(this.props.componentId, {
                          component: {
                            name: "MyProfile",
                          },
                        });
                      } else if (index == 1) {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: "AccountDetail",
                            options: {
                              topBar: {
                                visible: false,
                              },
                            },
                          },
                        });
                      } else if (index == 2) {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: "notification",
                            options: {
                              topBar: {
                                visible: false,
                              },
                            },
                          },
                        });
                      } else if (index == 3) {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: "about",
                            options: {
                              topBar: {
                                visible: false,
                              },
                            },
                          },
                        });
                      }
                    }}
                  >
                    <View>
                      <Text
                        style={
                          item.id == this.state.selectedId
                            ? {
                                color: COLORS.appPurple,
                                fontSize: 14,
                                marginLeft: 10,
                                fontFamily:
                                  Platform.OS == "ios"
                                    ? "SF Pro Display Bold"
                                    : "SfProDisplayBold",
                              }
                            : {
                                color: "white",
                                fontSize: 21,
                                fontFamily:
                                  Platform.OS == "ios"
                                    ? "SF Pro Display"
                                    : "SfProDisplay",
                              }
                        }
                      >
                        {item.text}
                      </Text>
                      {item.id == this.state.selectedId ? (
                        <Text
                          style={{
                            color: COLORS.appWhite,
                            fontSize: 21,
                            fontFamily:
                              Platform.OS == "ios"
                                ? "SF Pro Display Bold"
                                : "SfProDisplayBold",
                            marginLeft: 10,
                            marginTop: 5,
                            marginRight:20
                            // width:"75%"
                          }}
                        >
                          {item.type}{" "}
                        </Text>
                      ) : (
                        <View></View>
                      )}
                    </View>

                    <Image
                      source={require("../assets/rightArrow.png")}
                      style={
                        item.id == this.state.selectedId
                          ? { width: 8, height: 14, marginRight: 10 }
                          : { width: 8, height: 14 }
                      }
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <TouchableOpacity
            onPress={() => {
              Navigation.push(this.props.componentId, {
                component: {
                  name: "terms",
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                },
              });
            }}
            style={{
              flexDirection: "row",
              width: "90%",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop:30,
            }}
          >
            <Text style={{ color: COLORS.appWhite }}>Terms & Conditions</Text>
            <Image
              source={require("../assets/rightArrow.png")}
              style={{ width: 8, height: 14 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Navigation.push(this.props.componentId, {
                component: {
                  name: "privacy",
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                },
              });
            }}
            style={{
              flexDirection: "row",
              width: "90%",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom:20
            }}
          >
            <Text style={{ color: COLORS.appWhite }}>Privacy Policy</Text>
            <Image
              source={require("../assets/rightArrow.png")}
              style={{ width: 8, height: 14 }}
            />
          </TouchableOpacity>
        </View>
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
    );
  }
}
