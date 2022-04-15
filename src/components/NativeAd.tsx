import {TestIds} from '@invertase/react-native-google-ads';
import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {ActivityIndicator, DeviceEventEmitter} from 'react-native';

import NativeAdView, {
  AdvertiserView,
  CallToActionView,
  HeadlineView,
  IconView,
  NativeMediaView,
  StarRatingView,
  StoreView,
  TaglineView,
} from 'react-native-admob-native-ads';
import Config from 'react-native-config';
import {useTheme} from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const IOS_LINK_URL = 'https://apps.apple.com/pk/app/urdu-shorts/id1565184003';
const ANDROID_LINK_URL = 'market://details?id=com.gsoft.newsapp';
const unitAdId =
  Platform.OS == 'ios' ? Config.nativeAd_ios : Config.nativeAd_android;
const NativeAd = (props: any) => {
  // Each NativeAdView component needs to have its own ref, you cannot use the same ref for multiple ads.
  const nativeAdViewRef = useRef<any>();
  const {adView} = useTheme();
  React.useEffect(() => {
    nativeAdViewRef.current?.loadAd();
  }, []);
  const [aspectRatio, setAspectRatio] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef<any>();
  useEffect(() => {
    console.log('Native ad rendered');
  }, []);
  const onAdFailedToLoad = (event: any) => {
    console.log('event', event);
    setError(true);
    setLoading(false);
  };

  const onAdLoaded = () => {
    setLoaded(false);
    setLoading(false);
  };

  const onNativeAdLoaded = (event: any) => {
    setLoading(false);
    setLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
  };

  useEffect(() => {
    nativeAdRef.current?.loadAd();

    return () => {
      setLoaded(false);
    };
  }, []);
  const refreshInterval: number = 60000 * 2;
  return (
    <>
      {!error ? (
        <NativeAdView
          ref={nativeAdViewRef}
          adUnitID={unitAdId}
          onAdLoaded={onAdLoaded}
          onAdFailedToLoad={onAdFailedToLoad}
          onNativeAdLoaded={onNativeAdLoaded}
          style={adView.nativeAdView}
          videoOptions={{
            customControlsRequested: false,
          }}
          repository={props.type}>
          {!error && props.type == 'imageAd' ? (
            <View style={adView.mainView}>
              <View style={{padding: 0}}>
                <IconView style={adView.iconView} />
              </View>
              <View style={adView.padding}>
                <View style={adView.subView}>
                  <HeadlineView style={adView.headline} />
                  <CallToActionView
                    style={adView.callToView}
                    allCaps
                    textStyle={adView.buttonText}
                  />
                </View>
              </View>
            </View>
          ) : null}
          {!error && props.type == 'videoAd' ? (
            <View style={adView.container}>
              <NativeMediaView style={adView.mediaView} paused={false} />
              <View style={adView.subContainer}>
                <HeadlineView style={adView.headline} />
                <CallToActionView
                  style={adView.callToView}
                  allCaps
                  textStyle={adView.buttonText}
                />
              </View>
            </View>
          ) : null}
        </NativeAdView>
      ) : null}
    </>
  );
};

export default React.memo(NativeAd);
