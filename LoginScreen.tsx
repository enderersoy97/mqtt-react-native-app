import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Props {
  logoImageSource: any;
  onLoginPress: () => void;
}

const LoginScreen = ({ logoImageSource, onLoginPress }: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={logoImageSource} />
      <TouchableOpacity onPress={onLoginPress} style={{ marginTop: 20 }}>
        <Text>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;