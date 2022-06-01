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
} from "react-native";
import { Navigation } from "react-native-navigation";
import { ApiCall } from "../../components/ApiCall";
import { COLORS } from "../../components/colors";
import { HeaderFile } from "../../components/HeaderFile";
import { Loader } from "../../components/Loader";
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export default class forgotpassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      forgotpass: "",
      show: false,
      simple: false,
      borderColor:COLORS.appWhite,
      isLoading:false
    };
  }
  forgotpassWORD = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "forgotpassword",
      {
        params: this.state.forgotpass,
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          alert(responseJson.data.message);
          Navigation.pop(this.props.componentId);
        } else {
          this.setState({ isLoading: false });
          if (responseJson.data.error == "No user found") {
            this.setState({
              show: true,
              simple: true,
            });
          } else {
            this.setState({
              show: false,
              simple: false,
            });
          }
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
          <HeaderFile
            name={"Sign In"}
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
                    Trouble signing in?
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
                    Enter your phone, email, or artist name and we’ll send you a
                    link to get back into your acocunt.
                  </Text>
                </View>
                <View
                  style={{
                    height: 420,
                    width: "90%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    placeholder={"Phone, Email, or Artist Name"}
                    placeholderTextColor={COLORS.appWhite}
                    autoCapitalize={"none"}
                    onChangeText={(forgotpass) => {
                      this.setState({
                        forgotpass: forgotpass,
                      },()=>{
                       if(this.state.forgotpass=='') {
                         this.setState({
                           show:false
                         })
                       }
                      });
                    }}
                    style={{
                      width: "100%",
                      height: 49,
                      borderWidth: 1,
                      borderColor:this.state.show?COLORS.appRed: COLORS.appWhite,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      color: COLORS.appWhite,
                      fontSize: 21,
                      opacity:this.state.forgotpass==''? 0.4:1.0,
                    }}
                  ></TextInput>
                  {this.state.show && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: "red",
                        marginTop: 8,
                      }}
                    >
                      {this.state.simple == true
                        ? "Sorry, we don’t recognize that.\nPlease double-check and try again."
                        : "Please enter valid email address"}
                    </Text>
                  )}
                  <TouchableOpacity
                    disabled={this.state.forgotpass == "" ? true : false}
                    onPress={() => {
                      this.ValidationForgot();
                    }}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      borderRadius: 6,
                      marginTop: 50,
                      backgroundColor: COLORS.appPurple,
                      opacity: this.state.forgotpass == "" ? 0.4 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.appWhite,
                        fontSize: 14,
                        fontWeight: "800",
                      }}
                    >
                      Send Sign In Link
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <View
            style={{
              width: "90%",
              height: 50,
              position: "absolute",
              bottom: 10,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.appWhite }}>
              Don’t have an account?
              <TouchableOpacity
                onPress={() => {
                  Navigation.push(this.props.componentId, {
                    component: {
                      name: "Signup",
                      options: {
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
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -3,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.appPurple,
                    fontWeight: "800",
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
          <Loader visible ={this.state.isLoading}/>
        </ImageBackground>
      // </SafeAreaView>
    );
  }
  ValidationForgot = () => {
    if (reg.test(this.state.forgotpass) === false) {
      this.setState({
        show: true,
      });
    } else {
      this.setState(
        {
          show: false,
        },
        () => {
          this.forgotpassWORD();
        }
      );
    }
  };
}