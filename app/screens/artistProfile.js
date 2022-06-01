import React, { PureComponent, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS } from "../components/colors";
import * as Progress from "react-native-progress";
import { Navigation } from "react-native-navigation";
import Collapsible from "react-native-collapsible";
import RBSheet from "react-native-raw-bottom-sheet";
import Player from "../components/player";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { ifIphoneX } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiCall } from "../components/ApiCall";
import { Loader } from "../components/Loader";
import moment from "moment";
import { song } from "../components/songs";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 140;
const Min_Header_Height = 130;

export default class ArtistProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      reacted_track: "",
      info: false,
      reactedsong: "",
      user_name: "",
      data: [
        { id: 1, name: "Epic Cure Us", image: require("../assets/dots.png") },
        { id: 2, name: "Swere Into Me", image: require("../assets/dots.png") },
        { id: 3, name: "Atoms", image: require("../assets/dots.png") },
        {
          id: 4,
          name: "In The Absence Of Pain ",
          image: require("../assets/dots.png"),
        },
        { id: 5, name: "Determin Esque", image: require("../assets/dots.png") },
      ],
      singers: [
        // { id: 1, name: "Socrates" },
        // { id: 2, name: "Fred Nietzsche" },
        // { id: 3, name: "Hannah Arendt" },
        // { id: 4, name: "Leo Tolstoy" },
        // { id: 5, name: "Spinoza" },
        // { id: 6, name: "Carl Jung" },
      ],
      isActive: false,
      collapsed: true,
      emoji: [
        {
          id: 1,
          image: require("../assets/emojis/emoji-1.png"),
          name: "heart",
        },
        {
          id: 2,
          image: require("../assets/emojis/emoji-2.png"),
          name: "boring",
        },
        {
          id: 3,
          image: require("../assets/emojis/emoji-3.png"),
          name: "laugh",
        },
        { id: 4, image: require("../assets/emojis/emoji-4.png"), name: "sad" },
        { id: 5, image: require("../assets/emojis/emoji-5.png"), name: "fire" },
        { id: 6, image: require("../assets/emojis/emoji-6.png"), name: "clap" },
      ],
      artist:this.props.artist!=''?this.props.artist:'',
      title: 'TestAudio',//this.props.data.title!='' && this.props.data.title!=null ?this.props.data.title:'Test',
      position: 0,
      duration: 0,
      UserToken: "",
      ArtistData: "",
      Artgear: "",
      popularTrack: "",
      isLoading: false,
      iselected: -1,
    };

    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  showActionSheet = () => {
    this.RBSheet.open();
  };
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  async componentDidMount() {
    //alert(song.Searchdata)
    const token = await AsyncStorage.getItem("token");
    const user_name = await AsyncStorage.getItem("artistname");
    this.setState({
      UserToken: token,
      user_name: user_name,
    });
    // alert(user_name)
    this.getPosition();
    this.GetArtistProfile();
    //alert(this.props.data.title)
  }

  getPosition = async () => {
    setInterval(async () => {
      this.setState({
        position: await TrackPlayer.getPosition(),
        duration: await TrackPlayer.getDuration(),
      });
    }, 500);
  };

  // PlaySong = async () => {
  //   await TrackPlayer.setupPlayer();
  //   await TrackPlayer.add(this.props.data);
  //   await TrackPlayer.play();
  // };

  GetArtistProfile = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "userbyid",
      {
        user_id: this.props.id,
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({
          isLoading: false,
        });
        if (responseJson.data.status == true) {
          //AsyncStorage.setItem("token", responseJson.data);
          this.setState({
            //artist:responseJson.data.data.user_id.username,
            ArtistData: responseJson.data.data,
            popularTrack: responseJson.data.data.popular_track,
            Artgear: responseJson.data.data.gear.join("+"),
            singers: responseJson.data.data.fan_also,
            reacted_track: responseJson.data.data.reacted_track,
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
            follow: !this.state.follow,
            isLoading: false,
          });
          this.GetArtistProfile();
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
  Reaction(post_id, react) {
    ApiCall(
      "postlike",
      {
        post_id: post_id,
        name: react,
      },
      (responseJson) => {
        if (responseJson.data.status == true) {
          //Alert.alert("",responseJson.data.message)
          this.RBSheet.close();
          console.log(responseJson.data);
        } else {
        }
      }
    );
  }

  render() {
    const headerHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, Max_Header_Height - Min_Header_Height],
      outputRange: [Max_Header_Height, Min_Header_Height],
      extrapolate: "clamp",
    });

    const MarginTop = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, 15 - 5],
      outputRange: [20, 5],
      extrapolate: "clamp",
    });

    const FontHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, 36 - 21],
      outputRange: [36, 21],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...ifIphoneX(
                {
                  marginTop: 100,
                },
                {
                  marginTop: 120,
                }
              ),
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: this.scrollYAnimatedValue },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
            onScrollBeginDrag={() => {
              this.setState({
                latest: false,
              });
            }}
          >
            <View style={{ width: "100%" }}>
              {this.state.ArtistData.image != null && (
                <View>
                  <Image
                    source={{ uri: this.state.ArtistData.image }}
                    style={{
                      width: "100%",
                      height: 240,
                      // marginTop: 120
                    }}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  width: "84%",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  BIO
                </Text>

                <TouchableOpacity
                  onPress={this.toggleExpanded}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.appWhite,
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display Bold"
                      //     : "SfProDisplayBold",
                    }}
                  >
                    {this.state.collapsed == true ? "FULL BIO" : "CLOSE BIO"}
                  </Text>
                  <Image
                    source={
                      this.state.collapsed == true
                        ? require("../assets/dropdown.png")
                        : require("../assets/cancel.png")
                    }
                    style={{
                      width: 10,
                      height: 6,
                      marginLeft: 5,
                      tintColor: "#fff",
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "85%",
                  alignSelf: "center",
                  marginTop: 10,
                  justifyContent: "center",
                  height: this.state.collapsed == true ? null : 0,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{ color: this.state.ArtistData.bio == null?COLORS.appGray:"#fff", textAlign: "left", fontSize: 21 }}
                >
                  {/* {this.state.collapsed == true
                    ? this.state.ArtistData.bio==null  :'No BIO'
                    ?this.state.ArtistData.bio
                    : this.state.ArtistData.bio} */}
                  {this.state.collapsed == true
                    ? this.state.ArtistData.bio == null
                      ? "No Bio"
                      : this.state.ArtistData.bio
                    : this.state.ArtistData.bio}
                </Text>
              </View>
              {this.state.ArtistData.bio != null && (
                <Collapsible collapsed={this.state.collapsed}>
                  <View style={{ marginHorizontal: 34 }}>
                    <Text
                      style={{
                        textAlign: "justify",
                        color:this.state.ArtistData.bio?COLORS.appGray: "#fff",
                        fontSize: 21,
                      }}
                    >
                      {this.state.ArtistData.bio == null
                        ? "No Bio"
                        : this.state.ArtistData.bio}
                      {/* I’m Pan Rose. Making organic sounds groove with a new kind
                    of blend whether we like it or not, we have all been born on
                    this earth as part of one great human family. Rich or poor,
                    educated or uneducated, belonging to one nation or another,
                    to one religion or another, adhering to this ideology or
                    that, ultimately each of us has the sensory power. */}
                    </Text>
                  </View>
                </Collapsible>
              )}
              <View
                style={{
                  flexDirection: "row",
                  width: "84%",
                  alignSelf: "center",
                  justifyContent: "space-between",
                  marginTop: 30,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../assets/heart.png")}
                    style={{
                      height: 10,
                      width: 12,
                      tintColor: COLORS.appPurple,
                      marginRight: 5,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.appPurple,
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display"
                      //     : "SfProDisplay",
                    }}
                  >
                    You reacted to{" "}
                    <Text
                      style={{
                        // fontFamily:
                        //   Platform.OS == "ios"
                        //     ? "SF Pro Display Bold"
                        //     : "SfProDisplayBold",
                        fontSize: 14,
                      }}
                    >
                      {this.state.reacted_track != "" &&
                      this.state.reacted_track.length == 0
                        ? "0"
                        : this.state.reacted_track.length}
                    </Text>{" "}
                    tracks
                  </Text>
                </View>

                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => {
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: "Reactions",
                        passProps: {
                          reactedtracks:
                            this.state.reacted_track != "" &&
                            this.state.reacted_track,
                          follow:
                            this.state.user_name != this.state.artist
                              ? true
                              : false,
                          follow_status:
                            this.state.ArtistData != "" &&
                            this.state.ArtistData.follow_status,
                          id: this.props.id,
                        },
                        options: {
                          topBar: {
                            visible: false,
                          },
                        },
                      },
                    });

                    // this.props.tracks("All");
                    // Navigation.dismissModal(this.props.componentId);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.appWhite,
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display Bold"
                      //     : "SfProDisplayBold",
                    }}
                  >
                    SEE TRACKS →
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 14,
                  marginLeft: 50,
                  marginTop: 6,
                  // fontFamily:
                  //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                by {this.state.ArtistData!=''?this.state.ArtistData.username:''}
              </Text>

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    width: "84%",
                    alignSelf: "center",
                    fontSize: 14,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  LATEST
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "95%",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",

                      justifyContent: "space-between",
                      width: "92%",
                    }}
                  >
                    <Image
                      source={require("../assets/play.png")}
                      style={{
                        tintColor: COLORS.appWhite,
                        width: 10,
                        height: 10,
                        marginTop: 10,
                        marginRight: 15,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 21,
                        color: COLORS.appWhite,
                        fontWeight: "800",
                        marginTop: 8,
                        width: "90%",
                      }}
                    >
                      {this.state.ArtistData.latest_track == null
                        ? "No Track"
                        : this.state.ArtistData.latest_track.track_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      tintColor: COLORS.appGray,
                      width: 20,
                      height: 10,
                      marginRight: 25,
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      this.setState({
                        reactedsong:
                          this.state.ArtistData != "" &&
                          this.state.ArtistData.latest_track._id,
                      });
                      this.showActionSheet();
                    }}
                  >
                    <Image
                      source={require("../assets/dots.png")}
                      style={{
                        tintColor: COLORS.appGray,
                        width: 18,
                        height: 4,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appGray,
                    // fontFamily:
                    //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    marginTop: 8,
                    width: "84%",
                    alignSelf: "center",
                  }}
                >
                 
                  { this.state.ArtistData.latest_track != null  ?
                    moment(
                      this.state.ArtistData.latest_track.createdAt
                    ).fromNow():''}
                </Text>
              </View>

              {this.state.popularTrack != null &&
                this.state.popularTrack != "" && (
                  <View
                    style={{
                      flexDirection: "row",
                      width: "84%",
                      alignSelf: "center",
                      justifyContent: "space-between",
                      marginTop: 30,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.appPurple,
                        // fontFamily:
                        //   Platform.OS == "ios"
                        //     ? "SF Pro Display Bold"
                        //     : "SfProDisplayBold",
                      }}
                    >
                      POPULAR
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: "AllTracks",
                            passProps: {
                              follow:
                                this.state.user_name != this.state.artist
                                  ? true
                                  : false,
                              follow_status:
                                this.state.ArtistData != "" &&
                                this.state.ArtistData.follow_status,
                              id: this.props.id,
                            },
                            options: {
                              topBar: {
                                visible: false,
                              },
                            },
                          },
                        });

                        //this.props.tracks("AllTracks");
                        // Navigation.dismissModal(this.props.componentId);
                      }}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: COLORS.appWhite,
                          // fontFamily:
                          //   Platform.OS == "ios"
                          //     ? "SF Pro Display Bold"
                          //     : "SfProDisplayBold",
                        }}
                      >
                        {"ALL " +
                          this.state.ArtistData.total_track_count +
                          " TRACKS →"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
            {this.state.popularTrack != null && this.state.popularTrack != "" && (
              <FlatList
                data={this.state.popularTrack}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        width: "84%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                        marginTop: 30,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: COLORS.appGray,
                          }}
                        >
                          {index + 1}{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 21,
                            color: COLORS.appWhite,
                            // fontFamily:
                            //   Platform.OS == "ios"
                            //     ? "SF Pro Display"
                            //     : "SfProDisplay",

                            marginLeft: 8,
                          }}
                        >
                          {item.track_name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={
                          {
                            //tintColor: COLORS.appGray,
                            // width: 18,
                            // height: 4,
                          }
                        }
                        onPress={() => {
                          this.setState({
                            reactedsong: item._id,
                          });
                          this.showActionSheet();
                        }}
                      >
                        <Image
                          source={require("../assets/dots.png")}
                          style={{
                            tintColor: COLORS.appGray,
                            width: 18,
                            height: 4,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}
            <View
              style={{
                width: "84%",
                alignSelf: "center",
                marginTop: 40,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.appPurple,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                }}
              >
                GEAR
              </Text>
            </View>

            <Text
              style={{
                color:
                  this.state.Artgear != null && this.state.Artgear != ""
                    ? COLORS.appWhite
                    : COLORS.appGray,
                alignSelf: "center",
                width: "84%",
                // fontFamily:
                //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                fontSize: 21,
                marginTop: 10,
              }}
            >
              {this.state.Artgear != null && this.state.Artgear != ""
                ? this.state.Artgear
                : "No Gear"}
            </Text>

            <View
              style={{
                width: "84%",
                alignSelf: "center",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.appPurple,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                }}
              >
                LINKS
              </Text>
            </View>
            {(this.state.ArtistData.spotify == null ||
              this.state.ArtistData.spotify == "") &&
              (this.state.ArtistData.instagram == null ||
                this.state.ArtistData.instagram == "") &&
              (this.state.ArtistData.instagram == null ||
                this.state.ArtistData.instagram == "") &&
              (this.state.ArtistData.twitter == null ||
                this.state.ArtistData.twitter == "") &&
              (this.state.ArtistData.website == null ||
                this.state.ArtistData.website == "") &&
              (this.state.ArtistData.soundcloud == null ||
                this.state.ArtistData.soundcloud == "") && (
                <Text
                  style={{
                    color: COLORS.appGray,
                    alignSelf: "center",
                    width: "84%",
                    // fontFamily:
                    //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 21,
                    marginTop: 12,
                  }}
                >
                  No links
                </Text>
              )}
            {this.state.ArtistData.spotify != null &&
              this.state.ArtistData.spotify != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    Spotify ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.ArtistData.instagram != null &&
              this.state.ArtistData.instagram != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 15,
                    }}
                  >
                    Instagram ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.ArtistData.website != null &&
              this.state.ArtistData.website != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 15,
                    }}
                  >
                    Website ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.ArtistData.soundcloud != null &&
              this.state.ArtistData.soundcloud != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 15,
                    }}
                  >
                    soundcloud ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.ArtistData.twitter != null &&
              this.state.ArtistData.twitter != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 15,
                    }}
                  >
                    Twitter ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.singers != "" && this.state.singers != null && (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginTop: 30,
                  backgroundColor: "#202020",
                  height: 200,
                }}
              >
                <Text
                  style={{
                    width: "84%",
                    alignSelf: "center",
                    fontSize: 12,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    marginTop: 10,
                  }}
                >
                  FANS ALSO LIKE
                </Text>

                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <FlatList
                    data={this.state.singers}
                    contentContainerStyle={{ alignSelf: "flex-start" }}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginLeft: 25 }}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "white",
                              height: 45,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 40,
                              padding: 10,
                              marginVertical: 10,
                              marginHorizontal: 5,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.appWhite,
                                fontSize: 21,
                              }}
                            >
                              {item.user_id.username}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                  />
                </ScrollView>
              </View>
            )}

            <View
              style={{
                ...ifIphoneX(
                  {
                    height: 80,
                  },
                  {
                    height: 100,
                  }
                ),
              }}
            ></View>
          </ScrollView>

          <Animated.View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "95%",
              height: headerHeight,
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              justifyContent: "center",
              // flexDirection:'row'
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "95%",
                alignSelf: "center",
                ...ifIphoneX(
                  {
                    marginTop: 40,
                  },
                  {
                    marginTop: 10,
                  }
                ),
              }}
            >
              <Animated.Text
                numberOfLines={2}
                style={{
                  color: COLORS.appWhite,
                  fontSize: FontHeight,
                  // fontFamily:
                  //   Platform.OS == "ios" ? "SF UI Display" : "SfProDisplayBold",
                  marginLeft: 18,
                  // ...ifIphoneX(
                  //   {
                  //     marginTop: 40,
                  //   },
                  //   {
                  //     marginTop: 10,
                  //   }
                  // ),
                }}
              >
                {this.state.artist}
              </Animated.Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    latest: !this.state.latest,
                  });
                }}
                style={{
                  width: 25,
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 20,
                  alignSelf: "center",
                }}
              >
                <Image
                  source={require("../assets/dots.png")}
                  style={{
                    tintColor: COLORS.appGray,
                    width: 18,
                    height: 4,
                    alignSelf: "center",
                  }}
                />

                {this.state.latest == true && (
                  <View
                    style={{
                      height: 75,
                      backgroundColor: "black",
                      width: 185,
                      position: "absolute",
                      top: 25,
                      borderRadius: 15,
                      alignItems: "center",
                      right: -20,
                      borderWidth: 0,
                      borderColor: "#ffffff22",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 180,
                        marginTop: 10,
                        alignItems: "center",
                        height: 50,
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        this.setState({
                          latest: false,
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.appWhite,

                          fontSize: 20,
                          color: "#fff",
                        }}
                      >
                        Share Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                alignSelf: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appGray,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                }}
              >
                {/* {this.props.data.views!='' || this.props.data.views!=null ?this.props.data.views:'0'
                 + " plays"} */}
              </Text>
            </View>
          </Animated.View>
        </View>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={140}
          openDuration={250}
          customStyles={{
            container: {
              backgroundColor: "transparent",
            },
            wrapper: {
              backgroundColor: "transparent",
            },
            draggableIcon: {
              backgroundColor: "transparent",
            },
          }}
        >
          <View style={{ height: 140, width: "100%" }}>
            <View
              style={{
                height: "42%",
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                borderRadius: 13,
              }}
            >
              <FlatList
                contentContainerStyle={{ alignItems: "center" }}
                data={this.state.emoji}
                horizontal
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ marginHorizontal: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState(
                            {
                              iselected: index,
                            },
                            () => {
                              this.Reaction(this.state.reactedsong, item.name);
                            }
                          );

                          //this.RBSheet.close();
                        }}
                      >
                        <Image
                          source={item.image}
                          style={{
                            height: 30,
                            width: 30,
                            opacity: this.state.iselected == index ? 1.0 : 0.5,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
            <View
              style={{ height: "10%", backgroundColor: "transparent" }}
            ></View>
            <TouchableOpacity
              style={{
                height: "38%",
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                borderRadius: 13,
              }}
              onPress={() => {
                this.RBSheet.close();
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "400", color: "#fff" }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: "10%", backgroundColor: "transparent" }}
            ></View>
          </View>
        </RBSheet>
        <View
          style={{
            width: width,
            // height: 189,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            alignItems: "center",
            // position: "absolute",
            // bottom: 0,
            // right: 0,
            // left: 0,
          }}
        >
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
            {this.state.user_name != this.state.artist && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (
                    this.state.UserToken != null &&
                    this.state.UserToken != ""
                  ) {
                    // Alert.alert(this.state.artist , this.state.user_name)
                    this.Follow();
                  } else {
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: "auth",
                        options: {
                          topBar: {
                            visible: false,
                          },
                          animations: {
                            push: {
                              content: {
                                translationY: {
                                  from: require("react-native").Dimensions.get(
                                    "screen"
                                  ).height,
                                  to: 0,
                                  duration: 300,
                                },
                              },
                            },
                          },
                        },
                      },
                    });
                  }
                }}
                style={{
                  width: 131,
                  height: 40,
                  backgroundColor: this.state.ArtistData.follow_status
                    ? "#000"
                    : COLORS.appPurple,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  borderColor: this.state.ArtistData.follow_status
                    ? "#fff"
                    : COLORS.appPurple,
                  borderWidth: this.state.ArtistData.follow_status ? 1 : 0,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appWhite,
                    fontWeight: "800",
                  }}
                >
                  {this.state.ArtistData.follow_status == true
                    ? "Following"
                    : "Follow"}
                </Text>
                {this.state.ArtistData.follow_status == true && (
                  <Image
                    style={{
                      width: 14,
                      height: 14,
                      tintColor: "#fff",
                      marginLeft: 5,
                    }}
                    source={require("../assets/check_mark.png")}
                  />
                )}
              </TouchableOpacity>
            )}
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
                  fontWeight: "800",
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
                source={require("../assets/close.png")}
                style={{ height: 40, width: 40 }}
              />
            </TouchableOpacity>
          </View>
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
              // this.PlaySong();
              await TrackPlayer.play();
            } else if (state == "paused") {
              await TrackPlayer.play();
            } else {
              await TrackPlayer.pause();
            }
          }}
        />
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    paddingTop: 30,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  headerText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    padding: 20,
    backgroundColor: "#000",
  },
  active: {
    backgroundColor: "rgba(255,255,255,1)",
  },
  inactive: {
    backgroundColor: "rgba(245,252,255,1)",
  },
  selectors: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  selector: {
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  activeSelector: {
    fontWeight: "bold",
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: "500",
    padding: 10,
    textAlign: "center",
  },
  multipleToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 30,
    alignItems: "center",
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});
