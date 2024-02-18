// src/screens/ScheduleCreateView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { decode as atob } from 'base-64';
import { checkTokenValidity } from '../utils/auth';
import { useIsFocused } from '@react-navigation/native';
const ScheduleCreate = ({ route, navigation }) => {
  // 상태 훅
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysData, setDaysData] = useState({});
  const [goal, setGoal] = useState('');
  const [editing, setEditing] = useState(route.params?.editor === 1);
  const [time, setTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [points, setPoints] = useState('');
  const [currentPoints, setCurrentPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isFocused = useIsFocused(); // 현재 화면이 포커스되었는지 확인
  // 로그인으로 이동
  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };
  useEffect(() => {
    const init = async () => {
      const isLoggedIn = await checkTokenValidity(); // 로그인 상태 확인
      setIsLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        fetchUserPoints(); // 포인트 조회 로직
      } else {
        navigateToLogin(); // 로그인 페이지로 이동
      }
    };

    if (isFocused) {
      // 상태를 초기화하는 로직
      setStartDate(new Date());
      setEndDate(new Date());
      setDaysData({});
      setGoal('');
      setPoints('');
 
      // 필요한 다른 상태도 여기서 초기화
  
      // 로그인 상태 확인 및 포인트 조회
      init();
    }
  }, [isFocused]);

  // 로그인 상태 확인
  useEffect(() => {
    const fetchUserPoints = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('토큰 없음: 로그인 필요');
        return;
      }
  
      try {
        const response = await fetch('http://${API_HOST}/api/point/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('포인트 조회 실패');
        }
  
        const data = await response.json();
        setCurrentPoints(data.points);
      } catch (error) {
        console.error('포인트 조회 중 오류 발생:', error);
      }
    };
  
    fetchUserPoints();
  }, []);
  

  useEffect(() => {
    navigation.setOptions({
      headerTitle: editing ? '일정 편집' : '일정 생성',
    });
  }, [editing]);

  // 시간 변경 핸들러
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  // 일 선택 핸들러
  const handleDayPress = day => {
    if (day === selectedDay) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  // 일정 저장 핸들러
  const handleSave = async () => {
    try {
      if (!startDate || !endDate) {
        Alert.alert('오류', '시작일과 종료일을 모두 선택해야 합니다.');
        return;
      }
      const dayKeys = Object.keys(daysData);
      if (dayKeys.length === 0 || !dayKeys.some(day => daysData[day].length > 0)) {
        Alert.alert('오류', '최소 하나의 일정을 추가해야 합니다.');
        return;
      }
      if (parseInt(points) > currentPoints) {
        Alert.alert('오류', '포인트가 부족합니다.');
        return;
      }
      if (isLoggedIn && points && currentPoints > 0 && parseInt(points) <= currentPoints) {
        const token = await AsyncStorage.getItem('userToken');
        const payloadPart = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadPart));
        const pointsToDeduct = parseInt(points);
        const response = await fetch('http://${API_HOST}/api/point/minus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: decodedPayload.id,
            pointsToDeduct: pointsToDeduct,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to update points');
        }
        await AsyncStorage.setItem('userToken', responseData.newToken);
        setCurrentPoints(responseData.newPoint);
      }
      const generateUniqueKey = () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 15; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const timestamp = moment().format('YYYYMMDDHHmmss'); // 현재 날짜 및 시간을 '년도월일시분초' 형식으로 포맷팅
        return `${result}${timestamp}`;
      };
      
      const uniqueKey = generateUniqueKey();

      const newSchedule = { startDate, endDate, daysData , points: parseInt(points) , id: uniqueKey };
      const storedData = await AsyncStorage.getItem('scheduleData');
      const storedSchedules = storedData ? JSON.parse(storedData) : [];
      if (editing) {
        const updatedSchedules = storedSchedules.map(s => (s.id === route.params.scheduleId ? newSchedule : s));
        await AsyncStorage.setItem('scheduleData', JSON.stringify(updatedSchedules));
      } else {
        await AsyncStorage.setItem('scheduleData', JSON.stringify([...storedSchedules, newSchedule]));
      }
      console.log('저장된 일정 데이터:', JSON.stringify([...storedSchedules, newSchedule]));
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '저장 중 오류가 발생했습니다.');
    }
  };

  // 일자 데이터 추가 핸들러
const handleAddDayData = () => {
  // time 상태에서 시간 부분만 추출하여 저장
  const timeOnly = moment(time).format('HH:mm:ss');
  setDaysData({
    ...daysData,
    [selectedDay]: [...(daysData[selectedDay] || []), { time: timeOnly, goal }],
  });
  setGoal('');
};

  // 일자 데이터 삭제 핸들러
  const handleDeleteDayData = (day, index) => {
    const dayData = [...daysData[day]];
    dayData.splice(index, 1);
    setDaysData({ ...daysData, [day]: dayData });
  };

  // 일자 데이터 아이템 렌더링
  const renderDayDataItem = ({ item, index }) => (
    <View style={styles.dayDataItem}>
      <Text style={styles.dayDataText}>{`${item.time} - ${item.goal}`}</Text>
      <TouchableOpacity onPress={() => handleDeleteDayData(selectedDay, index)}>
        <Text style={styles.deleteButton}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  // 토큰 삭제 핸들러
  const deleteToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('토큰 삭제됨');
      setIsLoggedIn(false);
      setCurrentPoints(0);
    } catch (error) {
      console.error('토큰 삭제 중 오류 발생:', error);
      Alert.alert('오류', '토큰 삭제 중 오류가 발생했습니다.');
    }
  };

  // UI 컴포넌트
  const TimePicker = () => (
    <View>
      <Button title="시간 선택" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onTimeChange}
        />
      )}
    </View>
  );

  // 메인 렌더 함수
  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Button title="시작일 선택" onPress={() => setShowStartDatePicker(true)} />
        <Button title="종료일 선택" onPress={() => setShowEndDatePicker(true)} />
        <Text style={styles.dateText}>
          {`기간 : ${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`}
        </Text>
        {showStartDatePicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              setStartDate(selectedDate || startDate);
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={endDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              setEndDate(selectedDate || endDate);
            }}
          />
        )}
      </View>

      <View style={styles.pointInputContainer}>
        <TextInput
          style={styles.pointInput}
          onChangeText={setPoints}
          value={points}
          placeholder={isLoggedIn ? "포인트 입력" : "포인트 입력시 로그인이 필요합니다."}
          keyboardType="numeric"
          editable={isLoggedIn && currentPoints > 0}
          onTouchStart={!isLoggedIn ? navigateToLogin : null}
        />
        {isLoggedIn && (
          <Text style={styles.currentPoints}>
            현재 포인트: {currentPoints}
          </Text>
        )}
      </View>

      <View style={styles.daysContainer}>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => handleDayPress(day)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedDay && (
        <View style={styles.dayDataContainer}>
          <View style={styles.timeGoalForm}>
            <TimePicker />
            <TextInput
              style={styles.goalInput}
              onChangeText={setGoal}
              value={goal}
              placeholder="목표를 입력하세요"
            />
          </View>
          <Button title="추가하기" onPress={handleAddDayData} />
          <FlatList
            data={daysData[selectedDay]}
            renderItem={renderDayDataItem}
            keyExtractor={(item, index) => `${selectedDay}-${index}`}
          />
        </View>
      )}
      <Button title="저장" onPress={handleSave} />
      <Button title="JWT 삭제" onPress={deleteToken} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  pointInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  currentPoints: {
    color: 'red',
    marginLeft: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedDayButton: {
    backgroundColor: '#4caf50',
  },
  dayButtonText: {
    fontSize: 16,
  },
  dayDataContainer: {
    flex: 1,
  },
  timeGoalForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  goalInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    padding: 10,
  },
  dayDataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayDataText: {
    flex: 1,
  },
  deleteButton: {
    color: 'red',
  },
});

export default ScheduleCreate;
