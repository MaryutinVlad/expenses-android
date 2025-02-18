import { View, Text, StyleSheet } from "react-native";

import GroupView from "./GroupView";
import { Group, ExpensesEntry } from "@/app";
import showExpenses from "../helpers/showExpenses";

type Props = {
  groups: Group[],
  expenses: ExpensesEntry[],
  filter: number,
  dateKey: string,
  onAddExpense( groupName: string, groupValue: number): void,
};

type GroupColors = {
  [key: string]: string,
}

export default function GroupsView({
 groups,
 expenses,
 filter,
 dateKey,
 onAddExpense,
}: Props) {

  const groupColors : GroupColors = {};

  groups.map(group => groupColors[group.groupName] = group.groupColor);

  const { expensesSummary, expensesHistory } = showExpenses(filter, expenses, groups, dateKey);
  let expensesTotal = 0;
  let profitsTotal = 0;

  expensesSummary.map(group => group.earnings ? profitsTotal += group.groupValue : expensesTotal += group.groupValue);

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderWidth: .5,
        borderRadius: 7,
      }}>
        <Text style={styles.totalsText}>
          Total:
        </Text>
        <View style={{flexDirection: "row", gap: 3}}>
          <Text style={{
            ...styles.totalsText,
            color: "green"
          }}>
            pr:
          </Text>
          <Text style={styles.totalsText}>
            {profitsTotal}
          </Text>
        </View>
        <View style={{flexDirection: "row", gap: 3}}>
          <Text style={{
            ...styles.totalsText,
            color: "red"
          }}>
            ex:
          </Text>
          <Text style={styles.totalsText}>
            {expensesTotal}
          </Text>
        </View>
      </View>
      {
        expensesSummary.map(({ id, groupName, groupValue, earnings }) => 
        (
          <GroupView
            key={id}
            groupName={groupName}
            groupValue={groupValue}
            groupColor={groupColors[groupName]}
            expensesTotal={expensesTotal}
            onAddExpense={onAddExpense}
            earnings={earnings}
          />
        ))
      }
      <View style={styles.history}>
        <Text style={{ fontSize: 22 }}>
          History
        </Text>
        {
          expensesHistory.map(({ id, expenseGroup, expenseValue, createdOn }) => (
            <View
              key={id}
              style={styles.historyUnit}
            >
              <Text style={styles.historyText}>
                {expenseValue} in
              </Text>
              <Text style={{color: `${groupColors[expenseGroup]}`, ...styles.historyText}}>
                {expenseGroup}
              </Text>
              <Text style={styles.historyText}>
                on {createdOn}
              </Text>
            </View>
          ))
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "column",
    gap: 8,
  },
  history: {
    marginVertical: 10,
  },
  historyUnit: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 10,
  },
  historyText: {
    fontSize: 18,
  },
  totalsText: {
    fontSize: 23,
  }
})