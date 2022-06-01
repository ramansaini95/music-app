import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,ScrollView
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCallPut } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import { Loader } from "../../components/Loader";
import Player from "../../components/player";
import TrackPlayer, { useProgress } from "react-native-track-player";
//import { ScrollView } from "react-native-gesture-handler";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const EditBio = (props) => {
  const [Bio, setBio] = useState(props.data==null?'':props.data);
  const [isLoading, setisLoading] = useState(false);
  const [artist, setArtist] = useState("Masked wolf");
  const [title, setTitle] = useState("Astronout");
  const [position, setposition] = useState(0);
  const [duration, setduration] = useState(0);

  useEffect(() => {
    getPosition();
    console.log(props.data)
  });

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

  const editBio = async () => {
    setisLoading(true);
    try {
      ApiCallPut(
        "user",
        {
          bio: Bio,
        },
        (responseJson) => {
          console.log(JSON.stringify(responseJson.data));
          if (responseJson.data.status == true) {
            setisLoading(false);
            Navigation.pop(props.componentId);
          } else {
            setisLoading(false);
            alert(responseJson.data.error);
          }
        }
      );
    } catch {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <HeaderFile
          name={"Bio"}
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
            width: "90%",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 30,
           // borderRadius: 6,
          }}
        >
          <View
               style={{
                borderWidth: 1,
                borderRadius: 6,
                width: "100%",
                minHeight: 200,
                borderColor: COLORS.appGray + 88
               }}
          >
          <TextInput
            value={Bio}
            onChangeText={(e) => {
              setBio(e);
            }}
            style={{
              // borderColor: COLORS.appGray + 88,
              // borderWidth: 1,
              color: COLORS.appWhite,
              fontSize: 21,
              padding: 10,
              //marginRight:65,
              minHeight: 200,
               width: "85%",
            }}
            placeholder={"Tell us a little about you"}
            placeholderTextColor={COLORS.appGray}
            multiline={true}
            maxLength={240}
          /></View>
           <View
                    style={{
                      position: "absolute",
                      width: 60,
                      height: 20,
                      right: 5,
                      top: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,
                        opacity: 0.6,
                        fontSize: 12,
                        fontWeight: "400",
                      }}
                    >
                   {Bio.length==0?0:Bio.length}
                     / 240
                    </Text>
                  </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.appPurple,
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            alignSelf: "center",
            borderRadius: 6,
            marginTop: 30,
          }}
          onPress={() => {
            console.log(Bio, "----");
            editBio();
          }}
        >
          <Text style={{ color: COLORS.appWhite, fontSize: 14,fontWeight:'800' }}>Done</Text>
        </TouchableOpacity>
       
        <Loader visible={isLoading} />
        </ScrollView>
     </KeyboardAvoidingView>
     <Text
        style={{
          width:'90%',
          color:COLORS.appGray,
          alignSelf:'center',
          bottom:20
        }}
     >
     By posting a bio, you agree that you have all of the legal rights to do so.
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

export default EditBio;
