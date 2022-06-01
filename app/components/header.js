import React from "react";
import { View, Text, Image } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { COLORS } from "./colors";

const Header = () => {
  return (
    <View
      style={{
        height: 50,
        width: "90%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        ...ifIphoneX({
          marginTop: 40
      }, {
        marginTop: 20
      })
      }}
    >
      <Image
        style={{
          tintColor: COLORS.appWhite,
          height: 18,
          width: 22,
        }}
        source={require("../assets/Majesty.png")}
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
  );
};

export default Header;
