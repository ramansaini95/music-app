import React, { PureComponent } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { HeaderFile } from "../components/HeaderFile";
import Player from "../components/player";
import TrackPlayer from "react-native-track-player";

export default class privacy extends PureComponent {
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
          <HeaderFile
            name={"Privacy Policy"}
            back={"Settings"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          />
          <ScrollView>
            <View style={{ width: "85%", alignSelf: "center", marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  opacity: 0.4,
                  color: "#fff",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                Updated Feb 21, 2021
              </Text>
              <Text
                style={{
                  fontSize: 21,
                  color: "#fff",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  fontWeight: "800",
                  marginTop: 20,
                }}
              >
                More fundamental than religion is our basic human spirituality.
                We have a basic human disposition towards love, kindness and
                affection, irrespective of whether we have a framework or not.
                {"\n"}
                {"\n"}
                When we nurture this most basic human resource when we set about
                cultivating inner values which we all appreciate in others, then
                we start to live more spiritually.
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  marginTop: 20,
                }}
              >
                We can reject everything else: religion, ideology, all received
                wisdom. But we cannot escape the necessity of love and
                compassion. This, then, is my true religion, my simple faith. In
                this sense, there is no need for temple or church, for mosque or
                synagogue, no need for complicated philosophy, doctrine or
                dogma. Our own heart, our own mind, is the temple.
                {"\n"}
                {"\n"}
                The doctrine is compassion. Love for others and respect for
                their rights and dignity, no matter who or what they are:
                ultimately these are all we need. So long as we practice these
                in our daily lives, then no matter if we are learned or
                unlearned, whether we believe in Buddha. So long as we practice
                these in our daily lives, then no matter if we are learned or
                unlearned, whether we believe in Buddha or God, or follow some
                other religion or none at all, as long as we have compassion for
                others and conduct ourselves with restraint out of a sense of
                responsibility, there is no doubt we will be happy. We can
                reject everything else: religion, ideology, all received wisdom.
                But we cannot escape the necessity of love and compassion....
                This, then, is my true religion, my simple faith. In this sense,
                there is no need for temple or church, for mosque or synagogue,
                no need for complicated philosophy, doctrine or dogma. Our own
                heart, our own mind, is the temple. The doctrine is compassion.
                Love for others and respect for their rights and dignity, no
                matter who or what they are: ultimately these are all we need.
                So long as we practice these in our daily lives, then no matter
                if we are learned or unlearned, whether we believe in Buddha. So
                long as we practice these in our daily lives, then no matter if
                we are learned or unlearned, whether we believe in Buddha or
                God, or follow some other religion or none at all, as long as we
                have compassion for others and conduct ourselves with restraint
                out of a sense of responsibility, there is no doubt we will be
                happy.
              </Text>
            </View>
          </ScrollView>
          {/* <View style={{ height: 135 }}></View> */}
          
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
