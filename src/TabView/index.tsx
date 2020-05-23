import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={ [ styles.scene, { backgroundColor: '#ff4081',  ...StyleSheet.absoluteFillObject } ] } />
);

const SecondRoute = () => (
  <View style={ [ styles.scene, { backgroundColor: '#673ab7',  ...StyleSheet.absoluteFillObject,borderWidth:1,borderColor: 'white' } ] } />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function TabViewExample () {
  const [ index, setIndex ] = React.useState(0);
  const [ routes ] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
    { key: 'second2', title: 'Second2' },
    { key: 'second3', title: 'Second3' },
    { key: 'second4', title: 'Second4' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    second2: SecondRoute,
    second3: SecondRoute,
    second4: SecondRoute,
  });

  return (
    <TabView
      renderTabBar={ () => null }
      navigationState={ { index, routes } }
      renderScene={ renderScene }
      onIndexChange={ setIndex }
      initialLayout={ initialLayout }
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});