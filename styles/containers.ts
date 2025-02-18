import { StyleSheet } from "react-native";

const containers = StyleSheet.create({
  app: {
    paddingHorizontal: 10,
    paddingTop: 15,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderTopWidth: .5,
    marginVertical: 15,
    paddingTop: 15,
  },
  stdList: {
    gap: 5,
  },
  rowApart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowTogether: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5eaf3",
    borderRadius: 4,
    width: "50%",
  },
  popup: {
    gap: 15,
    marginTop: 10,
    borderWidth: .5,
    borderRadius: 5,
    padding: 10,
  },
  halfSizedList: {
    width: "50%",
    gap: 5
  },
  colorPalette: {
    width: 328,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: "auto",
    marginVertical: 15,
  },
  color: {
    width: 40,
    height: 40,
    borderWidth: .5,
    borderRadius: 3,
  }
});

export default containers;