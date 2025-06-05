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
  highlighted?: boolean,
};

export type ExpensesMonth = {
  date: string,
  entries: Expense[],
};

export type Expenses = {
  own: ExpensesMonth[],
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

export type Contact = {
  id: string,
  name: string,
}

export type User = {
  profile: {
    id: string,
    name: string,
    createdOn: string,
    avatar: string,
    groups: Group[],
    contacts: Contact[],
    ver: string,
  },
  expenses: Expenses,
  archive: ArchiveEntry[],
};