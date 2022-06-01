import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { COLORS } from '../config/colors';
export const Loader = (props) => {
    return (
        <AnimatedLoader
            visible={props.visible}
            overlayColor='#00000099'
            source={require("../assets/loader/loader.json")}
            animationStyle={styles.lottie}
            speed={1}
        >
        </AnimatedLoader>
    );
}
const styles = StyleSheet.create({
    lottie: {
      width: 80,
      height: 80
    }
  });