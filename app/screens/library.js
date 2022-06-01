import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Navigation } from "react-native-navigation";
import RBSheet from "react-native-raw-bottom-sheet";
import { COLORS } from "../components/colors";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";
import { ifIphoneX } from "react-native-iphone-x-helper";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 120;
const Min_Header_Height = 90;

export default class Library extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      info: false,
      data: [
        { id: 1, song: "Common Here", singer: "Experience Surprise" },
        { id: 2, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
        { id: 3, song: "Feeeeel", singer: "Adrie Nguyen" },
        { id: 4, song: "Overnight Package For The W…", singer: "Dana DeMule" },
        { id: 5, song: "Lethargic", singer: "Leona Grace-Finn" },
        { id: 6, song: "Ran Dumb Acts Off Mimery", singer: "Stupid Grunge" },
        { id: 7, song: "Tomorrow Never Goes", singer: "Adrie Nguyen" },
        { id: 8, song: "Common Here", singer: "Experience Surprise" },
        { id: 9, song: "Common Here", singer: "Experience Surprise" },
        { id: 10, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
        { id: 11, song: "Feeeeel", singer: "Adrie Nguyen" },
        { id: 12, song: "Overnight Package For The W…", singer: "Dana DeMule" },
        { id: 13, song: "Lethargic", singer: "Leona Grace-Finn" },
        { id: 14, song: "Ran Dumb Acts Off Mimery", singer: "Stupid Grunge" },
        { id: 15, song: "Tomorrow Never Goes", singer: "Adrie Nguyen" },
        { id: 16, song: "Common Here", singer: "Experience Surprise" },
        { id: 17, song: "Common Here", singer: "Experience Surprise" },
        { id: 18, song: "Quiet Inside The Road", singer: "Karmen Lamicoll" },
        { id: 19, song: "Feeeeel", singer: "Adrie Nguyen" },
        { id: 20, song: "Overnight Package For The W…", singer: "Dana DeMule" },
        { id: 21, song: "Lethargic", singer: "Leona Grace-Finn" },
        { id: 22, song: "Ran Dumb Acts Off Mimery", singer: "Stupid Grunge" },
        { id: 23, song: "Tomorrow Never Goes", singer: "Adrie Nguyen" },
      ],
      emoji: [
        { id: 1, image: require("../assets/emojis/emoji-1.png") },
        { id: 2, image: require("../assets/emojis/emoji-2.png") },
        { id: 3, image: require("../assets/emojis/emoji-3.png") },
        { id: 4, image: require("../assets/emojis/emoji-4.png") },
        { id: 5, image: require("../assets/emojis/emoji-5.png") },
        { id: 6, image: require("../assets/emojis/emoji-6.png") },
        { id: 7, image: require("../assets/emojis/emoji-2.png") },
      ],
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
    };

    this.scrollYAnimatedValue = new Animated.Value(0);
  }
  animate = () => {
    let progress = 0;
    this.setState({
      progress: progress,
    });
    setTimeout(() => {
      setInterval(() => {
        progress += Math.random() / 15;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress: progress });
      }, 500);
    }, 1000);
  };

  componentDidMount() {
    this.getPosition();
    this.animate();
  }
  showActionSheet = () => {
    this.RBSheet.open();
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
        <StatusBar barStyle={"light-content"} />
        <ScrollView
          ref={(ref) => (this.ScrollNew = ref)}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => {
            this.setState({
              info: false,
            });
          }}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue } },
            },
          ])}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
            }}
          >
            <FlatList
              data={this.state.data}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={{
                      ...ifIphoneX(
                        {
                          marginTop: 60,
                        },
                        {
                          marginTop: 80,
                        }
                      ),
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appPurple,
                        marginTop: 20,
                        fontFamily:
                          Platform.OS == "ios"
                            ? "SF Pro Display Bold"
                            : "SfProDisplayBold",
                        marginLeft: 20,
                      }}
                    >
                      Reactions
                    </Text>

                    <Text
                      style={{
                        color: COLORS.appGray,
                        marginTop: 4,
                        fontFamily:
                          Platform.OS == "ios"
                            ? "SF Pro Display"
                            : "SfProDisplay",
                        marginLeft: 20,
                      }}
                    >
                      You reacted to{" "}
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS == "ios"
                              ? "SF Pro Display Bold"
                              : "SfProDisplayBold",
                        }}
                      >
                        33{" "}
                      </Text>{" "}
                      tracks
                    </Text>
                  </View>
                );
              }}
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
                        <Image
                          source={require("../assets/union.png")}
                          style={{
                            width: 11.5,
                            height: 12,
                          }}
                        />
                        <Image
                          source={require("../assets/ellipse.png")}
                          style={{
                            width: 11,
                            height: 12,
                          }}
                        />
                        <Image
                          source={require("../assets/emoji.png")}
                          style={{
                            width: 12,
                            height: 12,
                          }}
                        />
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
                        {item.song}
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
                        {item.singer}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        width: 40,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
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
              // ListFooterComponent={() => {
              //   return <View style={{ height: 175 }}></View>;
              // }}
            />
          </View>
        </ScrollView>
        <Animated.View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            width: "100%",
            height: headerHeight,
            position: "absolute",
            top: 0,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              alignSelf: "center",
              marginTop: 50,
            }}
          >
            <Animated.Text
              style={{
                color: COLORS.appWhite,
                fontSize: FontHeight,
                fontFamily:
                  Platform.OS == "ios"
                    ? "SF Pro Display Bold"
                    : "SfProDisplayBold",
                ...ifIphoneX(
                  {
                    marginTop: 10,
                  },
                  {
                    marginTop: -10,
                  }
                ),
              }}
            >
              Library
            </Animated.Text>
          </View>
        </Animated.View>
        <View
          style={{
            //  right: 20
            alignSelf: "flex-end",
            marginRight: 20,
          }}
        >
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
                          this.RBSheet.close();
                        }}
                      >
                        <Image
                          source={item.image}
                          style={{
                            height: 30,
                            width: 30,
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
            <View
              style={{
                height: "38%",
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                borderRadius: 13,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "400", color: "#fff" }}>
                Cancel
              </Text>
            </View>
            <View
              style={{ height: "10%", backgroundColor: "transparent" }}
            ></View>
          </View>
        </RBSheet>
      </View>
    );
  }
}
