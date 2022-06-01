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
import { ifIphoneX } from "react-native-iphone-x-helper";

export default class SignIn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      passwordLogin: "",
      show: false,
      simple: false,
      passError: false,
    };
  }

  SignInUser = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "login",
      {
        email: this.state.email,
        password: this.state.passwordLogin,
       
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          AsyncStorage.setItem("token", responseJson.data.data.token);
          AsyncStorage.setItem('artistname',responseJson.data.data.username)
          AsyncStorage.setItem('user_id',responseJson.data.data._id)
          console.log(responseJson.data.data.token,'----')
          this.setState(
            {
              show: false,
              passError: false,
            },
            () => {
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
            }
          );
        } else {
          this.setState({ isLoading: false });
          if (responseJson.data.error == "Wrong Password!") {
            this.setState({
              passError: true,
            });
          } else {
            this.setState({
              show: true,
              simple: true,
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
        {/* <AuthHeader
          name={"Sign In"}
          //back={"Back"}
          onClick={() => {
            Navigation.pop(this.props.componentId);
          }}
        /> */}
 <View
      style={{
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        width:'100%',
       
        ...ifIphoneX({
          marginTop: 40
      }, {
        marginTop: 20
      })
      }}
    >
      {/* <TouchableOpacity
        onPress={props.onClick}
        style={{
          width: "20%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          source={require("../assets/arrow.png")}
          style={{
            width: 15,
            height: 15,
            tintColor: "#fff",
            marginLeft: 10,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            marginLeft: 10,
            color: "#fff",
            fontWeight: "800",
          }}
        >
          {props.back}
        </Text>
      </TouchableOpacity> */}
      <View
        style={{
          //width: "90%",
          justifyContent: "center",
          alignItems: "center",
          flex:1,
          marginLeft:50
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "800",
      textAlign:'center' }}>
          Sign In
        </Text>
      </View>
      <TouchableOpacity
        style={{
          //width: "20%",
          alignItems: "center",
          flexDirection: "row",
          marginRight:10
        }}
        onPress={()=>{
            Navigation.setRoot({
                root: {
                  stack: {
                    children: [
                      {
                        component: {
                          name: "auth",
                          options: {
                            topBar: {
                              visible: "false",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              });
        }}
      >
         <Text
              style={{
                color:COLORS.appGray,
                fontSize:16
              }}
          >
            Cancel</Text>
      </TouchableOpacity>
    </View>

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
                  Welcome back
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
                    {this.state.simple == true
                      ? "Please double-check and try again."
                      : "Please enter valid email address"}
                  </Text>
                )}
                <TextInput
                  placeholder={"Phone, Email, or Artist Name"}
                  placeholderTextColor={COLORS.appWhite}
                  autoCapitalize={"none"}
                  onChangeText={(email) => {
                    this.setState({
                      email: email,
                    });
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
                    opacity: this.state.email.length == 0 ? 0.4 : 1,
                  }}
                ></TextInput>
                <TextInput
                  placeholder={"Password"}
                  placeholderTextColor={COLORS.appWhite}
                  value={this.state.passwordLogin}
                  secureTextEntry={true}
                  onChangeText={(passwordLogin) => {
                    this.setState({
                      passwordLogin: passwordLogin,
                    });
                  }}
                  style={{
                    width: "100%",
                    height: 49,
                    borderWidth: 1,
                    borderColor:
                      this.state.passError == true ? "red" : COLORS.appWhite,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    color: COLORS.appWhite,
                    fontSize: 21,
                    opacity: this.state.passwordLogin.length == 0 ? 0.4 : 1,
                    marginTop: 10,
                  }}
                ></TextInput>

                <TouchableOpacity
                  onPress={() => {
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: "forgotpassword",
                        options: {
                          topBar: {
                            visible: false,
                          },
                        },
                      },
                    });
                  }}
                  style={{
                    width: "45%",
                    height: 30,
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.appPurple,
                      fontWeight: "800",
                    }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                {this.state.passError && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: "red",
                      marginBottom: 5,
                      width: 273,
                    }}
                  >
                    {
                      "Sorry, your password was incorrect. Please double-check your password."
                    }
                  </Text>
                )}
                <TouchableOpacity
                  disabled={
                    this.state.email == "" || this.state.passwordLogin == ""
                      ? true
                      : false
                  }
                  onPress={() => {
                    this.SignInValidation();
                  }}
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    borderRadius: 6,
                    marginTop: 40,
                    backgroundColor: COLORS.appPurple,
                    opacity:
                      this.state.email == "" || this.state.passwordLogin == ""
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
                   Sign In
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
        <Loader  visible={this.state.isLoading}/>
      </ImageBackground>
      // </SafeAreaView>
    );
  }

  SignInValidation = () => {
   // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.email === false) {
      this.setState({
        show: true,
      });
    } 
    else {
      this.setState(
        {
          show: false,
        },
        () => {
          this.SignInUser();
        }
      );
    }
  };
}