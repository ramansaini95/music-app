import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCallPut } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import { Loader } from "../../components/Loader";
import Player from "../../components/player";
import TrackPlayer, { useProgress } from "react-native-track-player";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Gear = (props) => {
  const [gear, setGear] = useState(props.data);
  const [isLoading, setisLoading] = useState(false);
  const [artist, setArtist] = useState("Masked wolf");
  const [title, setTitle] = useState("Astronout");
  const [position, setposition] = useState(0);
  const [duration, setduration] = useState(0);

  editGear = async () => {
    setisLoading(true);
    var SampleText = gear.toString();

    var NewText = SampleText.replaceAll("+", ",");
    console.log(NewText, "+++");

    ApiCallPut(
      "user",
      {
        gear: NewText,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          setisLoading(false);
          Navigation.pop(props.componentId);
        } else {
          setisLoading(false);
          alert(responseJson.data.message);
        }
      }
    );
  };
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

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <HeaderFile
          name={"Gear"}
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
            marginTop: 50,
            flexDirection:'row',
            borderColor: COLORS.appGray + 88,
            borderWidth: 1,
            color: COLORS.appWhite,
            //position:'relative',
            borderRadius: 6,
            height:null
          }}
        >
          <TextInput
            value={gear}
            onChangeText={(e) => {
              if (e.split("+").length <= 5) {
                //alert('greater')
                setGear(e);
              } else {
                //setGear(e);
              }
              //setGear(e);
            }}
            style={{
              // borderColor: COLORS.appGray + 88,
              // borderWidth: 1,
               color: COLORS.appWhite,
              fontSize: gear == "" ? 13 : 17,
               padding: 10,
              paddingTop :gear == "" ? 10 : 10,
              //  height: null,
             // borderRadius: 6,
               width: "90%",
            }}
            
            placeholderTextColor={COLORS.appGray}
            placeholder={'Add gear used on your track, separate with a "+"'}
            multiline={true}
          />
          <View
              style={{
                position:'absolute',
                right:5,
                top:9
                //alignSelf:'center'
              }}
          >
          <Text style={{ fontSize: 14, color: "#fff" ,}}>
                     {
                      gear.split("+").filter((item) => item != "")
                          .length
                      }{" "}
                     / 5
                    </Text>
          </View>
           
        </View>

        <View style={{ width: "88%", alignSelf: "center", marginTop: 20 }}>
          <Text style={{ color: "#666666", fontSize: 14 }}>
            Example: Peavey Horizon II + Garageband
          </Text>
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
            this.editGear();
          }}
        >
          <Text style={{ color: COLORS.appWhite, fontSize: 14,fontWeight:'800' }}>Done</Text>
        </TouchableOpacity>
        <Loader visible={isLoading} />
        </ScrollView>
        </KeyboardAvoidingView>
       
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

export default Gear;
