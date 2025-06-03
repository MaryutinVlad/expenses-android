import type { Expense, Expenses, Group } from "@/types/types";

type SubResult = {
  [key: string]: number,
};

export default function showExpenses(id: string, filter: string, expenses: Expenses, groups: Group[], dateKey: string, highlight: string) {

  const curMonthIndex = expenses.own.findIndex(month => month.date === dateKey);
  const expensesSummary = [];
  const expensesHistory: Expense[] = [];
  const subResult: SubResult = {};

  if (filter === "month") {

    for (let userId in expenses) {

      const monthExpenses = expenses[userId][curMonthIndex];

      if (!monthExpenses) {

        continue;

      } else {

        for (let expenseIndex = monthExpenses.entries.length - 1; expenseIndex >= 0; expenseIndex--) {

          const currentExpense = monthExpenses.entries[expenseIndex];

          if (!subResult[currentExpense.expenseGroup]) {
            subResult[currentExpense.expenseGroup] = currentExpense.expenseValue;
          } else {
            subResult[currentExpense.expenseGroup] += currentExpense.expenseValue;
          }

          expensesHistory.push({
            ...currentExpense,
            highlighted: highlight === currentExpense.id
          });
        }
      }
    }
  } else if (filter === "week") {

    const date = new Date();
    const daysToMonday = date.getDay();
    const dayInMilliseconds = 86400000;
    const finalDate = new Date(Date.now() - (dayInMilliseconds * (daysToMonday === 0 ? 0 : daysToMonday - 1)));
    const finalKey = finalDate.toLocaleDateString("en-US");

    for (let userId in expenses) {

      const monthExpenses = expenses[userId][curMonthIndex];

      if (!monthExpenses) {

        continue;

      } else {

        let monthIndex = expenses[userId].length - 1;
        let expenseIndex = expenses[userId][monthIndex].entries.length - 1;

        for (monthIndex; monthIndex >= 0; monthIndex--) {
          for (expenseIndex; expenseIndex >= 0; expenseIndex--) {

            const currentExpense = expenses[userId][monthIndex].entries[expenseIndex];
            const [curMonth, curDay, curYear] = currentExpense.createdOn.split("/").map(value => Number(value));
            const [finMonth, finDay, finYear] = finalKey.split("/").map(value => Number(value));
            console.log(curMonth, curDay, curYear)
            console.log(finMonth, finDay, finYear)

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

              expensesHistory.push({
                ...currentExpense,
                highlighted: highlight === currentExpense.id
              });
            }
          }
        }
      }
    }
  } else {

    const today = new Date();

    for (let userId in expenses) {

      const monthExpenses = expenses[userId][curMonthIndex];

      if (!monthExpenses) {

        continue;

      } else {

        for (let expenseIndex = monthExpenses.entries.length - 1; expenseIndex >= 0; expenseIndex--) {

          const currentExpense = monthExpenses.entries[expenseIndex];

          if (currentExpense.createdOn === today.toLocaleDateString("en-US")) {

            if (!subResult[currentExpense.expenseGroup]) {
              subResult[currentExpense.expenseGroup] = currentExpense.expenseValue;
            } else {
              subResult[currentExpense.expenseGroup] += currentExpense.expenseValue;
            }

            expensesHistory.push({
              ...currentExpense,
              highlighted: highlight === currentExpense.id
            });

          } else {
            break;
          }
        }
      }
    }
  };

  const sortedHistory = expensesHistory.sort((a, b) => {

    const aDay = Number(a.createdOn.split("/")[1]);
    const bDay = Number(b.createdOn.split("/")[1]);

    if (aDay > bDay) {

      return 1;

    } else if (aDay < bDay) {

      return -1;

    }

    return 0;
  });

  for (let group of groups) {
    expensesSummary.push({
      id: group.id,
      groupName: group.groupName,
      groupValue: subResult[group.groupName] ? subResult[group.groupName] : 0,
      earnings: group.earnings,
    })
  };

  return { expensesSummary, sortedHistory };
}