import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Toast, {DURATION} from 'react-native-easy-toast';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils/GetResponsiveHeight';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import {getConfigRequest} from '../../actions/appAction';
import {enableRefreshing} from '../../actions/loadingAction';
import MenuHeader from '../../components/header/MenuHeader';
import NewsList from '../../components/News/NewsList';
import NewsCardShimmer from '../../components/Shimmer/NewsCardShimmer';
import {reducerState} from '../../utils/types';
import RatingDialog from '../../components/RatingDialog';
import {onRate} from '../../actions/userAction';

interface props {}
const Tab = createMaterialTopTabNavigator();

const MyFeedView: React.FC<props> = props => {
  const {colors, tabBar, rootContainer, newsList} = useTheme();
  const dispatch = useDispatch();
  const tabs = useSelector((state: reducerState) => state.app?.tabs);
  const loading = useSelector(
    (state: reducerState) => state.loading.isLoadingVisible,
  );
  const [exitApp, setExitApp] = useState(false);
  const toastRef = useRef();

  const refreshing = useSelector(
    (state: reducerState) => state.loading.refreshing,
  );

  const ratingDetail = useSelector(
    (state: reducerState) => state.user.ratingDetail,
  );
  const [isRatingDialogVisible, setIsRatingDialogVisible] = useState(false);
  //for rating action
  useEffect(() => {
    const date = new Date();
    console.log('Rating Detail>', ratingDetail);
    if (ratingDetail != 'never') {
      console.log('here 4');
      if (ratingDetail == null) {
        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        dispatch(onRate({date: tomorrow, rating: null}));
        console.log('here 3');
      } else if (
        new Date(ratingDetail?.date) <= date &&
        ratingDetail?.rating == null
      ) {
        setIsRatingDialogVisible(true);
        console.log('here 1');
      } else if (
        ratingDetail?.rating < 4 &&
        new Date(ratingDetail?.date) <= date
      ) {
        setIsRatingDialogVisible(true);
        console.log('here 2');
      }
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (!exitApp) {
          setExitApp(true);
          toastRef.current.show('Press Back to exit', 1000);
        } else if (exitApp == true) {
          BackHandler.exitApp();
        }

        setTimeout(() => {
          setExitApp(false);
        }, 1700);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, [exitApp]),
  );

  // useLayoutEffect(() => {
  //   if (refreshing) {
  //     dispatch(getConfigRequest());
  //   }
  //   [refreshing];
  // });
  return (
    <View key="MyFeedView" style={rootContainer}>
      <MenuHeader refresh={true} />
      {tabs.length == 0 && refreshing ? (
        <View key="emptyTab" style={{flex: 1}}>
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: 20,
              zIndex: 5,
              alignSelf: 'center',
            }}
            size="small"
            color={colors.primaryTextColor}
          />
          <NewsCardShimmer />
        </View>
      ) : tabs.length == 0 ? (
        <TouchableOpacity
          key="emptyString"
          onPress={() => {
            dispatch(enableRefreshing());
            dispatch(getConfigRequest());
          }}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={newsList.emptyText}>اپنا انٹرنیٹ کنکشن چیک کریں</Text>
          <MaterialIcons name="refresh" size={wp('6')} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <Tab.Navigator
          //  tabBar={props => <MyTabBar {...props} />}
          // removeClippedSubviews
          lazy={true}
          lazyPreloadDistance={0}
          lazyPlaceholder={() => <NewsCardShimmer />}
          initialLayout={{width: Dimensions.get('window').width}}
          tabBarOptions={{
            labelStyle: [tabBar.title, {color: colors.primary}],
            tabStyle: tabBar.tabStyle,
            scrollEnabled: true,
            style: tabBar.tabBarStyle,
          }}
          screenOptions={({route}) => ({
            tabBarLabel: ({focused}) => {
              return (
                <Text
                  style={[
                    tabBar.title,
                    {color: focused ? colors.primary : colors.gray},
                  ]}>
                  {route.params.title}
                </Text>
              );
            },
          })}>
          {tabs.map(route => {
            return (
              <Tab.Screen
                key={route.index}
                name={route.index}
                component={NewsList}
                initialParams={route}
              />
            );
          })}
        </Tab.Navigator>
      )}
      <Toast
        ref={toastRef}
        position="center"
        style={{
          backgroundColor: colors.generic == '#FFFFFF' ? 'black' : 'white',
          borderRadius: 20,
          marginTop: hp('10'),
        }}
        textStyle={{color: colors.generic}}
        opacity={0.8}
      />
      {isRatingDialogVisible ? (
        <RatingDialog
          onCompletion={key => {
            setIsRatingDialogVisible(key?.state);
            toastRef.current.show(key?.message, 1000);
          }}
        />
      ) : null}
    </View>
  );
};

export default MyFeedView;
