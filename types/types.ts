export type Group = {
  id: string,
  createdOn: string,
  groupName: string,
  groupColor: string,
  earnings: boolean,
  altName: string,
  altColor: string,
};

export type Expense = {
  id: string,
  createdOn: string,
  expenseGroup: string,
  expenseValue: number,
  toOmit?: boolean,
  highlighted?: boolean,
};

export type ExpensesMonth = {
  date: string,
  entries: Expense[],
};

export type Expenses = {
  [key: string]: ExpensesMonth[],
};

export type ArchivedItem = {
  groupName: string,
  groupValue: number,
  earnings: boolean,
};

export type ArchiveEntry = {
  date: string,
  totals: ArchivedItem[],
};

export type User = {
  profile: {
    id: string,
    name: string,
    createdOn: string,
    avatar: string,
    groups: Group[],
    lastUpdated: string,
  },
  expenses: Expenses,
  archive: ArchiveEntry[],
};