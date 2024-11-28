import type { PropsWithChildren, ReactElement } from 'react';
import type { Group } from '@/app';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme, View, Image } from 'react-native';
import Animated, {
  useAnimatedRef,
} from 'react-native-reanimated';

import UserView from '@/components/UserView';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  user: {
    name: string,
    avatar: string,
    groups: Group[],
  },
  onChangeName(nameInput: string): void,
  onRemoveGroup(id: string, name: string): void,
  onRemoveGroups(): void,
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  user,
  onChangeName,
  onRemoveGroup,
  onRemoveGroups,
}: Props) {

  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] }
            ]}>
            {headerImage}
            <UserView
              name={user.name}
              groups={user.groups}
              onChangeName={onChangeName}
              onRemoveGroup={onRemoveGroup}
              onRemoveGroups={onRemoveGroups}
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
    </GestureHandlerRootView>
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
