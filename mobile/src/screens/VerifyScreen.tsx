import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { api } from '../api/client';
import { initDb, getPlateResult, savePlateResult } from '../storage/sqlite';

export default function VerifyScreen() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDb();
  }, []);

  const onVerify = async () => {
    const plateNormalized = plate.trim().toUpperCase();
    if (!plateNormalized) return;
    setLoading(true);
    try {
      const res = await api.post('/api/verify/plate', { plate_number: plateNormalized });
      setResult(res.data);
      savePlateResult(plateNormalized, JSON.stringify(res.data));
    } catch (e: any) {
      const cached = await getPlateResult(plateNormalized);
      if (cached) {
        setResult(JSON.parse(cached.result_json));
        Alert.alert('Offline result', 'Showing cached verification');
      } else {
        Alert.alert('Verification failed', 'No network and no cached result');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Verify Plate</Text>
      <TextInput placeholder="Enter plate (e.g., LAG123AB)" value={plate} onChangeText={setPlate} autoCapitalize="characters" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Button title={loading ? 'Checking...' : 'Verify'} onPress={onVerify} />
      {result && (
        <View style={{ marginTop: 16 }}>
          <Text>Plate: {result.plate_number}</Text>
          <Text>State code: {result.state_code}</Text>
          <Text>Class: {result.plate_class}</Text>
          <Text>Status: {result.registration_status}</Text>
          <Text>Vehicle: {result.vehicle_model}</Text>
          <Text>Registration date: {result.registration_date}</Text>
          <Text>Source: {result.source}</Text>
        </View>
      )}
    </View>
  );
}
