import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";
import * as Progress from "react-native-progress";
import Collapsible from "react-native-collapsible";
import Trimmer from "react-native-trimmer";
import TrackPlayer from "react-native-track-player";
import { ApiCall, ApiCallGet } from "../../components/ApiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Loader } from "../../components/Loader";
import { RNFFmpeg } from "react-native-ffmpeg";
import moment from "moment";
import { DocumentDirectoryPath } from "react-native-fs";
import { file } from "@babel/types";
import { ifIphoneX } from "react-native-iphone-x-helper";
const marginleft=12;
export default class editPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      trimmerLeftHandlePosition: 0,
      trimmerRightHandlePosition: 0,
      scrubberposition: 0,
      playing: false,
      AudioName:
        this.props.music.split("/").length > 0
          ? this.props.music.split("/")[this.props.music.split("/").length - 1]
          : this.props.music,
      TrackNotes: "",
      Sticker: "",
      scrubberInterval: "",
      stickerCount: "0",
      data: [
        {
          id: 1,
          image: require("../../assets/LineSticker/lineFeedback.png"),
          text: "FEEDBACK WANTED",
          height: 40,
          width: 100,
          isSelected: false,
        },
        {
          id: 2,
          image: require("../../assets/LineSticker/line_fullSong.png"),
          text: "FULL SONG",
          height: 30,
          width: 66,
          isSelected: false,
        },
        {
          id: 3,
          image: require("../../assets/LineSticker/lineClip.png"),
          text: "CLIP",
          width: 50,
          height: 20,
          isSelected: false,
        },
        {
          id: 4,
          image: require("../../assets/LineSticker/lineFinal.png"),
          text: "FINAL",
          width: 70,
          height: 30,
          isSelected: false,
        },
        {
          id: 5,
          image: require("../../assets/LineSticker/lineDemo.png"),
          text: "DEMO",
          width: 62,
          height: 15,
          isSelected: false,
        },
        {
          id: 6,
          image: require("../../assets/LineSticker/lineCover.png"),
          text: "COVER",
          width: 55,
          height: 22,
          isSelected: false,
        },
      ],
      collapsed: true,
      collapsed1: true,
      collapsed2: true,
      rotate: true,
      singers: [
        { id: 1, name: "Rock", isSelected: false },
        { id: 2, name: "Pop", isSelected: false },
        { id: 3, name: "Hip Hop", isSelected: false },
        { id: 4, name: "Metal", isSelected: false },
        { id: 5, name: "EDM", isSelected: false },
        { id: 6, name: "Electronic", isSelected: false },
        { id: 7, name: "Jazz", isSelected: false },
        { id: 8, name: "Bass", isSelected: false },
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
      ],
      isPlay: false,
      isPause: false,
      hash: "",
      gear: "",
      isSelected: false,
      getstickers: "",
      hashtagList: "",
      progress: 0,
      musicurl: "",
      isLoading: false,
      localmusic: this.props.music,
      trackDuration: 0,
      trackPosition: 0,
      localStorage: "",
    };
    this.anim = new Animated.Value(0);
  }
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };
  toggleExpanded1 = () => {
    this.setState({ collapsed1: !this.state.collapsed1 });
  };
  toggleExpanded2 = () => {
    this.setState({ collapsed2: !this.state.collapsed2 });
  };

  onHandleChange = ({ leftPosition, rightPosition }) => {
    this.setState(
      {
        trimmerRightHandlePosition: rightPosition,
        trimmerLeftHandlePosition: leftPosition,
        scrubberPosition: leftPosition,
        scrubberInterval: rightPosition + leftPosition / 2,
      },
      () => {
        console.log(rightPosition);
      }
    );
  };
  onAnimate = () => {
    this.anim.addListener(({ value }) => {
      this.setState({ progress: parseInt(value, 10) });
    });
    Animated.timing(this.anim, {
      toValue: 100,
      duration: 20000,
    }).start();
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    this.listner.remove();
  }

  componentDidMount() {
    this.listner = Navigation.events().registerScreenPoppedListener(
      async (btn) => {
        if (btn.componentId == "propsID") {
          this.startTimer();
        }
      }
    );
    this.timer = setInterval(async () => {
      const duration = await TrackPlayer.getDuration();
      const position = await TrackPlayer.getPosition();
      let currentTrack = await TrackPlayer.getCurrentTrack();

      if(duration > 0 && this.state.trimmerRightHandlePosition <= 1000) {
        this.setRightHand(duration * 1000)
      }

      if (position * 1000 >= this.state.trimmerRightHandlePosition) {
        TrackPlayer.seekTo(
          this.state.trimmerLeftHandlePosition > 0
            ? this.state.trimmerLeftHandlePosition / 1000
            : 0
        );
      } else {
        this.setState({
          trackPosition: parseInt(position * 1000),
          trackDuration: parseInt(duration * 1000),
        });
      }
    }, 1000);
    this.startTimer();
    this.onAnimate();
    setTimeout(() => {
      this.Sticker();
    }, 1000);
  }

  async setRightHand(duration) {
    // alert(this.state.trackDuration)
    this.setState({
      trimmerRightHandlePosition: duration > 45000 ? 45000 : (duration < 2000 ? 2000 : duration)
    })
  }

  startTimer = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add([
      {
        id: moment(new Date()).format("YYMMDDHHmmsss"),
        url: this.state.localmusic,
        title: "Track Title",
        artist: "Track Artist",
      },
    ]);
    
  };

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
    if (hDisplay != "") {
      return (
        (hDisplay.length > 1 ? hDisplay : "00" + hDisplay) +
        ":" +
        (mDisplay.length > 1 ? mDisplay : "00" + mDisplay) +
        ":" +
        (sDisplay.length > 1 ? sDisplay : "00" + sDisplay)
      );
    } else if (mDisplay != "") {
      return (
        (mDisplay.length > 1 ? mDisplay : "" + mDisplay) +
        ":" +
        (sDisplay.length > 1 ? sDisplay : "0" + sDisplay)
      );
    } else if (sDisplay != "") {
      return ":" + (sDisplay.length > 1 ? sDisplay : "0" + sDisplay);
    }
    return "00:00";
  }

  Clip = () => {
    try {
    let outputDirectory =
      DocumentDirectoryPath +
      "/" +
      "MajestyMusic" +
      // moment(new Date()).format("YYYYMMDD_HHmmsss") +
      ".aac";
    const clipQuery =
      "-y -ss " +
      parseInt(this.state.trimmerLeftHandlePosition / 1000) +
      " -t " +
      (parseInt(this.state.trimmerRightHandlePosition / 1000) -
        parseInt(this.state.trimmerLeftHandlePosition / 1000)) +
      " -i \"" +
      decodeURI(this.state.localmusic) +
      "\" " +
      outputDirectory;
    RNFFmpeg.execute(clipQuery).then(async (result) => {
      console.log(result);
      setTimeout(() => {
        this.Navigate(outputDirectory);
      }, 1200);
    });
  }
  catch(err) {
   // alert(err)
  }
  };

  PlaySong = async () => {
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
{limit:5},
      async (responseJson) => {
        console.log(JSON.stringify(responseJson.data.data));
        const duration = await TrackPlayer.getDuration();
        if (responseJson.data.status == true) {
          var stickers = [];
          responseJson.data.data.sticker.map((item, index) => {
            var sticker = {
              ...item,
              isSelected:
                item._id == "61402853596e02ec880bfa61"
                  ? duration > 45
                  : false,
                  
              isEnable:
                item._id == "61402853596e02ec880bfa61"
                  ? duration <= 45
                  : true,
                  
            };

            stickers.push(sticker);
            this.setState({
              isLoading: false,
              hashtagList: responseJson.data.data.hashtag,
              gears: responseJson.data.data.gear,
              stickerCount: stickers.filter((item) => item.isSelected).length
            });
            this.setState({
              getstickers: stickers,
            });
          });

          console.log(responseJson.data.data, "-----");
        } else {
          this.setState({ isLoading: false });

          alert(responseJson.data.error);
        }
      }
    );
  };

  onHandleTrimmerChange = ({ leftPosition, rightPosition }) => {
    if (leftPosition != this.state.trimmerLeftHandlePosition) {
      TrackPlayer.seekTo(leftPosition / 1000);
    }
    this.setState({
      trimmerLeftHandlePosition: leftPosition,
    });
    this.setState({
      trimmerRightHandlePosition: rightPosition,
    });
  };

  render() {
    const { trimmerLeftHandlePosition, trimmerRightHandlePosition } =
      this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBlack }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                ...ifIphoneX(
                  {
                    marginBottom: 120,
                  },
                  {
                    marginBottom: 140,
                  }
                ),
              }}
            >
              <View
                style={{
                  height: 40,
                  flexDirection: "row",
                  width: "90%",
                  alignSelf: "center",
                  //backgroundColor:'red',
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 40,
                    flexDirection: "row",
                    width: "87%",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/Majesty.png")}
                    style={{ width: 22, height: 18 }}
                  />

                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 20,
                      marginLeft: 10,
                      fontWeight: "600",
                    }}
                  >
                    Majesty
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ width: "17%", height: 30, justifyContent: "center" }}
                  onPress={async () => {
                    await TrackPlayer.reset();
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
                  <Text style={{ color: COLORS.appWhite }}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 70 }}>
                <Progress.Bar
                  width={width / 1.23}
                  height={2}
                  borderColor={"red"}
                  borderWidth={0}
                  color={COLORS.appPurple}
                  unfilledColor={COLORS.appWhite}
                  style={{ marginLeft: 37, marginTop: 13 }}
                  progress={this.state.progress / 120.0}
                />
                <View
                  style={{
                    // backgroundColor: "pink",
                    width: "82%",
                    height: 50,
                    alignSelf: "center",
                    marginTop: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: "#fff",
                      opacity: 0.6,
                      fontSize: 14,
                      width: "70%",
                    }}
                  >
                    {this.props.music.split("/").length > 0
                      ? this.props.music.split("/")[
                          this.props.music.split("/").length - 1
                        ]
                      : this.props.music}
                  </Text>
                  <Text style={{ color: "#fff", opacity: 0.6, fontSize: 14 }}>
                    Processing
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "88%",
                  alignSelf: "center",
                  marginTop:20
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: COLORS.appPurple,
                    marginLeft:marginleft
                  }}
                >
                  TRACK NAME
                </Text>
                <TextInput
                  placeholder={"Audio name"}
                  placeholderTextColor={COLORS.appGray}
                  onChangeText={(text) => {
                    this.setState({ AudioName: text });
                  }}
                  value={this.state.AudioName}
                  style={{
                    width: "100%",
                    height: 60,
                    borderWidth: 1,
                    borderColor: "#4D4D4D",
                    borderRadius: 10,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    color: COLORS.appWhite,
                  }}
                ></TextInput>
                
                <View
                  style={{
                    width: "100%",
                     height: 15,
                    // alignSelf: "center",
                    marginTop: 30,
                    flexDirection: "row",
                    //alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontWeight: "800",
                      fontSize: 12,
                      textTransform: "uppercase",
                      marginLeft:marginleft
                    }}
                  >
                    Track Region
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      opacity: 0.6,
                      fontSize: 14,
                     // fontWeight: "700",
                    }}
                  >
                    {this.secondsToHms(this.state.trackDuration / 1000)}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center",marginTop:-10 }}>
                  <View style={{ width: "80%" }}>
                  {this.state.trackDuration > 1500 && (
                      <Trimmer
                        onHandleChange={this.onHandleTrimmerChange}
                        totalDuration={
                          this.state.trackDuration == 0
                            ? 500000
                            : this.state.trackDuration
                        }
                        maxTrimDuration={45000}
                        minimumTrimDuration={1000}
                        maximumZoomLevel={1}
                        zoomMultiplier={1}
                        initialZoomValue={1}
                        scaleInOnInit={false}
                        markerColor={"white"}
                        trackBackgroundColor="#00000000"
                        trackBorderColor="#00000000"
                        scrubberColor="#18ACFE"
                        scrubberPosition={this.state.trackPosition}
                        onScrubbingComplete={(value) => {
                          TrackPlayer.seekTo(value / 1000);
                        }}
                        trimmerLeftHandlePosition={
                          this.state.trackDuration < trimmerRightHandlePosition
                            ? 0
                            : trimmerLeftHandlePosition
                        }
                        trimmerRightHandlePosition={
                          this.state.trackDuration < trimmerRightHandlePosition
                            ? 1000
                            : trimmerRightHandlePosition
                        }
                        tintColor={COLORS.appPurple}
                        url={{ uri: "file://" + this.state.localmusic }}
                      />
                    )}
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={async () => {
                      let state = await TrackPlayer.getState();
                      if (state == "idle" || this.state.isPlay == false) {
                        this.setState(
                          {
                            isPlay: true,
                          },
                          () => {
                            this.PlaySong();
                          }
                        );
                      } else if (
                        state == "paused" ||
                        this.state.isPlay == false
                      ) {
                        this.setState(
                          {
                            isPlay: true,
                          },
                          await TrackPlayer.play()
                        );
                      } else if (state == "play" || this.state.isPlay == true) {
                        this.setState({
                          isPlay: false,
                        });
                        await TrackPlayer.pause();
                      }
                    }}
                    style={{
                      height: 50,
                      borderRadius: 25,
                      width: 50,
                      marginLeft: 15,
                      backgroundColor: "#000",
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={
                        this.state.isPlay == true
                          ? require("../../assets/pause.png")
                          : require("../../assets/play_dark.png")
                      }
                      style={{
                        height: 18,
                        width: 18,
                        marginLeft: this.state.isPlay == false ? 5 : 0,
                        tintColor: "#fff",
                        //opacity: this.state.isPlay == true  ? 0.6 : 1,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    color: COLORS.appGray,
                    opacity: 0.8,
                    fontSize: 14,
                    fontWeight: "800",
                    marginTop: 10,
                    marginLeft: 10,
                  }}
                >
                  :
                  {parseInt(this.state.trimmerRightHandlePosition / 1000) -
                    parseInt(this.state.trimmerLeftHandlePosition / 1000)}{" "}
                  <Text style={{ color: "#fff", opacity: 0.6, fontSize: 14,fontWeight:'500' }}>
                    Seconds
                  </Text>
                </Text>
                
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: COLORS.appPurple,
                    marginTop: 30,
                    marginLeft:marginleft
                  }}
                >
                  TRACK NOTES
                </Text>
                <View>
                  <TextInput
                    placeholder={"Add details or feedback you’d like to get"}
                    placeholderTextColor={COLORS.appGray}
                    onChangeText={(text) => {
                      this.setState({ TrackNotes: text });
                    }}
                    multiline={true}
                    maxLength={240}
                    style={{
                      width: "100%",
                      height: 100,
                      borderWidth: 1,
                      borderColor: "#4D4D4D",
                      borderRadius: 10,
                      marginTop: 10,
                      paddingHorizontal: 10,
                      paddingRight: 70,
                      paddingBottom: 10,
                      paddingTop: 10,
                      color: COLORS.appWhite,
                    }}
                  ></TextInput>
                  <View
                    style={{
                      position: "absolute",
                      width: 60,
                      height: 20,
                      right: 12,
                      top: 16,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        opacity: 0.6,
                        fontSize: 12,
                        fontWeight: "400",
                      }}
                    >
                      {this.state.TrackNotes.length} / 240
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 30,
                      alignSelf: "center",
                      marginTop: 30,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appPurple,
                        fontWeight: "800",
                        fontSize: 12,
                        textTransform: "uppercase",
                        marginLeft:marginleft
                      }}
                    >
                      Stickers
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        opacity: 0.6,
                        fontSize: 12,
                        fontWeight: "400",
                      }}
                    >
                      {this.state.stickerCount} / 3
                    </Text>
                  </View>
                  <FlatList
                    data={this.state.getstickers}
                    numColumns={3}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          style={{
                            width:
                              ((Dimensions.get("window").width / 100) * 87) / 3,
                          }}
                        >
                          <TouchableOpacity
                            disabled={!item.isEnable}
                            onPress={() => {
                              var stickers = [...this.state.getstickers];
                              if (
                                !item.isSelected &&
                                stickers.filter((item) => item.isSelected)
                                  .length >= 3
                              ) {
                                console.log("3 selected");
                              } else {
                                stickers[index].isSelected =
                                  !stickers[index].isSelected;
                                this.setState({
                                  getstickers: stickers,
                                  stickerCount: stickers.filter(
                                    (item) => item.isSelected
                                  ).length,
                                });
                              }
                            }}
                            style={{
                              backgroundColor: "#2B2B2B",
                              // height: 54,
                              // width: 109,
                              marginVertical: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 6,
                              marginTop: 10,
                              margin: 5,
                              //opacity:0.6
                            }}
                          >
                            <Image
                              source={{ uri: item.sticker }}
                              style={{
                                //flex:1,
                                height: 50, //item.height,
                                width:
                                  ((Dimensions.get("window").width / 100) *
                                    50) /
                                  3, // item.width,
                                resizeMode: "contain",
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: item.isSelected ? 1.0 : 0.5,
                                transform: [
                                  {
                                    rotate:
                                      item.isSelected && index % 2 == 0
                                        ? "-15deg"
                                        : item.isSelected && index != 0
                                        ? "15deg"
                                        : "0deg",
                                  },
                                ],
                              }}
                            ></Image>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                  <View
                    style={{
                      width: "100%",
                      height: 30,
                      alignSelf: "center",
                      marginTop: 30,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appPurple,
                        fontWeight: "800",
                        fontSize: 12,
                        textTransform: "uppercase",
                        marginLeft:marginleft
                      }}
                    >
                      GENRES
                    </Text>
                    <TouchableOpacity onPress={this.toggleExpanded}>
                      {this.state.collapsed == true ? (
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "800",
                          }}
                        >
                          Add +
                        </Text>
                      ) : (
                        <Image
                          source={require("../../assets/cancel.png")}
                          style={{
                            width: 12,
                            height: 12,

                            //marginLeft: 5,
                            tintColor: "#fff",
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Collapsible collapsed={this.state.collapsed}>
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
                        scrollEnabled={false}
                        renderItem={({ item, index }) => {
                          return (
                            <View>
                              <TouchableOpacity
                                onPress={() => {
                                  var genres = [...this.state.singers];
                                  genres[index] = {
                                    ...item,
                                    isSelected: !item.isSelected,
                                  };
                                  if (
                                    genres.filter((item2) => item2.isSelected)
                                      .length <= 2
                                  ) {
                                    this.setState({
                                      singers: genres,
                                    });
                                  } else {
                                    console.log("3 selected");
                                  }
                                }}
                                style={{
                                  borderWidth: 1,
                                  borderColor: COLORS.appGray,
                                  height: 45,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: 40,
                                  padding: 10,
                                  marginVertical: 10,
                                  marginHorizontal: 5,
                                  backgroundColor: item.isSelected
                                    ? "#fff"
                                    : "transparent",
                                }}
                                activeOpacity={0.5}
                              >
                                <Text
                                  style={{
                                    color:
                                      item.isSelected == true
                                        ? "#000"
                                        : COLORS.appWhite,
                                    fontSize: 18,
                                    opacity: item.isSelected ? 1.0 : 0.6,
                                    fontWeight:item.isSelected == true
                                    ? '700'
                                    : 'normal'
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
                  </Collapsible>
                </View>
                <View
                  style={{
                    width: "100%",
                    height: 30,
                    alignSelf: "center",
                    marginTop: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontWeight: "800",
                      fontSize: 12,
                      textTransform: "uppercase",
                      marginLeft:marginleft
                    }}
                  >
                    HASHTAGS
                  </Text>
                  <TouchableOpacity onPress={this.toggleExpanded1}>
                    {this.state.collapsed1 == true ? (
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "800",
                        }}
                      >
                        Add +
                      </Text>
                    ) : (
                      <Image
                        source={require("../../assets/cancel.png")}
                        style={{
                          width: 12,
                          height: 12,
                          tintColor: "#fff",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <Collapsible collapsed={this.state.collapsed1}>
                  <View
                    style={{
                      width: "100%",
                      height: 40,
                      borderWidth: 1,
                      borderColor: COLORS.appGray,
                      opacity: this.state.hash == "" ? 0.4 : 1.0,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder={"Select or add your own #Hashtag"}
                      onChangeText={(text) => {
                        if (text.length > this.state.hash.length) {
                          var tags = text.split(" ");

                          var hashTags = tags.filter((item) =>
                            item.startsWith("#")
                          );
                          if (text.split("#").length > 6) {
                            //alert("greater");
                          } else {
                            var fTags = tags.filter(
                              (item) => !item.startsWith("#")
                            );
                            if (fTags.length > 0) {
                              fTags.map((item, index) => {
                                if (text.split("#").length <= 5) {
                                  hashTags.push("#" + item);
                                }
                              });
                            }
                            this.setState({ hash: hashTags.join(" ") });
                          }
                        } else {
                          this.setState({ hash: text });
                        }
                      }}
                      value={this.state.hash}
                      placeholderTextColor={COLORS.appWhite}
                      autoCorrect={false}
                      style={{
                        width: "88%",
                        height: 40,
                        paddingHorizontal: 10,
                        color: "#FFFFFF",
                        letterSpacing: 0.2,
                      }}
                    ></TextInput>
                    <Text style={{ fontSize: 14, color: COLORS.appGray }}>
                      {
                        this.state.hash.split("#").filter((item) => item != "")
                          .length
                      }{" "}
                      / 5
                    </Text>
                  </View>
                  <View style={{ height: 40, justifyContent: "center" }}>
                    <FlatList
                      data={this.state.hashtagList}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              height: 40,
                              alignItems: "center",
                              marginRight: 20,
                            }}
                            onPress={() => {
                              if (this.state.hash.split("#").length <= 5) {
                                this.setState({
                                  hash:
                                    this.state.hash != ""
                                      ? this.state.hash + " " + item.hashtag
                                      : item.hashtag,
                                });
                              }
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: COLORS.appWhite,
                                opacity: 0.4,
                                fontWeight: "400",
                              }}
                            >
                              {item.hashtag}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    ></FlatList>
                  </View>
                </Collapsible>
                <View
                  style={{
                    width: "100%",
                    height: 30,
                    alignSelf: "center",
                    marginTop: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appPurple,
                      fontWeight: "800",
                      fontSize: 12,
                      textTransform: "uppercase",
                      marginLeft:marginleft
                    }}
                  >
                    Gear
                  </Text>
                  <TouchableOpacity onPress={this.toggleExpanded2}>
                    {this.state.collapsed2 == true ? (
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "800",
                        }}
                      >
                        Add +
                      </Text>
                    ) : (
                      <Image
                        source={require("../../assets/cancel.png")}
                        style={{
                          width: 12,
                          height: 12,
                          tintColor: "#fff",
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <Collapsible collapsed={this.state.collapsed2}>
                  <View
                    style={{
                      width: "100%",
                      height: 40,
                      borderWidth: 1,
                      borderColor: COLORS.appGray,
                      opacity: this.state.gear == "" ? 0.4 : 1.0,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder={
                        "Add gear used on your track, separate with a  “+”"
                      }
                      placeholderTextColor={COLORS.appWhite}
                      autoCorrect={false}
                      onChangeText={(text) => {
                        // alert("lskd")
                        if (text.split("+").length > 5) {
                          //alert('greater')
                          this.setState({ gear: this.state.gear });
                        } else {
                          this.setState({ gear: text });
                        }
                      }}
                      value={this.state.gear}
                      style={{
                        width: "88%",
                        height: 40,
                        paddingHorizontal: 10,
                        color: "#fff",
                      }}
                    ></TextInput>
                    <Text style={{ fontSize: 14, color:COLORS.appGray }}>
                      {
                        this.state.gear.split("+").filter((item) => item != "")
                          .length
                      }{" "}
                      / 5
                    </Text>
                  </View>
                  <View style={{ height: 40, justifyContent: "center" }}>
                    <FlatList
                      data={this.state.gears}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              height: 40,
                              alignItems: "center",
                              marginRight: 20,
                            }}
                            onPress={() => {
                              if (this.state.gear.split("+").length < 5) {
                                this.setState({
                                  gear:
                                    this.state.gear != ""
                                      ? this.state.gear + "+" + item
                                      : item,
                                });
                              }
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: COLORS.appWhite,
                                opacity: 0.4,
                                fontWeight: "400",
                              }}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    ></FlatList>
                  </View>
                </Collapsible>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Loader visible={this.state.isLoading} />
        <View
          style={{
            width: "100%",
            backgroundColor: "#000",
            height: 120,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
            position: "absolute",
            bottom: 1,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              let selectstickers = [];

              this.state.getstickers.map((item) => {
                if (item.isSelected) {
                  selectstickers.push(item._id);
                }
              });
              let selectgeners = [];
              this.state.singers.map((item) => {
                if (item.isSelected) {
                  selectgeners.push(item.name);
                }
              });
              if (this.state.AudioName == "") {
                Alert.alert("", "Please add track name");
              } else if (this.state.TrackNotes == "") {
                Alert.alert("", "Please add track notes");
              } else if (this.state.hash == "") {
                Alert.alert("", "Please add hashtahgs");
              } else if (this.state.gear == "") {
                Alert.alert("", "Please add gears");
              } else if (selectstickers == "") {
                Alert.alert("", "Please select stickers");
              } else if (selectgeners == "") {
                Alert.alert("", "Please select genres");
              } else {
                this.Clip();
                await TrackPlayer.stop();
              }

              //this.postApi()
            }}
            style={{
              backgroundColor: COLORS.appWhite,
              marginTop: 10,
              width: "85%",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "black",
                fontWeight: "800",
              }}
            >
              Preview →
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  async Navigate(output) {
    await TrackPlayer.stop();
    let selectstickers = [];

    this.state.getstickers.map((item) => {
      if (item.isSelected) {
        selectstickers.push(item._id);
      }
    });
    let selectgeners = [];
    this.state.singers.map((item) => {
      if (item.isSelected) {
        selectgeners.push(item.name);
      }
    });

    Navigation.push(this.props.componentId, {
      component: {
        name: "previewPost",
        id: "propsID",
        passProps: {
          trackname: this.state.AudioName,
          tracknotes: this.state.TrackNotes,
          hashtag: this.state.hash.split(" "),
          genres: selectgeners,
          gear: this.state.gear.split(" "),
          sticker: selectstickers,
          music: output,
          musictype: this.props.musictype,
        },
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    });
  }
}
