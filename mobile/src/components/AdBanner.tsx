import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';

export default function AdBanner() {
  useEffect(() => {
    setTestDeviceIDAsync('EMULATOR');
  }, []);
  return (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/2934735716'}
        servePersonalizedAds
      />
    </View>
  );
}
