import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import moment from 'moment'; // 현재 이 예제에서는 moment를 사용하지 않으므로 주석 처리합니다.

export const scheduleAlarmsForStoredSchedules = async () => {
  // 이전에 예약된 모든 알람을 취소합니다.
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 앱을 시작하는 즉시 알람이 울리도록 스케줄링합니다.
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "알람 시간입니다!",
      body: "즉시 알람 테스트입니다.",
      data: { screen: 'AlarmScreen' }, // 사용자가 알람을 탭했을 때 이동할 화면 정보
    },
    trigger: { seconds: 1 }, // 1초 후에 알람이 울리도록 설정
  });
};

// 앱 시작 시 알람 스케줄링을 실행합니다.
scheduleAlarmsForStoredSchedules();

/*
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const scheduleAlarmsForStoredSchedules = async () => {
  // 이전에 예약된 모든 알람을 취소합니다.
  await Notifications.cancelAllScheduledNotificationsAsync();

  // AsyncStorage에서 스케줄 데이터를 가져옵니다.
  const storedData = await AsyncStorage.getItem('scheduleData');
  const schedules = storedData ? JSON.parse(storedData) : [];

  // 현재 날짜와 요일을 구합니다.
  const today = moment();
  const dayOfWeek = today.format('dddd');

  schedules.forEach(async (schedule) => {
    // 현재 날짜가 startDate와 endDate 사이에 있는지 확인합니다.
    if (today.isBetween(moment(schedule.startDate), moment(schedule.endDate), undefined, '[]')) {
      // 오늘 요일에 해당하는 알람 데이터를 가져옵니다.
      const dayData = schedule.daysData[dayOfWeek];
      if (dayData) {
        // 해당 요일에 설정된 모든 알람을 예약합니다.
        dayData.forEach(async (timeData) => {
          const time = moment(timeData.time, 'HH:mm:ss');
          const triggerTime = today.set({
            hour: time.get('hour'),
            minute: time.get('minute'),
            second: 0,
          });

          // 알람 시간이 현재 시간 이후인 경우에만 알람을 스케줄링합니다.
          if (triggerTime.isAfter(moment())) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "알람 시간입니다!",
                body: `목표: ${timeData.goal}`,
                data: { screen: 'AlarmScreen' }, // 사용자가 알람을 탭했을 때 이동할 화면 정보
              },
              trigger: triggerTime.toDate(),
            });
          }


        });
      }
    }
  });
};

// 앱 시작 시 알람 스케줄링을 실행합니다.
scheduleAlarmsForStoredSchedules();
*/