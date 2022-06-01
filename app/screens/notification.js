import React, { PureComponent } from "react";
import { View, Text, SafeAreaView, Switch, ScrollView } from "react-native";
import { Navigation } from "react-native-navigation";
import { HeaderFile } from "../components/HeaderFile";
import { COLORS, global } from "../components/colors";
import { ApiCall, ApiCallGet } from "../components/ApiCall";
import { Loader } from "../components/Loader";
import Player from "../components/player";

export default class notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledPush: '',
      isEnabledEmail: '',
      isEnableTrackPush: '',
      isEnableTrackEmail: '',
      isEnableFeedbackPush: '',
      isEnableFeedbackEmail: '',
      isEnabledSharePush: '',
      isEnabledShareEmail: '',
      isLoading:false,
      duration: 0,
      position: 0,
      artist: "Masked wolf",
      title: "Astronout",
    };
  }

  _toggleSwitch1 = () => {
    //music,reaction,share,feedback
    if (this.state.isEnabledPush == false) {
      this.setState({
        isEnabledPush: true,
      },()=>{
        this.Update_status('music',this.state.isEnabledPush,this.state.isEnabledEmail)
      });
    } else {
      this.setState({
        isEnabledPush: false,
      },()=>{
        this.Update_status('music',this.state.isEnabledPush,this.state.isEnabledEmail)
      });
    }
   
  };
  _toggleSwitch2 = () => {
    if (this.state.isEnabledEmail == false) {
      this.setState({
        isEnabledEmail: true,
      },()=>{
        this.Update_status('music',this.state.isEnabledPush,this.state.isEnabledEmail)
      });
    } else {
      this.setState({
        isEnabledEmail: false,
      },()=>{
        this.Update_status('music',this.state.isEnabledPush,this.state.isEnabledEmail)
      });
    }
  };
  _toggleSwitch3 = () => {
    if (this.state.isEnableTrackPush == false) {
      this.setState({
        isEnableTrackPush: true,
      },()=>{
        this.Update_status('reaction',this.state.isEnableTrackPush,this.state.isEnableTrackEmail)
      });
    } else {
      this.setState({
        isEnableTrackPush: false,
      },()=>{
        this.Update_status('reaction',this.state.isEnableTrackPush,this.state.isEnableTrackEmail)
      });
    }
  };
  _toggleSwitch4 = () => {
    if (this.state.isEnableTrackEmail == false) {
      this.setState({
        isEnableTrackEmail: true,
      },()=>{
        this.Update_status('reaction',this.state.isEnableTrackPush,this.state.isEnableTrackEmail)
      });
    } else {
      this.setState({
        isEnableTrackEmail: false,
      },()=>{
        this.Update_status('reaction',this.state.isEnableTrackPush,this.state.isEnableTrackEmail)
      });
    }
  };
  _toggleSwitch5 = () => {
    if (this.state.isEnableFeedbackPush == false) {
      this.setState({
        isEnableFeedbackPush: true,
      },()=>{
        this.Update_status('feedback',this.state.isEnableFeedbackPush,this.state.isEnableFeedbackEmail)
      });
    } else {
      this.setState({
        isEnableFeedbackPush: false,
      },()=>{
        this.Update_status('feedback',this.state.isEnableFeedbackPush,this.state.isEnableFeedbackEmail)
      });
    }
  };
  _toggleSwitch6 = () => {
    if (this.state.isEnableFeedbackEmail == false) {
      this.setState({
        isEnableFeedbackEmail: true,
      },()=>{
        this.Update_status('feedback',this.state.isEnableFeedbackPush,this.state.isEnableFeedbackEmail)
      });
    } else {
      this.setState({
        isEnableFeedbackEmail: false,
      },()=>{
        this.Update_status('feedback',this.state.isEnableFeedbackPush,this.state.isEnableFeedbackEmail)
      });
    }
  };
  _toggleSwitch7 = () => {
    if (this.state.isEnabledSharePush == false) {
      this.setState({
        isEnabledSharePush: true,
      },()=>{
        this.Update_status('share',this.state.isEnabledSharePush,this.state.isEnabledShareEmail)
      });
    } else {
      this.setState({
        isEnabledSharePush: false,
      },()=>{
        this.Update_status('share',this.state.isEnabledSharePush,this.state.isEnabledShareEmail)
      });
    }
  };
  _toggleSwitch8 = () => {
    if (this.state.isEnabledShareEmail == false) {
      this.setState({
        isEnabledShareEmail: true,
      },()=>{
        this.Update_status('share',this.state.isEnabledSharePush,this.state.isEnabledShareEmail)
      });
    } else {
      this.setState({
        isEnabledShareEmail: false,
      },()=>{
        this.Update_status('share',this.state.isEnabledSharePush,this.state.isEnabledShareEmail)
      });
    }
  };
  Notification_status = () => {
   
    this.setState({ isLoading: true });
    ApiCallGet(
      "user",
      
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data.notify_status),'olo');
       
        if (responseJson.data.status == true) {
         
          this.setState(
            {
              isLoading:false,
              isEnabledPush: responseJson.data.data.notify_status.music_push_notify==1?true:false,
      isEnabledEmail: responseJson.data.data.notify_status.music_email_notify==1?true:false,
      isEnableTrackPush: responseJson.data.data.notify_status.reaction_push_notify==1?true:false,
      isEnableTrackEmail: responseJson.data.data.notify_status.reaction_email_notify==1?true:false,
      isEnableFeedbackPush: responseJson.data.data.notify_status.feedback_push_notify==1?true:false,
      isEnableFeedbackEmail: responseJson.data.data.notify_status.feedback_email_notify==1?true:false,
      isEnabledSharePush: responseJson.data.data.notify_status.share_push_notify==1?true:false,
      isEnabledShareEmail: responseJson.data.data.notify_status.share_email_notify==1?true:false,
            },
           
          );
        } else {
          this.setState({ isLoading: false });
         
        }
      }
    );
  };
  Update_status = (key,push,email) => {
   
    this.setState({ isLoading: true });
    ApiCall(
      "update_notification",
      {
        key:key,
        push_notify:push==true?1:0,
        email_notify:email==true?1:0
      },
      
      (responseJson) => {
       
        this.setState({ isLoading: false });
        if (responseJson.data.status == true) {
         this.setState({isLoading:false})
        //alert(responseJson.data.message)
           
          
        } else {
          this.setState({ isLoading: false });
         
        }
      }
    );
  };
componentDidMount(){
  this.Notification_status()
}
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={{ flex: 1 }}>
          <HeaderFile
            name={"Notifications"}
            back={"Settings"}
            onClick={() => {
              Navigation.pop(this.props.componentId);
            }}
          />
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{ width: "85%", alignSelf: "center", marginTop: 30 }}
              >
                <Text
                  style={{
                    color: COLORS.appPurple,
                    fontWeight: "800",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 12,
                    letterSpacing: 0.1,
                  }}
                >
                  NEW MUSIC
                </Text>
                <Text
                  style={{
                    opacity: 0.4,
                    letterSpacing: 0.02,
                    fontSize: 13,
                    color: "#fff",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 12,
                    letterSpacing: 0.1,
                    marginTop: 5,
                  }}
                >
                  From artists you follow or might like
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity: this.state.isEnabledPush == false ? 0.3 : 1,
                    }}
                  >
                    Push notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={this.state.isEnabledPush ? "#fff" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch1}
                    value={this.state.isEnabledPush}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity: this.state.isEnabledEmail == false ? 0.3 : 1,
                    }}
                  >
                    Email notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={this.state.isEnabledEmail ? "#fff" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch2}
                    value={this.state.isEnabledEmail}
                  />
                </View>
              </View>
              <View
                style={{ width: "85%", alignSelf: "center", marginTop: 30 }}
              >
                <Text
                  style={{
                    color: COLORS.appPurple,
                    fontWeight: "800",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 12,
                    letterSpacing: 0.1,
                  }}
                >
                  REACTIONS TO MY TRACKS
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity: this.state.isEnableTrackPush == false ? 0.3 : 1,
                    }}
                  >
                    Push notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={this.state.isEnableTrackPush ? "#fff" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch3}
                    value={this.state.isEnableTrackPush}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity: this.state.isEnableTrackEmail == false ? 0.3 : 1,
                    }}
                  >
                    Email notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={this.state.isEnableTrackEmail ? "#fff" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch4}
                    value={this.state.isEnableTrackEmail}
                  />
                </View>
              </View>
              <View
                style={{ width: "85%", alignSelf: "center", marginTop: 30 }}
              >
                <Text
                  style={{
                    color: COLORS.appPurple,
                    fontWeight: "800",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 12,
                    letterSpacing: 0.1,
                  }}
                >
                  FEEDBACK ON MY TRACKS
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity:
                        this.state.isEnableFeedbackPush == false ? 0.3 : 1,
                    }}
                  >
                    Push notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={
                      this.state.isEnableFeedbackPush ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch5}
                    value={this.state.isEnableFeedbackPush}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity:
                        this.state.isEnableFeedbackEmail == false ? 0.3 : 1,
                    }}
                  >
                    Email notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={
                      this.state.isEnableFeedbackEmail ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch6}
                    value={this.state.isEnableFeedbackEmail}
                  />
                </View>
              </View>
              <View
                style={{ width: "85%", alignSelf: "center", marginTop: 30 }}
              >
                <Text
                  style={{
                    color: COLORS.appPurple,
                    fontWeight: "800",
                    fontFamily:
                      Platform.OS == "ios" ? "SF Pro Display" : "SfProDisplay",
                    fontSize: 12,
                    letterSpacing: 0.1,
                  }}
                >
                  WHEN MY TRACKS ARE SHARED
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity: this.state.isEnabledSharePush == false ? 0.3 : 1,
                    }}
                  >
                    Push notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={this.state.isEnabledSharePush ? "#fff" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch7}
                    value={this.state.isEnabledSharePush}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 45,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "80%",
                      fontSize: 21,
                      fontWeight: "400",
                      color: "#fff",
                      opacity:
                        this.state.isEnabledShareEmail == false ? 0.3 : 1,
                    }}
                  >
                    Email notifications
                  </Text>
                  <Switch
                    trackColor={{
                      false: COLORS.appPurple,
                      true: COLORS.appPurple,
                    }}
                    thumbColor={
                      this.state.isEnabledShareEmail ? "#fff" : "#fff"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this._toggleSwitch8}
                    value={this.state.isEnabledShareEmail}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <Loader  visible={this.state.isLoading}/>
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
      </View>
    );
  }
}
