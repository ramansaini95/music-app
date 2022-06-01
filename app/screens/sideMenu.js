import React, { PureComponent } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { buttons, COLORS, global } from "../components/colors";
import Header from "../components/header";
import RBSheet from "react-native-raw-bottom-sheet";
import UploadTrack from "../components/uploadTrack";
import DocumentPicker from "react-native-document-picker";
import TrackPlayer, { useProgress } from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";

height = Dimensions.get("window").height;
width = Dimensions.get("window").width;

export default class SideMenu extends PureComponent {
  state = {
    UserToken: "",
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    this.setState({
      UserToken: token,
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Navigation.mergeOptions(this.props.componentId, {
              sideMenu: {
                left: {
                  visible: false,
                },
              },
            });
          }}
          style={{
            height: 65,
            width: "90%",
            // alignSelf: 'center',
            flexDirection: "row",
            alignItems: "center",
            marginTop: "10%",
            marginLeft: 20,
          }}
        >
          <Image
            style={{
              tintColor: COLORS.appGray,
              height: 18,
              width: 22,
            }}
            source={require("../assets/Majesty.png")}
          />

          <Text
            style={{
              color: COLORS.appGray,
              fontSize: 20,
              marginLeft: 10,
              fontWeight: "600",
            }}
          >
            Majesty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height / 2.6,
          }}
          onPress={() => {
            if (this.state.UserToken != null && this.state.UserToken != "") {
              buttons.profileButton = "Profile";
              Navigation.push("Drawer", {
                component: {
                  name: "MyProfile",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                  },
                },
              });
            } else {
              Navigation.push("Drawer", {
                component: {
                  name: "auth",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                    topBar: {
                      visible: false,
                    },
                    animations: {
                      push: {
                        content: {
                          translationY: {
                            from: require("react-native").Dimensions.get(
                              "screen"
                            ).height,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }}
        >
          <Image
            source={require("../assets/profile.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 20,
              tintColor: COLORS.appGray,
            }}
          />
          <Text
            style={{
              color: COLORS.appGray,
              fontSize: 25,
              fontWeight: "400",
              marginLeft: 10,
            }}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height / 22,
          }}
          onPress={() => {
            if (this.state.UserToken != null && this.state.UserToken != "") {
              Navigation.push("Drawer", {
                component: {
                  name: "Library",
                  passProps: {
                    data: this.props.data,
                    state: this.props.state,
                  },
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                  },
                },
              });
            } else {
              Navigation.push("Drawer", {
                component: {
                  name: "auth",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                    topBar: {
                      visible: false,
                    },
                    animations: {
                      push: {
                        content: {
                          translationY: {
                            from: require("react-native").Dimensions.get(
                              "screen"
                            ).height,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }}
        >
          <Image
            source={require("../assets/library.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 20,
              tintColor: COLORS.appGray,
            }}
          />
          <Text
            style={{
              color: COLORS.appGray,
              fontSize: 25,
              fontWeight: "400",
              marginLeft: 10,
            }}
          >
            Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (this.state.UserToken != null && this.state.UserToken != "") {
              global.search = "search";
              Navigation.push("Drawer", {
                component: {
                  name: "Search",
                  passProps: {
                    check: "nav",
                  },
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                  },
                },
              });
            } else {
              Navigation.push("Drawer", {
                component: {
                  name: "auth",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                    topBar: {
                      visible: false,
                    },
                    animations: {
                      push: {
                        content: {
                          translationY: {
                            from: require("react-native").Dimensions.get(
                              "screen"
                            ).height,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height / 22,
          }}
        >
          <Image
            source={require("../assets/search.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 20,
              tintColor: COLORS.appGray,
            }}
          />
          <Text
            style={{
              color: COLORS.appGray,
              fontSize: 25,
              fontWeight: "400",
              marginLeft: 10,
            }}
          >
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height / 22,
          }}
          onPress={() => {
            if (this.state.UserToken != null && this.state.UserToken != "") {
              this.RBSheetTwo.open();
            } else {
              Navigation.push("Drawer", {
                component: {
                  name: "auth",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                    topBar: {
                      visible: false,
                    },
                    animations: {
                      push: {
                        content: {
                          translationY: {
                            from: require("react-native").Dimensions.get(
                              "screen"
                            ).height,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }}
        >
          <Image
            source={require("../assets/createPost.png")}
            style={{ width: 15, height: 15, marginLeft: 20 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "600",
              marginLeft: 10,
            }}
          >
            Post
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            bottom: 50,
          }}
          onPress={() => {
            if (this.state.UserToken != null && this.state.UserToken != "") {
              Navigation.push("Drawer", {
                component: {
                  name: "Setting",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                  },
                },
              });
            } else {
              Navigation.push("Drawer", {
                component: {
                  name: "auth",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                    topBar: {
                      visible: false,
                    },
                    animations: {
                      push: {
                        content: {
                          translationY: {
                            from: require("react-native").Dimensions.get(
                              "screen"
                            ).height,
                            to: 0,
                            duration: 300,
                          },
                        },
                      },
                    },
                  },
                },
              });
            }
          }}
        >
          <Image
            source={require("../assets/settings.png")}
            style={{
              width: 15,
              height: 15,
              marginLeft: 20,
              tintColor: COLORS.appGray,
            }}
          />
          <Text
            style={{
              color: COLORS.appGray,
              fontSize: 16,
              fontWeight: "400",
              marginLeft: 10,
            }}
          >
            Settings
          </Text>
        </TouchableOpacity>

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
              Navigation.push("Drawer", {
                component: {
                  name: "Record",
                  options: {
                    sideMenu: {
                      left: {
                        visible: false,
                      },
                    },
                  },
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
                      Navigation.push("Drawer", {
                        component: {
                          name: "editPost",

                          passProps: {
                            music: resto[0].uri,
                          },
                          options: {
                            sideMenu: {
                              left: {
                                visible: false,
                              },
                            },
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
      </View>
    );
  }
}
