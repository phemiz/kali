import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

// Placeholder paywall - integrate expo-in-app-purchases or RevenueCat later
export default function PremiumPaywall() {
  const onPurchase = async () => {
    Alert.alert('Coming soon', 'In-app purchases will be integrated later.');
  };
  return (
    <View style={{ padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Go Premium</Text>
      <Text>Unlock offline history sync and remove ads.</Text>
      <View style={{ height: 8 }} />
      <Button title="Upgrade" onPress={onPurchase} />
    </View>
  );
}
