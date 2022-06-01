import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { COLORS } from "./colors";
import { global } from "./playerState";
import TrackPlayer from "react-native-track-player";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const BottomTab = (props) => {
  // const [showlyric, setShowLyric] = useState(0);
  // const [showHeart, setshowHeart] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(async () => {
    getPlayerState();
  }, []);
  const getPlayerState = () => {
    TrackPlayer.addEventListener("playback-state", async (data) => {
      // console.log(data);
        // None,
        // Ready,
        // Playing,
        // Paused,
        // Stopped,
        // Buffering,
        // Connecting
      if (data.state == "playing") {
        global.introTab = "playing";
      } else if (data.state == "paused") {
        global.introTab = "paused";
      } else if (data.state == "idle") {
        global.introTab = "idle";
      } else if (data.state == "ready") {
        global.introTab = "ready";
      } else {
        global.introTab = data.state
      }
    });
  };
  useEffect(() => {
    // setInterval(async () => {
    //   setShowLyric(global.showLyrics);
    //   setshowHeart(global.heartPress);
    //   let state = await TrackPlayer.getState();
    //   // console.log("STATE" + " " + state);
    // }, 300);
  }, []);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "center",
          alignItems: "center",
          width: "85%",
          // backgroundColor:'gray'
        }}
      >
        <Image
          source={require("../assets/repeat1.png")}
          style={{
            height: 24,
            width: 24,
          }}
        />
        <TouchableOpacity
          style={{ height: 20, width: 20 }}
          onPress={async () => {
            let state = await TrackPlayer.getState();
            if (state == "playing") {
              await TrackPlayer.pause();
            } else {
              await TrackPlayer.play();
            }
          }}
        >
          <Image
            source={
              global.introTab == "playing"
                ? require("../assets/pause.png")
                : require("../assets/homePlay.png")
            }
            style={
              global.introTab == "playing"
                ? {
                  height: 18,
                  width: 20,
                  tintColor: COLORS.appGray,
                  opacity: 0.4,
                }
                : {
                  height: 18,
                  width: 15,
                  tintColor: COLORS.appWhite,
                  marginLeft: 5
                  // opacity: 0.4,
                }
            }
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/post.png")}
          style={{
            height: 24,
            width: 24,
          }}
        />
        <TouchableOpacity
          style={{
            height: 25,
            width: 25,
          }}
          onPress={props.touch}
        >
          <Image
            source={
              props.showlyric
                ? require("../assets/track_note.png")
                : require("../assets/track_notes.png")
            }
            style={{
              height: 24,
              width: 24,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.heartPress}
        >
          <Image
            source={
              props.showHeart
                ? require("../assets/fullheart.png")
                : require("../assets/like.png")
            }
            style={{
              height: 24,
              width: 24,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default BottomTab;