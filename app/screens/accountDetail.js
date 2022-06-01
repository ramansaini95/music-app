import React, { PureComponent } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../components/colors";
import { HeaderFile } from "../components/HeaderFile";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AccountDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
      Profile: "",
    };
  }
  componentDidMount() {
    this.getPosition();
    this.ArtistProfile();
  }

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

  ArtistProfile = async () => {
    this.setState({
      isLoading: true,
    });
    const token = await AsyncStorage.getItem("token");
    fetch("http://18.116.105.68:3001/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        if (responseJson.status == true) {
          this.setState({
            isLoading: false,
            Profile: responseJson.data,
          });
          console.log(responseJson.data.gear);
        } else {
          Alert.alert("", responseJson.message);
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <HeaderFile
            name={"Account info"}
            back={"Settings"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          />
          <View>
            <Text
              style={{
                color: COLORS.appPurple,
                fontSize: 12,
                // fontFamily:
                //   Platform.OS == "ios"
                //     ? "SF Pro Display Bold"
                //     : "SfProDisplayBold",
                marginLeft: 30,
                marginTop: 30,
              }}
            >
              Artist Name
            </Text>
            <Text
              style={{
                color: COLORS.appWhite,
                fontSize: 21,
                // fontFamily:
                //   Platform.OS == "ios"
                //     ? "SF Pro Display Bold"
                //     : "SfProDisplayBold",
                marginLeft: 30,
                marginTop: 10,
                width: "90%",
              }}
            >
              {this.state.Profile.username}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 40,
              width: "84%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: COLORS.appPurple,
                  fontSize: 12,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  //   marginTop:30
                }}
              >
                Phone Number
              </Text>
              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 14,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  marginTop: 10,
                }}
              >
                419-787-7254
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 14,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  marginLeft: 30,
                  marginTop: 10,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              width: "84%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: COLORS.appPurple,
                  fontSize: 12,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  //   marginTop:30
                }}
              >
                Email
              </Text>
              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 14,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  marginTop: 10,
                }}
              >
                {this.state.Profile.email}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: "editEmail",
                    options: {
                      topBar: {
                        visible: false,
                      },
                    },
                  },
                });
              }}
            >
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 14,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                  marginLeft: 30,
                  marginTop: 10,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              width: "84%",
              alignSelf: "center",
              marginTop: 40,
              backgroundColor: COLORS.appGray,
            }}
          ></View>

          <TouchableOpacity
            onPress={() => {
              TrackPlayer.stop()
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("artistname");
              Navigation.setRoot({
                root: {
                  sideMenu: {
                    id: "Menu",
                    left: {
                      component: {
                        name: "SideMenu",
                      },
                    },
                    center: {
                      stack: {
                        id: "Drawer",
                        children: [
                          {
                            component: {
                              name: "Home",
                            },
                          },
                        ],
                        options: {
                          layout: {
                            direction: "ltr",
                            orientation: ["portrait"],
                          },
                          animations: {
                            setRoot: {
                              alpha: {
                                from: 0,
                                to: 1,
                                duration: 300,
                              },
                            },
                          },
                          topBar: {
                            visible: false,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }}
          >
            <Text
              style={{
                color: COLORS.appWhite,
                marginLeft: 30,
                marginTop: 30,
              }}
            >
              Sign Out
            </Text>
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
