import React, {PureComponent} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {COLORS} from '../components/colors';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class Lyrics extends PureComponent {
  render() {
    return (
      <View
        style={{
          height: height / 2,
          width: width / 1.3,
          position: 'absolute',
          top: height / 9,
          left: 25,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: COLORS.appGray, fontSize: 14}}>#Harmony </Text>
          <Text style={{color: COLORS.appGray, marginLeft: 5, fontSize: 14}}>
            #Harmony{' '}
          </Text>
          <Text style={{color: COLORS.appGray, marginLeft: 5, fontSize: 14}}>
            #Harmony{' '}
          </Text>
        </View>
        <Text
          style={{
            color: COLORS.appGray,
            fontFamily:
              Platform.OS == 'ios' ? 'SF Pro Display Bold' : 'SfProDisplayBold',
            marginTop: 12,
          }}>
          GEAR
        </Text>
        <Text style={{color: COLORS.appGray, fontSize: 14, marginTop: 5}}>
          Stratocaster + Rhodes + Blue Yeti
        </Text>
        <Text
          style={{
            color: COLORS.appWhite,
            fontSize: 22,
            marginTop: height / 10,
            width: width / 1.6,
          }}>
          Still working on this track. Not sure where I should go after the
          chorus but I like the descending chord progression. Thoughts on going
          back to the verse or introducing a new section?
          
        </Text>
        <View style={{ marginTop: 50, flexDirection: "row",width:"100%",height:120}}>
                <Image
                  source={require("../assets/ThreeSticker/feed_full_final.png")}
                  style={{ width: 200, height: 80 }}
                />
              </View>
      </View>
    );
  }
}
