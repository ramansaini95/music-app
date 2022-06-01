import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,ScrollView
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCallPut } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import Player from "../../components/player";
import TrackPlayer, { useProgress } from "react-native-track-player";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Links = (props) => {
  const [spotifyLink, setSpotify] = useState(props.Links.spotify);
  const [soundCloudLink, setsoundCloud] = useState(props.Links.soundcloud);
  const [InstagramLink, setInstagram] = useState(props.Links.instagram);
  const [TwitterLink, setTwitter] = useState(props.Links.twitter);
  const [WebsiteLink, setWebsite] = useState(props.Links.website);
  const [artist, setArtist] = useState("Masked wolf");
  const [title, setTitle] = useState("Astronout");
  const [position, setposition] = useState(0);
  const [duration, setduration] = useState(0);

  const getPosition = async () => {
    setInterval(async () => {
      setposition(await TrackPlayer.getPosition());
      setduration(await TrackPlayer.getDuration());
    }, 500);
  };

  const PlaySong = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(this.props.data);
    await TrackPlayer.play();
  };
  useEffect(() => {
    getPosition();
  });

  const editlinks = async () => {
    console.log(
      spotifyLink +
        "," +
        soundCloudLink +
        "," +
        InstagramLink +
        "," +
        TwitterLink +
        "," +
        WebsiteLink
    );
    ApiCallPut(
      "user",
      {
        spotify: spotifyLink,
        soundcloud: soundCloudLink,
        instagram: InstagramLink,
        twitter: TwitterLink,
        website: WebsiteLink,
        //links:spotifyLink+","+soundCloudLink+","+InstagramLink+','+TwitterLink+','+WebsiteLink
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));

        if (responseJson.data.status == true) {
          Alert.alert("", responseJson.data.message);
          Navigation.pop(props.componentId);
        } else {
          alert(responseJson.data.message);
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View
           style={{ flex: 1, }}
        >
          <HeaderFile
            name={"Links"}
            back={"Cancel"}
            onClick={() => {
              Navigation.pop(props.componentId);
            }}
          />
           <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 60,
            }}
          >
            <Image
              source={require("../../assets/spotify.png")}
              style={{ height: 24, width: 24, tintColor: COLORS.appGray }}
            />
            <TextInput
              value={spotifyLink}
              placeholder={"Spotify URL"}
              placeholderTextColor={COLORS.appGray}
              onChangeText={(e) => {
                setSpotify(e);
              }}
              style={{
                color: COLORS.appWhite,
                borderColor: COLORS.appGray + 88,
                borderWidth: 1,
                fontSize: 14,
                marginLeft: 20,
                padding: 5,
                borderRadius: 6,
                height: 40,
                width: "90%",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 13,
            }}
          >
            <Image
              source={require("../../assets/Soundcloud.png")}
              style={{ height: 10, width: 24, tintColor: COLORS.appGray }}
            />
            <TextInput
              placeholder={"SoundCloud URL"}
              onChangeText={(e) => {
                setsoundCloud(e);
              }}
              value={soundCloudLink}
              placeholderTextColor={COLORS.appGray}
              style={{
                color: COLORS.appWhite,
                borderColor: COLORS.appGray + 88,
                borderWidth: 1,
                fontSize: 14,
                marginLeft: 20,
                padding: 5,
                borderRadius: 6,
                height: 40,
                width: "90%",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 12,
            }}
          >
            <Image
              source={require("../../assets/instagram.png")}
              style={{ height: 24, width: 24, tintColor: COLORS.appGray }}
            />
            <TextInput
              placeholder={"Instagram"}
              onChangeText={(e) => {
                setInstagram(e);
              }}
              value={InstagramLink}
              placeholderTextColor={COLORS.appGray}
              style={{
                color: COLORS.appWhite,
                borderColor: COLORS.appGray + 88,
                borderWidth: 1,
                fontSize: 14,
                marginLeft: 20,
                padding: 5,
                borderRadius: 6,
                height: 40,
                width: "90%",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 12,
            }}
          >
            <Image
              source={require("../../assets/twitter.png")}
              style={{ height: 24, width: 24, tintColor: COLORS.appGray }}
            />
            <TextInput
              placeholderTextColor={COLORS.appGray}
              value={TwitterLink}
              onChangeText={(e) => {
                setTwitter(e);
              }}
              placeholder={"Twitter"}
              style={{
                color: COLORS.appWhite,
                borderColor: COLORS.appGray + 88,
                borderWidth: 1,
                fontSize: 14,
                marginLeft: 20,
                padding: 5,
                borderRadius: 6,
                height: 40,
                width: "90%",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 12,
            }}
          >
            <Image
              source={require("../../assets/browser.png")}
              style={{ height: 24, width: 24, tintColor: COLORS.appGray }}
            />
            <TextInput
              placeholder={"Website"}
              value={WebsiteLink}
              onChangeText={(e) => {
                setWebsite(e);
              }}
              placeholderTextColor={COLORS.appGray}
              style={{
                color: COLORS.appWhite,
                borderColor: COLORS.appGray + 88,
                borderWidth: 1,
                fontSize: 14,
                marginLeft: 20,
                padding: 5,
                borderRadius: 6,
                height: 40,
                width: "90%",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.appPurple,
              width: "92%",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              alignSelf: "center",
              borderRadius: 6,
              marginTop: 60,
              //bottom:20
            }}
            onPress={() => {
              editlinks();
              // console.log(spotifyLink+","+soundCloudLink+","+InstagramLink+','+TwitterLink+','+WebsiteLink)
            }}
          >
            <Text
              style={{
                color: COLORS.appWhite,
                fontSize: 14,
                fontWeight: "800",
              }}
            >
              Done
            </Text>
          </TouchableOpacity>
         
          </ScrollView>
          </KeyboardAvoidingView>
          
        </View>
       
      </View>
      <View
              style={{
                height:50,
                justifyContent:'flex-end'
              }}
          >
          <Text
        style={{
          width:'90%',
          color:COLORS.appGray,
          alignSelf:'center',
          marginBottom:5
          
        }}
     >
     By posting a links, you agree that you have all of the legal rights to do so.
     </Text>
     </View>
      <Player
        artistName={artist}
        title={title}
        value={position}
        maximumValue={duration}
        onValueChange={(value) => {
          TrackPlayer.seekTo(value);
        }}
        playTrack={async () => {
          let state = await TrackPlayer.getState();
          if (state == "idle") {
            PlaySong();
          } else if (state == "paused") {
            await TrackPlayer.play();
          } else {
            await TrackPlayer.pause();
          }
        }}
      />
    </View>
  );
};

export default Links;
