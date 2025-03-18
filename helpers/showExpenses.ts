import type { Expense, ExpensesEntry, Group } from "@/types/types";

type SubResult = {
  [key: string]: number,
};

export default function showExpenses(filter: number, expenses: ExpensesEntry[], groups: Group[], dateKey: string) {

  const curMonthIndex = expenses.findIndex(month => month.date === dateKey);
  const expensesSummary = [];
  const expensesHistory: Expense[] = [];
  const currentMonthExpenses = expenses[curMonthIndex];
  const subResult: SubResult = {};
  let group;

  if (currentMonthExpenses.date !== dateKey) {
    for (group of groups) {
      expensesSummary.push({
        id: group.id,
        groupName: group.groupName,
        groupValue: 0,
        earnings: group.earnings,
      })
    }

    return { expensesSummary, expensesHistory };

  } else if (filter === 2) {

    for (let expenseIndex = currentMonthExpenses.entries.length - 1; expenseIndex >= 0; expenseIndex--) {
      const currentExpense = currentMonthExpenses.entries[expenseIndex];

      if (!subResult[currentExpense.expenseGroup]) {
        subResult[currentExpense.expenseGroup] = currentExpense.expenseValue;
      } else {
        subResult[currentExpense.expenseGroup] += currentExpense.expenseValue;
      }

      expensesHistory.push(currentExpense);
    }
  } else if (filter === 1) {
    
    const date = new Date();
    const daysToMonday = date.getDay();
    const dayInMilliseconds = 86400000;
    const finalDate = new Date(Date.now() - (dayInMilliseconds * (daysToMonday === 0 ? 0 : daysToMonday - 1)));
    const finalKey = finalDate.toLocaleDateString("en-US");

    let monthIndex = expenses.length - 1;
    let expenseIndex = expenses[monthIndex].entries.length - 1;

    for (monthIndex; monthIndex > 0; monthIndex --) {
      for (expenseIndex; expenseIndex > 0; expenseIndex --) {

        const currentExpense = expenses[monthIndex].entries[expenseIndex];
        const [ curMonth, curDay, curYear ] = currentExpense.createdOn.split("/").map(value => Number(value));
        const [ finMonth, finDay, finYear ] = finalKey.split("/").map(value => Number(value));

        if (curYear < finYear) {
          break;
        } else if (curMonth < finMonth) {
          break;
        } else if (curDay < finDay) {
          break;
        } else {

          if (!subResult[currentExpense.expenseGroup]) {
            subResult[currentExpense.expenseGroup] = currentExpense.expenseValue;
          } else {
            subResult[currentExpense.expenseGroup] += currentExpense.expenseValue;
          }
    
          expensesHistory.push(currentExpense);
        }
      }
    }
  } else {
    const today = new Date()

    for (let expenseIndex = currentMonthExpenses.entries.length - 1; expenseIndex >= 0; expenseIndex--) {

      const currentExpense = currentMonthExpenses.entries[expenseIndex];

      if (currentExpense.createdOn === today.toLocaleDateString("en-US")) {

        if (!subResult[currentExpense.expenseGroup]) {
          subResult[currentExpense.expenseGroup] = currentExpense.expenseValue;
        } else {
          subResult[currentExpense.expenseGroup] += currentExpense.expenseValue;
        }
        expensesHistory.push(currentExpense);

      } else {
        break
      }
    }
  }

  for (let group of groups) {
    expensesSummary.push({
      id: group.id,
      groupName: group.groupName,
      groupValue: subResult[group.groupName] ? subResult[group.groupName] : 0,
      earnings: group.earnings,
    })
  }

  return { expensesSummary, expensesHistory };
}