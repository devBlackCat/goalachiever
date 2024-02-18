// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleListView from '../screens/ScheduleListView';
import ScheduleCreateView from '../screens/ScheduleCreateView';
import BoardScreen from '../screens/BoardScreen';
import MyPageScreen from '../screens/MyPageScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import AlarmScreen from '../screens/AlarmScreen'; 
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ScheduleList" component={ScheduleListView} options={{ title: '일정리스트' }} />
      <Tab.Screen name="ScheduleCreate" component={ScheduleCreateView} options={{ title: '일정 생성' }} />
      <Tab.Screen name="Board" component={BoardScreen} options={{ title: '게시판' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Alarm" component={AlarmScreen} options={{ headerShown: false }} />
      {/* MainTabs는 로그인 성공 후 보여줄 메인 탭 네비게이터입니다. */}
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  );
}
