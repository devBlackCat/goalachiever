// src/utils/auth.js 

import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkTokenValidity = async (navigation) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    console.log("현재 로그인 상태: 안됨");
    navigation.navigate('Login');
    return false;
  }

  try {
    const response = await fetch('http://${API_HOST}/api/user/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Bearer 토큰으로 전송
      },
    });

    if (response.status === 200) {
      console.log("현재 로그인 상태: 됨");
      return true;
    } else {
      await AsyncStorage.removeItem('userToken'); // 유효하지 않은 토큰 제거
      console.log("토큰 만료 또는 유효하지 않음: 로그아웃 처리");
      navigation.navigate('Login');
      return false;
    }
  } catch (error) {
    console.error('Token validation error:', error);
    console.log("토큰 검증 중 오류 발생: 로그아웃 처리");
    navigation.navigate('Login');
    return false;
  }
};
