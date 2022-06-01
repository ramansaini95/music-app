import React, { PureComponent, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Animated,
  Alert,
  TouchableWithoutFeedbackBase,
  PermissionsAndroid,
  Linking,
} from "react-native";
import { COLORS } from "../components/colors";
import moment from "moment";
import Player from "../components/player";
import { Navigation } from "react-native-navigation";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import TrackPlayer from "react-native-track-player";
import ActionSheet from "react-native-actionsheet";
import { ApiCall, ApiCallGet, ApiCallPut } from "../components/ApiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader } from "../components/Loader";
import { ifIphoneX } from "react-native-iphone-x-helper";
import UploadTrack from "../components/uploadTrack";
import DocumentPicker from "react-native-document-picker";
import Clipboard from "@react-native-clipboard/clipboard";
import Share, { Button } from "react-native-share";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 140;
const Min_Header_Height = 130;

export default class MyProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Profile: "",
      tracklist: "",
      progress: 0,
      popular: false,
      // data: [
      //   { id: 1, name: "Yellow Son", image: require("../assets/dots.png") },
      //   { id: 2, name: "The Other Side", image: require("../assets/dots.png") },
      //   {
      //     id: 3,
      //     name: "Two Can Be Alive",
      //     image: require("../assets/dots.png"),
      //   },
      // ],
      desc: "No bio",
      info: false,
      gearText:
        " Logic Pro X + 1972 Wurlitzer + Scarlett 2i2 + Stratocaster + Blue Yeti",
      singers: [
        { id: 1, name: "Socrates" },
        { id: 2, name: "Fred Nietzsche" },
        { id: 3, name: "Hannah Arendt" },
        { id: 4, name: "Leo Tolstoy" },
        { id: 5, name: "Spinoza" },
        { id: 6, name: "Carl Jung" },
      ],
      selectImage: "",
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
      isLoading: false,
      populartrack: "",
      Username: "",
    };
    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  componentDidMount = () => {
    this.ArtistProfile();
    this.animate();
    this.getPosition();
    this.listner = Navigation.events().registerComponentDidAppearListener(
      (btn) => {
        if (btn.componentName == "MyProfile") {
          this.ArtistProfile();
        }
      }
    );
  };
  componentWillUnmount() {
    this.listner.remove();
  }
  choose_image = () => {
    this.ActionSheet.show();
  };
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

  animate = () => {
    let progress = 0;
    this.setState({ progress: this.state.progress });
    setTimeout(() => {
      setInterval(() => {
        progress += Math.random() / 15;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({ progress: this.state.progress });
      }, 500);
    }, 1000);
  };
  DeletePost = (id) => {
    this.setState({ isLoading: true });
    ApiCall(
      "deletepost",
      {
        post_id: id,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          console.log(responseJson.data);
          //AsyncStorage.setItem("token", responseJson.data);
          this.setState(
            {
              isLoading: false,
            },
            () => {
              this.ArtistProfile();
            }
          );
        } else {
          this.setState({ isLoading: false });
          //alert(responseJson.data.error);
        }
      }
    );
  };
  UpdateProfile = async (image) => {
    try {
      ApiCallPut(
        "user",
        {
          image: image,
        },
        (responseJson) => {
          console.log(JSON.stringify(responseJson.data));
          if (responseJson.data.status == true) {
            this.ArtistProfile();
          } else {
            alert(responseJson.data.error);
          }
        }
      );
    } catch {
      console.error(error);
    }
  };

  ArtistProfile = async () => {
    this.setState({
      isLoading: true,
    });
    const token = await AsyncStorage.getItem("token");
    // console.log(token)
    fetch("http://18.116.105.68:3001/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);

        if (responseJson.status == true) {
          this.setState({
            isLoading: false,
            Profile: responseJson.data,
            selectImage: responseJson.data.image,
            gearText: responseJson.data.gear.join(" + "),
            tracklist: responseJson.data.latest_track,
            populartrack: responseJson.data.popular_track,
            Username: responseJson.data.username,
          });
          console.log(responseJson.data, "lll");
        } else {
          Alert.alert("", responseJson.message);
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  UploadImage = async (imageURI, name) => {
    this.setState({
      isLoading: true,
    });
    var formData = new FormData();
    formData.append("image", {
      uri: imageURI,
      name: name,
      type: "image/jpeg",
    });

    console.log("ImageForm" + " " + JSON.stringify(formData));
    fetch("http://18.116.105.68:3001/imageupload", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("----> " + JSON.stringify(responseJson));
        if (responseJson.status == true) {
          this.setState(
            {
              isLoading: false,
            },
            () => {
              this.UpdateProfile(responseJson.data);
            }
          );
        } else {
          this.setState({
            isLoading: false,
          });
        }
      });
  };
  ShareProfile() {
    Share.open({
      message: "Share Profile",
    });
  }
  upload(index) {
    if (index == 0) {
      launchCamera(
        {
          mediaType: "photo",
          quality: 0.4,
          maxHeight: 800,
          maxWidth: 800,
        },
        (response) => {
          console.log(response);
          if (response.didCancel) {
          } else {
            this.setState(
              {
                selectImage: response.assets[0].uri,
              },
              () => {
                this.UploadImage(
                  this.state.selectImage,
                  response.assets[0].fileName
                );
              }
            );
          }
        }
      );
    } else if (index == 1) {
      launchImageLibrary(
        {
          mediaType: "photo",
          quality: 0.4,
          maxHeight: 800,
          maxWidth: 800,
        },
        (response) => {
          console.log(response);
          if (response.didCancel) {
          } else {
            this.setState(
              {
                selectImage: response.assets[0].uri,
              },
              () => {
                this.UploadImage(
                  this.state.selectImage,
                  response.assets[0].fileName
                );
              }
            );
          }
        }
      );
    }
  }
  render() {
    const headerHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, Max_Header_Height - Min_Header_Height],
      outputRange: [Max_Header_Height, Min_Header_Height],
      extrapolate: "clamp",
    });

    const MarginTop = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, 15 - 5],
      outputRange: [20, 5],
      extrapolate: "clamp",
    });

    const FontHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, 36 - 21],
      outputRange: [36, 21],
      extrapolate: "clamp",
    });
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              ...ifIphoneX(
                {
                  marginTop: this.state.Username.length > 26 ? 200 : 100,
                },
                {
                  marginTop: this.state.Username.length > 26 ? 200 : 125,
                }
              ),
            }}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              this.setState({ info: false });
            }}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { y: this.scrollYAnimatedValue },
                },
              },
            ])}
          >
            <View>
              {this.state.selectImage == "" ||
              this.state.selectImage == null ? (
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 240,
                      backgroundColor: "#BB61F2",
                      justifyContent: "center",
                      opacity: 0.25,
                    }}
                  ></View>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      this.choose_image();
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "white",
                        fontWeight: "700",
                        opacity: 1.0,
                        fontSize: 14,
                        letterSpacing:0.5
                      }}
                    >
                      ADD A PHOTO +
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ImageBackground
                  source={
                    this.state.selectImage == "" ||
                    this.state.selectImage == null
                      ? require("../assets/dummi.png")
                      : { uri: this.state.selectImage }
                  }
                  style={{
                    width: "100%",
                    height: 240,
                    // marginTop: 120
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.choose_image();
                    }}
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      width: 130,
                      borderRadius: 10,
                      alignItems: "center",
                      height: 20,
                      justifyContent: "center",
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,
                        // fontFamily:
                        //   Platform.OS == "ios"
                        //     ? "SF Pro Display Bold"
                        //     : "SfProDisplayBold",
                      }}
                    >
                      CHANGE PHOTO
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "84%",
                alignSelf: "center",
                justifyContent: "space-between",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.appPurple,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                }}
              >
                BIO
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => {
                  Navigation.push(this.props.componentId, {
                    component: {
                      name: "EditBio",
                      passProps: {
                        data:
                          // this.state.Profile.bio == null
                          //   ? this.state.desc
                          this.state.Profile.bio,
                        profile: this.state.Profile,
                      },
                      options: {
                        topBar: {
                          visible: false,
                        },
                      },
                    },
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.appWhite,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    fontWeight: "700",
                  }}
                >
                  {this.state.Profile.bio == null ? "ADD +" : "EDIT BIO"}
                </Text>
                {this.state.Profile.bio != null &&
                  this.state.Profile.bio != "" && (
                    <Image
                      source={require("../assets/dropdown.png")}
                      style={{ width: 8, height: 4, marginLeft: 5 }}
                    />
                  )}
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color:
                  this.state.Profile.bio == null
                    ? COLORS.appGray
                    : COLORS.appWhite,
                alignSelf: "center",
                width: "84%",
                // fontFamily:
                //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                fontSize: 21,
                marginTop: 10,
                textAlign: "left",
              }}
            >
              {this.state.Profile.bio == null
                ? "No bio"
                : this.state.Profile.bio}
            </Text>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  width: "84%",
                  alignSelf: "center",
                  fontSize: 14,
                  color: COLORS.appPurple,
                  // fontFamily:
                  //   Platform.OS == "ios"
                  //     ? "SF Pro Display Bold"
                  //     : "SfProDisplayBold",
                }}
              >
                LATEST
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "84%",
                  alignSelf: "center",
                  // backgroundColor:'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 21,
                    color:
                      this.state.tracklist == null
                        ? COLORS.appGray
                        : COLORS.appWhite,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    marginTop: 8,
                    width: "80%",
                    textAlign: "justify",
                  }}
                >
                  {this.state.tracklist == null
                    ? "No tracks"
                    : this.state.tracklist.track_name}
                </Text>
                {this.state.populartrack != null &&
                this.state.populartrack != "" &&
                this.state.tracklist != null ? (
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      {
                        // this.state.populartrack != null &&
                        //   this.state.populartrack != "" &&
                        //   this.state.tracklist != null &&
                        this.setState({ latest: !this.state.latest });
                      }
                    }}
                  >
                    <Image
                      source={require("../assets/dots.png")}
                      style={{
                        tintColor: COLORS.appGray,
                        width: 18,
                        height: 4,
                        //alignSelf:'center'
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: 110,
                      height: 30,
                      //alignItems: "center",
                      //justifyContent: "center",
                    }}
                    onPress={() => {
                      this.RBSheetTwo.open();
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        //alignSelf:'center',
                        padding: 5,
                        marginLeft: -50,
                        color: COLORS.appWhite,
                        letterSpacing:0.3
                      }}
                    >
                      POST A TRACK +
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {this.state.tracklist != null && this.state.tracklist != "" && (
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appGray,
                    // fontFamily:
                    //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    marginTop: 8,
                    width: "84%",
                    alignSelf: "center",
                  }}
                >
                  {moment(this.state.tracklist.createdAt).format("MMM DD")}
                </Text>
              )}
            </View>
            {this.state.populartrack != null && this.state.populartrack != "" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    width: "84%",
                    alignSelf: "center",
                    justifyContent: "space-between",
                    marginTop: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.appPurple,
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display Bold"
                      //     : "SfProDisplayBold",
                    }}
                  >
                    POPULAR
                  </Text>
                </View>

                <FlatList
                  data={this.state.populartrack}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "84%",
                          alignSelf: "center",
                          justifyContent: "space-between",
                          marginTop: 30,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: COLORS.appGray,
                            }}
                          >
                            {index + 1}
                            {""}
                          </Text>
                          <Text
                            style={{
                              fontSize: 21,
                              color: COLORS.appWhite,

                              width: "80%",
                              textAlign: "justify",
                              marginLeft: 8,
                            }}
                          >
                            {item.track_name}
                          </Text>
                        </View>
                        {/* <TouchableOpacity
                          onPress={()=>{
                            this.setState({
                              popular:!this.state.popular
                            })
                          }}
                      > */}
                        <Image
                          source={require("../assets/dots.png")}
                          style={{
                            tintColor: COLORS.appGray,
                            width: 18,
                            height: 4,
                          }}
                        />
                        {/* </TouchableOpacity> */}
                      </View>
                    );
                  }}
                />
              </>
            )}
            {this.state.latest == true && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    latest: false,
                  });
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00000000",
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 132,
                    backgroundColor: "#000",
                    width: 185,
                    borderRadius: 15,
                    alignItems: "center",
                    borderWidth: 0,
                    marginTop: -45,
                    borderColor: "#ffffff22",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 180,
                      marginTop: 10,
                      alignItems: "center",
                      height: 50,
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      this.setState(
                        {
                          latest: false,
                        },
                        () => {
                          this.DeletePost(this.state.tracklist._id);
                        }
                      );
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,

                        fontSize: 20,
                        color: "red",
                      }}
                    >
                      Delete Track
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 180,
                      marginTop: 5,
                      alignItems: "center",
                      height: 50,
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      this.setState(
                        {
                          latest: false,
                        },
                        () => {
                          Clipboard.setString(this.state.tracklist.track);
                        }
                      );
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,
                        fontSize: 20,
                      }}
                    >
                      Copy Link
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            <View
              style={{
                width: "84%",
                alignSelf: "center",
                marginTop: 40,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  GEAR
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: "Gear",
                        passProps: {
                          data: this.state.gearText,
                          // profile:this.state.Profile.gear
                        },
                        options: {
                          topBar: {
                            visible: false,
                          },
                        },
                      },
                    });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.appWhite,
                      // fontFamily:
                      //   Platform.OS == "ios"
                      //     ? "SF Pro Display Bold"
                      //     : "SfProDisplayBold",
                      fontWeight: "700",
                    }}
                  >
                    {this.state.gearText == "" || this.state.gearText == null
                      ? "ADD +"
                      : "EDIT GEAR"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                color:
                  this.state.gearText == "" ? COLORS.appGray : COLORS.appWhite,
                alignSelf: "center",
                width: "84%",
                // fontFamily:
                //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                fontSize: 21,
                marginTop: 10,
              }}
            >
              {this.state.gearText == "" || this.state.gearText == null
                ? "No gear"
                : this.state.gearText.split(" + ").map((item, index) => {
                    return index <
                      this.state.gearText.split(" + ").length - 1 ? (
                      <Text
                        style={{
                          color: COLORS.appWhite,
                          alignSelf: "center",
                          width: "84%",
                          fontSize: 21,
                        }}
                      >
                        {item}
                        <Text
                          style={{
                            color: COLORS.appGray,
                          }}
                        >
                          {" "}
                          +{" "}
                        </Text>
                      </Text>
                    ) : (
                      <Text>{item}</Text>
                    );
                  })}
            </Text>

            <View
              style={{
                width: "84%",
                alignSelf: "center",
                marginTop: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  LINKS
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.appPurple,
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(this.state.Profile.links.filter((item) => item.key == 'fb'))
                      Navigation.push(this.props.componentId, {
                        component: {
                          name: "Links",
                          passProps: {
                            Links: this.state.Profile,
                          },
                          options: {
                            topBar: {
                              visible: false,
                            },
                          },
                        },
                      });
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.appWhite,
                        fontWeight: "700",
                        textAlign: "right",
                        // justifyContent:'flex-end'
                        // fontFamily:
                        //   Platform.OS == "ios"
                        //     ? "SF Pro Display Bold"
                        //     : "SfProDisplayBold",
                      }}
                    >
                      {(this.state.Profile.spotify == null ||
                        this.state.Profile.spotify == "") &&
                      (this.state.Profile.soundcloud == null ||
                        this.state.Profile.soundcloud == "") &&
                      (this.state.Profile.instagram == null ||
                        this.state.Profile.instagram == "") &&
                      (this.state.Profile.twitter == null ||
                        this.state.Profile.twitter == "") &&
                      (this.state.Profile.website == null ||
                        this.state.Profile.website == "")
                        ? "ADD +"
                        : "EDIT LINKS"}
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
            {(this.state.Profile.spotify == null ||
              this.state.Profile.spotify == "") &&
              (this.state.Profile.soundcloud == null ||
                this.state.Profile.soundcloud == "") &&
              (this.state.Profile.instagram == null ||
                this.state.Profile.instagram == "") &&
              (this.state.Profile.twitter == null ||
                this.state.Profile.twitter == "") &&
              (this.state.Profile.website == null ||
                this.state.Profile.website == "") && (
                <Text
                  style={{
                    color: COLORS.appGray,
                    alignSelf: "center",
                    width: "84%",
                    // fontFamily:
                    //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 21,
                    marginTop: 12,
                  }}
                >
                  No links
                </Text>
              )}

            {this.state.Profile.spotify != null &&
              this.state.Profile.spotify != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    Spotify ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.Profile.soundcloud != null &&
              this.state.Profile.soundcloud != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    Soundcloud ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.Profile.instagram != null &&
              this.state.Profile.instagram != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    Instagram ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.Profile.twitter != null &&
              this.state.Profile.twitter != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    Twitter ↗
                  </Text>
                </TouchableOpacity>
              )}
            {this.state.Profile.website != null &&
              this.state.Profile.website != "" && (
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      alignSelf: "center",
                      width: "84%",
                      // fontFamily:
                      //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                      fontSize: 21,
                      marginTop: 12,
                    }}
                  >
                    website ↗
                  </Text>
                </TouchableOpacity>
              )}

            <View
              style={{
                ...ifIphoneX(
                  {
                    height: 200,
                  },
                  {
                    height: 220,
                  }
                ),
              }}
            ></View>
          </ScrollView>

          <Animated.View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "100%",
              height:
                this.state.Username.length > 26
                  ? headerHeight + 100
                  : headerHeight,
              position: "absolute",
              top: 0,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
                marginTop: 15,
              }}
            >
              <Animated.Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: FontHeight,
                  //fontFamily:
                    // Platform.OS == "ios"
                    //   ? "SF Pro Display Bold"
                    //   : "SfProDisplayBold",
                  width: "90%",
                  ...ifIphoneX(
                    {
                      marginTop: 40,
                    },
                    {
                      marginTop: 20,
                    }
                  ),
                }}
              >
                {this.state.Username}
              </Animated.Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ info: !this.state.info });
                }}
                style={{
                  height: 20,
                  justifyContent: "center",
                  alignSelf: "center",
                  ...ifIphoneX(
                    {
                      marginTop: 40,
                    },
                    {
                      marginTop: 20,
                    }
                  ),
                  // marginTop: 50,
                }}
              >
                <Image
                  source={require("../assets/dots.png")}
                  style={{
                    tintColor: COLORS.appGray,
                    width: 18,
                    height: 4,
                    //marginTop: 50,
                  }}
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                width: "90%",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: MarginTop,
                flexDirection: "row",
                alignSelf: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appGray,
                  // fontFamily:
                  //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                <Text
                  style={{
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    fontSize: 14,
                    fontWeight: "900",
                  }}
                >
                  {this.state.Profile.play_count == null
                    ? "0"
                    : this.state.Profile.play_count}
                </Text>{" "}
                Plays
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appGray,
                  // fontFamily:
                  //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                <Text
                  style={{
                    // fontFamily:
                    // Platform.OS == "ios"
                    //   ? "SF Pro Display Bold"
                    //   : "SfProDisplayBold",
                    fontSize: 14,
                    fontWeight: "900",
                  }}
                >
                  {this.state.Profile.follower_count == null
                    ? "0"
                    : this.state.Profile.follower_count}
                </Text>{" "}
                Followers
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appGray,
                  // fontFamily:
                  //   Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                <Text
                  style={{
                    // fontFamily:
                    //   Platform.OS == "ios"
                    //     ? "SF Pro Display Bold"
                    //     : "SfProDisplayBold",
                    fontSize: 14,
                    fontWeight: "900",
                  }}
                >
                  {this.state.Profile.following_count == null
                    ? "0"
                    : this.state.Profile.following_count}
                </Text>{" "}
                Following
              </Text>
            </Animated.View>
          </Animated.View>

          {this.state.info == true && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.setState({
                  info: false,
                });
              }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#00000000",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <View
                style={{
                  height: 132,
                  backgroundColor: "#000",
                  width: 185,
                  position: "absolute",
                  alignSelf: "flex-end",
                 
                  ...ifIphoneX(
                    {
                      top:130,
                    },
                    {
                      top:100,
                    }
                  ),
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  right: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        info: false,
                      },
                      () => {
                        Navigation.push(this.props.componentId, {
                          component: {
                            name: "AccountDetail",
                            options: {
                              topBar: {
                                visible: false,
                              },
                            },
                          },
                        });
                      }
                    );
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      // marginTop: 20,
                      fontSize: 20,
                    }}
                  >
                    Account Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        info: false,
                      },
                      () => {
                        this.ShareProfile();
                      }
                    );
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.appWhite,
                      fontSize: 20,
                      marginTop: 14,
                    }}
                  >
                    Share Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={"Choose Image"}
          options={["Camera", "Gallery", "Cancel"]}
          cancelButtonIndex={2}
          onPress={(index) => {
            //this.upload(index)
            if (index == 0) {
              launchCamera(
                {
                  mediaType: "photo",
                  quality: 0.4,
                  maxHeight: 800,
                  maxWidth: 800,
                },
                (response) => {
                  console.log(response);
                  if (response.didCancel) {
                  } else if (response.errorCode) {
                    // Linking.openSettings();
                    if (Platform.OS == "ios") {
                      Alert.alert(
                        "Majesty",
                        "Please turn on your camera permissions",
                        [
                          {
                            text: "Settings",
                            onPress: async () => {
                              Linking.openSettings();
                            },
                          },
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA
                      );
                    }
                  } else {
                    this.setState(
                      {
                        selectImage: response.assets[0].uri,
                      },
                      () => {
                        this.UploadImage(
                          this.state.selectImage,
                          response.assets[0].fileName
                        );
                      }
                    );
                  }
                }
              );
            } else if (index == 1) {
              launchImageLibrary(
                {
                  mediaType: "photo",
                  quality: 0.2,
                  maxHeight: 720,
                  maxWidth: 720,
                },
                (response) => {
                  console.log(response);
                  if (response.didCancel) {
                  } else if (response.errorCode) {
                    // Linking.openSettings();
                    if (Platform.OS == "ios") {
                      Alert.alert(
                        "Majesty",
                        "Please turn on your camera permissions",
                        [
                          {
                            text: "Settings",
                            onPress: async () => {
                              Linking.openSettings();
                            },
                          },
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA
                      );
                    }
                  } else {
                    this.setState(
                      {
                        selectImage: response.assets[0].uri,
                      },
                      () => {
                        this.UploadImage(
                          this.state.selectImage,
                          response.assets[0].fileName
                        );
                      }
                    );
                  }
                }
              );
            }
          }}
        />

        {/* <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={170}
          openDuration={250}
          customStyles={{
            container: {
              backgroundColor: "transparent",
            },
            wrapper: {
              backgroundColor: "transparent",
            },
            draggableIcon: {
              backgroundColor: "transparent",
            },
          }}
        >
          <View style={{ height: 170, width: "100%" }}>
            <View
              style={{
                height: "58%",
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                borderRadius: 13,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.RBSheet.close();
                  launchCamera(
                    {
                      mediaType: "photo",
                    },
                    (response) => {
                      console.log(response);
                      if (response.didCancel) {
                      } else if (response.errorCode) {
                      } else {
                        this.setState({
                          selectImage: response.assets[0].uri,
                        });
                      }
                    }
                  );
                }}
                style={{
                  width: "100%",
                  height: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: "#fff",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  }}
                >
                  Camera
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: "100%",
                  height: 0.5,
                  backgroundColor: "#ffffff44",
                }}
              ></View>
              <TouchableOpacity
                onPress={() => {
                  launchImageLibrary(
                    {
                      mediaType: "photo",
                    },
                    (response) => {
                      console.log(response);
                      if (response.didCancel) {
                      } else {
                        this.setState(
                          {
                            selectImage: response.assets[0].uri,
                          },
                          () => {
                            this.RBSheet.close();
                          }
                        );
                      }
                    }
                  );
                }}
                style={{
                  width: "100%",
                  height: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: "#fff",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                  }}
                >
                  Gallary
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ height: "5%", backgroundColor: "transparent" }}
            ></View>
            <TouchableOpacity
              onPress={() => {
                this.RBSheet.close();
              }}
              style={{
                height: "28%",
                backgroundColor: "#202020",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                alignSelf: "center",
                borderRadius: 13,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "400",
                  color: "#fff",
                  fontFamily:
                    Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <View
              style={{ height: "10%", backgroundColor: "transparent" }}
            ></View>
          </View>
        </RBSheet> */}
        <RBSheet
          ref={(ref) => {
            this.RBSheetTwo = ref;
          }}
          height={height / 1.7}
          openDuration={400}
          closeDuration={300}
          closeOnDragDown={true}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            },
            draggableIcon: {
              backgroundColor: "black",
            },
          }}
        >
          <UploadTrack
            RecordScreen={() => {
              TrackPlayer.stop();
              this.RBSheetTwo.close();
              Navigation.push(this.props.componentId, {
                component: {
                  name: "Record",
                },
              });
            }}
            Demo={() => {
              this.RBSheetTwo.close();
              setTimeout(async () => {
                try {
                  DocumentPicker.pick({
                    type: [DocumentPicker.types.audio],
                  }).then((resto) => {
                    // alert(JSON.stringify(resto[0].uri));

                    if (resto[0].uri != null) {
                      Navigation.push(this.props.componentId, {
                        component: {
                          name: "editPost",
                          passProps: {
                            music: resto[0].uri,
                          },
                        },
                      });
                    }
                    // console.log(
                    //   res.uri,
                    //   res.type, // mime type
                    //   res.name,
                    //   res.size
                    // );
                    // console.log(res.uri, "--res");
                  });
                } catch (err) {
                  if (DocumentPicker.isCancel(err)) {
                    this.RBSheetTwo.close();
                    alert(err);
                    //console.log(res.uri, "--res");
                    // User cancelled the picker, exit any dialogs or menus and move on
                  } else {
                    alert(err);
                    //console.log(res.uri, "--res");
                    this.RBSheetTwo.close();
                    //throw err
                  }
                }
              }, 1000);
            }}
          />

          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: COLORS.appBlack,
              width: "95%",
              alignItems: "center",
              height: 60,
              justifyContent: "center",
              marginTop: 15,
              borderRadius: 15,
              overflow: "hidden",
            }}
            onPress={() => {
              this.RBSheetTwo.close();
            }}
          >
            <Text style={{ color: COLORS.appWhite, fontSize: 18 }}>Cancel</Text>
          </TouchableOpacity>
        </RBSheet>
        <View
          style={{
            width: width,
            // height: 189,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            alignItems: "center",
            // position: "absolute",
            // bottom: 0,
            // right: 0,
            // left: 0,
          }}
        >
          <View
            style={{
              // backgroundColor: 'rgba(0, 0, 0, 0.6)',
              height: 55,
              width: "92%",
              flexDirection: "row",
              marginVertical: 5,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.RBSheetTwo.open();
              }}
              style={{
                width: 131,
                height: 40,
                backgroundColor: COLORS.appPurple,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              <Image
                source={require("../assets/post1.png")}
                style={{ width: 15, height: 15 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appWhite,
                  fontWeight: "800",
                  marginLeft: 5,
                }}
              >
                Post a Track
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                this.state.populartrack == null ||
                this.state.populartrack == "" ||
                this.state.tracklist == null
                  ? true
                  : false
              }
              activeOpacity={0.8}
              style={{
                width: 131,
                height: 40,
                backgroundColor: COLORS.appWhite,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                opacity:
                  this.state.populartrack == null ||
                  this.state.populartrack == "" ||
                  this.state.tracklist == null
                    ? 0.3
                    : 1.0,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.appBlack,
                  fontWeight: "800",
                }}
              >
                Shuffle Play
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                width: 30,
                justifyContent: "center",
              }}
              onPress={() => {
                Navigation.pop(this.props.componentId);
              }}
            >
              <Image
                source={require("../assets/close.png")}
                style={{ height: 40, width: 40 }}
              />
            </TouchableOpacity>
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
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}
