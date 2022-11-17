import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Category} from "../../model/category";
import {TransactionService} from "../../service/transaction.service";
import {CategoryService} from "../../service/category.service";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  transactionForm = new FormGroup({
    time: new FormControl(),
    total: new FormControl(),
    description: new FormControl(),
  })

  category: any;
  color: string = '#E9E612';
  nameCategory: string = 'Danh mục giao dich';
  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];
  transaction: any;

  constructor(private transactionService: TransactionService,
              private categoryService: CategoryService,
              private toast: NgToastService) {
  }

  ngOnInit(): void {
    this.showExpenseCategory();
    this.showIncomeCategory();
  }

  showExpenseCategory() {
    this.categoryService.findByStatus(2).subscribe((categories) => {
      this.expenseCategories = categories.data.data;
    }, e => {
      console.log(e);
    })
  }

  showIncomeCategory() {
    this.categoryService.findByStatus(1).subscribe((categories) => {
      this.incomeCategories = categories.data.data;
    }, e => {
      console.log(e);
    })
  }

  addTransaction() {
    this.transaction = {
      category_id: this.category.id,
      time: this.transactionForm.value.time,
      total: this.transactionForm.value.total,
      description: this.transactionForm.value.description,
      wallet_id: parseInt(localStorage.getItem('ID_WALLET') || "")
    }
    console.log(this.transaction);
    this.transactionService.save(this.transaction).subscribe(() => {
      this.toast.success({detail: "Thông báo", summary: "Thêm giao dịch thành công!", duration: 3000, position: 'br'})
      setInterval(() => {
        location.reload()
      }, 600)
    })
  }

  getCategory(id: number) {
    this.categoryService.findById(id).subscribe(category => {
      console.log(category.data)
      this.category = category.data;
      this.nameCategory = this.category.name;
      this.color = this.category.color;
    })
  }
}
