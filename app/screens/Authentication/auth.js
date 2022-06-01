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
import { ifIphoneX } from "react-native-iphone-x-helper";
import { Navigation } from "react-native-navigation";
import { COLORS } from "../../components/colors";

export default class auth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>

      <ImageBackground
        source={require("../../assets/giphy-1.gif")}
        style={{
          flex: 1,
        }}
      >
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 60,
              flexDirection: "row",
              width: "90%",
              alignSelf: "center",
              ...ifIphoneX(
                {
                  marginTop: 60,
                },
                {
                  marginTop: 40,
                }
              ),
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
              Listen more.
              {"\n"}
              {"\n"}
              Discover artists.
              {"\n"}
              {"\n"}
              Post your own
              {"\n"}
              0:45 tracks.
            </Text>
          </View>
          <View style={{ height: "32%", width: "90%", alignSelf: "center" }}>
            <TouchableOpacity
              onPress={() => {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: "Signup",
                    options: {
                      topBar: {
                        visible: false,
                      },
                    },
                  },
                });
              }}
              style={{
                backgroundColor: COLORS.appPurple,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                borderRadius: 6,
                marginTop: 0,
              }}
            >
              <Text
                style={{
                  color: COLORS.appWhite,
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                Sign up →
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: "SignIn",
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
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            Navigation.pop(this.props.componentId);
          }}
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: "transparent",
            borderRadius: 25,
            top: 50,
            right: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/close.png")}
            style={{ width: 45, height: 45 }}
          />
        </TouchableOpacity>
      </ImageBackground>
      // </SafeAreaView>
    );
  }
}
