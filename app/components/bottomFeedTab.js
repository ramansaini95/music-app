import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS } from "./colors";
import TrackPlayer, { State } from "react-native-track-player";
import { global } from "../components/playerState";

const Bottom = (props) => {
  const [changePlay, setChangePlay] = useState(false);
  // const [showlyric, setShowLyric] = useState(0);
  // const [showHeart, setshowHeart] = useState(0);
  // const [showRepeat, setshowRepeat] = useState(0);

  useEffect(async () => {
    TrackPlayer.addEventListener("playback-state", async (data) => {
        global.changePlay = data.state
        setChangePlay(data.state)
    });
  }, []);
  // useEffect(() => {
  //   setInterval(() => {
  //     // setShowLyric(global.showLyrics);
  //     // setshowHeart(global.heartPress);
  //     // setshowRepeat(global.repeatPress);
  //   }, 300);
  // }, []);

  return (
    <View style={props.style}>
      <TouchableOpacity onPress={props.firstPress}>
        <Image
          source={
            props.showRepeat == 0
              ? require("../assets/repeat.png")
              : require("../assets/repeat1.png")
          }
          style={{
            height: 24,
            width: 24,
            tintColor: COLORS.appWhite,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.onPlay}
        style={{
          width: 24,
          height: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {(changePlay == State.Buffering || changePlay == State.Connecting) ? <ActivityIndicator /> : <Image
          source={
            changePlay == State.Playing
              ? require("../assets/pause.png")
              : require("../assets/homePlay.png")
          }
          style={
            changePlay == State.Playing
              ? {
                  height: 16,
                  width: 18,
                  tintColor: COLORS.appGray,
                  opacity: 0.4,
                }
              : {
                  height: 16,
                  width: 13,
                  tintColor: COLORS.appWhite,
                  // opacity: 0.4,
                }
          }
        />}
      </TouchableOpacity>

      <TouchableOpacity onPress={props.ThirdPress}>
        <Image
          source={require("../assets/post.png")}
          style={{
            height: 24,
            width: 24,
            tintColor: COLORS.appWhite,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={props.fourthPress}>
        <Image
          source={
            props.showlyric == 0
              ? require("../assets/track_notes.png")
              : require("../assets/track_note.png")
          }
          style={{
            height: 24,
            width: 24,
            tintColor: COLORS.appWhite,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onLongPress={props.fifthPress}
        onPress={props.heartPress}
      >
        <Image
          source={
            props.isLiked
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
  );
};

export default Bottom;
