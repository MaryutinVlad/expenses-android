import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

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
    console.log('!!!!!!!!!!!!!!!!')
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
        <Button
          title="+"
          onPress={toggleAddExpense}
          color={isAddingExpense ? "#ff0800" : "#2196F3"}
        />
        <Text style={{ color: `${groupColor}`, ...styles.text}}>{groupName} </Text>
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
            <Button
              title="save"
              
              onPress={addExpense}
              disabled={!inputValue}
            />
          </View>
        ) : (
          <>
            <Text style={styles.text}>{groupValue}</Text>
            <Text style={styles.text}>{groupValue === 0 ? 0 : ((groupValue / expensesTotal) * 100).toFixed(0)} %</Text>
          </>
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
    height: 30
  },
  subcontainer: {
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 20,
    verticalAlign: "middle"
  },
  add: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5eaf3",
    borderRadius: 10,
    alignItems: "center",
  },
  textInput: {
    textDecorationLine: "underline",
    height: 30,
    padding: 0,
    margin: 0,
    textAlign: "center",
    minWidth: "40%",
    fontSize: 16,
  },
})