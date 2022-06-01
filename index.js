/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native";
import { Navigation } from "react-native-navigation";
import App from "./App";
import { name as appName } from "./app.json";
import AccountDetail from "./app/screens/accountDetail";
import ArtistProfile from "./app/screens/artistProfile";
import Reactions from "./app/screens/artistProfile/reactions";
import AllTracks from "./app/screens/artistProfile/AllTracks";
import Feedback from "./app/screens/feedback";
import Home from "./app/screens/home";
import Intro from "./app/screens/intro";
import Library from "./app/screens/library";
import Lyrics from "./app/screens/lyrics";
import MyProfile from "./app/screens/myProfile";
import EditBio from "./app/screens/profile/editBio";
import Gear from "./app/screens/profile/gear";
import Links from "./app/screens/profile/links";
import Record from "./app/screens/record";
import Search from "./app/screens/search";
import Setting from "./app/screens/setting";
import SideMenu from "./app/screens/sideMenu";
import Welcome from "./app/screens/welcome";
import searchBy from "./app/screens/searchBy";
import notification from "./app/screens/notification";
import about from "./app/screens/about";
import terms from "./app/screens/terms";
import privacy from "./app/screens/privacy";
import auth from "./app/screens/Authentication/auth";
import Signup from "./app/screens/Authentication/Signup";
import SignIn from "./app/screens/Authentication/SignIn";
import confirmcode from "./app/screens/Authentication/confirmcode";
import addartist from "./app/screens/Authentication/addartist";
import password from "./app/screens/Authentication/password";
import main from "./app/screens/Authentication/main";
import forgotpassword from "./app/screens/Authentication/forgotpassword";
import editEmail from "./app/screens/profile/editEmail";
import editPost from "./app/screens/Post Section/editPost";

import previewPost from "./app/screens/Post Section/previewPost";
import AsyncStorage from "@react-native-async-storage/async-storage";

// AppRegistry.registerComponent(appName, () => App);

Navigation.registerComponent("welcome", () => Welcome);
Navigation.registerComponent("Intro", () => Intro);
Navigation.registerComponent("Home", () => Home);
Navigation.registerComponent("SideMenu", () => SideMenu);
Navigation.registerComponent("Record", () => Record);
Navigation.registerComponent("Library", () => Library);
Navigation.registerComponent("Search", () => Search);
Navigation.registerComponent("Lyrics", () => Lyrics);
Navigation.registerComponent("Feedback", () => Feedback);
Navigation.registerComponent("Setting", () => Setting);
Navigation.registerComponent("MyProfile", () => MyProfile);
Navigation.registerComponent("EditBio", () => EditBio);
Navigation.registerComponent("Links", () => Links);
Navigation.registerComponent("Gear", () => Gear);
Navigation.registerComponent("AccountDetail", () => AccountDetail);
Navigation.registerComponent("Reactions", () => Reactions);
Navigation.registerComponent("ArtistProfile", () => ArtistProfile);
Navigation.registerComponent("AllTracks", () => AllTracks);
Navigation.registerComponent("searchBy", () => searchBy);
Navigation.registerComponent("notification", () => notification);
Navigation.registerComponent("about", () => about);
Navigation.registerComponent("terms", () => terms);
Navigation.registerComponent("privacy", () => privacy);
Navigation.registerComponent("auth", () => auth);
Navigation.registerComponent("Signup", () => Signup);
Navigation.registerComponent("SignIn", () => SignIn);
Navigation.registerComponent("confirmcode", () => confirmcode);
Navigation.registerComponent("addartist", () => addartist);
Navigation.registerComponent("password", () => password);
Navigation.registerComponent("main", () => main);
Navigation.registerComponent("forgotpassword", () => forgotpassword);
Navigation.registerComponent("editEmail", () => editEmail);
Navigation.registerComponent("editPost", () => editPost);
Navigation.registerComponent("previewPost", () => previewPost);

Navigation.events().registerAppLaunchedListener(async () => {
  const token = await AsyncStorage.getItem("token");

  LogBox.ignoreAllLogs();

  if (token != null && token != "") {
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
  } else {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: "welcome",
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
});
