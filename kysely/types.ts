import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
    id: Generated<number>;
    userId: string;
    totalBalance: Generated<string>;
    giftTokens: Generated<string>;
    rechargeTokens: Generated<string>;
    earnedTokens: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    grade: Generated<string>;
};
export type GiftRecord = {
    id: Generated<number>;
    accountId: number;
    amount: string;
    createdAt: Generated<Timestamp>;
    type: string;
};
export type RechargeRecord = {
    id: Generated<number>;
    accountId: number;
    amount: string;
    createdAt: Generated<Timestamp>;
    orderNumber: string;
    source: string;
    status: Generated<string>;
};
export type TransactionRecord = {
    id: Generated<number>;
    accountId: number;
    amount: string;
    createdAt: Generated<Timestamp>;
    type: string;
};
export type User = {
    id: Generated<string>;
    name: string | null;
    phone: string | null;
    email: string | null;
    picture: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    attributes: unknown | null;
};
export type DB = {
    Account: Account;
    GiftRecord: GiftRecord;
    RechargeRecord: RechargeRecord;
    TransactionRecord: TransactionRecord;
    User: User;
};
