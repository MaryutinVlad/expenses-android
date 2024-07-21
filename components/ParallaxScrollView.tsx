import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme, View, Image } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import UserView from '@/components/UserView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  user: {
    name: string,
    avatar: string
  }
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  user
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}>
          {headerImage}
          <UserView
            name={user.name}
            avatar={
              <Image
                source={require('@/assets/images/defaultAvatar.png')}
                style={styles.avatar}
              />
            }
          />
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flex: 1,
    margin: 0,
    paddingTop: 35,
  },
  content: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
});
