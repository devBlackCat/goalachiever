// src/components/AuthForm.js
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const AuthForm = ({ formData, setFormData, onBlur, onSubmit, submitLabel }) => {
  return (
    <View style={styles.container}>
      {Object.keys(formData).map(key => (
        <TextInput
          key={key}
          style={styles.input}
          value={formData[key]}
          onChangeText={(text) => setFormData(key, text)}
          onBlur={() => onBlur(key)}
          placeholder={key}
          secureTextEntry={key === 'password'}
        />
      ))}
      <Button title={submitLabel} onPress={onSubmit} />
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default AuthForm;
