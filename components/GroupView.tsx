import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

import shortenValue from "../helpers/shortenValue";

type Props = {
  groupName: string,
  groupValue: number,
  groupColor: string,
  expensesTotal: number,
  onAddExpense( groupName: string, groupValue: number ): void,
}

export default function GroupView({
  groupName,
  groupValue,
  groupColor,
  expensesTotal,
  onAddExpense,
}: Props) {

  const [ isAddingExpense, setIsAddingExpense ] = useState(false);
  const [ inputValue, setInputValue ] = useState("");

  const toggleAddExpense = () => {
    setIsAddingExpense(!isAddingExpense);
    setInputValue("");
  }

  const addExpense = () => {
    if (!Number(inputValue)) {
      console.log("invalid input");
      return
    }
    setIsAddingExpense(false);
    setInputValue("");
    onAddExpense(groupName, Number(inputValue));
  }

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Pressable
          onPress={toggleAddExpense}
          style={{
            borderColor: "#2196F3",
            backgroundColor: `${isAddingExpense ? "#2196F3" : "#ffffff"}`,
            borderWidth: 1.5,
            borderRadius: 25,
            width: 35,
            height: 35,
          }}
        >
          <Text
            style={{
              color: `${isAddingExpense ? "#ffffff" : "#2196F3"}`,
              fontSize: 35,
              fontWeight: 100,
              margin: "auto",
              lineHeight: 35,
              textAlign: "center",
            }}
          >
            +
          </Text>
        </Pressable>
        <Text style={{
          color: `${groupColor}`,
          fontSize: 25,
          verticalAlign: "middle",
          maxWidth: "65%",
          }}>
            {groupName} 
          </Text>
      </View>
      {
        isAddingExpense ? (
          <View style={styles.add}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="type in value"
            />
            <Pressable
              onPress={addExpense}
              disabled={!inputValue ? true : false}
              style={{
                width: "30%",
                backgroundColor: `${!inputValue ? "#dadddf" : "#2196F3"}`,
                borderTopRightRadius: 7,
                borderBottomRightRadius: 7,
              }}
            >
              <Text
                style={{
                  color: `${!inputValue ? "#999999" : "#ffffff"}`,
                  textAlign: "center",
                  margin: 0,
                  padding: 0,
                  lineHeight: 35,
                }}
              >
                SAVE
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.numbers}>
            <Text style={{
              width: "60%",
              textAlign: "right",
              paddingRight: 15,
              ...styles.text
              }}>
                {groupValue >= 1000000 ? shortenValue(groupValue) : groupValue}
              </Text>
            <Text style={{
              width: "40%",
              textAlign: "right"
              ,...styles.text
            }}>
              {groupValue === 0 ? 0 : ((groupValue / expensesTotal) * 100).toFixed(0)} %
            </Text>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
    maxHeight: 100,
  },
  subcontainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "45%",
  },
  text: {
    fontSize: 25,
    verticalAlign: "middle"
  },
  numbers: {
    width: "55%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  add: {
    width: "55%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5eaf3",
    borderRadius: 7,
    alignItems: "center",
  },
  textInput: {
    width: "70%",
    textDecorationLine: "underline",
    height: 35,
    padding: 0,
    margin: 0,
    textAlign: "center",
    fontSize: 17,
  },
})