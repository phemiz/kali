import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/profile');
        setProfile(res.data);
      } catch (e: any) {
        Alert.alert('Session expired', 'Please login again');
        navigation.replace('Login');
      }
    })();
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    navigation.replace('Login');
  };

  if (!profile) return <View style={{ padding: 16 }}><Text>Loading...</Text></View>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Welcome, {profile.full_name}</Text>
      <Text>Email: {profile.email}</Text>
      <Button title="Verify a plate" onPress={() => navigation.navigate('Verify')} />
      <View style={{ height: 12 }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
