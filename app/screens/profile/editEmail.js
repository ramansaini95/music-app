import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import Player from "../../components/player";
import TrackPlayer from "react-native-track-player";
import { ifIphoneX } from "react-native-iphone-x-helper";

export default class editEmail extends PureComponent {
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
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={{ flex: 1 }}>
          {/* <HeaderFile
            name={"Edit Email"}
            //back={"Back"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          /> */}
           <View
              style={{
                height: 40,
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
                alignItems: "center",
                ...ifIphoneX({
                  marginTop: 40
              }, {
                marginTop: 20
              })
              }}
            >
              <View
                style={{
                  height: 40,
                  flexDirection: "row",
                  width: "87%",
                  alignItems: "center",
                  justifyContent:'center'
                }}
              >
               

                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 18,
                    marginLeft: 10,
                    fontWeight: "600",
                   alignItems:'center',
                   marginLeft:30
                  }}
                >
                  Edit Email
                </Text>
              </View>
              <TouchableOpacity
                style={{ width: "17%", height: 30, justifyContent: "center" }}
                onPress={async () => {
                  Navigation.pop(this.props.componentId);
                }}
              >
                <Text style={{ color: COLORS.appWhite }}>Cancel</Text>
              </TouchableOpacity>
            </View>

          <View
            style={{
              height: "30%",
              width: "85%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.appPurple,
                fontWeight: "800",
                fontFamily:
                  Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                fontSize: 12,
                letterSpacing: 0.1,
                marginTop: 40,
                textTransform: "uppercase",
              }}
            >
              Email
            </Text>
            <TextInput
              placeholder={"Email"}
              placeholderTextColor={COLORS.appWhite}
              style={{
                width: "100%",
                height: 40,
                borderWidth: 1,
                borderColor: COLORS.appWhite,
                borderRadius: 10,
                paddingHorizontal: 10,
                color: COLORS.appWhite,
                fontSize: 14,
                opacity: 0.4,
                marginTop: 10,
              }}
            ></TextInput>
            <Text
              style={{
                color: COLORS.appPurple,
                fontWeight: "800",
                fontFamily:
                  Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                fontSize: 12,
                letterSpacing: 0.1,
                marginTop: 20,
                textTransform: "uppercase",
              }}
            >
              Confirm Password
            </Text>
            <TextInput
              placeholder={"Confirm Password"}
              placeholderTextColor={COLORS.appWhite}
              style={{
                width: "100%",
                height: 40,
                borderWidth: 1,
                borderColor: COLORS.appWhite,
                borderRadius: 10,
                paddingHorizontal: 10,
                color: COLORS.appWhite,
                fontSize: 14,
                opacity: 0.4,
                marginTop: 10,
              }}
            ></TextInput>
          </View>
          <View
            style={{
              height: "65%",
              width: "90%",
              alignSelf: "center",
              justifyContent: "center",
              // backgroundColor: "cyan",
            }}
          ></View>
        </View>
        <View
          style={{
            // position: "absolute",
            width: "85%",
            alignSelf: "center",
            height: 50,
            // backgroundColor: "red",
            // bottom: 140,
          }}
        >
          <TouchableOpacity
            // onPress={() => {
            //   Navigation.push(this.props.componentId, {
            //     component: {
            //       name: "confirmcode",
            //       options: {
            //         topBar: {
            //           visible: false,
            //         },
            //       },
            //     },
            //   });
            // }}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              borderRadius: 6,
              backgroundColor: COLORS.appPurple,
            }}
          >
            <Text
              style={{
                color: COLORS.appWhite,
                fontSize: 14,
                fontWeight: "800",
              }}
            >
              Save
            </Text>
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
      </View>
    );
  }
}
