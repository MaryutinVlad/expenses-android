import { StyleSheet } from "react-native";

export const containers = StyleSheet.create({
  app: {
    paddingHorizontal: 10,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderTopWidth: .5,
    marginTop: 5,
    paddingTop: 10,
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5eaf3",
    borderRadius: 4,
    width: "50%",
  }
});

export default containers;