import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { COLORS } from "./colors";

export const HeaderFile = (props) => {
  return (
    <View
      style={{
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        width:'95%',
        alignSelf:'center',
        ...ifIphoneX({
          marginTop: 40
      }, {
        marginTop: 20
      })
      }}
    >
      <TouchableOpacity
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
      </TouchableOpacity>
      <View
        style={{
          width: "60%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff", fontWeight: "800" }}>
          {props.name}
        </Text>
      </View>
      <View
        style={{
          width: "20%",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        
      </View>
    </View>
  );
};
