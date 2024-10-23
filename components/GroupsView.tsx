import { View, Text, StyleSheet } from "react-native"

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

  const groupColors : GroupColors = {}

  groups.map(group => groupColors[group.groupName] = group.groupColor);

  const { expensesSummary, expensesHistory } = showExpenses(filter, expenses, groups, dateKey);
  const expensesTotal = expensesSummary.reduce(((accum, cur) => accum + cur.groupValue), 0);

  return (
    <View style={styles.container}>
      {
        expensesSummary.map(({ groupName, groupValue }) => (
          <GroupView
            key={groupName + '-expenses'}
            groupName={groupName}
            groupValue={groupValue}
            groupColor={groupColors[groupName]}
            expensesTotal={expensesTotal}
            onAddExpense={onAddExpense}
          />
        ))
      }
      <View style={styles.history}>
        <Text style={{ fontSize: 22 }}>
          History
        </Text>
        {
          expensesHistory.map(({ expenseGroup, expenseValue, createdOn }) => (
            <View
              key={expenseGroup + '-history'}
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
    flexDirection: "column",
    gap: 5,
  },
  history: {
    marginTop: 10,
  },
  historyUnit: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 10,
  },
  historyText: {
    fontSize: 18,
  }
})