import { Image } from 'react-native';

export default function AppLogo() {
  return (
    <Image
      source={require('../../assets/images/logo-matched.png')}
      style={{
        width: 100,
        height: 100,
      }}
      resizeMode="contain"
    />
  );
}