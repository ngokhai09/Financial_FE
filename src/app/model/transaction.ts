import {Category} from "./category";
import {Wallet} from "./wallet";

export interface Transaction {
  id: number;
  wallet: Wallet;
  categoryName: string;
  categoryColor: string;
  categoryStatus: string;
  MoneyTypeName: string;
  total: number;
  time: string;
  description: string;
}
