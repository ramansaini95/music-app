import React, { PureComponent } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Animated,
} from "react-native";
import {
  Navigation,
  OptionsModalPresentationStyle,
} from "react-native-navigation";
import { COLORS } from "../components/colors";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";
import { ifIphoneX } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { song } from "../components/songs";
import { ApiCall, ApiCallGet } from "../components/ApiCall";
import { Loader } from "../components/Loader";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 110;
const Min_Header_Height = 80;

export default class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      singers: [
        { id: 1, name: "Rock" },
        { id: 2, name: "Pop" },
        { id: 3, name: "Hip Hop" },
        { id: 4, name: "Metal" },
        { id: 5, name: "EDM" },
        { id: 6, name: "Electronic" },
        { id: 7, name: "Jazz" },
        { id: 8, name: "Bass" },
      ],
      tags: [
        { id: 1, text: "#VoiceMemo" },
        { id: 2, text: "#NewIdea" },
        { id: 3, text: "#Beat" },
        { id: 4, text: "#Freestyle" },
        { id: 5, text: "#Solo" },
        { id: 6, text: "#IsThisAnything" },
        { id: 7, text: "#Band" },
        { id: 8, text: "#Vocals" },
        { id: 9, text: "#Harmony" },
        { id: 10, text: "#Guitar" },
        { id: 11, text: "#Drums" },
        { id: 12, text: "#ChillFun" },
      ],
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
      UserToken: "",
      hashtagList: "",
      isLoading: false,
      homeComponentId:
        props.homeComponentId != null ? props.homeComponentId : "",
    };
    this.scrollYAnimatedValue = new Animated.Value(0);
  }
  async componentDidMount() {
    console.log("YYY", song.Searchdata)
    const token = await AsyncStorage.getItem("token");
    this.setState(
      {
        UserToken: token,
      },
      () => {
        this.Sticker();
      }
    );
    this.getPosition();
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

  Sticker = async () => {
    this.setState({
      isLoading: true,
    });
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    ApiCall(
      "stickers",
      {
        limit: 12,
      },
      async (responseJson) => {
        console.log(JSON.stringify(responseJson.data.data));

        if (responseJson.data.status == true) {
          // var stickers = [];
          // responseJson.data.data.sticker.map((item, index) => {
          //   var sticker = {
          //     ...item,
          //     isSelected:
          //       item._id == "61402853596e02ec880bfa61"
          //         ? duration > 45
          //         : false,

          //     isEnable:
          //       item._id == "61402853596e02ec880bfa61"
          //         ? duration <= 45
          //         : true,

          //   };

          //   stickers.push(sticker);
          this.setState(
            {
              isLoading: false,
              hashtagList: responseJson.data.data.hashtag,
              //gears: responseJson.data.data.gear,
              data: responseJson.data.data.sticker,
              //stickerCount: stickers.filter((item) => item.isSelected).length
            },
            () => {
              console.log(this.state.data);
            }
          );

          //});

          console.log(responseJson.data.data, "-----");
        } else {
          this.setState({ isLoading: false });

          alert(responseJson.data.error);
        }
      }
    );
  };

  searchData = async (id, name) => {
    if (this.props.check == "nav") {
      Navigation.pop(this.props.componentId);
      let items = await TrackPlayer.getQueue()
      let index = await TrackPlayer.getCurrentTrack()
      Navigation.push(this.props.componentId, {
        component: {
          name: "ArtistProfile",
          passProps: {
            data:song.Searchdata, //items.length > index ? items[index] : null,
            // state: TrackPlayer.getState(),
            id: id,
            artist: name,
           //title: "TestAudio",
            // plays: item.views,
          },
          options: {
            topBar: {
              visible: false,
            },
            animations: {
              push: {
                content: {
                  translationY: {
                    from: require("react-native").Dimensions.get("screen")
                      .height,
                    to: 0,
                    duration: 300,
                  },
                },
              },
            },
          },
        },
      });
    } else {
      this.props.Close();
      Navigation.push(this.state.homeComponentId, {
        component: {
          name: "ArtistProfile",
          passProps: {
            // data: item,
            // state: TrackPlayer.getState(),
            id: id,
            artist: name,
            title: "TestAudio",
            // plays: item.views,
          },
          options: {
            topBar: {
              visible: false,
            },
            animations: {
              push: {
                content: {
                  translationY: {
                    from: require("react-native").Dimensions.get("screen")
                      .height,
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
        <ScrollView
          contentContainerStyle={{ paddingTop: 60 }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: this.scrollYAnimatedValue },
              },
            },
          ])}
          alwaysBounceVertical={false}
          bounces={false}
          style={{ flex: 1, 
            //marginBottom: 50 
          }}
        >
          <View
            style={{
              height: 150,
              ...ifIphoneX(
                {
                  marginTop: 20,
                },
                {
                  marginTop: 40,
                }
              ),
              width: "90%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.appPurple,
                fontSize: 10,
                fontFamily:
                  Platform.OS == "ios"
                    ? "SF Pro Display Bold"
                    : "SfProDisplayBold",
                marginBottom: 10,
              }}
            >
              BY STICKER
            </Text>
            <FlatList
              data={this.state.data}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.appBlack,
                        height: 54,
                        width: 109,
                        marginVertical: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        // alert(item.type[0].replace(/"/g, "'").slice(6))
                        (song.searchFilter = item.type[0]
                          .replace(/"/g, "'")
                          .slice(6)),
                          (song.searchFiltertype = "stickers"),
                          this.props.check == "nav"
                            ? Navigation.pop(this.props.componentId)
                            : this.props.Close();
                      }}
                    >
                      <Image
                        source={{ uri: item.sticker }}
                        style={{
                          height: 50, //item.height,
                          width:
                            ((Dimensions.get("window").width / 100) * 50) / 3, // item.width,
                          resizeMode: "contain",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                      {/* <Text
                          style={{
                            fontFamily:
                              Platform.OS == "ios"
                                ? "SF Pro Display Bold"
                                : "SfProDisplayBold",
                            fontSize: 11,
                            textAlign: "center",
                            width: 62,
                          }}
                        >
                          {item.sticker}
                        </Text> */}
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              marginTop: 30,
              height: 175,
            }}
          >
            <Text
              style={{
                width: "90%",
                alignSelf: "center",
                fontSize: 10,
                color: COLORS.appPurple,
                fontFamily:
                  Platform.OS == "ios"
                    ? "SF Pro Display Bold"
                    : "SfProDisplayBold",
                marginTop: 10,
                marginBottom: 3,
              }}
            >
              BY TOP GENRE
            </Text>

            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
            >
              <FlatList
                data={this.state.singers}
                contentContainerStyle={{ alignSelf: "flex-start" }}
                numColumns={this.state.singers.length / 2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: 10 }}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
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
                        onPress={() => {
                          (song.searchFilter = item.name),
                            (song.searchFiltertype = "genres"),
                            this.props.check == "nav"
                              ? Navigation.pop(this.props.componentId)
                              : this.props.Close();
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.appWhite,
                            fontSize: 18,
                          }}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </ScrollView>
          </View>

          <View
            style={{
              marginTop: 5,
              height: 150,
            }}
          >
            <Text
              style={{
                width: "90%",
                alignSelf: "center",
                fontSize: 12,
                color: COLORS.appPurple,
                fontFamily:
                  Platform.OS == "ios"
                    ? "SF Pro Display Bold"
                    : "SfProDisplayBold",
                marginTop: 10,
              }}
            >
              BY POPULAR TAG
            </Text>
            <ScrollView
              style={{
                height: 150,
                width: "95%",
                alignSelf: "center",
              }}
              horizontal
              bounces={false}
              scrollEnabled={true}
            >
              <FlatList
                data={this.state.hashtagList}
                numColumns={4}
                scrollEnabled={false}
                style={{ marginTop: 8, width: "90%" }}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          (song.searchFilter = item.hashtag),
                            (song.searchFiltertype = "hashtags");
                          this.props.check == "nav"
                            ? Navigation.pop(this.props.componentId)
                            : this.props.Close();
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: COLORS.appWhite,
                            // fontFamily:
                            //   Platform.OS == "ios"
                            //     ? "SF Pro Display Bold"
                            //     : "SfProDisplayBold",
                            marginHorizontal: 10,
                            marginVertical: 10,
                            fontWeight: "800",
                          }}
                        >
                          {item.hashtag}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </ScrollView>
          </View>

          <View
            style={{
              ...ifIphoneX(
                {
                  height: 30,
                },
                {
                  height: 10,
                }
              ),
            }}
          ></View>
        </ScrollView>
        <View
          style={{
            // position: "absolute",
            // bottom: 130,
            width: "100%",
            // height: 60,
            backgroundColor: "#000",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (this.state.UserToken != null && this.state.UserToken != "") {
                Navigation.showModal({
                  component: {
                    id: "searchBy",
                    name: "searchBy",
                    passProps: {
                      searchData: this.searchData,
                    },
                    options: {
                      modalPresentationStyle:
                        OptionsModalPresentationStyle.fullScreen,
                    },
                  },
                });
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
              borderWidth: 1,
              borderColor: COLORS.appGray,
              width: "75%",
              height: 40,
              backgroundColor: "black",
              borderRadius: 10,
              paddingLeft: 15,
              color: COLORS.appWhite,
              paddingRight: 15,
              marginLeft: 20,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: COLORS.appGray }}>
              Search artists or tracks
            </Text>
          </TouchableOpacity>
          {this.props.check == "nav" ? (
            <TouchableOpacity
              style={{
                height: 50,
                width: "20%",
                justifyContent: "center",
                marginLeft: 8,
              }}
              onPress={() => {
                Navigation.pop(this.props.componentId);
              }}
            >
              <Image
                source={require("../assets/close.png")}
                style={{ height: 45, width: 45 }}
              />
            </TouchableOpacity>
          ) : (
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
          )}
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

        <Animated.View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            width: "100%",
            height: headerHeight,
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            justifyContent: "center",
            // marginTop:50
            //backgroundColor:'red'
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
                  marginTop: 30,
                },
                {
                  marginTop: 10,
                }
              ),
            }}
          >
            Search
          </Animated.Text>
        </Animated.View>
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}
