import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../components/colors";
import { HeaderFile } from "../components/HeaderFile";
import * as Progress from "react-native-progress";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";

export default class about extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
    };
  }
  componentDidMount() {
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <HeaderFile
            name={"About Majesty"}
            back={"Settings"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          />
          <View
            style={{
              height: "48%",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.appPurple,
                  fontSize: 24,
                  fontWeight: "800",
                  width: "80%",
                  marginLeft: 20,
                  marginTop: Dimensions.get("window").height / 6.5,
                }}
              >
                Here's our story.
              </Text>
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 20,
                  fontWeight: "400",
                  width: "65%",
                  marginLeft: 20,
                }}
              >
                You’re one of the first beta users, so let us know what you
                think. Feedback is what this app is all about.
                {"\n"}
                {"\n"}
                And post a track — even if it’s a voice memo or a rough idea.
                Your music is worth sharing. We want to hear it. Alright. Swipe
                to start listening, sharing and getting inspiration from
              </Text>
            </ScrollView>
            <LinearGradient
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 150,
                marginLeft: 0,
              }}
              colors={["rgba(0, 0, 0, 0)", " rgba(0, 0, 0, 0.7)"]}
              pointerEvents={"none"}
            />
          </View>

          <Text
            style={{
              color: COLORS.appWhite,
              fontSize: 16,
              fontWeight: "400",
              width: "70%",
              //   alignSelf: 'center',
              fontFamily: Platform.OS == 'ios' ? 'SF Pro Display' : 'SfProDisplay',
              marginLeft: 20,
              marginTop: 0,
            }}
          >
            Majesty
          </Text>
          <Text
            style={{
              color: COLORS.appWhite,
              fontSize: 34,
              fontWeight: "800",
              fontFamily: Platform.OS == 'ios' ? 'SF Pro Display' : 'SfProDisplay',
              marginLeft: 20,
              marginTop: 5,
            }}
          >
           Behind The Music
          </Text>
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
            Version 1.1.1.1
          </Text>
          <Progress.Bar
            width={width / 1.15}
            height={2}
            borderColor={"#fff"}
            color={COLORS.appWhite}
            unfilledColor={"transparent"}
            style={{ marginLeft: 20, marginTop: 13 }}
            progress={this.state.progress}
          />
          <View style={{height:30,justifyContent:'center',alignItems:'center'}}>
          <Image
            source={require("../assets/pause.png")}
            style={{
              height: 24,
              width: 24,
              marginTop:25,
              tintColor:"#fff"
            }}
          />
          </View>
         
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
      </View>
    );
  }
}
