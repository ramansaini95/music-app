import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { COLORS } from "./colors";
import DocumentPicker from "react-native-document-picker";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";
import RNFS, { DocumentDirectoryPath } from "react-native-fs";
import { Navigation } from "react-native-navigation";
// import { Dropbox } from 'dropbox';

const UploadTrack = (props) => {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const accessToken = 'sl.A3XFvI52IfkIXRPBBLxeGDHnVhotzHk9UkJho_RNOwZLiJ1-XWWOXBXy_YNvEScDv5mE_ThtkWrz-sHv66TEcuTCB0V2Ne36LyDMkondCXJDsgP5VnqXGoBuFDpn9Gz2gvnobvE';

  // const dbx = new Dropbox({
  //   accessToken,
  //   fetch
  // });

  // const getFiles = async () => {
  //   const response = await dbx.filesListFolder({
  //     path: '',
  //     limit: 5
  //   })

  // console.log(response)
  // }

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        // 'https://www.googleapis.com/auth/drive',
        // 'https://www.googleapis.com/auth/drive.file',
        "https://www.googleapis.com/auth/drive.appdata",
        // 'https://www.googleapis.com/auth/drive.metadata',
        // 'https://www.googleapis.com/auth/drive.readonly',
        // 'https://www.googleapis.com/auth/drive.metadata.readonly',
        // 'https://www.googleapis.com/auth/drive.apps.readonly',
        // 'https://www.googleapis.com/auth/drive.photos.readonly',
        // 'email', 'profile'
      ],
      webClientId:
        "976286338695-v1p064j0hs4r288g27ldihl56hiriok3.apps.googleusercontent.com",
      iosClientId:
        "976286338695-d17gq611im6ea9ahgqk1190is54pmku2.apps.googleusercontent.com",
    });
    _isSignedIn();
  }, []);

  const _signIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      const gdrive = new GDrive();
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      console.log("Access Token --> ", gdrive.accessToken);
    } catch (error) {
      console.log("Google Signin alert", error);
    }
  };

  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log("User is already signed in");
      try {
        let info = await GoogleSignin.signInSilently();
        console.log("User Info --> ", info);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          alert("User has not signed in yet");
          console.log("User has not signed in yet");
        } else {
          alert("Unable to get user's info");
          console.log("Unable to get user's info", error);
        }
      }
    }
  };

  let apiToken =
    "ya29.a0ARrdaM_sCOB53wMzOQqz4BltFHnlnPc1pYyT_Pe-dtwQ9OCcR6CohOOHEY3J6iQw-M2ogb82kOAa_AkDTCPW5xrVXXIjcuLXGTKfR76pWMja6r3hgnsZNyxWQCwoqPPzMN9AR7V2DD8dwZjc1LoyNJGtDmok";

  const configureGetOptions = () => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${apiToken}`);
    return {
      method: "GET",
      headers,
    };
  };

  const queryParams = () => {
    return encodeURIComponent(
      "name = 'data.json' and 'appDataFolder' in parents"
    );
  };

  const url = "https://www.googleapis.com/drive/v3";

  const parseAndHandleErrors = (response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((error) => {
      throw new Error(JSON.stringify(error));
    });
  };

  const handleDrive = async () => {
    _isSignedIn;
    const qParams = queryParams();
    const options = configureGetOptions();
    return fetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options)
      .then(parseAndHandleErrors)
      .then((body) => {
        if (body && body.files && body.files.length > 0) return body.files[0];
        return null;
      });
  };

  const handleDropbox = () => {
    // Linking.openURL(
    //   [
    //     'https://www.dropbox.com/oauth2/authorize',
    //     "?response_type=token",
    //     `&client_id=${DROPBOX.OAUTH_CLIENT_ID}`,
    //     `&redirect_uri=${DROPBOX.OAUTH_REDIRECT_URI}`,
    //     `&state=${stateValue}`
    //   ].join("")
    // )
    //   .catch(err =>
    //     console.error(
    //       "An error occurred trying to open the browser to authorize with Dropbox:",
    //       err
    //     )
    //   )
    //   .then((result) => {})
  };

  return (
    <View style={{ width: "95%", borderRadius: 15, overflow: "hidden" }}>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.appBlack,
          width: "100%",
          alignItems: "center",
          alignSelf: "center",
          // marginVertical:10,
          height: 35,
          justifyContent: "center",
        }}
        activeOpacity={1}
      >
        <Text style={{ color: COLORS.appGray, fontSize: 13 }}>
          Upload a track
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: COLORS.appGray,
        }}
      ></View>

      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: COLORS.appBlack,
          width: "100%",
          alignItems: "center",
          alignSelf: "center",
          height: 60,
          justifyContent: "center",
        }}
        onPress={handleDropbox}
      >
        <Text style={{ color: COLORS.appWhite, fontSize: 18 }}>Dropbox</Text>
      </TouchableOpacity>

      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: COLORS.appGray,
        }}
      ></View>
      <TouchableOpacity
         activeOpacity={1}
        style={{
          backgroundColor: COLORS.appBlack,
          width: "100%",
          alignItems: "center",
          height: 60,
          justifyContent: "center",
        }}
        onPress={handleDrive}
      >
        <Text style={{ color: COLORS.appWhite, fontSize: 18 }}>
          Google Drive
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: COLORS.appGray,
        }}
      ></View>

      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: COLORS.appBlack,
          width: "100%",
          alignItems: "center",
          height: 60,
          justifyContent: "center",
        }}
        onPress={props.Demo}
      >
        <Text style={{ color: COLORS.appWhite, fontSize: 18 }}>
          On My iPhone
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: COLORS.appGray,
        }}
      ></View>

      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: COLORS.appBlack,
          width: "100%",
          alignItems: "center",
          height: 60,
          justifyContent: "center",
        }}
        onPress={props.RecordScreen}
      >
        <Text style={{ color: COLORS.appRed, fontSize: 18 }}>● Record</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadTrack;

// const _getAllMyAppFilesList = async () => {
//   try {
//     if (!(await _initGoogleDrive())) {
//       return alert("Failed to Initialize Google Drive");
//     }
//     // Create/Get Directory on Google Device
//     let directoryId = await GDrive.files.safeCreateFolder({
//       name: APP_DIRECTORY,
//       parents: ["root"],
//     });
//     console.log("directoryId -> ", directoryId);
//     let data = await GDrive.files.list({
//       q:
//         GDrive._stringifyQueryParams(
//           {
//             trashed: false,
//             // mimeType: 'application/text'
//           },
//           "",
//           " and ",
//           true
//         ) + ` and '${directoryId}' in parents`,
//     });
//     let result = await data.json();
//     setListData(result.files);
//   } catch (error) {
//     console.log("Error->", error);
//     alert(`Error-> ${error}`);
//   }
//   setLoading(false);
// };

//   const handlePickerr = async (item) => {
//     // _signIn()
//   if (Platform.OS === "android") {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: "External Storage Write Permission",
//           message: "App needs write permission",
//         }
//       );
//       // If WRITE_EXTERNAL_STORAGE Permission is granted
//       if (granted != PermissionsAndroid.RESULTS.GRANTED) return;
//     } catch (err) {
//       console.warn(err);
//       alert("Write permission err", err);
//       return;
//     }
//   }

//   try {
//     if (!(await _initGoogleDrive())) {
//       return alert("Failed to Initialize Google Drive");
//     }
//     console.log(`Destination: ${RNFS.DocumentDirectoryPath}/${item.name}`);

//     GDrive.files
//       .download(item.id, {
//         toFile: `${RNFS.DocumentDirectoryPath}/${item.name}`,
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//         },
//       })
//       .promise.then((res) => {
//         console.log({ res });
//         setLoading(false);
//         if (res.statusCode == 200 && res.bytesWritten > 0)
//           alert("File download successful");
//       });
//   } catch (error) {
//     alert(error);
//     console.log(error);
//     setLoading(false);
//   }
// };

// const _initGoogleDrive = async () => {

//   let token = await GoogleSignin.getTokens();
//   if (!token) return alert("Failed to get token");
//   console.log("res.accessToken =>", token.accessToken);
//   const gdrive = new GDrive();
//   gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
//   // let directoryId = await gdrive.files.safeCreateFolder({
//   parents: ['root'],
//   name: newImageName,
// });
// console.log("directoryId -> ", directoryId);

// GDrive.setAccessToken(token.accessToken);
// GDrive.init();
// Check if Initialized
// return GDrive.isInitialized();
// };
