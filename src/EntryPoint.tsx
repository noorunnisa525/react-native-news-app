import './utils/i18nNext';
import 'react-native-gesture-handler';
import {getConfigRequest} from '../src/actions/appAction';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import admob, {MaxAdContentRating} from '@invertase/react-native-google-ads';
import {firebase} from '@react-native-firebase/analytics';
import {Root} from 'native-base';
import React, {Suspense, useEffect, useLayoutEffect, useState} from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import RNRestart from 'react-native-restart';
import {
  Alert,
  BackHandler,
  InteractionManager,
  Linking,
  SafeAreaView,
  useColorScheme,
  View,
  AsyncStorage,
  Button,
  Text,
} from 'react-native';
import codePush from 'react-native-code-push';
import {Provider as PaperProvider, Snackbar} from 'react-native-paper';
import {enableScreens} from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import DarkTheme from '../src/utils/DarkTheme';
import LightTheme from '../src/utils/LightTheme';
import {disableNightMode, enableNightMode} from './actions/userAction';
import PushNotifications from './components/PushNotifications';
import AppNavigator from './navigation';
import {persistor, store} from './store/store';
import {navigateToDeepLink} from './utils/deepLinking';
import {fetchServerConfig} from './utils/GetConfig';
import {reducerState} from './utils/types';
import {useAppState} from '@react-native-community/hooks';
// import {
//   RewardedAd,
//   RewardedAdEventType,
//   AdEventType,
//   TestIds,
// } from '@react-native-firebase/admob';
/* eslint-disable react/prop-types */
enableScreens();

const Loading = () => {
  return <View />;
};

const App = () => {
  const currentAppState = useAppState();
  const colorScheme = useColorScheme();
  const nightMode = useSelector((state: reducerState) => state.user.nightMode);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    fetchServerConfig();
    if (!nightMode && colorScheme == 'dark') {
      dispatch(enableNightMode());
    } else {
      dispatch(disableNightMode());
    }
  }, []);

  useEffect(() => {
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,

        // An array of test device IDs to whitelist.
        testDeviceIdentifiers: ['EMULATOR'],
      })
      .then(() => {
        // Request config successfully set!
      });
  }, []);
  // useEffect(() => {
  //   admob()
  //     .initialize()
  //     .then(adapterStatuses => {
  //       // Initialization complete!
  //     });
  // }, []);
  const updateAlert = () =>
    Alert.alert(
      'Please Update',
      'You will have to update your app to latest version to continue using app',
      [
        {
          text: 'Update',
          onPress: () => {
            BackHandler.exitApp();
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.gsoft.newsapp',
            );
          },
        },
      ],
      {cancelable: false},
    );
  useLayoutEffect(() => {
    // dispatch(enableRefreshing());
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      navigateToDeepLink();
      Linking.addEventListener('url', url => {});

      setTimeout(() => {
        dispatch(getConfigRequest());
        SplashScreen.hide();
      }, 5000);
    });
    return () => {
      interactionPromise.cancel();
    };
  }, []);

  const checkIfFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('HAS_LAUNCHED');
      if (hasLaunched === null) {
        AsyncStorage.setItem('HAS_LAUNCHED', 'true');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    checkIfFirstLaunch().then(data => {
      if (data == true)
        setTimeout(() => {
          //  dispatch(getConfigRequest());
        }, 6000);
    });
  }, []);
  useEffect(() => {
    const analytics = async () => {
      await firebase.analytics().setAnalyticsCollectionEnabled(true);
    };
    analytics();
  }, []);

  return (
    <PaperProvider theme={nightMode ? DarkTheme : LightTheme}>
      <AppNavigator />
      <PushNotifications />
    </PaperProvider>
  );
};

const codePushOptions = {
  updateDialog: false,
  installMode: codePush.InstallMode.IMMEDIATE,
};

const mainComponent = () => {
  const CustomFallback = (props: {error?: Error; resetError: () => void}) => (
    <SafeAreaView
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontWeight: 'bold'}}>
        Something Error occured, please try again
      </Text>
      <Button
        title="Restart"
        onPress={() => RNRestart.Restart()}
        style={{
          backgroundColor: 'blue',
          borderRadius: 20,
          marginTop: 10,
        }}
      />
      <Snackbar
        visible={props.error?.message ? true : false}
        onDismiss={() => {}}>
        {props.error?.message}
      </Snackbar>
    </SafeAreaView>
  );
  return (
    <Suspense fallback={<Loading />}>
      <SafeAreaView style={{flex: 1}}>
        <Root>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ErrorBoundary FallbackComponent={CustomFallback}>
                <App />
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </Root>
      </SafeAreaView>
    </Suspense>
  );
};

export default codePush(codePushOptions)(mainComponent);
// export default mainComponent;
