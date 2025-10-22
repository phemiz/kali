import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/signup', { full_name: fullName, email, phone, password });
      await SecureStore.setItemAsync('jwt', res.data.token);
      navigation.replace('Profile');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.response?.data?.error || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Sign Up</Text>
      <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Button title={loading ? 'Loading...' : 'Create account'} onPress={onSignUp} />
    </View>
  );
}
