import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCall, ApiCallGet } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { AuthHeader } from "../../components/AuthHeader";

export default class addartist extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artist: "",
      showTick: false,
      show: false,
    };
  }

  
  addArtist = (artist) => {
    this.setState({ isLoading: true });
    ApiCall(
      "username",
      {
        username: artist,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          AsyncStorage.setItem('artistname',this.state.artist)
          //AsyncStorage.setItem('artistname',this.state.artist)
          this.setState({
            showTick: true,
            show: false,
          });
          console.log(responseJson.data.message);
        } else {
          this.setState({ isLoading: false });
          this.setState({
            showTick: false,
            show: true,
          });
          //alert(responseJson.data.error);
        }
      }
    );
  };
  render() {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBlack }}>
        <ImageBackground
          source={require("../../assets/giphy-1.gif")}
          style={{
            flex: 1,
          }}
        >
          <AuthHeader
            name={"Sign Up"}
            back={"Back"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            enabled
          >
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    height: 140,
                    width: "90%",
                    alignSelf: "center",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: "800",
                      color: COLORS.appWhite,
                      letterSpacing: 0.02,
                    }}
                  >
                    Add your Artist Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: "#999999",
                      letterSpacing: 0.02,
                      marginTop: 10,
                    }}
                  >
                    Your Artist Name is how people discover and tag you. It can
                    be your real name or band name.
                    {"\n"}
                    {"\n"}
                    And it must be unique, but you can change it later.
                  </Text>
                </View>
                <View
                  style={{
                    height: 400,
                    width: "90%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.state.show ? (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "red",
                        marginBottom: 5,
                      }}
                    >
                      {"This artist name is not available."}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "red",
                        marginBottom: 5,
                      }}
                    >
                      {""}
                    </Text>
                  )}
                  <View
                    style={{
                      height: 49,
                      flexDirection: "row",
                      borderWidth: 1,
                      borderColor: this.state.show == true ? "red": COLORS.appWhite,
                      borderRadius: 6,
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder={"Artist Name"}
                      placeholderTextColor={COLORS.appWhite}
                      onChangeText={(artist) => {
                        this.setState(
                          {
                            artist: artist,
                          },
                          () => {
                            if (artist == "") {
                              this.setState({
                                show: false,
                                showTick:false
                              });
                            } else {
                              this.addArtist(artist);
                            }
                          }
                        );
                      }}
                      style={{
                        width: "90%",
                        height: 49,
                        paddingHorizontal: 10,
                        color: COLORS.appWhite,
                        fontSize: 21,
                        opacity: this.state.artist.length == 0 ? 0.4 : 1,
                      }}
                      maxLength={50}
                    ></TextInput>
                    {this.state.showTick && this.state.artist!='' && (
                      <Image
                        source={require("../../assets/check_mark.png")}
                        style={{
                          width: 16,
                          height: 16,
                          tintColor: COLORS.appPurple,
                        }}
                      />
                    )}
                  </View>
                  <TouchableOpacity
                    disabled={
                      this.state.artist == "" || this.state.show == true
                        ? true
                        : false
                    }
                    onPress={() => {
                     
                      Navigation.push(this.props.componentId, {
                        component: {
                          name: "password",
                          passProps: {
                            email: this.props.email,
                            username: this.state.artist,
                          },
                          options: {
                            topBar: {
                              visible: false,
                            },
                          },
                        },
                      });
                    }}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      borderRadius: 6,
                      marginTop: 20,
                      backgroundColor: COLORS.appPurple,
                      opacity:
                        this.state.artist == "" || this.state.show == true
                          ? 0.6
                          : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,
                        fontSize: 14,
                        fontWeight: "800",
                      }}
                    >
                      Next →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      // </SafeAreaView>
    );
  }
}
