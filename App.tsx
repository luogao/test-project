import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, SafeAreaView, Button } from 'react-native'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import BetterImage from './src/BetterImage'
import SmallImage from './src/SmallImage'
const DEFAULT_IMAGE_URL = 'https://placeimg.com/640/640/any'
import FacebookExample from './src/FacebookExample'
import DoubleTap from './src/DoubleTap'
import CircularProgressBar from './src/CircularProgressBar'
import Animated from 'react-native-reanimated'
import { timing } from 'react-native-redash'
import Wallet from './src/Wallet'
import Swiper from './src/Swiper'
import TabViewExample from './src/TabView'
import ScrollableTabView from './src/rn-scrollable-tab-view'
import { TabBarPosition } from './src/rn-scrollable-tab-view/types'
import { assets } from './src/Swiper/index copy'
import { width, height } from './src/constants'
import FadeInOut from './src/FadeInOut'
import TestChildren from './src/FadeInOut/TestChildren'
import MambaConsole from './src/MambaConsole'

MambaConsole.setup()

const images = [
  'https://i.pinimg.com/564x/29/20/0e/29200e4feaeadcbd6c9fdda3d2cb7fb7.jpg',
  'https://i.pinimg.com/564x/fa/e9/5a/fae95aeedf1965085ac1ddfc5a8275cc.jpg',
  'https://i.pinimg.com/564x/19/28/2d/19282d8b940b3b1a79f86bfbbc861e33.jpg',
  'https://i.pinimg.com/564x/c6/87/a2/c687a234c4f968c2b7cb394f2a079ec5.jpg',
  'https://i.pinimg.com/564x/d4/b4/49/d4b449a31cc8a77a35c7ecf968667100.jpg',
  'https://i.pinimg.com/564x/af/51/f5/af51f503419b63dd21cff6d392aa584e.jpg',
]

export default function App() {
  const testImg1 =
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587810356921&di=bc5c9d7ce4914560833910f2d138353f&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Fd62a6059252dd42a1c362a29033b5bb5c9eab870.jpg'
  const testImg2 =
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587810356919&di=55acd8a776a2d38b8a610b693a6af639&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F20%2F62%2F01000000000000119086280352820.jpg'

  const [image, setImage] = useState(testImg1)

  const [fadeInOutVisible, setFadeInOutVisible] = useState(false)
  const handleChangeTab = ({ i }) => {
    console.log(i)
  }
  const handlePress = (item) => {
    console.log('handlePress')
    setImage(item)
  }
  // return <PressBox />

  const process = timing({ duration: 1000 })

  const handleToggle = () => {
    setFadeInOutVisible(!fadeInOutVisible)
  }

  // return <TabViewExample />
  return (
    <View style={[styles.container]}>
      {/* <CircularProgressBar
        backgroundColor='#000'
        Radius={100}
        barColor='#fff'
        process={process}
        BarSize={10}
        trackColor="orange"
      /> */}

      {/* <Wallet /> */}
      {/* <Swiper /> */}

      {/* <ScrollableTabView
        prerenderingSiblingsNumber={1} // 预渲染所有子tab
        initialPage={0}
        onChangeTab={handleChangeTab}
        tabBarPosition={TabBarPosition.overlayTop}
        contentProps={{ bounces: true }}
      >
        {assets.map((source, i) => (
          <View key={source} style={styles.picture} tabLabel={i}>
            <Image
              resizeMethod='resize'
              source={source}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
          </View>
        ))}
      </ScrollableTabView> */}

      {/* <FadeInOut visible={fadeInOutVisible} unmountChildrenWhenInvisible>
        <TestChildren />
      </FadeInOut>

      <Text style={{ color: '#000' }}>{fadeInOutVisible + ''}</Text>

      <Button title='TOGGLE' onPress={handleToggle}></Button> */}

      <MambaConsole.Panel />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
  picture: {
    width,
    flex: 1,
    overflow: 'hidden',
    borderColor: 'red',
    borderWidth: 1,
  },
})
