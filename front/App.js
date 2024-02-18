import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications'; // 이 줄을 추가하세요
import { scheduleAlarmsForStoredSchedules } from './src/utils/AlarmNotificationHandler';

const App = () => {
  const navigationRef = useRef();

  useEffect(() => {
    // 알림 권한 요청
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Notification permissions granted.');
        // 저장된 일정에 대한 알람 스케줄링
        scheduleAlarmsForStoredSchedules();
      }
    }

    requestPermissions();

    // 알림에 반응하여 특정 화면으로 이동하는 리스너 설정
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);
      const screen = response.notification.request.content.data.screen;
      if (screen && navigationRef.current) {
        // 'navigate' 액션을 전역적으로 디스패치합니다.
        navigationRef.current.navigate(screen);
      }
    });

    // 리스너 제거를 위한 cleanup 함수 반환
    return () => {
      Notifications.removeAllNotificationListeners();
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
