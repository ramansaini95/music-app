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
import { AuthHeader } from "../../components/AuthHeader";

export default class confirmcode extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      email: props.email,
    };
  }

  confirmCode = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "verifiyemail",
      {
        email: this.props.email,
        token: this.state.code,
        //phonenumber:''
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          Navigation.push(this.props.componentId, {
            component: {
              name: "addartist",
              passProps: {
                email: this.props.email,
              },
              options: {
                topBar: {
                  visible: false,
                },
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
  resendCode = () => {
    this.setState({ isLoading: true });
    ApiCall(
      "resendcode",
      {
        email: this.props.email,
       
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
          alert(responseJson.data.message);
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
                    Enter confirmation code
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: COLORS.appWhite,
                      letterSpacing: 0.02,
                      marginTop: 10,
                    }}
                  >
                    Enter the confirmation code we sent to
                    {"\n"}[ email or phone number ]
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.resendCode()
                    }}
                    style={{
                      width: 120,
                      height: 40,
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
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 400,
                    width: "90%",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                  keyboardType={'number-pad'}
                    placeholder={"Confirmation Code"}
                    placeholderTextColor={COLORS.appWhite}
                    onChangeText={(code) => {
                      this.setState({
                        code: code,
                      });
                    }}
                    style={{
                      width: "100%",
                      height: 49,
                      borderWidth: 1,
                      borderColor: COLORS.appWhite,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      color: COLORS.appWhite,
                      fontSize: 21,
                      opacity: this.state.code.length == 0 ? 0.4 : 1,
                    }}
                  ></TextInput>
                  <TouchableOpacity
                    disabled={this.state.code == "" ? true : false}
                    onPress={() => {
                      this.confirmCode();
                    }}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      borderRadius: 6,
                      marginTop: 20,
                      backgroundColor: COLORS.appPurple,
                      opacity: this.state.code == "" ? 0.6 : 1,
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
