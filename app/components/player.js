import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import { COLORS } from "./colors";
import TrackPlayer from "react-native-track-player";
import Slider from "react-native-slider";
import { global } from "../components/playerState";
import AutoScrolling from "react-native-auto-scrolling";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Player = (props) => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    getPlayerState();
  }, []);

  const getPlayerState = () => {
    TrackPlayer.addEventListener("playback-state", async (data) => {
      if (data.state == "playing") {
        global.changePlay = "playing";
      } else if (data.state == "paused") {
        global.changePlay = "paused";
      } else if (data.state == "idle") {
        global.changePlay = "idle";
      }
    });
  };

  return (
    <View
      style={{
        width: width,
        height: 130,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
     
      }}
    >
      <View
        style={{
          backgroundColor: "lightgray",
          width: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={require("../assets/giphy-2.gif")}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "85%",
              alignSelf: "center",
              marginTop: 25,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  color: COLORS.appWhite,
                  fontSize: 14,
                }}
              >
                {props.artistName}
              </Text>
              {props.title.length > 26 ? (
                <AutoScrolling
                  style={{
                    width: 220,
                  }}
                  endPadding={50}
                >
                  <Text
                    style={{
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display Bold"
                      //     : "SfProDisplayBold",
                      color: COLORS.appWhite,
                      fontSize: 14,
                    }}
                  >
                    {props.title}
                  </Text>
                </AutoScrolling>
              ) : (
                <Text
                  style={{
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    color: COLORS.appWhite,
                    fontSize: 14,
                  }}
                >
                  {props.title}
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "25%",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={props.playTrack}>
                <Image
                  source={
                    global.changePlay == "playing"
                      ? require("../assets/pause.png")
                      : require("../assets/homePlay.png")
                  }
                  style={{ height: 16, width: 16, opacity: 0.4 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={props.onRepeat}>
                <Image
                  source={require("../assets/repeat.png")}
                  style={{ height: 18, width: 16 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Slider
            style={{
              width: width / 1.18,
              height: 1,
              marginTop: 13,
              alignSelf: "center",
            }}
            value={props.value}
            minimumValue={0}
            maximumValue={props.maximumValue}
            minimumTrackTintColor={COLORS.appWhite}
            maximumTrackTintColor="#00000055"
            onValueChange={props.onValueChange}
            thumbStyle={{ height: 0, width: 0 }}
          />
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              width: "80%",
              alignSelf: "center",
              marginTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: COLORS.appGray }}>1.2K</Text>
              <Image
                source={require("../assets/share.png")}
                style={{
                  width: 10,
                  height: 10,
                  marginLeft: 5,
                  tintColor: COLORS.appGray,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: COLORS.appGray }}>869</Text>
              <Image
                source={require("../assets/message.png")}
                style={{
                  width: 10,
                  height: 10,
                  marginLeft: 5,
                  tintColor: COLORS.appGray,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: COLORS.appGray }}>7.7K</Text>
              <Image
                source={require("../assets/ellipse.png")}
                style={{
                  width: 10,
                  height: 10,
                  marginLeft: 5,
                  tintColor: COLORS.appGray,
                }}
              />
              <Image
                source={require("../assets/emoji.png")}
                style={{
                  width: 12,
                  height: 12,
                  marginLeft: 5,
                  tintColor: COLORS.appGray,
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Player;
