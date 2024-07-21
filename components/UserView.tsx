import { View, Text, Image, StyleSheet } from "react-native";

import type { ReactElement } from "react";

export type UserProps = {
  name: string,
  avatar: ReactElement,
}

export default function User({name, avatar} : UserProps) {

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        {avatar}
        <Text
         style={styles.username}
        >
          {name}
        </Text>
      </View>
      <Image
        source={require('@/assets/images/favicon.png')}
        style={styles.settings}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: .5,
    marginTop: 5,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  user: {
    flexDirection: 'row',
    gap: 10,
  },
  username: {
    fontSize: 30,
    textAlignVertical: 'bottom',
    fontWeight: '400',
    lineHeight: 35,
  },
  passed: {

  },
  settings: {
    width: 40,
    height: 40,
  }
})