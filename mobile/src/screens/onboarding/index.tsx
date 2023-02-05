import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Layout from '@components/layout';
import Button from '@components/buttons';

import colors from '@constant/colors';

import slides from '@constant/onboarding';
import screens from '@constant/screens';

const {width, height} = Dimensions.get('window');

const Slide = (
  props: (typeof slides)[number] & {currentSlideIndex: number},
) => {
  const navigation = useNavigation();

  return (
    <View style={[{width}, styles.container]}>
      <View style={{flex: 3}}>
        <ImageBackground
          imageStyle={{
            width: '100%',
            resizeMode: 'contain',
          }}
          source={props.image}
          style={styles.image}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              props.currentSlideIndex == index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button
          textColor="primary_dark"
          backgroundColor="anonn_green"
          title="Sign up"
          onPress={() => navigation.navigate(screens.Signup as never)}
        />
        <Button
          textColor="white"
          backgroundColor="primary_dark"
          title="Log in"
          onPress={() => navigation.navigate(screens.Login as never)}
        />
      </View>
    </View>
  );
};

const Onboarding = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };
  return (
    <Layout>
      <FlatList
        pagingEnabled
        horizontal
        data={slides}
        // contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        renderItem={({item}) => (
          <Slide currentSlideIndex={currentSlideIndex} {...item} />
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  slideContainer: {
    // flex: 1,
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.white,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: 'grey',
    borderRadius: 100,
    marginHorizontal: 2,
  },
  activeIndicator: {
    width: 20,
    height: 8,
    backgroundColor: colors.anonn_green,
    borderRadius: 100,
    marginHorizontal: 2,
  },
});

export default Onboarding;
