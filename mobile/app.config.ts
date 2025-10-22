import { ExpoConfig } from 'expo/config';

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  name: 'NaijaPlate',
  slug: 'naijaplate',
  extra: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000',
  },
});
