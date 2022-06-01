import React, { createRef, PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../components/colors";
import Header from "../components/header";
import Swiper from "react-native-swiper";
import BottomTab from "../components/bottomTab";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import * as Progress from "react-native-progress";
import { global } from "../components/playerState";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import Slider from "react-native-slider";
import AutoScrolling from "react-native-auto-scrolling";
import { ifIphoneX } from "react-native-iphone-x-helper";

width = Dimensions.get("window").width;
height = Dimensions.get("window").height;

export class Intro extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      position: 0,
      duration: 0,
      artist: "",
      notes: true,

      swipeIndex: 0,

      scrollViewHeight1: 0,
      scrollViewHeight2: 0,
      scrollViewHeight3: 0,

      scrollContentHeight1: 0,
      scrollContentHeight2: 0,
      scrollContentHeight3: 0,

      showlyric: true,
      showHeart1: false,
      showHeart2: false,
      showHeart3: false,

      data: [
        {
          id: 0,
          title: "Majesty",
          album: "Majesty",
          artwork: require("../assets/giphy-2.gif"),
          artist: "Martin Garix",
          like: "7.7K",
          url: require("../assets/mp3/MajestyIntroStep1.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 1,
          title: "Doors Open",
          album: "Doors Open",
          artwork: require("../assets/giphy-1.gif"),
          artist: "Masked Wolf",
          url: require("../assets/mp3/MajestyIntroStep1.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 2,
          title: "Featuring",
          album: "Featuring",
          artwork: require("../assets/giphy-3.gif"),
          artist: "Ariana Grande",
          url: require("../assets/mp3/MajestyIntroStep2.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 3,
          title: "Here We Go",
          album: "Here we Go",
          artwork: require("../assets/giphy-1.gif"),
          artist: "KVSH",
          url: require("../assets/mp3/MajestyIntroStep3.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 4,
          title: "Tokyo Drift",
          album: "Tokyo Drift",
          artwork: require("../assets/giphy-1.gif"),
          artist: "KVSH",
          url: require("../assets/mp3/TokyoDrift.mp3"),
          genre: "Progressive House, Electro House",
        },
      ],
    };
  }

  componentDidMount() {
    TrackPlayer.addEventListener("playback-state", async (data) => {});
    TrackPlayer.setRepeatMode(RepeatMode.Track);
    this.PlaySong();
    this.getPosition();
  }
  getPosition = async () => {
    this.tracktime = setInterval(async () => {
      this.setState(
        {
          position: await TrackPlayer.getPosition(),
          duration: await TrackPlayer.getDuration(),
        },
        async () => {
          if (this.state.swipeIndex == 1) {
            this.ScrollRef.scrollTo({
              y:
                ((this.state.scrollContentHeight1 -
                  this.state.scrollViewHeight1) /
                  this.state.duration) *
                this.state.position,
              animated: true,
            });
          } else if (this.state.swipeIndex == 2) {
            this.ScrollRefTwo.scrollTo({
              y:
                ((this.state.scrollContentHeight2 -
                  this.state.scrollViewHeight2) /
                  this.state.duration) *
                this.state.position,
              animated: true,
            });
          } else if (this.state.swipeIndex == 3) {
            this.ScrollRefThree.scrollTo({
              y:
                ((this.state.scrollContentHeight3 -
                  this.state.scrollViewHeight3) /
                  this.state.duration) *
                this.state.position,
              animated: true,
            });
          }
        }
      );
    }, 300);
  };

  PlaySong = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add([...this.state.data]);
  };

  componentWillUnmount() {
    clearInterval(this.tracktime);
  }

  getTrack = async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    this.setState({
      artist: trackObject.title,
    });
  };

  render() {
    return (
      <View
        // onLayout={(event) => {
        //   this.find_dimesions(event.nativeEvent.layout);
        // }}
        style={{ flex: 1 }}
      >
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        />
        <Swiper
          loop={false}
          showsPagination={false}
          scrollEnabled={this.state.changeSong == true ? false : true}
          onIndexChanged={async (data) => {
            this.setState(
              {
                swipeIndex: data,
                position: 0,
              },
              async () => {
                await TrackPlayer.skip(data);
                if (data == 1) {
                  // TrackPlayer.addEventListener("playback-state", async (data) => {
                  //   if (data.state == "playing") {
                  //     this.startPlay();
                  //   } else {
                  //     clearInterval(this._timerId);
                  //   }
                  // });
                  // this.getTrack();
                  await TrackPlayer.play();
                } else if (data == 2) {
                  // TrackPlayer.addEventListener("playback-state", async (data) => {
                  //   if (data.state == "playing") {
                  //     this.SecondPlay();
                  //   } else {
                  //     clearInterval(this.SecondId);
                  //   }
                  // });
                  // this.getTrack();
                } else if (data == 3) {
                  // TrackPlayer.addEventListener("playback-state", async (data) => {
                  //   if (data.state == "playing") {
                  //     this.ThirdPlay();
                  //   } else {
                  //     clearInterval(this.ThirdId);
                  //   }
                  // });
                  // this.getTrack();
                } else if (data == 4) {
                   TrackPlayer.reset();
                  setTimeout(() => {
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
                  }, 100);
                } else if (data == 0) {
                  await TrackPlayer.pause();
                }
              }
            );
          }}
        >
          <ImageBackground
            source={require("../assets/giphy-1.gif")}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#00000099",
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            ></View>
            <Header />
            <Text
              style={{
                color: COLORS.appWhite,
                fontSize: 36,
                fontWeight: "800",
                width: "80%",
                //   alignSelf: 'center',
                fontFamily:
                  Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                marginLeft: 20,
                marginTop: 30,
              }}
            >
              0:45 share & tell
              {"\n"}
              for musicians
            </Text>
            <Text
              style={{
                color: COLORS.appGray,
                fontSize: 28,
                fontWeight: "400",
                width: "74%",
                fontFamily:
                  Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                marginLeft: 20,
                marginTop: 30,
              }}
            >
              Grab headphones,
              {"\n"}
              listen to the onboarding, and join the community.
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 150,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ width: 36, height: 42 }}
                source={require("../assets/SwipeIcon.gif")}
              />
            </View>
          </ImageBackground>

          <ImageBackground
            source={require("../assets/giphy-2.gif")}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#000000BB",
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            ></View>

            <View
              style={{
                height: "60%",
                //backgroundColor:'pink'
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  // ...ifIphoneX(
                  //   {
                  //     marginTop: 200,
                  //   },
                  //   {
                  //     marginTop: 250,
                  //   }
                  // ),
                  //backgroundColor:'red'
                }}
                ref={(ref) => (this.ScrollRef = ref)}
                // contentOffset = {{x: 0, y: (this.state.contentHeight / this.state.duration) * this.state.position}}
                onLayout={(event) => {
                  this.setState({
                    scrollViewHeight1: event.nativeEvent.layout.height,
                  });
                }}
                // onScrollBeginDrag={() => {
                //   this.setState({
                //     firstScroll: true,
                //   });
                // }}
              >
                {/* {this.state.notes == true && ( */}
                <View
                  onLayout={(event) => {
                    this.setState({
                      scrollContentHeight1: event.nativeEvent.layout.height,
                    });
                  }}
                  style={{
                    ...ifIphoneX(
                      {
                        paddingTop: 300,
                      },
                      {
                        paddingTop: 250,
                      }
                    ),
                    opacity:
                      this.state.notes && this.state.position > 0 ? 1.0 : 0.0,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 24,
                      fontWeight: "800",
                      width: "75%",
                      marginLeft: 20,
                      ...ifIphoneX(
                        {
                          marginTop: Dimensions.get("window").height / 4,
                        },
                        {
                          marginTop: Dimensions.get("window").height / 25,
                        }
                      ),
                    }}
                  >
                    👑
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      //   alignSelf: 'center',
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 20,
                    }}
                  >
                    Welcome to Majesty
                    {"\n"}
                  </Text>

                  <Animated.Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "67%",
                      //   alignSelf: 'center',
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      // marginTop: 30,
                    }}
                  >
                    A community of bedroom musicians sharing music and getting
                    feedback.
                    {"\n"}
                    {"\n"} Post a short song or a clip of a longer song — as
                    long as it’s 45 seconds or less.
                    {"\n"}
                    {"\n"} Here are four things to know about the app
                    {"\n"}
                  </Animated.Text>
                  <Image
                    style={{
                      width: 36,
                      height: 42,
                      marginLeft: 20,
                      marginBottom: this.state.scrollViewHeight1 / 5,
                    }}
                    source={require("../assets/SwipeIcon.gif")}
                  />
                </View>
                {/* )} */}
              </ScrollView>
            </View>

            <LinearGradient
              style={{
                position: "absolute",
                bottom: Dimensions.get("window").height / 19,
                width: "100%",
                height: "45%",
                marginLeft: 0,
              }}
              colors={[
                "transparent",
                "#000000EE",
                "transparent",
                "transparent",
              ]}
            />
            <LinearGradient
              style={{
                position: "absolute",
                bottom: Dimensions.get("window").height / 1.6,
                width: "100%",
                height: "45%",
                marginLeft: 0,
              }}
              colors={["#000", "#000000EE", "transparent", "transparent"]}
            />
            <View style={{ position: "absolute", bottom: height / 6 }}>
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                  marginTop: 43,
                }}
              >
                Majesty
              </Text>
              {this.state.data[1].title > 26 ? (
                <AutoScrolling
                  style={{
                    width: "98%",
                  }}
                  endPadding={50}
                >
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 34,
                      fontWeight: "800",
                      width: "70%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    {/* {this.state.artist} */}
                    {this.state.data[1].title}
                  </Text>
                </AutoScrolling>
              ) : (
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 34,
                    fontWeight: "800",
                    width: "70%",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {/* {this.state.artist} */}
                  {this.state.data[1].title}
                </Text>
              )}

              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                  marginTop: 5,
                }}
              >
                1 of 3
              </Text>
              <View
                style={{
                  width: width / 1.15,
                  height: 30,
                  justifyContent: "center",
                  marginTop: 13,
                  marginLeft: 20,
                }}
              >
                <Slider
                  style={{
                    width: width / 1.15,
                    height: 1,
                  }}
                  //disabled={true}

                  value={this.state.position}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  onValueChange={(value) => {
                    CurrentSlide =
                      ((this.state.contentHeight1 - this.state.scrollHeight) /
                        100) *
                      ((100 / this.state.duration) * value);
                    TrackPlayer.seekTo(value);
                  }}
                  minimumTrackTintColor={COLORS.appWhite}
                  maximumTrackTintColor="#00000055"
                  onSlidingStart={() => {
                    this.setState({
                      changeSong: true,
                    });
                  }}
                  onSlidingComplete={() => {
                    this.setState({
                      changeSong: false,
                    });
                  }}
                  thumbStyle={{ height: 0, width: 0 }}
                />
              </View>
            </View>
            <View
              style={{
                bottom: 30,
                position: "absolute",
              }}
            >
              <BottomTab
                showlyric={this.state.showlyric}
                showHeart={this.state.showHeart1}
                touch={() => {
                  this.setState({
                    notes: !this.state.notes,
                    showlyric: !this.state.showlyric,
                  });
                }}
                heartPress={() => {
                  this.setState({
                    showHeart1: !this.state.showHeart1,
                  });
                }}
              />
            </View>
          </ImageBackground>

          <ImageBackground
            source={require("../assets/giphy-3.gif")}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#000000BB",
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            ></View>
            <View
              style={{
                ...ifIphoneX(
                  {
                    height: "63%",
                  },
                  {
                    height: "60%",
                  }
                ),
              }}
            >
              <ScrollView
                style={{}}
                contentContainerStyle={{
                  flexGrow: 1,
                  // ...ifIphoneX(
                  //   {
                  //     marginTop: 300,
                  //   },
                  //   {
                  //     marginTop: 250,
                  //   }
                  // ),
                }}
                ref={(ref) => (this.ScrollRefTwo = ref)}
                onLayout={(event) => {
                  this.setState({
                    scrollViewHeight2: event.nativeEvent.layout.height,
                  });
                }}
                // onScrollBeginDrag={() => {
                //   this.setState({
                //     secondScroll: true,
                //   });
                // }}
              >
                {/* {this.state.notes == true && ( */}
                <View
                  style={{
                    ...ifIphoneX(
                      {
                        paddingTop: 300,
                      },
                      {
                        paddingTop: 250,
                      }
                    ),
                    opacity:
                      this.state.notes && this.state.position > 0 ? 1.0 : 0.0,
                  }}
                  onLayout={(event) => {
                    this.setState({
                      scrollContentHeight2: event.nativeEvent.layout.height,
                    });
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      ...ifIphoneX(
                        {
                          marginTop: Dimensions.get("window").height / 5.5,
                        },
                        {
                          marginTop: Dimensions.get("window").height / 9,
                        }
                      ),
                    }}
                  >
                    Stickers
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "55%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                    }}
                  >
                    You’ll see stickers like “Feedback Wanted” or “Final” to let
                    you know more about the track.
                    {"\n"}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    Track Notes
                  </Text>

                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "58%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    The little music icon at the bottom will show you details
                    from the artist about their track.
                    {"\n"}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    Reactions
                  </Text>

                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "60%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    Long press the heart icon for more ways to react to a track,
                    or just tap once to show some love.
                    {"\n"}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 10,
                    }}
                  >
                    Swiping
                  </Text>

                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "60%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    You can swipe to skip a track and swipe to go back. Swipe
                    down to search and swipe up for comments.
                    {"\n"}
                  </Text>
                  <Image
                    style={{
                      width: 36,
                      height: 42,
                      marginLeft: 20,
                      marginBottom: this.state.scrollViewHeight2 / 5,
                    }}
                    source={require("../assets/SwipeIcon.gif")}
                  />
                </View>
                {/* )} */}
              </ScrollView>
            </View>
            <LinearGradient
              style={{
                position: "relative",
                bottom: height / 9,
                width: "100%",
                height: "40%",
                marginLeft: 0,
              }}
              colors={[
                "transparent",
                "#000000EE",
                "transparent",
                "transparent",
              ]}
            />
            <LinearGradient
              style={{
                position: "absolute",
                bottom: Dimensions.get("window").height / 1.6,
                width: "100%",
                height: "45%",
                marginLeft: 0,
              }}
              colors={["#000", "#000000EE", "transparent", "transparent"]}
            />
            <View style={{ position: "absolute", bottom: height / 6 }}>
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                  marginTop: 15,
                }}
              >
                Majesty
              </Text>
              {this.state.data[2].title.length > 26 ? (
                <AutoScrolling
                  style={{
                    width: "98%",
                    backgroundColor: "red",
                  }}
                  endPadding={10}
                >
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 34,
                      fontWeight: "800",
                      width: "70%",
                      //   alignSelf: 'center',
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    {this.state.data[2].title}
                  </Text>
                </AutoScrolling>
              ) : (
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 34,
                    fontWeight: "800",
                    width: "95%",
                    //   alignSelf: 'center',
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {this.state.data[2].title}
                </Text>
              )}
              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                  marginTop: 5,
                }}
              >
                2 of 3
              </Text>
              <View
                style={{
                  width: width / 1.15,
                  height: 30,
                  justifyContent: "center",
                  marginTop: 13,
                  marginLeft: 20,
                }}
              >
                <Slider
                  style={{
                    width: width / 1.15,
                    height: 1,
                  }}
                  //disabled={true}
                  value={this.state.position}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  onValueChange={(value) => {
                    SecondSlide =
                      ((this.state.contentHeight1 - this.state.scrollHeight1) /
                        100) *
                      ((100 / this.state.duration) * value);
                    TrackPlayer.seekTo(value);
                  }}
                  minimumTrackTintColor={COLORS.appWhite}
                  maximumTrackTintColor="#00000055"
                  onSlidingStart={() => {
                    this.setState({
                      changeSong: true,
                    });
                  }}
                  onSlidingComplete={() => {
                    this.setState({
                      changeSong: false,
                    });
                  }}
                  thumbStyle={{ height: 0, width: 0 }}
                />
              </View>
            </View>
            <View
              style={{
                bottom: 30,
                position: "absolute",
              }}
            >
              <BottomTab
                showlyric={this.state.showlyric}
                showHeart={this.state.showHeart2}
                touch={() => {
                  this.setState(
                    {
                      notes: !this.state.notes,
                    },
                    () => {
                      if (global.showLyrics == 0) {
                        global.showLyrics = 1;
                      } else {
                        global.showLyrics = 0;
                      }
                    }
                  );
                }}
                heartPress={() => {
                  this.setState({
                    showHeart2: !this.state.showHeart2,
                  });
                }}
              />
            </View>
          </ImageBackground>

          <ImageBackground
            source={require("../assets/giphy-4.gif")}
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#000000BB",
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            ></View>
            <View
              style={{
                ...ifIphoneX(
                  {
                    height: "65%",
                  },
                  {
                    height: "60%",
                  }
                ),
                // marginTop: 10,
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,

                  // height:'50%'
                }}
                ref={(ref) => (this.ScrollRefThree = ref)}
                onLayout={(event) => {
                  this.setState({
                    scrollViewHeight3: event.nativeEvent.layout.height,
                  });
                }}
                onScrollBeginDrag={() => {
                  this.setState({
                    thirdScroll: true,
                  });
                }}
              >
                {/* {this.state.notes == true && ( */}
                <View
                  style={{
                    ...ifIphoneX(
                      {
                        paddingTop: 320,
                      },
                      {
                        paddingTop: 230,
                      }
                    ),
                    opacity:
                      this.state.notes && this.state.position > 0 ? 1.0 : 0.0,
                  }}
                  onLayout={(event) => {
                    this.setState({
                      scrollContentHeight3: event.nativeEvent.layout.height,
                    });
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 21,
                      fontWeight: "800",
                      width: "80%",
                      //   alignSelf: 'center',
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      ...ifIphoneX(
                        {
                          marginTop: Dimensions.get("window").height / 5.5,
                        },
                        {
                          marginTop: Dimensions.get("window").height / 7.5,
                        }
                      ),
                    }}
                  >
                    Early Bird Special
                  </Text>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 21,
                      fontWeight: "400",
                      width: "65%",
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      letterSpacing: 0.02,
                      marginTop: 20,
                    }}
                  >
                    You’re one of the first beta users, so let us know what you
                    think. Feedback is what this app is all about.
                    {"\n"}
                    {"\n"}
                    And post a track — even if it’s a voice memo or a rough
                    idea. Your music is worth sharing. We want to hear it.
                    {"\n"}
                    {"\n"}
                    Alright. Swipe to start listening, sharing and getting
                    inspiration from music under 45 seconds.
                  </Text>
                  <Image
                    style={{
                      width: 36,
                      height: 42,
                      marginLeft: 20,
                      marginBottom: this.state.scrollViewHeight3 / 5,
                      marginTop: 20,
                    }}
                    source={require("../assets/SwipeIcon.gif")}
                  />
                </View>
                {/* )} */}
              </ScrollView>
            </View>

            <LinearGradient
              style={{
                position: "relative",
                bottom: height / 8,
                width: "100%",
                height: "40%",
                marginLeft: 0,
              }}
              colors={[
                "transparent",
                "#000000EE",
                "transparent",
                "transparent",
              ]}
            />
            <LinearGradient
              style={{
                position: "absolute",
                bottom: Dimensions.get("window").height / 1.6,
                width: "100%",
                height: "45%",
                marginLeft: 0,
              }}
              colors={["#000", "#000000EE", "transparent", "transparent"]}
            />
            <View style={{ position: "absolute", bottom: height / 6 }}>
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                }}
              >
                Majesty
              </Text>
              {this.state.data[3].title.length > 26 ? (
                <AutoScrolling
                  style={{
                    width: "98%",
                    backgroundColor: "red",
                  }}
                  endPadding={50}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontSize: 34,
                      fontWeight: "800",
                      width: "70%",
                      //   alignSelf: 'center',
                      fontFamily:
                        Platform.OS == "ios"
                          ? "SF Pro Display"
                          : "SfProDisplay",
                      marginLeft: 20,
                      marginTop: 5,
                    }}
                  >
                    {this.state.data[3].title}
                  </Text>
                </AutoScrolling>
              ) : (
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 34,
                    fontWeight: "800",
                    width: "70%",
                    //   alignSelf: 'center',
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {this.state.data[3].title}
                </Text>
              )}
              <Text
                style={{
                  color: COLORS.appGray,
                  fontSize: 16,
                  fontWeight: "400",
                  width: "70%",
                  //   alignSelf: 'center',
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginLeft: 20,
                  marginTop: 5,
                }}
              >
                3 of 3
              </Text>
              <View
                style={{
                  width: width / 1.15,
                  height: 30,
                  justifyContent: "center",
                  marginTop: 13,
                  marginLeft: 20,
                }}
              >
                <Slider
                  style={{
                    width: width / 1.15,
                    height: 1,
                  }}
                  // disabled={true}
                  value={this.state.position}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  onValueChange={(value) => {
                    ThirdSlide =
                      ((this.state.contentHeight1 - this.state.scrollHeight2) /
                        100) *
                      ((100 / this.state.duration) * value);
                    TrackPlayer.seekTo(value);
                  }}
                  minimumTrackTintColor={COLORS.appWhite}
                  maximumTrackTintColor="#00000055"
                  onSlidingStart={() => {
                    this.setState({
                      changeSong: true,
                    });
                  }}
                  onSlidingComplete={() => {
                    this.setState({
                      changeSong: false,
                    });
                  }}
                  // thumbImage={require('../assets/circle.png')}
                  // thumbTintColor={"#00000088"}
                  thumbStyle={{ height: 0, width: 0 }}
                  // animationType={'spring'}
                />
              </View>
            </View>

            <View
              style={{
                bottom: 30,
                position: "absolute",
                // backgroundColor:'gray'
              }}
            >
              <BottomTab
                showlyric={this.state.showlyric}
                showHeart={this.state.showHeart3}
                touch={() => {
                  this.setState(
                    {
                      notes: !this.state.notes,
                    },
                    () => {
                      if (global.showLyrics == 0) {
                        global.showLyrics = 1;
                      } else {
                        global.showLyrics = 0;
                      }
                    }
                  );
                }}
                heartPress={() => {
                  this.setState({
                    showHeart3: !this.state.showHeart3,
                  });
                }}
              />
            </View>
          </ImageBackground>

          <View style={{ flex: 1, backgroundColor: "black" }}></View>
        </Swiper>
      </View>
    );
  }
}

export default Intro;
