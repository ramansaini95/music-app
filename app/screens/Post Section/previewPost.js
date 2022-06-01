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
  Alert,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";
import * as Progress from "react-native-progress";
import SwipeButton from "rn-swipe-button";
import { ApiCall } from "../../components/ApiCall";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Slider from "react-native-slider";
import AutoScrolling from "react-native-auto-scrolling";
import { Loader } from "../../components/Loader";
import moment from "moment";

export default class previewPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.hashtag,
      gears: props.gear,
      musictype: "audio/aac",
      getSticker: "",
      progress: 0,
      position: 0,
      duration: 0,
      Stickerid: "",
      music: props.music,
      musicurl: "",
      musicName:
        props.music != null && props.music.split("/").length > 0
          ? props.music.split("/")[props.music.split("/").length - 1]
          : props.music,
      Artistname: "",
      isLoading: false,
      show:false
    };
  }
  async componentWillUnmount() {
    this.setState({
      music: "",
    });
    await TrackPlayer.stop();
  }

  componentDidMount = async () => {
    console.log("==>" + this.state.music);
    this.onUpload();
    this.Sticker();
    this.setState({
      Artistname: await AsyncStorage.getItem("artistname"),
    });
  };

  Sticker = async () => {
    this.setState({ isLoading: true });
    ApiCall(
      "stickerbyid",
      {
        id: this.props.sticker.join(","),
      },

      (responseJson) => {
        console.log(JSON.stringify(responseJson.data.data));
        if (responseJson.data.status == true) {
          this.setState({
            getSticker: responseJson.data.data[0].sticker,
            Stickerid: responseJson.data.data[0]._id,
            isLoading: false,
          });

          console.log(this.state.Stickerid);
        } else {
          this.setState({ isLoading: false });
        }
      }
    );
  };

  onUpload = async () => {
   

    const config = {
      onUploadProgress: (progressEvent) => {
        let { progress } = this.state;
        progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.setState({ progress: progress });
        console.log(progress / 100.0);
      },
    };

    let formData = new FormData();
    formData.append("image", {
      uri: this.state.music,
      type: this.state.musictype,
      name: "track_" + moment(new Date()).format('YYYYMMDDHHmmSSS') + '.' + this.state.musictype //this.state.musicName,
    });
    axios
      .post("http://18.116.105.68:3001/imageupload", formData, config)
      .then((res) => {
        if (res.data.status == true) {
          console.log("done: ", res.data.data);
          this.setState(
            {
              musicurl: res.data.data,
            },
            () => {
              this.PlaySong();
            }
          );
        }
      })
      .catch((err) => {
        console.log("error: ", err.message);
      });
  };

  postApi = async () => {
    console.log(this.props.hashtag.join(","));
    try {
      ApiCall(
        "post",
        {
          trackname: this.props.trackname,
          tracknotes: this.props.tracknotes,
          track: this.state.musicurl,
          hashtag: this.props.hashtag.join(","),
          sticker: this.state.Stickerid,
          generes: this.props.genres.join(","),
          gear: this.state.gears.join(","),
        },
        async (responseJson) => {
          console.log(JSON.stringify(responseJson.data));
          if (responseJson.data.status == true) {
            Alert.alert("", responseJson.data.message);
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
          } else {
            alert(responseJson.data.error);
          }
        }
      );
    } catch {
      console.error(error);
    }
  };

  PlaySong = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      id: "1",
      url: this.state.music,
      title: "Track",
      artist: "Artist",
    });
    await TrackPlayer.play();
    setInterval(async () => {
      const duration = await TrackPlayer.getDuration();
      const position = await TrackPlayer.getPosition();
      this.setState(
        {
          show:true,
          position: parseInt(position),
          duration: parseInt(duration),
        },
        async () => {
          console.log(this.state.position + 1 + "   " + this.state.duration);
          if (this.state.position == this.state.duration) {
            this.setState(
              {
                //isPlay: true,
              },
              async () => {
                await TrackPlayer.setRepeatMode(RepeatMode.Track)
              }
            );
          } else {
          }
        }
      );
    }, 500);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBlack }}>
        <ScrollView style={{ flex: 1, marginBottom: 50 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 40,
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
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
                  style={{ width: 22, height: 18, }}
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
                <Text style={{ color: "#747474" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 70 }}>
              <Progress.Bar
                width={width / 1.14}
                height={2}
                borderColor={"red"}
                borderWidth={0}
                color={COLORS.appPurple}
                unfilledColor={COLORS.appWhite}
                style={{ marginLeft: 25, marginTop: 13 }}
                progress={this.state.progress / 100.0}
              />
              <View
                style={{
                  width: "88%",
                  height: 30,
                  alignSelf: "center",
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#fff", opacity: 0.6, fontSize: 14 }}>
                  {this.state.musicName}
                </Text><View
                     style={{
                       flexDirection:'row'
                     }}
                >
                <Text style={{ color: "#fff", opacity: 0.6, fontSize: 14 }}>
                  {this.state.progress / 100.0 != 1
                    ? "Processing"
                    : "Ready to publish"}
                </Text>
                {this.state.progress / 100.0 == 1 &&
                <Image
                    style={{
                      height:13,
                      width:13,
                      tintColor:'#fff',
                      marginLeft:5
                    }}
                    source={require('../../assets/tick.png')}
                >

                </Image>}</View>
              </View>
            </View>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
              }}
            >
              <View style={{ width: "100%" }}>
                <FlatList
                  data={this.state.tags}
                  numColumns={3}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          height: null,
                          alignItems: "center",
                          marginRight: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#A6A6A6",
                            fontWeight: "400",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
              <Text
                style={{
                  color: "#A6A6A6",
                  fontWeight: "800",
                  fontSize: 12,
                  textTransform: "uppercase",
                  marginTop: 15,
                }}
              >
                Gear
              </Text>
              <View style={{ width: "100%", marginTop: 10 }}>
                <FlatList
                  data={this.state.gears}
                  numColumns={3}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          height: null,
                          alignItems: "center",
                          marginRight: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#A6A6A6",
                            fontWeight: "400",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
              <Text
                style={{
                  width: "78%",
                  fontSize: 21,
                  color: COLORS.appWhite,
                  marginTop: 50,
                  fontWeight: "400",
                }}
              >
                {this.props.tracknotes}
              </Text>
              <View style={{ marginTop: 30, flexDirection: "row" }}>
                {this.state.getSticker != "" && (
                  <Image
                    source={{ uri: this.state.getSticker }}
                    style={{
                      width: 150,
                      height: 70,
                    }}
                    resizeMode={"contain"}
                  />
                )}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: COLORS.appWhite,
                  marginTop: 20,
                }}
              >
                {this.state.Artistname}
              </Text>
              {this.props.trackname.length > 26 ? (
                <AutoScrolling
                  style={{
                    width: "98%",
                  }}
                  endPadding={20}
                >
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontWeight: "800",
                      fontSize: 25,
                      marginTop: 5,
                    }}
                  >
                    {this.props.trackname}
                  </Text>
                </AutoScrolling>
              ) : (
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontWeight: "800",
                    fontSize: 25,
                    marginTop: 5,
                  }}
                >
                  {this.props.trackname}
                </Text>
              )}
              <Slider
                style={{
                  width: width / 1.14,
                  height: 1,
                  marginTop: 13,
                }}
                disabled={true}
                value={this.state.position}
                minimumValue={0}
                maximumValue={this.state.duration}
                minimumTrackTintColor={COLORS.appWhite}
                maximumTrackTintColor="#00000055"
                thumbStyle={{ height: 0, width: 0 }}
              />

              <View style={{ marginTop: 10, flexDirection: "row", height: 50 }}>
                <View
                  style={{
                    width: "40%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Navigation.pop(this.props.componentId);
                    }}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Image
                      source={require("../../assets/edit_back.png")}
                      style={{ width: 7, height: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: COLORS.appWhite,
                        marginLeft: 5,
                      }}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (this.state.isPlay) {
                        this.setState(
                          {
                            isPlay: false,
                            isPause: true,
                          },
                          () => {
                            this.PlaySong();
                            // TrackPlayer.play()
                          }
                        );
                      } else {
                        this.setState(
                          {
                            isPlay: true,
                            isPause: false,
                          },
                          () => {
                            TrackPlayer.pause();
                          }
                        );
                      }
                    }}
                    style={{
                      height: 50,
                      borderRadius: 25,
                      width: 50,
                      backgroundColor: "#000",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={
                        this.state.isPlay == true
                          ? require("../../assets/play_dark.png")
                          : require("../../assets/pause.png")
                      }
                      style={{
                        height: 18,
                        width: 18,
                        marginLeft: this.state.isPlay == true ? 5 : 0,
                        tintColor: "#fff",
                        opacity: this.state.isPlay == false ? 0.6 : 1,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ width: "40%"}}></View>
              </View>
            </View>
          </View>
          <View style={{ width: "100%",height:100 }}></View>
        </ScrollView>
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
          <SwipeButton
            title={"Slide to Publish"}
            titleColor={"#FFFFFF"}
            titleFontSize={14}
            titleStyles={{ opacity: 0.5 }}
            railBackgroundColor={"#202020"}
            railBorderColor={"#202020"}
            railFillBorderColor={"#202020"}
            thumbIconBackgroundColor={"#fff"}
            thumbIconBorderColor={"#202020"}
            railFillBackgroundColor={"#000"}
            railStyles={{ borderWidth: 1.5 }}
            width={"80%"}
            height={60}
            disableResetOnTap={false}
            enableReverseSwipe={false}
            shouldResetAfterSuccess={true}
            thumbIconStyles={{ borderWidth: 5 }}
            thumbIconWidth={80}
            swipeSuccessThreshold={"20%"}
            disabled={this.state.show ? false : true}
            onSwipeSuccess={() => {
              this.postApi();
            }}
            thumbIconImageSource={require("../../assets/slide.png")}
          />
        </View>
      </SafeAreaView>
    );
  }
}
