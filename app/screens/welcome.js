import React, { PureComponent } from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'

export class Welcome extends PureComponent {

    componentDidMount(){
        setTimeout(()=>{
            Navigation.push(this.props.componentId,{
                component:{
                    name:'Intro',
                    options:{
                        topBar:{
                            visible:false
                        }
                    }
                }
            })
        },2000)
    }
    render() {
        return (
           <SafeAreaView style={{
               flex:1,
               backgroundColor:'black'
           }}>
               <View style={{
                   justifyContent:'center',
                   backgroundColor:'black',
                   alignItems:'center',
                   alignSelf:'center',
                   height:'100%',
                   flexDirection:'row'
               }}>
                   <Image source={require('../assets/MajestyLogo.png')} style={{
                   height:200,
                   width:200,
                   alignSelf:'center',
                   resizeMode:'contain'
                   }}/>
                    {/* <Text style={{
                   color:'white',
                   fontSize:26,
                   marginLeft:5
               }}>
                   Majesty
               </Text> */}
               </View>
              
           </SafeAreaView>
        )
    }
}

export default Welcome