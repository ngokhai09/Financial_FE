import {User} from "./user";
import {MoneyType} from "./money-type";

export interface Wallet {
  id: number;
  name: string;
  icon: string;
  money: number;
  status: number ;
  moneyType: MoneyType;
  user: User;
}
