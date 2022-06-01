import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCall } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { AuthHeader } from "../../components/AuthHeader";
import { Loader } from "../../components/Loader";
export default class password extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artistview: true,
      tracksView: false,
      password: "",
      show: false,
      simple: false,
      isLoading: false,
    };
  }
  Register = () => {
    ApiCall(
      "registeruser",
      {
        "email": this.props.email,
        "password": this.state.password,
        "username": this.props.username,
        //"phone_number": "",
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          AsyncStorage.setItem("token", responseJson.data.data.token);
          AsyncStorage.setItem('user_id',responseJson.data.data._id)
          Navigation.setRoot({
            root: {
              stack: {
                children: [
                  {
                    component: {
                      name: "main",
                      passProps: {
                        username: this.props.username,
                      },
                      options: {
                        topBar: {
                          visible: false,
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
                      },
                    },
                  },
                ],
              },
            },
          });
        } else {
          this.setState({ isLoading: false });
          alert(responseJson.data.error);
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
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 140,
                  width: "90%",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: 10,
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
                  Create a Password
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: COLORS.appGray,
                    letterSpacing: 0.02,
                    marginTop: 10,
                  }}
                >
                  Passwords must have at least 6 characters.
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
                    {"This password is too easy to guess."}
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
                <TextInput
                  placeholder={"Password"}
                  placeholderTextColor={COLORS.appWhite}
                  secureTextEntry={true}
                  onChangeText={(password) => {
                    this.setState(
                      {
                        password: password,
                      },
                      () => {
                        if (password == "123456") {
                          this.setState({
                            show: true,
                          });
                        } else {
                          this.setState({
                            show: false,
                          });
                        }
                      }
                    );
                  }}
                  style={{
                    width: "100%",
                    height: 49,
                    borderWidth: 1,
                    borderColor:
                      this.state.show == true ? "red" : COLORS.appWhite,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    color: COLORS.appWhite,
                    fontSize: 21,
                    opacity: this.state.password.length == 0 ? 0.4 : 1,
                  }}
                ></TextInput>
                <TouchableOpacity
                  disabled={
                    this.state.password == "" ||
                    this.state.password.length < 6 ||
                    this.state.password == "123456"
                      ? true
                      : false
                  }
                  onPress={() => {
                    this.Register();
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
                      this.state.password == "" ||
                      this.state.password.length < 6 ||
                      this.state.password == "123456"
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
        <Loader visible={this.state.isLoading} />
      </ImageBackground>
      // </SafeAreaView>
    );
  }
}