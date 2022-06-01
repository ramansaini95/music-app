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
import { HeaderFile } from "../../components/HeaderFile";
import { Loader } from "../../components/Loader";

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default class Signup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artistview: true,
      tracksView: false,
      email: "",
      phone_number: "",
      isLoading: false,
      Passerr: "",
    };
  }

  SignUp = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "register",
      {
        email: this.state.email,
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          //AsyncStorage.setItem("token", responseJson.data);
          this.setState({
            show: false,
            isLoading: false,
          });
          Navigation.push(this.props.componentId, {
            component: {
              name: "confirmcode",
              passProps: {
                email: this.state.email.toLowerCase(),
              },
              options: {
                topBar: {
                  visible: false,
                },
              },
            },
          });
        } else {
          this.setState({
            isLoading: false,
            show: true,
            Passerr: responseJson.data.error.slice(5, 200),
          });
          //alert(responseJson.data.error);
        }
      }
    );
  };
  componentDidMount() {}
  render() {
    return (
      // <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.appBlack }}>
      <ImageBackground
        source={require("../../assets/giphy-1.gif")}
        style={{
          flex: 1,
        }}
      >
        <HeaderFile
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
                  Enter phone or email
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
                {this.state.show && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: "red",
                      marginBottom: 5,
                    }}
                  >
                    {this.state.Passerr}
                  </Text>
                )}
                {this.state.artistview == true ? (
                  <TextInput
                    ref={(input) => {
                      this.textInput = input;
                    }}
                    placeholder={"Phone Number"}
                    placeholderTextColor={COLORS.appWhite}
                    onChangeText={(phone_number) => {
                      this.setState({
                        phone_number: phone_number,
                      });
                    }}
                    autoCapitalize={"none"}
                    keyboardType={"number-pad"}
                    returnKeyType={"done"}
                    style={{
                      width: "100%",
                      height: 49,
                      borderWidth: 1,
                      borderColor: COLORS.appWhite,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      color: COLORS.appWhite,
                      fontSize: 21,
                      opacity: this.state.phone_number.length == 0 ? 0.4 : 1,
                    }}
                  ></TextInput>
                ) : (
                  <TextInput
                    ref={(input) => {
                      this.textInput2 = input;
                    }}
                    placeholder={"Email"}
                    placeholderTextColor={COLORS.appWhite}
                    onChangeText={(email) => {
                      this.setState({
                        email: email,
                      });
                    }}
                    autoCapitalize={"none"}
                    style={{
                      width: "100%",
                      height: 49,
                      borderWidth: 1,
                      borderColor: COLORS.appWhite,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      color: COLORS.appWhite,
                      fontSize: 21,
                      opacity: this.state.email.length == 0 ? 0.4 : 1,
                    }}
                  ></TextInput>
                )}
                <TouchableOpacity
                  disabled={
                    this.state.email == "" && this.state.phone_number == ""
                      ? true
                      : false
                  }
                  onPress={() => {
                    this.signUpValidation();
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
                      this.state.email == "" && this.state.phone_number == ""
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
                <View
                  style={{
                    width: "100%",
                    height: 60,
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <View
                    style={{
                      height: 50,
                      width: "100%",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "50%",
                        justifyContent: "center",
                      }}
                    >
                      {this.state.artistview && (
                        <View
                          style={{ height: 2, backgroundColor: "#fff" }}
                        ></View>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          if (this.state.artistview == false) {
                            this.setState(
                              {
                                artistview: true,
                                tracksView: false,
                                email:''
                              },
                              () => {
                                if (this.state.artistview == true) {
                                  this.textInput.clear();
                                }
                              }
                            );
                          }
                        }}
                        style={{
                          height: "98%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "800",
                            color: "#fff",
                            // fontFamily:
                            //   Platform.OS == "ios"
                            //     ? "SF Pro Display"
                            //     : "SfProDisplay",
                            opacity: this.state.tracksView == true ? 0.3 : 1,
                          }}
                        >
                          Phone
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        justifyContent: "center",
                      }}
                    >
                      {this.state.tracksView && (
                        <View
                          style={{ height: 2, backgroundColor: "#fff" }}
                        ></View>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          // this.textInput.clear()
                          if (this.state.tracksView == false) {
                            this.setState(
                              {
                                artistview: false,
                                tracksView: true,
                                phone_number:''
                              },
                              () => {
                                if (this.state.tracksView == true) {
                                  this.textInput2.clear();
                                }
                              }
                            );
                          }
                        }}
                        style={{
                          height: "98%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "800",
                            color: "#fff",
                            // fontFamily:
                            //   Platform.OS == "ios"
                            //     ? "SF Pro Display"
                            //     : "SfProDisplay",
                            opacity: this.state.artistview == true ? 0.3 : 1,
                          }}
                        >
                          Email
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Loader visible={this.state.isLoading} />
      </ImageBackground>
      // </SafeAreaView>
    );
  }
  signUpValidation = () => {
    if (this.state.artistview == true) {
      if (this.state.phone_number == "") {
        this.setState({
          show: true,
          Passerr: "Please enter phone number first",
        });
      } else if (this.state.phone_number.length < 10) {
        this.setState({
          show: true,
          Passerr: "Please enter valid phone number",
        });
      } else {
        this.SignUp();
      }
    } else {
      if (this.state.email == "") {
        this.setState({
          show: true,
          Passerr: "Please enter email address",
        });
      } else if (reg.test(this.state.email) === false) {
        this.setState({
          show: true,
          Passerr: "Please enter valid email address",
        });
      } else {
        this.SignUp();
      }
    }
  };
}