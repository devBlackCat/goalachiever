// src/screens/ScheduleListView.js
import React, { useState, useCallback,useEffect  } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; 
import { checkTokenValidity } from '../utils/auth';
import * as Notifications from 'expo-notifications';

  const ScheduleListView = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    checkTokenValidity(navigation);
      // 알람 권한 요청 부분
      (async () => {
        if (Platform.OS !== 'web') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('알람을 위해서는 알림 권한이 필요합니다.');
            return;
          }
        }
      })();

  }, []);
  useFocusEffect(
    useCallback(() => {
      const getSchedules = async () => {
        try {
          const storedData = await AsyncStorage.getItem('scheduleData');
          const storedSchedules = storedData ? JSON.parse(storedData) : [];
          setSchedules(storedSchedules);
        } catch (error) {
          console.error('AsyncStorage 오류: ', error);
          alert('일정 불러오기 중 오류가 발생했습니다.');
        }
      };

      getSchedules();
    }, [])
  );

  const handleDelete = async (scheduleId) => {
    try {
      const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
      await AsyncStorage.setItem('scheduleData', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
      alert('일정이 삭제되었습니다.');
    } catch (error) {
      console.error('AsyncStorage 오류: ', error);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{`목표: ${item.timeSelection === 'timeBased' ? '시간별' : '목표별'}`}</Text>
      <Text style={styles.date}>{`시작일: ${moment(item.startDate).format('YYYY-MM-DD')}`}</Text>
      <Text style={styles.date}>{`종료일: ${moment(item.endDate).format('YYYY-MM-DD')}`}</Text>
      <Text style={styles.points}>{`포인트: ${item.points ?? 0}`}</Text>


      <Button 
        title="삭제" 
        onPress={() => handleDelete(item.id)} color="red" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.createButtonContainer}>
        <Button
          title="일정 생성"
          onPress={() => navigation.navigate('ScheduleCreate')}
        />
      </View>
      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
        keyExtractor={item => item.id}
      />

    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  createButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'flex-end',
  },
  itemContainer: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  date: {
    fontSize: 18,
  },
  points: {
    fontSize: 16,
    color: 'green',
  },
});

export default ScheduleListView;
