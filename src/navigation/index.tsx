import {NavigationContainer} from '@react-navigation/native';
import {Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {
  InterstitialAd,
  BannerAd,
  AdEventType,
  TestIds,
  BannerAdSize,
} from '@invertase/react-native-google-ads';
import {Platform, View} from 'react-native';
import {disableSnackbar} from '../actions/snackbarActions';
import LightTheme from '../utils/LightTheme';
import {reducerState} from '../utils/types';
import NavigationService from './NavigationService';
import NavigationStack from './NavigationStack';
import VersionCheckController from '../components/VersionCheckController';
import AdView from '../components/NativeAd';

const interstitial = InterstitialAd.createForAdRequest(
  Platform.OS == 'ios'
    ? Config.interstitialAd_ios
    : Config.interstitialAd_android,
  {
    requestNonPersonalizedAdsOnly: true,
  },
);

const AppNavigator = () => {
  console.log('config', Config.bannerAd_ios);
  const adUnitId =
    Platform.OS == 'ios' ? Config.bannerAd_ios : Config.bannerAd_android;

  const dispatch = useDispatch();
  const linking = {
    prefixes: [Config.LINKING_URL],

    config: {
      screens: {
        App: {
          path: 'app',
          initialRouteName: 'Home',
          screens: {
            Home: {
              path: 'Home',
              initialRouteName: 'Home',
              screens: {
                ShareNews: 'shareNews/:id',
              },
            },
          },
        },
      },
    },
  };
  const message = useSelector((state: reducerState) => state.snackbar.message);
  const isSnackbarVisible = useSelector(
    (state: reducerState) => state.snackbar.isSnackbarVisible,
  );
  const [loaded, setLoaded] = useState(false);
  const onExpandDetailCount = useSelector(
    (state: reducerState) => state.app.onExpandDetail,
  );
  useEffect(() => {
    if (message != '' && isSnackbarVisible) {
      Toast.show({
        text: message,

        duration: 4000,
        position: 'bottom',
        onClose: () => {
          dispatch(disableSnackbar());
        },
      });
    }
    setTimeout(() => {
      dispatch(disableSnackbar());
    }, 2000);
  }, [message, isSnackbarVisible]);

  useEffect(() => {
    const eventListener = interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === AdEventType.CLOSED) {
        interstitial?.load();
      }
    });
    interstitial?.load();

    return () => {
      eventListener();
    };
  }, []);

  useEffect(() => {
    const showAdd = () => {
      try {
        interstitial?.show();
      } catch (error) {}
    };
    if (onExpandDetailCount == 1 && loaded) {
      showAdd();
    } else if (!loaded) {
      interstitial?.load();
    }
  }, [loaded, onExpandDetailCount]);
  return (
    <>
      <VersionCheckController />

      <NavigationContainer
        theme={LightTheme}
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}>
        <NavigationStack />
      </NavigationContainer>
      <View
        style={{
          bottom: 0,
          backgroundColor: 'transparent',
          position: 'absolute',
          // height: hp('15'),
        }}>
        <BannerAd unitId={adUnitId} size={BannerAdSize.ADAPTIVE_BANNER} />
      </View>
    </>
  );
};

export default AppNavigator;
