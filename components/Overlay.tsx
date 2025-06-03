import type { PropsWithChildren } from 'react';
import type { Group } from '@/types/types';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme, View, Image } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import UserView from '@/components/UserView';
import containers from '@/styles/containers';
import assets from "@/styles/assets";

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
  user: {
    name: string,
    avatar: string,
    groups: Group[],
  },
  monthSelected: string,
  onChangeName(nameInput: string): void,
  onRemoveGroup(id: string, name: string): void,
  onRemoveGroups(): void,
}>;

export default function Overlay({
  children,
  headerBackgroundColor,
  user,
  monthSelected,
  onChangeName,
  onRemoveGroup,
  onRemoveGroups,
}: Props) {

  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <GestureHandlerRootView>
      <View style={containers.app}>
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={
              { backgroundColor: headerBackgroundColor[colorScheme] }
            }>
            <UserView
              name={user.name}
              groups={user.groups}
              onChangeName={onChangeName}
              onRemoveGroup={onRemoveGroup}
              onRemoveGroups={onRemoveGroups}
              monthSelected={monthSelected}
              avatar={
                <Image
                  source={require("@/assets/images/defaultAvatar.png")}
                  style={assets.icon}
                />
              }
            />
          </Animated.View>
          <View>{children}</View>
        </Animated.ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
