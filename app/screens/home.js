import React, { PureComponent } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  Navigation,
  OptionsModalPresentationStyle,
} from "react-native-navigation";
import Bottom from "../components/bottomFeedTab";
import { COLORS } from "../components/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import Lyrics from "./lyrics";
import Share, { Button } from "react-native-share";
import Player from "../components/player";
import TrackPlayer, {
  State,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Slider from "react-native-slider";
import { global } from "../components/playerState";
import AutoScrolling from "react-native-auto-scrolling";
import UploadTrack from "../components/uploadTrack";
import { PanGestureHandler } from "react-native-gesture-handler";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import GestureRecognizer from "react-native-swipe-gestures";
import Feedback from "./feedback";
import Search from "./search";
import DocumentPicker from "react-native-document-picker";
import { ifIphoneX } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiCall, ApiCallGet } from "../components/ApiCall";
import moment from "moment";
import { Loader } from "../components/Loader";
import { song } from "../components/songs";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const Max_Header_Height = 125;
const Min_Header_Height = 100;

const boring_count = "boring_count";
const clap_count = "clap_count";
const fire_count = "fire_count";
const laugh_count = "laugh_count";
const sad_count = "sad_count";
const heart_count = "heart_count";

const boringemoji_status = "boringemoji_status";
const clapemoji_status = "clapemoji_status";
const fireemoji_status = "fireemoji_status";
const laughemoji_status = "laughemoji_status";
const sademoji_status = "sademoji_status";
const heartemoji_status = "heartemoji_status";

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      follow: "",
      nameuser: "",
      data: [
        {
          id: 0,
          title: "Animals Progressive House, Electro House Progressive House",
          album: "Animals",
          artwork: require("../assets/giphy-2.gif"),
          artist: "Martin Garix",
          views: "9.3K",
          day: "Today",
          share: "2.3K",
          comment: "850",
          like: "7.7K",
          url: require("../assets/mp3/Animals.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 1,
          title: "Astronaut",
          album: "Astronaut",
          artwork: require("../assets/giphy-1.gif"),
          artist: "Masked Wolf",
          views: "230",
          day: "Today",
          share: "2.3K",
          comment: "850",
          like: "7.7K",
          url: require("../assets/mp3/Astronaut.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 2,
          title: "Met Him Last Night",
          album: "Met Him Last Night",
          artwork: require("../assets/giphy-3.gif"),
          artist: "Ariana Grande",
          views: "150",
          day: "Today",
          share: "2.3K",
          comment: "850",
          like: "7.7K",
          url: require("../assets/mp3/MetHimLastNight.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 3,
          title: "Future Mask",
          album: "Future Mask",
          artwork: require("../assets/giphy-4.gif"),
          artist: "Marshmello",
          views: "150",
          day: "Today",
          share: "0",
          comment: "0",
          like: "0",
          url: require("../assets/mp3/FutureMask.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 4,
          title: "Tokyo Drift",
          album: "Tokyo Drift",
          artwork: require("../assets/giphy-1.gif"),
          artist: "KVSH",
          views: "150",
          day: "Today",
          share: "0",
          comment: "0",
          like: "0",
          url: require("../assets/mp3/TokyoDrift.mp3"),
          genre: "Progressive House, Electro House",
        },
        {
          id: 5,
          title: "Treat Me Right  ",
          album: "Treat Me Right",
          artwork: require("../assets/giphy-2.gif"),
          artist: "Pette Bellis & Tommy",
          views: "150",
          day: "Today",
          share: "0",
          comment: "0",
          like: "0",
          url: require("../assets/mp3/TreatMeRight.mp3"),
          genre: "Progressive House, Electro House",
        },
      ],
      progress: 0,
      forYou: false,
      report: false,
      notes: false,
      viewSideMenu: false,

      emoji: [
        { id: 1, image: require("../assets/emojis/emoji-1.png"), count: "5" },
        {
          id: 2,
          image: require("../assets/emojis/emoji-2.png"),
          count: "2.1K",
        },
        { id: 3, image: require("../assets/emojis/emoji-3.png"), count: "900" },
        {
          id: 4,
          image: require("../assets/emojis/emoji-4.png"),
          count: "5.4K",
        },
        { id: 5, image: require("../assets/emojis/emoji-5.png"), count: "55" },
        {
          id: 6,
          image: require("../assets/emojis/emoji-6.png"),
          count: "5.5K",
        },
      ],
      viewEmoji: false,
      SearchText: "For You",
      data1: [
        {
          id: 1,
          name: "Ali Wright",
          at: "at :44",
          message:
            "Would love to hear a new section after the chorus 😮😮 I can hear it turn into a Pink Floyd style verse then fade out",
          time: "1h",
        },
        {
          id: 2,
          name: "Doug Hilarious",
          at: "at :27",
          message: "Back to a NEW verse 🔥 ",
          time: "2h",
        },
        {
          id: 3,
          name: "Wesley Swipes",
          at: "at :35",
          message: "🔥 Nice chord changes",
          time: "1h",
        },
        {
          id: 4,
          name: "Cesar Spa",
          at: "at :08",
          message:
            "Sounds like an Epicurus chord progression. Have you tried reversing it?",
          time: "1h",
        },
        {
          id: 5,
          name: "Cesar Spa",
          at: "at :08",
          message:
            "Fay Sunn at :06 Last swipe of the night and came across this gem. Going to record a version of the chorus tonight. Sonic A+",
          time: "1w",
        },
        {
          id: 6,
          name: "DJ Dodo",
          at: "at :11",
          message:
            "🙌 we need more 🙌 in this style because the old stuff is good but this is on another level! Can't wait to get my invite code to post my own! Can we get more BTS stuff too? ",
          time: "5h",
        },
        {
          id: 7,
          name: "Merci Vowler",
          at: "at :18",
          message: "New fav right here",
          time: "25s",
        },
        {
          id: 8,
          name: "Bibi Soull",
          at: "at :40",
          message: "Another bomb track from exactly who I imagined",
          time: "50s",
        },
        {
          id: 9,
          name: "Leo The Explorer",
          at: "at :36",
          message: "Ascend the chords!",
          time: "2h",
        },
        {
          id: 10,
          name: "Paws ",
          at: "at :11",
          message: "Loop back to the verse. 👏👏 Dope",
          time: "1h",
        },
        {
          id: 11,
          name: "Becca Luwoiski-Smith",
          at: "at :40",
          message: "The chorus is good 💃💃💃💃 maybe try a new section after",
          time: "31m",
        },
        {
          id: 12,
          name: "First Player",
          at: "at :45",
          message: "Nice! Sounds soooo great.️",
          time: "41m",
        },
      ],
      selected: [],
      // data2: [
      //   {
      //     id: 1,
      //     image: require("../assets/LineSticker/lineFeedback.png"),
      //     text: "FEEDBACK WANTED",
      //     height: 40,
      //     width: 100,
      //   },
      //   {
      //     id: 2,
      //     image: require("../assets/LineSticker/line_fullSong.png"),
      //     text: "FULL SONG",
      //     height: 30,
      //     width: 66,
      //   },
      //   {
      //     id: 3,
      //     image: require("../assets/LineSticker/lineClip.png"),
      //     text: "CLIP",
      //     width: 50,
      //     height: 20,
      //   },
      //   {
      //     id: 4,
      //     image: require("../assets/LineSticker/lineFinal.png"),
      //     text: "FINAL",
      //     width: 70,
      //     height: 30,
      //   },
      //   {
      //     id: 5,
      //     image: require("../assets/LineSticker/lineDemo.png"),
      //     text: "DEMO",
      //     width: 62,
      //     height: 15,
      //   },
      //   {
      //     id: 6,
      //     image: require("../assets/LineSticker/lineCover.png"),
      //     text: "COVER",
      //     width: 55,
      //     height: 22,
      //   },
      // ],
      // singers: [
      //   { id: 1, name: "Rock" },
      //   { id: 2, name: "Pop" },
      //   { id: 3, name: "Hip Hop" },
      //   { id: 4, name: "Metal" },
      //   { id: 5, name: "EDM" },
      //   { id: 6, name: "Electronic" },
      //   { id: 7, name: "Jazz" },
      //   { id: 8, name: "Bass" },
      // ],
      // tags: [
      //   { id: 1, text: "#VoiceMemo" },
      //   { id: 2, text: "#NewIdea" },
      //   { id: 3, text: "#Beat" },
      //   { id: 4, text: "#Freestyle" },

      //   { id: 5, text: "#Solo" },
      //   { id: 6, text: "#IsThisAnything" },
      //   { id: 7, text: "#Band" },
      //   { id: 8, text: "#Vocals" },
      //   { id: 9, text: "#Harmony" },
      //   { id: 10, text: "#Guitar" },
      //   { id: 11, text: "#Drums" },
      //   { id: 12, text: "#ChillFun" },
      // ],
      whiteUI: false,
      comments: "",
      emoji: [
        {
          id: 1,
          image: require("../assets/emojis/emoji-1.png"),
          count: "2.5K",
          text: "❤",
        },
        {
          id: 2,
          image: require("../assets/emojis/emoji-5.png"),
          count: "4.5K",
          text: "🔥",
        },
        {
          id: 3,
          image: require("../assets/emojis/emoji-6.png"),
          count: "2.5K",
          text: "👏",
        },
        {
          id: 4,
          image: require("../assets/emojis/emoji-4.png"),
          count: "8.5K",
          text: "💎",
        },
        {
          id: 5,
          image: require("../assets/emojis/emoji-5.png"),
          count: "9.5K",
          text: "💪",
        },
        {
          id: 6,
          image: require("../assets/emojis/emoji-6.png"),
          count: "10.5K",
          text: "🕺",
        },
        {
          id: 7,
          image: require("../assets/emojis/emoji-2.png"),
          count: "12.5K",
          text: "💃",
        },
      ],
      emoji1: [
        {
          key: sad_count,
          statusKey: sademoji_status,
          id: 1,
          image: require("../assets/emojis/emoji-4.png"),
          count: "2.5K",
          name: "sad",
        },
        {
          key: laugh_count,
          statusKey: laughemoji_status,
          id: 2,
          image: require("../assets/emojis/emoji-3.png"),
          count: "4.5K",
          name: "laugh",
        },
        {
          key: boring_count,
          statusKey: boringemoji_status,
          id: 3,
          image: require("../assets/emojis/emoji-2.png"),
          count: "2.5K",
          name: "boring",
        },
        {
          key: clap_count,
          statusKey: clapemoji_status,
          id: 4,
          image: require("../assets/emojis/emoji-6.png"),
          count: "8.5K",
          name: "clap",
        },
        {
          key: fire_count,
          statusKey: fireemoji_status,
          id: 5,
          image: require("../assets/emojis/emoji-5.png"),
          count: "9.5K",
          name: "fire",
        },
        {
          key: heart_count,
          statusKey: heartemoji_status,
          id: 6,
          image: require("../assets/emojis/emoji-1.png"),
          count: "10.5K",
          name: "heart",
        },
      ],
      play: false,
      offset: 0,
      position: 0,
      duration: 0,
      PlayerTitle: "",
      PlayerArtist: "",
      changeSong: false,
      onScrollCheck: false,
      swipeUp: false,
      swipeDown: false,
      AnimateUp: false,
      AnimateDown: false,
      UserToken: "",

      isLiked: false,
      currentTrackData: null,
      modalHide: false,
      currentIndex: 0,
      // playerState:State.Playing
    };
    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  slowlyScrollDown = () => {
    const y = offset + 80;
    scrollViewRef.current.scrollTo({ x: 0, y, animated: true });
    setOffset(y);
  };

  async componentDidMount() {
    // alert("hi")

    // this.modalTime = setInterval(() => {
    //   this.setState({
    //     AnimateDown: song.modal_hide,
    //   });

    // }, 1000);
    const token = await AsyncStorage.getItem("token");
    const name = await AsyncStorage.getItem("artistname");

    this.setState(
      {
        UserToken: token,
        nameuser: name,
      },
      () => {
        this.Feeds();
        // this.setState({
        //   UserToken: token,
        // });
      }
    );

    // useTrackPlayerEvents([useTrackPlayerEvents.PLAYBACK_STATE], (event) => {
    //   if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
    //     this.setState({
    //       playerState: event.state
    //     })
    //   }
    // });

    console.log(this.state.UserToken);
    this.listner = Navigation.events().registerComponentDidAppearListener(
      (btn) => {
        if (btn.componentName == "Home") {
          this.Feeds();
          this.setState({
            SearchText:
              song.searchFilter,
          });
        } else if (btn.componentName == "SideMenu") {
          this.setState({
            viewSideMenu: true,
          });
        }
      }
    );

    this.getPosition();

    this.hide = Navigation.events().registerComponentDidDisappearListener(
      (btn) => {
        if (btn.componentName == "SideMenu") {
          this.setState({
            viewSideMenu: false,
          });
        }
      }
    );
  }
  PlayCount(postid) {
    ApiCall(
      "playcount",
      {
        post_id: postid,
      },
      (responseJson) => {
        if (responseJson.data.status == true) {
          console.log(responseJson.data.status);
        } else {
        }
      }
    );
  }
  ShareCount(postid) {
    ApiCall(
      "sharepostcount",
      {
        post_id: postid,
      },
      (responseJson) => {
        if (responseJson.data.status == true) {
          console.log(responseJson.data.status);
        } else {
        }
      }
    );
  }
  Reaction(postid, react) {
    ApiCall(
      "postlike",
      {
        post_id: postid,
        name: react,
      },
      (responseJson) => {
        if (responseJson.data.status == true) {
          console.log(responseJson.data.data);
          // var _data = [...this.state.feeds];
          //     if (item.like_status == 0) {
          //   _data[index].like_status = 1;
          //   setData(_data);
          //   likeApi(item._id);
          // } else if (item.like_status == 1) {
          //   _data[index].like_status = 0;
          //   setData(_data);
          //   likeApi(item._id);
          // }
        } else {
        }
      }
    );
  }
  Feeds() {
    this.setState({ isLoading: true });

    ApiCall(
      this.state.UserToken != null && this.state.UserToken != ""
        ? song.searchFilter != null && song.searchFilter != ""
          ? "search"
          : "filterposts"
        : "posts",
      {
        key: this.state.SearchText.replace(" ", "").toLowerCase(),
        params: song.searchFilter,
        type: song.searchFiltertype,
      },
      (responseJson) => {
        this.setState({
          isLoading: false,
          // feeds: [],
        });
        //alert(JSON.stringify(responseJson.data))
        console.log(JSON.stringify(responseJson), "ll");
        if (responseJson.data.status == true) {
          //alert("if");
          //
          var tempFeeds = [];
          // var tracks =
          //   this.state.UserToken == "" && this.state.UserToken == null
          //     ? responseJson.data.data.slice(0, 5)
          //     : responseJson.data.data;

          // if(tracks.length > 0) {
          //   this.updateEmojiCount(tracks[0])
          // }
          if(responseJson.data.data.length==0){
            alert("No matching record found")
            
          }else{
            responseJson.data.data.map((item, index) => {
              // alert("this.state.feeds")
              // console.log(item.track_name, "llllll");
              tempFeeds.push({
                id: item._id == null ? index + "" : item._id,
                // id: index + '',
                title: item.track_name == null ? 0 : item.track_name,
                album: item.track_name == null ? 0 : item.track_name,
                artwork: require("../assets/giphy-2.gif"),
                artist: item.user_id != null ? item.user_id.username : "",
                userid: item.user_id != null ? item.user_id._id : "",
                sticker: item.sticker.sticker,
                views: item.totalplay_count,
                day: item.createdAt, //moment(item.createdAt + '').fromNow(),
                share: "0",
                comment: "0",
                like: "0",
                url: item.track,
                genre: item.generes,
                hashtags: item.hashtag.join(" "),
                gear: item.gear.join("+"),
                track_note: item.track_notes,
                postid: item._id,
                emojies: item,
                sad_count: item.sad_count,
                laugh_count: item.laugh_count,
                boring_count: item.boring_count,
                clap_count: item.clap_count,
                fire_count: item.fire_count,
                heart_count: item.heart_count,
                totalreaction_count: item.totalreaction_count,
                shared_count: item.shared_count,
                feedback_count: item.feedback_count,
                follow_status: item.follow_status,
                index: responseJson.data.data.length - 1 - index,
  
                sademoji_status:
                  item.reactions != null ? item.reactions.sademoji_status : "0",
                clapemoji_status:
                  item.reactions != null ? item.reactions.clapemoji_status : "0",
                boringemoji_status:
                  item.reactions != null
                    ? item.reactions.boringemoji_status
                    : "0",
                fireemoji_status:
                  item.reactions != null ? item.reactions.fireemoji_status : "0",
                heartemoji_status:
                  item.reactions != null ? item.reactions.heartemoji_status : "0",
                laughemoji_status:
                  item.reactions != null ? item.reactions.laughemoji_status : "0",
  
                //user_id:item.user_id.id
              });
            });
  
            // console.log(tracks, "yy");
            this.setState(
              {
                feeds: tempFeeds.reverse(),
              },
              () => {
                this.initiateSongs();
                if (this.state.feeds.length > 0) {
                  this.updateLikeStatus(this.state.feeds[0], 0);
                }
                console.log(this.state.feeds, "feeds");
              }
            )
  
          }
      

                 }
      }
    );
  }

  updateEmojiCount = (track) => {
    console.log(track, ";;;;");
    var tempEmojies = [...this.state.emoji1];
    tempEmojies.map((item, index) => {
      tempEmojies[index].count = track[item.key];
    });
    this.setState({
      emoji1: tempEmojies,
    });
  };

  tracks = (type) => {
    if (type == "All") {
      Navigation.push(this.props.componentId, {
        component: {
          name: "Reactions",
          options: {
            topBar: {
              visible: false,
            },
          },
        },
      });
    } else if (type == "AllTracks") {
      Navigation.push(this.props.componentId, {
        component: {
          name: "AllTracks",
          options: {
            topBar: {
              visible: false,
            },
          },
        },
      });
    }
  };

  componentWillUnmount() {
    clearInterval(this.modalTime);
    this.listner.remove();
    this.hide.remove();
  
  }

  getPosition = async () => {
    setInterval(async () => {
      if (global.changePlay == State.Playing) {
        let position = await TrackPlayer.getPosition();
        let duration = await TrackPlayer.getDuration();
        this.setState(
          {
            position: position,
            duration: duration,
          },
          () => {
            // console.log(this.state.position, "---------" + this.state.duration);
          }
        );
      }
    }, 1000);
  };

  itemChange = async (data) => {
    this.setState({
      PlayerArtist: data.changed[0].item.artist,
      PlayerTitle: data.changed[0].item.title,
      position: 0,
      currentTrackData: data.changed[0].item,
    });
  };

  changeTrack = async () => {
    console.log("===> ");
    if (this.state.currentTrackData != null) {
      await TrackPlayer.skip(parseInt(this.state.currentTrackData.index));
      this.updateLikeStatus(
        this.state.currentTrackData,
        this.state.currentTrackData.index
      );
    }
  };
  Follow = (id) => {
    this.setState({ isLoading: true });
    ApiCall(
      "follow",
      {
        follow_id: id,
        //phone_number:this.state.phone_number
      },
      (responseJson) => {
        console.log(JSON.stringify(responseJson.data));
        if (responseJson.data.status == true) {
          // alert(responseJson.data.message)
          this.setState({
            follow: "Following",
            isLoading: false,
          });
          console.log(responseJson.data.data);
        } else {
          this.setState({
            isLoading: false,
          });
          //alert(responseJson.data.error);
        }
      }
    );
  };

  ShareSong(url, postid) {
    Share.open({
      url: url,
      message: "ShareSong",
    })
      .then((res) => {
        {
          res.success && this.ShareCount(postid);
          var feedData = [...this.state.feeds];
          feedData.map((item, index) => {
            if (item.postid == postid) {
              feedData[index].shared_count =
                parseInt(feedData[index].shared_count) + 1;
            }
          });
          this.setState({
            feeds: feedData,
          });
        }
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  initiateSongs = async () => {
    // await TrackPlayer.stop()
    // await TrackPlayer.reset()
    // await TrackPlayer.setupPlayer();
    await TrackPlayer.add(this.state.feeds);
    await TrackPlayer.play();
  };

  // PlaySong = async (track) => {
  //   await TrackPlayer.setupPlayer();

  //   await TrackPlayer.add([track]);
  //   await TrackPlayer.play();
  //   this.getPosition();
  // };

  updateLikeStatus = (item, index) => {
    var postsData = [...this.state.feeds];
    postsData[index].totalreaction_count =
      item.sad_count +
      item.laugh_count +
      item.fire_count +
      item.boring_count +
      item.clap_count +
      item.heart_count;
    this.setState({
      isLiked:
        item.sademoji_status == "1" ||
        item.laughemoji_status == "1" ||
        item.heartemoji_status == "1" ||
        item.fireemoji_status == "1" ||
        item.boringemoji_status == "1" ||
        item.clapemoji_status == "1",
      feeds: postsData,
    });
  };

  
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

    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      { useNativeDriver: true }
    );

    _onHeaderHandlerStateChange = ({ nativeEvent }) => {
      if (nativeEvent.oldState === 2) {
        this._lastScrollY.setValue(0);
      }
      this._onHandlerStateChange({ nativeEvent });
    };


   
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar
          barStyle={Platform.OS == "ios" ? "light-content" : "dark-content"}
        />
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            enabled
          >
            {/* <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              ref={(ref) => (this.ScrollNew = ref)}
              style={{ flex: 1 }}
              pagingEnabled
              alwaysBounceVertical={false}
              alwaysBounceHorizontal={false}
              bounces={false}
              onMomentumScrollBegin={(event) => {
                Keyboard.dismiss();
                // console.log('Feed Screen------>>>>>>>>',event.nativeEvent.contentOffset.y)
              }}
              scrollsToTop={false}
              scrollEnabled={false}
              nestedScrollEnabled
            >
              <GestureRecognizer
                onSwipeDown={() => {
                  this.setState({
                    swipeDown: true,
                  });
                }}
                onSwipeUp={() => {
                  this.setState({
                    swipeUp: true,
                  });
                }}
              > */}
{/* {this.state.feeds==''
?
<View
  style={{
    //flex:1,
    height:200,
    justifyContent:'center'
  }}
>
  <Text
     style={{
       color:COLORS.appWhite,
       fontSize:20,
       textAlign:'center'
     }}
  >
    No Data
  </Text>
  </View>: */}
              
            <FlatList
              style={{
                height: Dimensions.get("window").height,
              }}
              ref={(ref) => (this.feedsRef = ref)}
              key={"."}
              // viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
              data={this.state.feeds}
              horizontal
              decelerationRate="normal"
              // scrollEventThrottle={1}
              pagingEnabled
              // onMomentumScrollBegin={(event)=>{
              //         if(event.nativeEvent.contentOffset.x < 0){
              //           Navigation.mergeOptions(this.props.componentId,{
              //             sideMenu:{
              //               left:{
              //                 id:'SideMenu',
              //                 visible:true
              //               }
              //             }
              //           })
              //         }

              // }}

              onScroll={(event) => {
                if (event.nativeEvent.contentOffset.x < 0) {
                  Navigation.mergeOptions(this.props.componentId, {
                    sideMenu: {
                      left: {
                        id: "SideMenu",
                        visible: true,
                      },
                    },
                  });
                }
              }}
              scrollEnabled={false}
              // scrollEnabled={this.state.changeSong == true ? false : true}
              onViewableItemsChanged={this.itemChange}
              onScrollEndDrag={this.changeTrack}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <Animated.ScrollView
                      showsVerticalScrollIndicator={false}
                      ref={(ref) => (this.ScrollNew = ref)}
                      style={{ flex: 1 }}
                      pagingEnabled
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      bounces={false}
                      onMomentumScrollBegin={(event) => {
                        Keyboard.dismiss();
                      }}
                      scrollsToTop={false}
                      scrollEnabled={false}
                      nestedScrollEnabled
                    >
                      <GestureRecognizer

                        onSwipeDown={() => {
                          // alert(JSON.stringify(item))
                          song.Searchdata = item
                          song.modal_hide = false;
                          this.setState({
                            swipeDown: true,
                          });
                        }}

                        onSwipeUp={() => {
                          song.song_id = item.postid;
                          song.userfeed_id = item.userid;
                          this.setState({
                            swipeUp: true,
                          });
                        }}
                        onSwipeLeft={() => {
                          this.setState(
                            {
                              currentIndex:
                                this.state.feeds.length - 1 >
                                this.state.currentIndex
                                  ? this.state.currentIndex + 1
                                  : this.state.currentIndex,
                            },
                            () => {
                              this.feedsRef.scrollToIndex({
                                index: this.state.currentIndex,
                                animated: true,
                              });
                              this.changeTrack();
                            }
                          );
                        }}
                        onSwipeRight={() => {
                          this.setState(
                            {
                              currentIndex:
                                0 < this.state.currentIndex
                                  ? this.state.currentIndex - 1
                                  : this.state.currentIndex,
                            },
                            () => {
                              this.feedsRef.scrollToIndex({
                                index: this.state.currentIndex,
                                animated: true,
                              });
                              this.changeTrack();
                            }
                          );
                        }}
                      >
                        <ImageBackground
                          source={item.artwork}
                          style={{
                            height: height,
                            width: Dimensions.get("window").width,
                          }}
                        >
                          <LinearGradient
                            style={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              right: 0,
                              left: 0,
                              marginLeft: 0,
                            }}
                            colors={[
                              " rgba(0, 0, 0, 0.9)",
                              " rgba(0, 0, 0, 0.1)",
                              " rgba(0, 0, 0, 0.6)",
                              " rgba(0, 0, 0, 0.8)",
                            ]}
                          />

                          <View
                            style={{
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
                            <View
                              style={{
                                height: 40,
                                width: "90%",
                                alignSelf: "center",
                                flexDirection: "row",
                                alignItems: "center",
                                //backgroundColor: "red",
                                justifyContent: "space-between",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  if (this.state.forYou == true) {
                                    this.setState({
                                      forYou: false,
                                    });
                                  }
                                  if (this.state.report == true) {
                                    this.setState({
                                      report: false,
                                    });
                                  }

                                  Navigation.mergeOptions(
                                    this.props.componentId,

                                    {
                                      sideMenu: {
                                        left: {
                                          visible: true,
                                          enabled: true,
                                          component: {
                                            name: "SideMenu",
                                            passProps: {
                                              data: item,
                                              state: TrackPlayer.getState(),
                                            },
                                          },
                                        },
                                      },
                                    }
                                  );
                                }}
                              >
                                {this.state.viewSideMenu == false && (
                                  <Image
                                    style={{
                                      tintColor: COLORS.appGray,
                                      height: 18,
                                      width: 22,
                                    }}
                                    source={require("../assets/crown.png")}
                                  />
                                )}
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  // backgroundColor:'red',
                                  height: 30,
                                  width: 80,
                                  marginLeft: 25,
                                }}
                                onPress={() => {
                                  if (
                                    this.state.UserToken != null &&
                                    this.state.UserToken != ""
                                  ) {
                                    if (this.state.report == true) {
                                      this.setState({
                                        report: false,
                                      });
                                    }
                                    this.setState({
                                      forYou: !this.state.forYou,
                                    });
                                  } else {
                                    Navigation.push(this.props.componentId, {
                                      component: {
                                        name: "auth",
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
                                  }
                                }}
                                activeOpacity={0.8}
                              >
                                <Text
                                  style={{
                                    color: COLORS.appWhite,
                                    fontWeight: "800",
                                  }}
                                >
                                  {this.state.SearchText == ""
                                    ? "For You"
                                    : this.state.SearchText}
                                </Text>
                                <Image
                                  style={{
                                    width: 9,
                                    height: 5,
                                    tintColor: COLORS.appWhite,
                                    marginLeft: 5,
                                  }}
                                  source={require("../assets/dropdown.png")}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{
                                  height: 30,
                                  width: 40,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  // backgroundColor:'red'
                                }}
                                onPress={() => {
                                  if (this.state.forYou == true) {
                                    this.setState({
                                      forYou: false,
                                    });
                                  }
                                  if (this.state.viewEmoji == true) {
                                    this.setState({
                                      viewEmoji: false,
                                    });
                                  }
                                  this.setState({
                                    report: !this.state.report,
                                  });
                                }}
                                activeOpacity={0.8}
                              >
                                <Image
                                  style={{
                                    tintColor: COLORS.appWhite,
                                    height: 4,
                                    width: 18,
                                  }}
                                  source={require("../assets/dots.png")}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Code removed */}

                          {/* {this.state.notes == true && ( */}
                          <View
                            style={{
                              flex: 1,
                              width: "85%",
                              alignSelf: "center",
                            }}
                          >
                            {this.state.notes == true && (
                              <View
                                style={{
                                  height: "15%",
                                  justifyContent: "center",
                                  width: "100%",
                                  alignSelf: "center",
                                }}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <Text
                                    style={{
                                      color: COLORS.appGray,
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.hashtags + " "}
                                  </Text>
                                  {/* <Text
                                    style={{
                                      color: COLORS.appGray,
                                      marginLeft: 5,
                                      fontSize: 14,
                                    }}
                                  >
                                    #Harmony{" "}
                                  </Text>
                                  <Text
                                    style={{
                                      color: COLORS.appGray,
                                      marginLeft: 5,
                                      fontSize: 14,
                                    }}
                                  >
                                    #Harmony{" "}
                                  </Text> */}
                                </View>

                                <Text
                                  style={{
                                    color: COLORS.appGray,
                                    fontFamily:
                                      Platform.OS == "ios"
                                        ? "SF Pro Display Bold"
                                        : "SfProDisplayBold",
                                    marginTop: 12,
                                  }}
                                >
                                  GEAR
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.appGray,
                                    fontSize: 14,
                                    marginTop: 5,
                                  }}
                                >
                                  {item.gear}
                                </Text>
                              </View>
                            )}

                            {this.state.notes == true && (
                              <View
                                style={{
                                  height: "32%",
                                  width: "100%",
                                  alignSelf: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <ScrollView
                                  ref={(ref) => (this.ScrollText = ref)}
                                  showsVerticalScrollIndicator={false}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.appWhite,
                                      fontSize: 22,
                                      width: width / 1.6,
                                    }}
                                  >
                                    {item.track_note}
                                    {/* Still working on this track. Not sure where
                                    I should go after the chorus but I like the
                                    descending chord progression. Thoughts on
                                    going back to the verse or introducing a new
                                    section? I reckon I've got at least seven
                                    more bars I could write */}
                                  </Text>
                                </ScrollView>
                              </View>
                            )}

                            <View
                              style={{
                                height: width / 4,
                                width: "100%",
                                alignSelf: "center",
                                position: "absolute",
                                bottom: 225,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "100%",
                                  height: 120,
                                }}
                              >
                                <Image
                                  source={{ uri: item.sticker }}
                                  style={{
                                    width: 200,
                                    height: 80,
                                    resizeMode: "contain",
                                  }}
                                />
                              </View>
                            </View>

                            <View
                              style={{
                                height: width / 2.5,
                                width: "100%",
                                alignSelf: "center",
                                position: "absolute",
                                bottom: 80,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  Navigation.push(this.props.componentId, {
                                    component: {
                                      name: "ArtistProfile",
                                      passProps: {
                                        data:item,
                                        artist: item.artist,
                                        // title:item.title,
                                        state: TrackPlayer.getState(),
                                        id: item.userid,
                                        plays: item.views,
                                      },
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
                              >
                                <Text
                                  style={{
                                    color: COLORS.appWhite,
                                  }}
                                >
                                  {item.artist}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                // onPress={() => {
                                //   Navigation.push(this.props.componentId, {
                                //     component: {
                                //       name: "ArtistProfile",
                                //       passProps: {
                                //         data:item,
                                //         artist: item.artist,
                                //         title:item.title,
                                //         state: TrackPlayer.getState(),
                                //         id: item.userid,
                                //         plays: item.views,
                                //       },
                                //       options: {
                                //         topBar: {
                                //           visible: false,
                                //         },
                                //         animations: {
                                //           push: {
                                //             content: {
                                //               translationY: {
                                //                 from: require("react-native").Dimensions.get(
                                //                   "screen"
                                //                 ).height,
                                //                 to: 0,
                                //                 duration: 300,
                                //               },
                                //             },
                                //           },
                                //         },
                                //       },
                                //     },
                                //   });
                                // }}
                              >
                                {item.title.length > 20 ? (
                                  <AutoScrolling
                                    style={{
                                      width: 350,
                                    }}
                                    endPadding={50}
                                  >
                                    <Text
                                      style={{
                                        color: COLORS.appWhite,
                                        fontWeight: "800",
                                        fontSize: 25,
                                        marginTop: 5,
                                      }}
                                    >
                                      {item.title}
                                    </Text>
                                  </AutoScrolling>
                                ) : (
                                  <Text
                                    style={{
                                      color: COLORS.appWhite,
                                      fontWeight: "800",
                                      fontSize: 25,
                                      marginTop: 5,
                                    }}
                                  >
                                    {item.title}
                                  </Text>
                                )}
                              </TouchableOpacity>

                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 5,
                                }}
                              >
                                <Text
                                  style={{
                                    color: COLORS.appWhite,
                                    opacity: 0.5,
                                  }}
                                >
                                  {moment(item.day).fromNow()}
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.appWhite,
                                    marginLeft: 20,
                                  }}
                                >
                                  {item.views}
                                </Text>
                                <Image
                                  source={require("../assets/play.png")}
                                  style={{
                                    width: 7,
                                    height: 8,
                                    marginLeft: 5,
                                  }}
                                />
                              </View>
                              <View
                                style={{
                                  width: width / 1.15,
                                  height: 30,
                                  marginTop: 5,
                                  overflow: "hidden",
                                }}
                              >
                                <Slider
                                  style={{
                                    flex: 1,
                                    height: 2,
                                  }}
                                  value={this.state.position}
                                  minimumValue={0}
                                  maximumValue={this.state.duration}
                                  onValueChange={(value) => {
                                    TrackPlayer.seekTo(value);
                                  }}
                                  minimumTrackTintColor={COLORS.appWhite}
                                  maximumTrackTintColor="#00000055"
                                  // onSlidingStart={() => {
                                  //   this.setState({
                                  //     changeSong: true,
                                  //   });
                                  // }}
                                  // onSlidingComplete={() => {
                                  //   this.setState({
                                  //     changeSong: false,
                                  //   });
                                  // }}
                                  // thumbImage={require('../assets/circle.png')}
                                  // thumbTintColor={"#00000088"}
                                  thumbStyle={{ height: 0, width: 0 }}
                                  // animationType={'spring'}
                                />
                              </View>

                              <View
                                style={{
                                  justifyContent: "space-between",
                                  flexDirection: "row",
                                  width: "100%",
                                  alignSelf: "center",
                                  marginTop: 10,
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                  onPress={() => {
                                    if (
                                      this.state.UserToken != null &&
                                      this.state.UserToken != ""
                                    ) {
                                      this.ShareSong(item.url, item.postid);
                                    } else {
                                      Navigation.push(this.props.componentId, {
                                        component: {
                                          name: "auth",
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
                                    }
                                  }}
                                >
                                  <Text style={{ color: COLORS.appWhite }}>
                                    {item.shared_count}
                                  </Text>
                                  <Image
                                    source={require("../assets/share.png")}
                                    style={{
                                      width: 14,
                                      height: 14,
                                      marginLeft: 5,
                                    }}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      this.state.UserToken != null &&
                                      this.state.UserToken != ""
                                    ) {
                                      song.song_id = item.postid;
                                      console.log("tt" + item.userid);
                                      song.userfeed_id = item.userid;
                                      this.setState({
                                        swipeUp: true,
                                      });
                                    } else {
                                      Navigation.push(this.props.componentId, {
                                        component: {
                                          name: "auth",
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
                                    }
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text style={{ color: COLORS.appWhite }}>
                                    {item.feedback_count}
                                  </Text>
                                  <Image
                                    source={require("../assets/message.png")}
                                    style={{
                                      width: 14,
                                      height: 14,
                                      marginLeft: 5,
                                    }}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                  onPress={() => {
                                    if (
                                      this.state.UserToken != null &&
                                      this.state.UserToken != ""
                                    ) {
                                      if (this.state.report == true) {
                                        this.setState({
                                          report: false,
                                        });
                                      }
                                      this.setState({
                                        viewEmoji: !this.state.viewEmoji,
                                      });
                                    } else {
                                      Navigation.push(this.props.componentId, {
                                        component: {
                                          name: "auth",
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
                                    }
                                  }}
                                >
                                  <Text style={{ color: COLORS.appWhite }}>
                                    {item.totalreaction_count}
                                  </Text>
                                  <Image
                                    source={require("../assets/ellipse.png")}
                                    style={{
                                      width: 14,
                                      height: 14,
                                      marginLeft: 5,
                                    }}
                                  />
                                  <Image
                                    source={require("../assets/emoji.png")}
                                    style={{
                                      width: 16,
                                      height: 16,
                                      marginLeft: 5,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                          {/* )} */}
                        </ImageBackground>
                        <Bottom
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignSelf: "center",
                            alignItems: "center",
                            width: "85%",
                            position: "absolute",
                            bottom: 35,
                          }}
                          isLiked={this.state.isLiked}
                          showlyric={this.state.notes}
                          showRepeat={global.repeatPress == 1}
                          firstPress={() => {
                            if (
                              this.state.UserToken != null &&
                              this.state.UserToken != ""
                            ) {
                              if (global.repeatPress == 0) {
                                global.repeatPress = 1;
                                //await TrackPlayer.setRepeatMode(RepeatMode.Track);
                              } else {
                                global.repeatPress = 0;
                              }
                            } else {
                              Navigation.push(this.props.componentId, {
                                component: {
                                  name: "auth",
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
                            }
                          }}
                          // playerState = {this.state.playerState}
                          onPlay={async () => {
                            // let state = await TrackPlayer.getState();
                            // if (state == "idle") {
                            //   this.PlaySong();

                            // } else
                            // alert(global.introTab)
                            // let state = await TrackPlayer.getState();
                            // if (state == "idle") {
                            // this.PlaySong();
                            // this.PlayCount(item.postid)
                            // } else
                            // alert(global.changePlay)
                            if (global.changePlay == State.Playing) {
                              await TrackPlayer.pause();
                            } else {
                              await TrackPlayer.play();
                              this.PlayCount(item.postid);
                            }
                          }}
                          //   this.PlayCount(item.postid)
                          //   if (global.changePlay == '' || global.changePlay == State.Ready) {
                          //     await TrackPlayer.play();
                          //   } else {
                          //     await TrackPlayer.pause();
                          //   }
                          // }}
                          fourthPress={() => {
                            this.setState(
                              {
                                notes: !this.state.notes,
                              },
                              () => {
                                // if (global.showLyrics == 0) {
                                //   global.showLyrics = 1;
                                // } else {
                                //   global.showLyrics = 0;
                                // }
                              }
                            );
                          }}
                          ThirdPress={() => {
                            if (
                              this.state.UserToken != null &&
                              this.state.UserToken != ""
                            ) {
                              this.RBSheetTwo.open();
                            } else {
                              Navigation.push(this.props.componentId, {
                                component: {
                                  name: "auth",
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
                            }
                          }}
                          fifthPress={() => {
                            if (
                              this.state.UserToken != null &&
                              this.state.UserToken != ""
                            ) {
                              this.setState({
                                viewEmoji: !this.state.viewEmoji,
                              });
                            } else {
                              Navigation.push(this.props.componentId, {
                                component: {
                                  name: "auth",
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
                            }
                          }}
                          heartPress={() => {
                            if (
                              this.state.UserToken != null &&
                              this.state.UserToken != ""
                            ) {
                              if (global.heartPress == 0) {
                                global.heartPress = 1;

                                // this.Reaction(item.postid,"heart")
                              } else {
                                global.heartPress = 0;
                              }
                            } else {
                              Navigation.push(this.props.componentId, {
                                component: {
                                  name: "auth",
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
                            }
                          }}
                        />

                        {this.state.forYou == true && (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              this.setState({
                                forYou: false,
                              });
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 70,
                            }}
                          >
                            <View
                              style={{
                                height: 178,
                                backgroundColor: "black",
                                width: 185,
                                position: "absolute",
                                alignSelf: "center",
                                borderRadius: 15,
                                alignItems: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    {
                                      forYou: false,
                                      SearchText: "For You",
                                    },
                                    () => {
                                      this.Feeds();
                                    }
                                  );
                                }}
                              >
                                <Text
                                  style={{
                                    color: COLORS.appPurple,
                                    marginTop: 25,
                                    fontSize: 20,
                                    fontWeight: "800",
                                  }}
                                >
                                  For You
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    {
                                      forYou: false,
                                      SearchText: "Feedback",
                                    },
                                    () => {
                                      this.Feeds();
                                    }
                                  );
                                }}
                              >
                                <Text
                                  style={{
                                    color: COLORS.appGray,
                                    fontSize: 20,
                                    marginTop: 25,
                                  }}
                                >
                                  Feedback
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  this.setState(
                                    {
                                      forYou: false,
                                      SearchText: "Final",
                                    },
                                    () => {
                                      this.Feeds();
                                    }
                                  );
                                }}
                              >
                                <Text
                                  style={{
                                    color: COLORS.appGray,
                                    fontSize: 20,
                                    marginTop: 25,
                                  }}
                                >
                                  Final
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        )}

                        {this.state.report == true && (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              this.setState({
                                report: false,
                              });
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 70,
                            }}
                          >
                            <View
                              style={{
                                height: 170,
                                backgroundColor: "black",
                                width: 185,
                                position: "absolute",
                                alignSelf: "flex-end",
                                borderRadius: 15,
                                alignItems: "center",
                                right: 10,
                              }}
                            >
                              {this.state.nameuser != item.artist && (
                                <TouchableOpacity
                                  onPress={() => {
                                    var feeds = [...this.state.feeds];
                                    feeds[index].follow_status =
                                      !feeds[index].follow_status;
                                    this.setState(
                                      {
                                        report: false,
                                        feeds: feeds,
                                      },
                                      () => {
                                        this.Follow(item.userid);
                                      }
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.appWhite,
                                      marginTop: 20,
                                      fontSize: 20,
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item.follow_status
                                      ? "Following"
                                      : "Follow"}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  width: "65%",
                                  height: 1,
                                  backgroundColor: COLORS.appGray,
                                  marginTop: 30,
                                }}
                              />

                              <Text
                                style={{
                                  color: COLORS.appWhite,
                                  fontSize: 14,
                                  marginTop: 25,
                                  textAlign: "center",
                                  fontWeight: "400",
                                }}
                              >
                                Art by:
                              </Text>
                              <Text
                                style={{
                                  color: COLORS.appPurple,
                                  fontSize: 15,
                                  marginTop: 2,
                                  textAlign: "center",
                                  fontWeight: "800",
                                }}
                              >
                                @kidmograph
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        {this.state.viewEmoji == true && (
                          <View
                            style={{
                              flex: 1,
                              width: 40,
                              position: "absolute",
                              right: 20,
                              top: height / 8,
                            }}
                          >
                            <FlatList
                              data={this.state.emoji1}
                              keyExtractor={(index) => index}
                              scrollEnabled={false}
                              showsVerticalScrollIndicator={false}
                              // style={{marginTop:height/10}}
                              renderItem={({ item }) => {
                                return (
                                  <View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        console.log(this.state.feeds[index]);
                                        if (
                                          this.state.UserToken != null &&
                                          this.state.UserToken != ""
                                        ) {
                                          this.Reaction(
                                            this.state.feeds[index].postid,
                                            item.name
                                          );
                                          // var count1 = [this.state.feeds[index][item.key]] + 1
                                          var postData = [...this.state.feeds];
                                          postData[index][item.key] =
                                            postData[index][item.statusKey] ==
                                            "1"
                                              ? parseInt(
                                                  postData[index][item.key]
                                                ) - 1
                                              : parseInt(
                                                  postData[index][item.key]
                                                ) + 1;
                                          postData[index][item.statusKey] =
                                            postData[index][item.statusKey] ==
                                            "1"
                                              ? "0"
                                              : "1";
                                          this.updateLikeStatus(
                                            postData[index],
                                            index
                                          );
                                          this.setState({
                                            feeds: postData,
                                          });
                                        } else {
                                          Navigation.push(
                                            this.props.componentId,
                                            {
                                              component: {
                                                name: "auth",
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
                                            }
                                          );
                                        }
                                      }}
                                      style={{ alignItems: "center" }}
                                    >
                                      <Image
                                        source={item.image}
                                        style={{
                                          height: width / 11,
                                          width: width / 11,
                                          marginVertical: 10,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          color: COLORS.appWhite,
                                          opacity: 0.7,
                                          fontWeight:
                                            this.state.feeds[index][
                                              item.statusKey
                                            ] == "1"
                                              ? "900"
                                              : "500",
                                          fontSize:
                                            this.state.feeds[index][
                                              item.statusKey
                                            ] == "1"
                                              ? 16
                                              : 14,
                                        }}
                                      >
                                        {this.state.feeds[index][item.key]}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                );
                              }}
                            />
                          </View>
                        )}
                        {/* {this.state.notes == true && <Lyrics />} */}
                      </GestureRecognizer>
                    </Animated.ScrollView>
                  </View>
                );
              }}
            /> 
            
            {/* </GestureRecognizer>
            </Animated.ScrollView> */}
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
                RecordScreen={async () => {
                  await TrackPlayer.stop();
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
                        copyTo: "documentDirectory",
                      }).then(async (resto) => {
                        await TrackPlayer.stop();
                        //AsyncStorage.setItem("file",resto[0].uri)
                        if (resto[0].uri != null) {
                          Navigation.setRoot({
                            root: {
                              stack: {
                                children: [
                                  {
                                    component: {
                                      name: "editPost",
                                      passProps: {
                                        music: resto[0].fileCopyUri,
                                        musictype: resto[0].type,
                                      },
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
                        }
                        console.log(resto[0].type, "--res");
                      });
                    } catch (err) {
                      if (DocumentPicker.isCancel(err)) {
                        this.RBSheetTwo.close();
                        alert(err);
                      } else {
                        alert(err);
                        this.RBSheetTwo.close();
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
                <Text style={{ color: COLORS.appWhite, fontSize: 18 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </RBSheet>

            {this.state.UserToken != null && this.state.UserToken != "" && (
              <SwipeUpDownModal
                modalVisible={this.state.swipeUp}
                PressToanimate={this.state.AnimateUp}
                ContentModalStyle={{ marginTop: 0, backgroundColor: "black" }}
                onClose={() => {
                  this.setState({
                    swipeUp: false,
                    AnimateUp: false,
                  });
                }}
                ContentModal={
                  <Feedback
                    Close={() => {
                      Keyboard.dismiss();
                      this.setState({
                        AnimateUp: true,
                      });
                    }}
                  />
                }
                OpenModalDirection="down"
                PressToanimateDirection="down"
                duration={300}
                disableHandAnimation={true}
                PressToanimate={this.state.AnimateUp}
              />
            )}

            {this.state.UserToken != null && this.state.UserToken != "" && (
              <SwipeUpDownModal
                modalVisible={this.state.swipeDown}
                PressToanimate={this.state.AnimateDown}
                ContentModalStyle={{ marginTop: 0, backgroundColor: "black" }}
                onClose={() => {
                  this.Feeds();
                  this.setState({
                    swipeDown: false,
                    AnimateDown: false,

                    SearchText: song.searchFilter,
                  });
                }}
                ContentModal={
                  <Search
                  homeComponentId = {this.props.componentId}

                  
                  //title={this.state.feeds.url}
                    Close={() => {
                      Keyboard.dismiss();
                      this.setState({
                        AnimateDown: true,
                      }),
                        Keyboard.dismiss();
                    }}
                    
                  />
                }
                OpenModalDirection="up"
                PressToanimateDirection="down"
                duration={300}
                fade={false}
                disableHandAnimation={false}
                PressToanimate={this.state.AnimateDown}
              />
            )}
          </KeyboardAvoidingView>
        </View>
        <Loader visible={this.state.isLoading} />
      </View>
    );
  }
}
