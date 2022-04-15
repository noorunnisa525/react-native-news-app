import AsyncStorage from '@react-native-community/async-storage';
import remoteConfig from '@react-native-firebase/remote-config';
import Config from 'react-native-config';
import dataConfig from '../../assets/firebaseConfig/dataConfig.json';

export const fetchServerConfig = async () => {
  try {
    await remoteConfig().fetch(0);
    let activated = await remoteConfig().activate();
    // const activated = await remoteConfig.remoteConfig().fetchAndActivate(
    let config = await remoteConfig()
      .getValue(
        Config.BUILD == 'production' ? 'liveServerConfig' : 'liveServerConfig',
      )
      .asString();
    await AsyncStorage.setItem('serverConfig', config);
    return JSON.parse(config);
  } catch (err) {}
};

export const fetchVersion = async () => {
  try {
    await remoteConfig().fetch(0);
    let activated = remoteConfig().activate();
    // const activated = await remoteConfig.remoteConfig().fetchAndActivate();

    let version = await remoteConfig()
      .getValue(
        Config.BUILD == 'production' ? 'version_detail' : 'version_detail',
      )
      .asString();
    return JSON.parse(version);
  } catch (err) {}
};

export const actionFetchRemoteConfig = async () => {
  try {
    await remoteConfig().fetch(0);
    let activated = remoteConfig().activate();
    // const activated = await remoteConfig.remoteConfig().fetchAndActivate();

    let confVal = await remoteConfig()
      .getValue(
        Config.BUILD == 'production' ? 'productionConfig' : 'productionConfig',
      )
      .asString();
    let result = confVal;
    return result;
  } catch (err) {
    return dataConfig;
  }
};
