import {useTheme} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

import FastImage from 'react-native-fast-image';
import NewsLogo from '../../assets/images/HeaderIcon.png';
import AntDesign from 'react-native-vector-icons/AntDesign';
import analytics from '@react-native-firebase/analytics';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Props from './types';
import {useDispatch} from 'react-redux';
import {onRate} from '../../actions/userAction';
import Toast, {DURATION} from 'react-native-easy-toast';
import {useKeyboard} from '@react-native-community/hooks';
import {getUniqueId} from 'react-native-device-info';
const RatingDialog: React.FC<Props> = props => {
  const {ratingDialog} = useTheme();
  const [rating, setRating] = useState<number>(-1);
  const keyboard = useKeyboard();
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const toastRef = useRef();
  const [error, setError] = useState('');

  return (
    <Modal isVisible={true} style={{zIndex: 1}}>
      <KeyboardAvoidingView
        behavior="padding"
        style={[
          ratingDialog.container,
          {
            marginBottom:
              Platform.OS == 'ios'
                ? keyboard?.keyboardShown
                  ? keyboard?.keyboardHeight
                  : 0
                : 0,
          },
        ]}>
        <FastImage
          source={NewsLogo}
          style={ratingDialog.logo}
          resizeMode="contain"
        />
        <Text style={ratingDialog.title}>Rate Urdu News App</Text>

        <TextInput
          style={ratingDialog.input}
          placeholder="Please enter your comment here (Optional)"
          multiline
          onChangeText={text => setComment(text)}
          numberOfLines={2}
          maxLength={100}
        />

        <View style={ratingDialog.ratingView}>
          {Array.from({length: 5}, (_, i) => (
            <TouchableOpacity onPress={() => setRating(i)} key={i}>
              <AntDesign
                name={i <= rating ? 'star' : 'staro'}
                size={widthPercentageToDP(6)}
                color={i <= rating ? 'gold' : 'grey'}
                style={ratingDialog.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        {error == '' ? null : <Text>{error}</Text>}
        <View style={ratingDialog.buttonView}>
          <TouchableOpacity
            style={ratingDialog.linkView}
            onPress={() => {
              var nextDate = new Date();
              nextDate.setDate(new Date().getDate() + 30);
              dispatch(onRate({date: nextDate, rating: null}));
              Keyboard.dismiss();
              props.onCompletion({
                state: false,
                message: 'Thank you for your time',
              });
            }}>
            <Text style={ratingDialog.link}>Never</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ratingDialog.linkView}
            onPress={() => {
              var nextDate = new Date();
              nextDate.setDate(new Date().getDate() + 7);
              dispatch(onRate({date: nextDate, rating: null}));
              Keyboard.dismiss();
              props.onCompletion({
                state: false,
                message: 'Thank you for your time',
              });
            }}>
            <Text style={ratingDialog.link}>Not now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ratingDialog.linkView}
            onPress={async () => {
              if (rating < 0) {
                setError('Please select the rating');
              } else {
                var nextDate = new Date();
                nextDate.setDate(new Date().getDate() + 10);
                Keyboard.dismiss();
                dispatch(
                  onRate({
                    date: nextDate,
                    rating: rating + 1,
                    comment: comment,
                  }),
                );
                //To google analytics
                let deviceId = getUniqueId();
                await analytics().logEvent('rating', {
                  id: deviceId,
                  rating: rating + 1,
                });

                props.onCompletion({
                  state: false,
                  message: 'Your response has been recorded',
                });

                if (rating > 3) {
                  if (Platform.OS == 'android') {
                    Linking.openURL('market://details?id=com.gsoft.newsapp');
                  } else {
                    Linking.openURL(
                      'itms-apps://apps.apple.com/ca/app/urdu-shorts/id1565184003',
                    );
                  }
                }
              }
            }}>
            <Text style={ratingDialog.link}>Ok</Text>
          </TouchableOpacity>
          {/* second view */}
        </View>
        <Toast ref={toastRef} position="center" opacity={0.8} />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default React.memo(RatingDialog);
