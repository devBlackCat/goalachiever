// src/screens/AlarmScreen.js

/**
 * AlarmScreen.js
 * 
 * 사용자에게 알람 정보를 표시하고 알람을 끌 수 있는 화면입니다.
 * 이 화면은 알람 시간에 도달했을 때 사용자가 알람을 확인하고 끌 수 있도록 합니다.
 * 사용자가 알람을 끄면, 알람 소리가 정지되고 필요한 경우 알람 설정을 업데이트합니다.
 */

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
const AlarmScreen = ({ navigation }) => {
  // 알람 끄기 버튼 핸들러
  const handleStopAlarm = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람!</Text>
      <Button title="알람 끄기" onPress={handleStopAlarm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AlarmScreen;
