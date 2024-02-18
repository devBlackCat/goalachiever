// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';  
import AuthForm from '../components/AuthForm';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    gender: '',
    birthdate: '',
    email: '',
  });

  const [warningMessages, setWarningMessages] = useState({
    username: '',
    password: '',
    birthdate: '',
    email: '',
  });

  const validateField = (field, value) => {
    let message = '';
    switch(field) {
      case 'username':
        message = value && /^[A-Za-z0-9]+$/.test(value) ? '' : "아이디는 영어와 숫자만 입력가능합니다";
        break;
      case 'password':
        message = value && value.length >= 8 ? '' : "패스워드는 8글자 이상으로 작성해주세요";
        break;
      case 'birthdate':
        message = value && /^\d{6}$/.test(value) ? '' : "생년월일은 숫자로 입력해주세요(031112)";
        break;
      case 'email':
        message = value && /\S+@\S+\.\S+/.test(value) ? '' : "유효한 이메일을 입력해주세요";
        break;
      default:
        break;
    }
    setWarningMessages(prevMessages => ({ ...prevMessages, [field]: message }));
  };

  const handleInputChange = (key, value) => {
    setFormData(prevFormData => ({ ...prevFormData, [key]: value }));
  };

  const handleInputBlur = (key) => {
    validateField(key, formData[key]);
  };

  const handleSignUp = async () => {
    // 각 입력 필드의 유효성을 검사
    const isUsernameValid = formData.username && /^[A-Za-z0-9]+$/.test(formData.username);
    const isPasswordValid = formData.password && formData.password.length >= 8;
    const isBirthdateValid = formData.birthdate && /^\d{6}$/.test(formData.birthdate);
    const isEmailValid = formData.email && /\S+@\S+\.\S+/.test(formData.email);
  
    // 입력 필드 중 하나라도 유효하지 않으면 경고 메시지를 표시
    if (!formData.username) {
      Alert.alert("입력 오류", "아이디를 입력해주세요");
    } else if (!formData.password) {
      Alert.alert("입력 오류", "비밀번호를 입력해주세요");
    } else if (!formData.gender) {
      Alert.alert("입력 오류", "성별을 선택해주세요");
    } else if (!formData.birthdate) {
      Alert.alert("입력 오류", "생년월일을 입력해주세요");
    } else if (!formData.email) {
      Alert.alert("입력 오류", "이메일을 입력해주세요");
    } else if (!isUsernameValid || !isPasswordValid || !isBirthdateValid || !isEmailValid) {
      // 입력값 중 하나라도 유효하지 않을 경우
      Alert.alert("입력 오류", "입력이 올바르지 않습니다");
    } 
    else {
          try {
            const response = await fetch('http://${API_HOST}/api/user/join', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: formData.username,
                password: formData.password,
                age: formData.birthdate, // age 필드가 생년월일로 대체되었다고 가정
                gender: formData.gender,
                email: formData.email // 가정: API가 이메일을 처리할 수 있도록 수정되었음
              }),
            });
            const data = await response.json();
      
            if (data.success) {
              console.log('회원가입 성공');
              navigation.navigate('Login'); // 회원가입 성공 후 로그인 화면으로 이동
            }else {
              Alert.alert('회원가입 실패', data.error || 'Something went wrong');
            }
          } catch (error) {
            console.error('회원가입 에러:', error);
            Alert.alert('회원가입 에러', 'An error occurred. Please try again later.');
          }
    }
  };
  

  return (
    <View style={styles.container}>
      <AuthForm
        formData={formData}
        setFormData={handleInputChange}
        onBlur={handleInputBlur}
        onSubmit={handleSignUp}
        submitLabel="회원가입"
      />
      {Object.keys(warningMessages).map((key) => (
        warningMessages[key] ? <Text key={key} style={styles.warningText}>{warningMessages[key]}</Text> : null
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  warningText: {
    color: 'red',
  },
});

export default SignUpScreen;
