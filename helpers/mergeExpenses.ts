import type { ExpensesEntry, Expense } from "@/types/types";

export function extractDay(date: string) {
  if (date.split("/").length === 3) {
    return Number(date.split("/")[1]);
  } else {
    return Number(date.split(".")[0]);
  }
};

export function sortByDay(array: Expense[]) {

  return array.sort((a, b) => {

    const aToCompare = extractDay(a.createdOn);
    const bToCompare = extractDay(b.createdOn);

    if (aToCompare < bToCompare) {
      return -1;
    } else {
      return 1;
    }
  });
};

export function sortByMonth(array: ExpensesEntry[]) {

  return array.sort((a, b) => {

    const [ aMonth, aYear ] = a.date.split("/").map(value => Number(value));
    const [ bMonth, bYear ] = b.date.split("/").map(value => Number(value));

    if (aYear < bYear) {
      return -1;
    } else if (aYear > bYear) {
      return 1;
    } else if (aMonth < bMonth) {
      return -1;
    } else {
      return 1;
    }

  });
};

export function mergeUniquesOnly(
  initialMonth: Expense[],
  importedMonth: Expense[],
) {

  const unsortedExpenses = Array.from([...initialMonth, ...importedMonth]);
  const sortedExpenses = sortByDay(unsortedExpenses);

  return sortedExpenses;
};

export function mergeConflictMonth(
  initialMonth: Expense[],
  importedMonth: Expense[],
) {

  const preupdatedValues : Expense[] = [];

  const withLessEntries = initialMonth.length <= importedMonth.length ? importedMonth : initialMonth;
  const withMoreEntries = initialMonth.length >= importedMonth.length ? initialMonth : importedMonth;

  let curDayIndex = 0;

  for (curDayIndex; curDayIndex < withLessEntries.length; curDayIndex ++) {

    if (withMoreEntries[curDayIndex].id === withLessEntries[curDayIndex].id) {
      preupdatedValues.push(withMoreEntries[curDayIndex]);
    } else {
      break;
    }
  };
  
  const uniqueExpenses = Array.from([...withMoreEntries.slice(curDayIndex), ...withLessEntries.slice(curDayIndex)]);
  const sortedUniques = sortByDay(uniqueExpenses);

  return [...preupdatedValues, ...sortedUniques];
};

export function mergeExpenses (initialExpenses: ExpensesEntry[], importedExpenses: ExpensesEntry[], lastUpdated: string) {

  const mergedExpenses : ExpensesEntry[] = [];

  const luMonth = lastUpdated.replace(/\/\d{1,}\//, "/");
  const withLessEntries = initialExpenses.length <= importedExpenses.length ? importedExpenses : initialExpenses;
  const withMoreEntries = initialExpenses.length >= importedExpenses.length ? initialExpenses : importedExpenses;

  let monthCounter = 0;

  if (initialExpenses.length === 1 && initialExpenses[0].entries.length === 0) {

    return importedExpenses;
  }

  for (monthCounter; monthCounter < withMoreEntries.length; monthCounter ++) {

    const aToMerge = withMoreEntries[monthCounter];
    const bToMerge = withLessEntries[monthCounter];

    if (bToMerge.date === aToMerge.date &&
      (Number(bToMerge.date[0]) < Number(luMonth[0]) || Number(bToMerge.date[1]) < Number(luMonth[1]))
    ) {
      //they are identical
      mergedExpenses.push(aToMerge);

    } else if (bToMerge.date === aToMerge.date && bToMerge.date === luMonth) {

      //they have both unique and identical values
      const conflictMonth: ExpensesEntry = {
        date: aToMerge.date,
        entries: mergeConflictMonth(aToMerge.entries, bToMerge.entries)
      };

      mergedExpenses.push(conflictMonth);

    } else if (
      bToMerge.date === aToMerge.date &&
      (Number(bToMerge.date[0]) > Number(luMonth[0]) || Number(bToMerge.date[1]) > Number(luMonth[1]))
    ) {

      //their values are unique
      const uniquesMonth: ExpensesEntry = {
        date: aToMerge.date,
        entries: mergeUniquesOnly(aToMerge.entries, bToMerge.entries)
      };

      mergedExpenses.push(uniquesMonth);
    } else {

      //month dates are not equal or one of them is undefined
      if (!aToMerge || !bToMerge) {

        mergedExpenses.push(Boolean(aToMerge) ? aToMerge : bToMerge);

      } else {

        const unmatchedMonths = Array.from([...withMoreEntries.slice(monthCounter), ...withLessEntries.slice(monthCounter)]);
        const sortedUnmatched = sortByMonth(unmatchedMonths);

        return [...mergedExpenses, ...sortedUnmatched];
      }
    }
  }

  return mergedExpenses;
};