/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [message, setMessage] = useState('No Message Received');
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {}
  });

  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;

  useEffect(() => {
    console.log('useEffect');
    client.connect({ onSuccess:onConnect, useSSL: false });
  }, []);

  function onConnect() {
    console.log("onConnect");
    client.subscribe('testtopic/155911');
  }
  
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }
  
  function onMessageArrived(message) {
    var mqttMessage = message.payloadString;
    setMessage(mqttMessage);
    console.log(mqttMessage);
  }

  function publishMessage(message: string,destination: string) {
    var message = new Paho.MQTT.Message(message);
    message.destinationName = destination;
    client.send(message);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title='FARM DATAS'>
            <Text style={styles.highlight}>{message}</Text>
          </Section>

          <Section title='CONTROL YOUR FARM'>
            <View style={styles.buttonContainer}>
              <Button title='START IRRIGATION' onPress={() => publishMessage('OPEN','testtopic/155912')}/>
            </View>
            <View style={styles.buttonContainer}>
              <Button title='STOP IRRIGATION' onPress={() => publishMessage('CLOSE','testtopic/155912')}/>
            </View>
            <View style={styles.buttonContainer}>
              <Button title='SPECIAL IRRIGATION' onPress={() => publishMessage('SPECIAL','testtopic/155912')}/>
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default App;