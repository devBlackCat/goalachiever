// src/screens/LoginScreen.js
import React, { useState , useEffect} from 'react';
import { View, Button, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTokenValidity } from '../utils/auth';
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    // 로그인 상태 확인 후 처리
    const validateTokenAndNavigate = async () => {
      const isLoggedIn = await checkTokenValidity();
      if (isLoggedIn) {
        navigation.navigate('Main', { screen: 'ScheduleList' });
      }
    };

    validateTokenAndNavigate();
  }, [navigation]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('로그인 실패', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://${API_HOST}/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: username,
          password: password,
        }),
      });
      
      const data = await response.json();

      if (response.status === 200) {
            console.log('로그인 성공:', data);
            try {
              await AsyncStorage.setItem('userToken', data.token);
              // 저장된 토큰을 불러와서 확인
              const token = await AsyncStorage.getItem('userToken');
              console.log('저장된 토큰:', token); // 콘솔에 토큰 내역 출력
              
              // 홈 화면으로 이동
              navigation.navigate('Main', { screen: 'ScheduleList' });

            } catch (e) {
              console.error('토큰 저장 또는 조회 에러:', e);
              Alert.alert('로그인 에러', '로그인 상태를 저장하거나 조회하는데 실패했습니다.');
            }
      } else {
        Alert.alert('로그인 실패', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('로그인 에러', 'An error occurred. Please try again later.');
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp'); // 'SignUp'은 SignUpScreen 컴포넌트에 지정된 이름
  };

 
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true} // 비밀번호 입력 필드는 내용이 보이지 않도록 설정
      />
      <Button
        title="로그인"
        onPress={handleLogin}
      />
      <Button
        title="회원가입"
        onPress={navigateToSignUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default LoginScreen;