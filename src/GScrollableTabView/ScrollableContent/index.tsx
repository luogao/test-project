import ScrollableContentIos from './ScrollableContentIos'
import { Platform } from 'react-native'

export default Platform.select({
  ios: ScrollableContentIos,
  android: null,
})
