import React, { PureComponent } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Animated,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS, global } from "../components/colors";
import Player from "../components/player";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { ifIphoneX } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { song } from "../components/songs";
import { ApiCall } from "../components/ApiCall";
import { Loader } from "../components/Loader";
import moment from "moment";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 120;
const Min_Header_Height = 110;
var appreciated = "";

export default class Feedback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectEmoji: "",
      selected: [],
      emoji: [
        {
          id: 1,
          image: require("../assets/emojis/emoji-1.png"),
          count: "2.5K",
          text: "❤",
        },
        {
          id: 2,
          image: require("../assets/emojis/emoji-5.png"),
          count: "4.5K",
          text: "🔥",
        },
        {
          id: 3,
          image: require("../assets/emojis/emoji-6.png"),
          count: "2.5K",
          text: "👏",
        },
        {
          id: 4,
          image: require("../assets/emojis/emoji-4.png"),
          count: "8.5K",
          text: "💎",
        },
        {
          id: 5,
          image: require("../assets/emojis/emoji-5.png"),
          count: "9.5K",
          text: "💪",
        },
        {
          id: 6,
          image: require("../assets/emojis/emoji-6.png"),
          count: "10.5K",
          text: "🕺",
        },
        {
          id: 7,
          image: require("../assets/emojis/emoji-2.png"),
          count: "12.5K",
          text: "💃",
        },
      ],
      CommentsData: [],
      swipeid: "",
      handle: false,
      comments: "",
      artist: "Pan Rose",
      title: "Holiday",
      position: 0,
      duration: 0,
      inputFocus: false,
      UserToken: "",
      song_id: "",
      USERID: "",
      userFeedID: "",
    };
    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  async componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        song_id: song.song_id,
        userFeedID: song.userfeed_id,
      });
    }, 200);

    setTimeout(() => {
      this.GetFeedBack();
    }, 500);

    const token = await AsyncStorage.getItem("token");
    const user_id = await AsyncStorage.getItem("user_id");
    this.setState({
      UserToken: token,
      USERID: user_id,
    });

    this.getPosition();
    this.listener = Keyboard.addListener("keyboardWillShow", () => {
      this.setState({
        inputFocus: true,
      });
    });

    this.dismiss = Keyboard.addListener("keyboardWillHide", () => {
      this.setState({
        inputFocus: false,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.listener.remove();
    this.dismiss.remove();
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

  FeedBack() {
    Keyboard.dismiss();
    this.setState({ isLoading: true });
    ApiCall(
      "givefeedback",
      {
        post_id: this.state.song_id,
        feedback: this.state.comments,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          this.setState(
            {
              isLoading: false,
              comments: "",
            },
            () => {
              this.GetFeedBack();
            }
          );
          console.log(responseJson.data.data);
        } else {
          this.setState({
            isLoading: false,
          });
        }
      }
    );
  }

  GetFeedBack() {
    this.setState({ isLoading: true });
    ApiCall(
      "getfeedback",
      {
        post_id: this.state.song_id,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          appreciated = responseJson.data.data.filter((item) => {
            return item.is_artist_appercated == "1";
          });
          let notApperiated = responseJson.data.data.filter((item) => {
            return item.is_artist_appercated == "0";
          });
          this.setState({
            CommentsData: [...appreciated, ...notApperiated],
            isLoading: false,
          });
          console.log(responseJson.data.data);
        } else {
          this.setState({
            isLoading: false,
          });
        }
      }
    );
  }

  AppreciateComments(ID) {
    this.setState({ isLoading: true });
    ApiCall(
      "appricatefeedback",
      {
        feedback_id: ID,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          this.setState(
            {
              isLoading: false,
            },
            () => {
              this.GetFeedBack();
            }
          );
          console.log(responseJson.data.data);
        } else {
          this.setState({
            isLoading: false,
          });
        }
      }
    );
  }

  rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
      extrapolate: "clamp",
    });

    return (
      this.state.handle == false && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            Alert.alert("Alert", "Are you sure you want to delete this?", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
              },
            ]);
          }}
        >
          <Animated.View
            style={{
              width: 80,
              height: 60,
              backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.Text
              style={{ fontSize: 10, fontWeight: "800", color: "#fff" }}
            >
              REPORT
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      )
    );
  };
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : null}
          enabled
        >
          <View style={{ flex: 1 }}>
            {this.state.CommentsData.length == 0 &&
            this.state.CommentsData == "" ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    letterSpacing: 0.2,
                    fontWeight: "400",
                    marginTop: 50,
                  }}
                >
                  No Comments Yet
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 14,
                    fontWeight: "400",
                    marginTop: 5,
                  }}
                >
                  Start the conversation
                </Text>
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{
                  ...ifIphoneX(
                    {
                      marginTop: 60,
                    },
                    {
                      marginTop: 80,
                    }
                  ),
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: { y: this.scrollYAnimatedValue },
                    },
                  },
                ])}
                bounces={false}
                data={this.state.CommentsData}
                onMomentumScrollBegin={() => {
                  Keyboard.dismiss();
                }}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      {index == 0 &&
                        this.state.CommentsData[0].is_artist_appercated ==
                          "1" && (
                          <View
                            style={{
                              backgroundColor: COLORS.appPurple + 44,
                              width: "93%",
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                              height: 30,
                              alignSelf: "center",
                              marginTop: 25,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.appPurple,
                                fontFamily:
                                  Platform.OS == "ios"
                                    ? "SF Pro Display Bold"
                                    : "SfProDisplayBold",
                                fontSize: 10,
                                marginLeft: 20,
                                marginTop: 15,
                                marginBottom: 2,
                              }}
                            >
                              ARTIST APPRECIATED
                            </Text>
                          </View>
                        )}
                      <View
                        style={{
                          width: "93%",
                          alignSelf: "center",
                          justifyContent: "center",
                          backgroundColor:
                            item.is_artist_appercated == "1"
                              ? COLORS.appPurple + 44
                              : "#000",
                          borderBottomRightRadius:
                            index == 1 && item.is_artist_appercated == "1"
                              ? 10
                              : 0,
                          borderBottomLeftRadius:
                            index == 1 && item.is_artist_appercated == "1"
                              ? 10
                              : 0,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            width: "92%",
                            marginVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignSelf: "center",
                          }}
                        >
                          <View style={{ width: "95%" }}>
                            <Text
                              style={{
                                color: COLORS.appWhite,

                                fontSize: 14,
                                fontWeight: "800",
                                letterSpacing: 0.02,
                                marginRight: 10,
                              }}
                            >
                              {item.user_id.username}
                              {"  "}
                              <Text
                                style={{
                                  color: COLORS.appWhite,
                                  fontSize: 14,
                                  letterSpacing: 0.02,
                                  opacity: 0.4,
                                  fontWeight: "400",
                                }}
                              >
                                {"at"} {moment(item.createdAt).format("hh:mm")}
                                {"  "}
                              </Text>
                              <Text
                                style={{
                                  color: COLORS.appWhite,
                                  fontSize: 14,
                                  width: 280,
                                  letterSpacing: 0.02,
                                  fontWeight: "400",
                                }}
                              >
                                {item.feedback}
                              </Text>
                            </Text>

                            <Text
                              style={{
                                color: COLORS.appGray,
                                marginTop: 5,
                              }}
                            >
                              {moment
                                .utc(item.createdAt)
                                .local()
                                .startOf("seconds")
                                .fromNow()}
                            </Text>
                          </View>
                          {this.state.USERID == this.state.userFeedID && (
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => {
                                if (appreciated.length == 2) {
                                  console.log("nothing");
                                  if (index == 0 || index == 1) {
                                    this.AppreciateComments(item._id);
                                  }
                                } else {
                                  this.AppreciateComments(item._id);
                                }
                              }}
                            >
                              <Image
                                source={
                                  item.is_artist_appercated == "0"
                                    ? require("../assets/like.png")
                                    : require("../assets/heart.png")
                                }
                                style={{
                                  width: 12,
                                  height: 10,
                                  marginTop: 5,
                                  tintColor: COLORS.appWhite,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                }}
                ListFooterComponent={() => {
                  return <View style={{ height: 100 }}></View>;
                }}
              />
            )}

            <Animated.View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                width: "100%",
                height: headerHeight,
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                justifyContent: "center",
              }}
            >
              <Animated.Text
                numberOfLines={5}
                style={{
                  color: COLORS.appWhite,
                  fontSize: FontHeight,
                  fontWeight: "800",
                  marginLeft: 18,
                  ...ifIphoneX(
                    {
                      marginTop: 45,
                    },
                    {
                      marginTop: 10,
                    }
                  ),
                }}
              >
                Feedback
              </Animated.Text>
            </Animated.View>

            <View
              style={{
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "100%",
                  marginLeft: 26,
                  marginBottom: 5,
                }}
              >
                <FlatList
                  data={this.state.emoji}
                  horizontal
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={false}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ marginHorizontal: 13 }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              inputFocus: true,
                              comments:
                                this.state.comments + " " + item.text + " ",
                            });
                            this.inputRef.focus();
                          }}
                        >
                          <Text style={{ fontSize: 21, marginTop: 5 }}>
                            {item.text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: "100%",
                height: 60,
                backgroundColor: "#000",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "80%",
                  borderWidth: 1,
                  borderColor: COLORS.appGray,
                  borderRadius: 10,
                  marginLeft: 20,
                  overflow: "hidden",
                }}
              >
                <TextInput
                  ref={(ref) => (this.inputRef = ref)}
                  placeholder={"Leave feedback or add a comment…"}
                  placeholderTextColor={COLORS.appGray}
                  value={this.state.comments}
                  onChangeText={(comments) => {
                    this.setState({ comments });
                  }}
                  style={{
                    width: "75%",
                    height: 40,
                    backgroundColor: "black",
                    paddingLeft: 15,
                    color: COLORS.appWhite,
                    paddingRight: 15,
                  }}
                />

                {this.state.comments.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        this.state.UserToken != null &&
                        this.state.UserToken != ""
                      ) {
                        this.FeedBack();
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
                      width: "25%",
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: COLORS.appPurple,
                      }}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={{
                  height: 50,
                  width: "20%",
                  justifyContent: "center",
                  marginLeft: 8,
                }}
                onPress={this.props.Close}
              >
                <Image
                  source={require("../assets/close.png")}
                  style={{ height: 45, width: 45 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}