import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";
import { Navigation } from "react-native-navigation";
import RBSheet from "react-native-raw-bottom-sheet";
import { COLORS } from "../../components/colors";
import UploadTrack from "../../components/uploadTrack";
import DocumentPicker from "react-native-document-picker";
import TrackPlayer, { useProgress } from "react-native-track-player";

export default class main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
 

  render() {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        />

        <ImageBackground
          source={require("../../assets/giphy-1.gif")}
          style={{
            flex: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 60,
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
                marginTop: 40,
              }}
            >
              <View
                style={{
                  height: 60,
                  flexDirection: "row",
                  width: "87%",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../../assets/Majesty.png")}
                  style={{ width: 22, height: 18, tintColor: COLORS.appWhite }}
                />

                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 20,
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  Majesty
                </Text>
              </View>
              <TouchableOpacity
                style={{ width: "17%", height: 30 }}
                onPress={() => {
                  Navigation.pop(this.props.componentId);
                }}
              ></TouchableOpacity>
            </View>
            <View
              style={{
                height: "62%",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "800",
                  color: COLORS.appWhite,
                  marginTop: 50,
                }}
              >
                Glad you’re here, {this.props.username}
              </Text>
            </View>
            <View style={{ height: "32%", width: "90%", alignSelf: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.RBSheetTwo.open();
                }}
                style={{
                  backgroundColor: COLORS.appPurple,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  borderRadius: 6,
                  marginTop: 0,
                  flexDirection: "row",
                }}
              >
                <Image
                  source={require("../../assets/post1.png")}
                  style={{ width: 15, height: 15 }}
                />
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 14,
                    fontWeight: "800",
                    marginLeft: 5,
                  }}
                >
                  Post your first track
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Navigation.setRoot({
                    root: {
                      sideMenu: {
                        id: "Menu",
                        left: {
                          component: {
                            name: "SideMenu",
                          },
                        },
                        center: {
                          stack: {
                            id: "Drawer",
                            children: [
                              {
                                component: {
                                  name: "Home",
                                },
                              },
                            ],
                            options: {
                              layout: {
                                direction: "ltr",
                                orientation: ["portrait"],
                              },
                              animations: {
                                setRoot: {
                                  alpha: {
                                    from: 0,
                                    to: 1,
                                    duration: 300,
                                  },
                                },
                              },
                              topBar: {
                                visible: false,
                              },
                            },
                          },
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
                  marginTop: 10,
                  borderWidth: 1.5,
                  borderColor: COLORS.appWhite,
                }}
              >
                <Text
                  style={{
                    color: COLORS.appWhite,
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  Listen to music
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
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
                  options: {
                    topBar: {
                      visible: false,
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
      </View>
      // </SafeAreaView>
    );
  }
}
