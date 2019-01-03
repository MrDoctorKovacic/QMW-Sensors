import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid
} from 'react-native';
import SensorBar from './SensorBar';

export default class SensorScreen extends React.Component {

	constructor(props) {
		super(props);

		this.state = { 
			rpm: "N/A",
			torque: "N/A",
			speed: "N/A",
			fuel: "N/A",
			mainVoltage: "N/A",
			auxVoltage: "N/A",
			coolantTemp: "N/A",
			outsideTemp: "N/A",
			varian: "Offline",
			lucio: "Offline",
			toasted: 0
		};

		// Continously get sensor data from controller
		this.interval = setInterval(() => {
			this._refreshSensorData();
		}, 500);
	}

	// Kilometers to miles
	kmToMi(km) {
		return km*0.621371;
	}
	
	// Convert celsius to fahrenheit
	CToF(C) {
		return (C*1.8)+32;
	}

	// Sends a GET request to the sensor aggregate on RPi
	_refreshSensorData() {
		try {
			componentHandler = this;
			return fetch("http://192.168.8.159/control-center/getJson.php")
			.then(function(response) {
				console.log(response);
				return response.json();
			})
			.then(function(sessionObject) {
				componentHandler.setState({
					rpm: ("RPM" in sessionObject) ? sessionObject["RPM"] : "N/A",
					speed: ("SPEED" in sessionObject) ? sessionObject["SPEED"] : "N/A",
					torque: ("RPM" in sessionObject) ? ((sessionObject["RPM"] > 0) ? (Math.round(333*5252/sessionObject["RPM"])*100)/100 : 0) : "N/A", // holy ternary batman, avoid divide by 0
					mainVoltage: ("MAIN_VOLTAGE" in sessionObject) ? sessionObject["MAIN_VOLTAGE"] : "N/A",
					auxVoltage: ("AUX_VOLTAGE" in sessionObject) ? sessionObject["AUX_VOLTAGE"] : "N/A",
					coolantTemp: ("COOLANT_TEMP" in sessionObject) ? sessionObject["COOLANT_TEMP"] : "N/A",
					outsideTemp:  ("OUTSIDE_TEMP" in sessionObject) ? sessionObject["OUTSIDE_TEMP"] : "N/A",
					lucio: "Online", // Since we just fetched from lucio
					varian: ("VARIAN_CONNECTION" in sessionObject) ? sessionObject["VARIAN_CONNECTION"] : "Offline",
				});
			}).catch((error) => {
				console.log(error);
				if(!this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch sensor data.", ToastAndroid.SHORT);
				}
			});
		}
		catch (error) {
			console.log(error);
			if(!this.state.toasted) {
				this.setState({toasted: 1});
				ToastAndroid.show("Failed to fetch sensor data.", ToastAndroid.SHORT);
			}
		}
	}

  	render() {
		return (
		<View style={[styles.mainContainer]}>
			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
				<Text style={styles.mainTitleText}>//M Performance</Text>
			</View>
			<View style={[styles.largeContainer]}>
				<View style={[styles.container, styles.containerPadding, styles.colContainer]}>
					<SensorBar barHeight="50" title="RPM" align="Right" val={this.state.rpm} fill={(this.state.rpm == "N/A") ? "0" : 100*(this.state.rpm/8500)} />
					<SensorBar barHeight="50" title="Torque" align="Right" val={this.state.torque} fill={(this.state.torque == "N/A") ? "0" : 100*(this.state.torque/7000)} />
					<SensorBar barHeight="50" title="Speed" align="Right" val={this.state.speed} fill={(this.state.speed == "N/A") ? "0" : 100*(this.state.speed/135)} />
				</View>
				<View style={[styles.container, styles.containerPadding, styles.colContainer]}>
					<SensorBar barHeight="50" title="Fuel" align="Left" val={(this.state.fuel == "N/A") ? "N/A" : Math.round(100*this.state.fuel/7000)+"%"} fill={(this.state.fuel == "N/A") ? "0" : 100*(this.state.fuel/7000)} />
					<SensorBar barHeight="50" title="Main Voltage" align="Left" val={(this.state.mainVoltage == "N/A") ? "N/A" : this.state.mainVoltage+"V"} fill={(this.state.mainVoltage == "N/A") ? "0" : 100*(this.state.mainVoltage/12)} />
					<SensorBar barHeight="50" title="Aux Voltage" align="Left" val={(this.state.auxVoltage == "N/A") ? "N/A" : this.state.auxVoltage+"V"} fill={(this.state.auxVoltage == "N/A") ? "0" : 100*(this.state.auxVoltage/18)} />
				</View>
			</View>
			<View style={[styles.container, styles.containerPadding, styles.alignTop]}>
				<View style={[styles.container, styles.containerPaddingRight, styles.colContainer, styles.alignTop]}>
					<Text style={styles.auxText}>Outside Temp: {(this.state.outsideTemp == "N/A") ? "N/A" : Math.round(this.CToF(this.state.outsideTemp))+"F"}</Text>
					<Text style={styles.auxText}>Coolant Temp: {(this.state.outsideTemp == "N/A") ? "N/A" : this.state.coolantTemp+"C"}</Text>
				</View>
				<View style={[styles.container, styles.containerPaddingLeft, styles.colContainer, styles.alignTop]}>
					<Text style={styles.auxText}>Lucio: {this.state.lucio}</Text>
					<Text style={styles.auxText}>Varian: {this.state.varian}</Text>
				</View>
			</View>
		</View>
		);
  	}
}

const styles = StyleSheet.create({
  mainContainer: {
	flex:1,
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'stretch',
	paddingTop: 20
  },
  container: {
	flex: 1,
	flexDirection: 'row',
	alignItems: 'center',
	color: '#fff',
	fontFamily: "orbitron-medium",
  },
  containerPadding: {
	paddingLeft: 30,
	paddingRight: 30
  },
  containerPaddingLeft: {
	paddingLeft: 30
  },
  containerPaddingRight: {
	paddingRight: 30
  },
  alignTop: {
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
  },
  largeContainer: {
	flex: 3,
	flexDirection: 'row',
	alignItems: 'center',
	color: '#fff',
	fontFamily: "orbitron-medium",
  },
  titleContainer: {
	flex: 1
  },
  colContainer: {
	flexDirection: 'column'
  },
  mainTitleText: {
	fontSize: 40,
	color: '#fb7e33',
	fontFamily: "orbitron-medium",
	textAlign: 'left'
  },
  auxText: {
	color: '#fff',
	fontFamily: "orbitron-medium",
	textAlign: 'left',
	fontSize: 20,
	marginBottom: 20,
  }
});
