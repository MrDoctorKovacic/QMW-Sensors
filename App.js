import React from 'react';
import {StatusBar, StyleSheet, View, Image} from 'react-native';
import SensorsScreen from './components/SensorsScreen.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#000000" translucent={true} />
		<View style={styles.imageContainer}>
			<Image style={styles.mainLeftImage} source={require('./assets/images/3-rotated.png')} />
		</View>
		<View style={styles.mainContainer}>
        	<SensorsScreen />
		</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	flexDirection: 'row',
	backgroundColor: '#000',
	maxHeight: 650
  },
  imageContainer: {
	flex: 2,
	flexDirection: 'row',
	paddingLeft: 30,
	marginTop: 15,
  },
  mainLeftImage: {
	flex: 1,
	flexDirection: 'column',
	resizeMode: 'contain',
	height: 500,
	marginTop: 40
  },
  mainContainer: {
	flex: 6,
	flexDirection: 'row'
  }
});