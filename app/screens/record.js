import React, { PureComponent } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../components/colors";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { RNFFmpeg } from "react-native-ffmpeg";
import { ifIphoneX } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { waveArray } from "../components/GLOBAL";
// import { LineChart } from "react-native-chart-kit";
var RNFS = require("react-native-fs");
height = Dimensions.get("window").height;
width = Dimensions.get("window").width;
const WIDTH_PER_SEC = 5;
const WAVE_IMAGE_WIDTH = 10;

// const chartConfig = {
//   // backgroundGradientFrom: "#fff",
//   // backgroundGradientTo: "#fff",
//   color: (opacity = 0) => `rgba(000, 000, 000, ${opacity})`,
//   strokeWidth: 1,
//   barPercentage: 0.5,
//   decimalPlaces: 0,
//   useShadowColorFromDataset: true,
//   propsForBackgroundLines: {
//     strokeDasharray: "",
//   },
// };

export default class Record extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      audioRecorderPlayer: new AudioRecorderPlayer(),
      recordSecs: 0,
      recordTime: "00:00",
      recordCounter: 1,
      waveImages: [],
      mp: "",
      music: "",
      showbutton: false,
      isPlay: false,
      position: 0,
      duration: 0,
      // waveformData: [0, 0, 0],
    };
  }
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
        (sDisplay.length > 1 ? sDisplay : "" + sDisplay)
      );
    } else if (sDisplay != "") {
      return ":" + (sDisplay.length > 1 ? sDisplay : "0" + sDisplay);
    }
    return "00:00";
  }

  onStartRecord = async () => {
    const result = await this.state.audioRecorderPlayer.startRecorder();
    this.state.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState(
        {
          recordSecs: e.currentPosition,
          recordTime: this.state.audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition)
          ),
          recordCounter: this.state.recordCounter + WIDTH_PER_SEC,
        },
        () => {
          var waveImages = [...this.state.waveImages];
          if (parseInt(e.currentPosition / 1000) > waveImages.length) {
            waveImages.push(waveArray[waveImages.length % 15]);
            this.setState({
              waveImages: waveImages,
            });
          }
          if (this.waveScroll != null) {
            // this.waveScroll.scrollToEnd();
            this.waveScroll.scrollTo(
              {
                x:
                  waveImages.length * WAVE_IMAGE_WIDTH -
                  10 / (1000 * (e.currentPosition % 1000) + 1),
              },
              true
            );
          }
        }
      );
      return;
    });
    this.setState({
      mp: result,
    });
    console.log(result, "playyyy");
  };

  onStopRecord = async () => {
    const result = await this.state.audioRecorderPlayer.stopRecorder();
    this.state.audioRecorderPlayer.removeRecordBackListener();

    this.ConvertAudio(result);
    console.log(result, "stopppp");
    this.setState({
      mp: result,
    });
  };


  ConvertAudio(file_path) {
    RNFFmpeg.execute(
      "-y -i " +
        file_path +
        " -af silencedetect=noise=-30dB:d=0.5 " +
        RNFS.DocumentDirectoryPath +
        "/music.aac"
    ).then((result) => {
      console.log(result, "+++");
      const path = RNFS.DocumentDirectoryPath + "/music.aac";
      this.setState({
        music: path,
      });
      //alert(path)
      // RNFS.readDir(path).then((res)=>{
      //   console.log(res[0].path,"----")
      //   // console.log("rs==", res[0].path.replace('/Documents/RCTAsyncLocalStorage_V1',' '))
      // })
    });

    // RNFFmpeg.execute('-i' +file_path+ '-c:v'  +RNFS.DocumentDirectoryPath+'/file2.mp3').then((result) =>
    //   RNFFprobe.getMediaInformation(`${result}`).then(information => {
    //     console.log('Result: ++' + JSON.stringify(information));
    // }),
    // console.log(`${result}`,"++++")
    // );
  }

  PlaySong = async () => {
    await TrackPlayer.play();
    this.waveScroll.scrollTo({ x: 0 }, true);
  };

  // componentDidMount = async () => {
  //   var tempArray = []
  //   for (i = 0;i < 1000; i++) {
  //     tempArray.push(Math.floor(Math.random() * 100) + 1)
  //   }
  //   this.setState({
  //     waveformData: tempArray
  //   })

  //   setInterval(() => {
  //     var array = [...this.state.waveformData]
  //     if(array.length > 999) {
  //       array = array.splice(20, array.length - 1)
  //       for (i = 0;i < 20; i++) {
  //         array.push(Math.floor(Math.random() * 100) + 1)
  //       }
  //     }
  //     else {
  //       for (i = 0;i < 20; i++) {
  //         array.push(Math.floor(Math.random() * 100) + 1)
  //       }
  //     }
  //     this.setState({
  //       waveformData: array
  //     })
  //   }, 500)

  // }

  componentWillUnmount = async () => {
    clearInterval(this.Record);
    await TrackPlayer.stop();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              ...ifIphoneX(
                {
                  height: 40,
                },
                {
                  height: 60,
                }
              ),
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
                opacity: 0.6,
              }}
            >
              <Image
                source={require("../assets/Majesty.png")}
                style={{ width: 22, height: 18, opacity: 0.6 }}
              />

              <Text
                style={{
                  color: COLORS.appGray,
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
              onPress={() => {
                Navigation.pop(this.props.componentId);
              }}
            >
              <Text style={{ color: COLORS.appWhite }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 100,
              width: "100%",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <LineChart
              style={{ marginTop: 20 }}
              data={{
                labels: [],
                datasets: [
                  {
                    data: this.state.waveformData,
                    color: (opacity = 0) => 'white', //`rgba(000,000,000, ${opacity})`,
                    strokeWidth: 1.2,
                    // stroke: APP_COLOR
                  },
                ],
              }}
              width={ this.state.waveformData.length / 2 }
              height={100}
              bezier
              withDots={false}
              withShadow={false}
              yAxisSuffix="k"
              chartConfig={chartConfig}
            /> */}
            <ScrollView
              ref={(ref) => (this.waveScroll = ref)}
              style={{
                width: "100%",
                height: 100,
              }}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                paddingRight: width / 2,
                paddingLeft: width / 2,
              }}
              scrollEnabled={!this.state.recording}
              bounces={false}
              horizontal
            >
              <View
                style={{
                  // width: this.state.recordCounter < 3 ? 1 : this.state.recordCounter,
                  height: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  // backgroundColor: "white",
                }}
              >
                {this.state.waveImages.map((item) => {
                  return (
                    <Image
                      style={{
                        flex: 1,
                        height: 40,
                        width: WAVE_IMAGE_WIDTH,
                        resizeMode: "stretch",
                        tintColor:
                          this.state.recording &&
                          this.state.waveImages.length > 45
                            ? "red"
                            : this.state.recording
                            ? COLORS.appPurple
                            : this.state.recording == false
                            ? "white"
                            : "white",
                      }}
                      source={item}
                    />
                  );
                })}
              </View>
            </ScrollView>
            {this.state.recording && (
              <View
                style={{
                  width: Dimensions.get("window").width / 2,
                  position: "absolute",
                  right: 0,
                  height: 100,
                  backgroundColor: "black",
                }}
              />
            )}
            <View
              style={{
                height: 100,
                width: 2,
                backgroundColor:
                this.state.recordTime == "00:00"
                ? COLORS.appPurple
                : this.state.recordTime > "00:46"
                ? "red"
                : COLORS.appPurple,
                position: "absolute",
              }}
            />
          </View>
          <View
            style={{
              height: "30%",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor:'red'
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color:
                  this.state.recordTime == "00:00"
                    ? COLORS.appGray
                    : this.state.recordTime > "00:46"
                    ? "red"
                    : COLORS.appWhite,
                fontSize: 80,
                fontWeight:
                  this.state.recordTime.slice(0, 5) >= "00:46"
                    ? "700"
                    : "normal",
              }}
            >
              {this.state.recordTime.slice(1, 5)}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.state.showbutton == true && (
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
                  } else if (state == "paused" || this.state.isPlay == false) {
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
                  backgroundColor: "#000",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    this.state.isPlay == true
                      ? require("../assets/pause.png")
                      : require("../assets/play_dark.png")
                  }
                  style={{
                    height: 18,
                    width: 18,
                    marginLeft: this.state.isPlay == false ? 5 : 0,
                    tintColor: "#fff",
                    //opacity: this.state.isPlay == true ? 0.6 : 1,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              height: "30%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.state.recording == false ? (
              <TouchableOpacity
                disabled={this.state.isPlay == true ? true : false}
                style={{
                  backgroundColor: COLORS.appRed,
                  height: 135,
                  width: 135,
                  borderRadius: 75,
                  alignSelf: "center",
                  opacity: this.state.isPlay == true ? 0.4 : 1,
                }}
                onPress={() => {
                  if (this.state.recording == false) {
                    this.setState(
                      {
                        waveImages: [],
                        recording: true,
                        showbutton: false,
                      },
                      async () => {
                        await TrackPlayer.stop();

                        this.onStartRecord();
                      }
                    );
                  }
                }}
              ></TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.appBlack,
                  height: 135,
                  width: 135,
                  borderRadius: 75,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  if (this.state.recording == true) {
                    this.setState(
                      {
                        recording: false,
                        showbutton: true,
                      },

                      () => {
                        this.onStopRecord();
                        setTimeout(async () => {
                          await TrackPlayer.setupPlayer();
                          await TrackPlayer.add({
                            id: "0",
                            url: this.state.music,
                            title: "Track Title",
                            artist: "Track Artist",
                          });
                          this.Record = setInterval(async () => {
                            const duration = await TrackPlayer.getDuration();
                            const position = await TrackPlayer.getPosition();

                            this.setState(
                              {
                                position: parseInt(position),
                                duration: parseInt(duration),
                              },
                              async () => {
                                console.log(
                                  this.state.position +
                                    "   " +
                                    this.state.duration
                                );
                                if (
                                  this.state.position == this.state.duration
                                ) {
                                  if (this.state.isPlay) {
                                    this.waveScroll.scrollTo({ x: 0 }, false);
                                  }
                                  // setTimeout(async () => {
                                    await TrackPlayer.setRepeatMode(
                                      RepeatMode.Track
                                    );
                                  // }, 1000);
                                }
                                if (this.state.isPlay) {
                                  this.waveScroll.scrollTo({
                                    x: this.state.position * WAVE_IMAGE_WIDTH,
                                  });
                                }
                              }
                            );
                          }, 50);
                        }, 1000);
                      }
                    );
                  }
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 8,
                    backgroundColor: COLORS.appRed,
                  }}
                ></View>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              // height: "20%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {this.state.showbutton == true && (
              <TouchableOpacity
                onPress={async () => {
                  this.setState({
                    duration: "",
                    position: "",
                  });
                  await TrackPlayer.stop();
                  AsyncStorage.setItem("file", this.state.music);
                  Navigation.setRoot({
                    root: {
                      stack: {
                        children: [
                          {
                            component: {
                              name: "editPost",
                              passProps: {
                                music: this.state.music,
                              },
                              options: {
                                topBar: {
                                  visible: "false",
                                },
                              },
                            },
                          },
                        ],
                      },
                    },
                  });
                }}
                style={{
                  backgroundColor: COLORS.appWhite,
                  ...ifIphoneX(
                    {
                      marginTop: 10,
                    },
                    {
                      marginTop: -30,
                    }
                  ),
                  width: "80%",
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
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  Next →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
