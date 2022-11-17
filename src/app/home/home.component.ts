import {Component, Input, OnInit} from '@angular/core';
import {Options} from "@angular-slider/ngx-slider";
import {TransactionService} from "../service/transaction.service";
import {Transaction} from "../model/transaction";
import {Chart, registerables} from "chart.js";
import {ExportService} from "../service/export.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {PageEvent} from "@angular/material/paginator";
import {WalletService} from "../service/wallet.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Category} from "../model/category";
import {CategoryService} from "../service/category.service";

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isOpen: boolean = true;
  transactions: Transaction[] = [];
  idWallet: any;

  constructor(private transactionService: TransactionService,
              private categoryService: CategoryService,
              private exportService: ExportService,
              private walletService: WalletService,
              private router: Router,
              private toast: NgToastService) {
    this.idWallet = localStorage.getItem("ID_WALLET");
  }

  ngOnInit(): void {
    setTimeout(() => {
      // @ts-ignore
      document.getElementById("defaultOpen").click();
      this.chart2();

    }, 800)
    this.findMaxMin();
    this.showTransaction();
    this.getData6Month();
    this.getData6MonthExpense()
    this.getNameCate();
    this.chart();
    this.chart3();
    this.showExpenseCategoryUpdate();
    this.showIncomeCategoryUpdate();
  }

  isOpenHtml(id: any) {
    // @ts-ignore
    if (document.getElementById('' + id).hidden) {
      // @ts-ignore
      document.getElementById('' + id).hidden = false;
    } else {
      // @ts-ignore
      document.getElementById('' + id).hidden = true;
    }
  }

  showTransaction() {
    this.transactionService.findAll().subscribe((transactions) => {
      this.transactions = transactions.data;
      this.transactionFile = [];
      this.transactionList();
    })
  }

  // biểu đồ chi
  transactionsSpent: any[] = [];
  labelsSpent: any[] = ['Trống'];
  colorSpent: any[] = ['#d0e1ef'];
  totalRevenueSpent = 0;
  percentMoneySpent: any[] = [100];
  checkIdSpent: any[] = [];
  total: any[] = [];

  getDataSpent() {
    let pm = 0;
    this.transactionService.findAllByMonth(2).subscribe((transactions) => {
      this.transactionsSpent = transactions.data;
      if (this.transactionsSpent.length != 0) {
        this.labelsSpent.pop();
        this.colorSpent.shift();
        this.percentMoneySpent.pop();
        for (let i = 0; i < this.transactionsSpent.length; i++) {
          if (!this.checkIdSpent.includes(this.transactionsSpent[i].category_id)) {
            this.labelsSpent.push(this.transactionsSpent[i].categoryName);
            this.colorSpent.push(this.transactionsSpent[i].categoryColor);
            this.checkIdSpent.push(this.transactionsSpent[i].category_id);
            this.total.push(this.transactionsSpent[i].total);
          } else {
            for (let j = 0; j < this.checkIdSpent.length; j++) {
              if (this.checkIdSpent[j] == this.transactionsSpent[i].category_id) {
                this.total[j] += this.transactionsSpent[i].total;
              }
            }
          }
          this.totalRevenueSpent += this.transactionsSpent[i].total;
        }
        for (let i = 0; i < this.total.length; i++) {
          pm = (this.total[i] / this.totalRevenueSpent) * 100;
          this.percentMoneySpent.push(pm);
        }
      }
    });
  }

  chart3() {
    this.getDataSpent();
    const ctx = document.getElementById('myChart3');
    // @ts-ignore
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labelsSpent,
        datasets: [{
          label: 'My First Dataset',
          data: this.percentMoneySpent,
          backgroundColor: this.colorSpent,
          hoverOffset: 4
        }]
      },
    });
  }


  //biểu đồ thu
  transactionsCollect: any[] = [];
  labelsCollect: any[] = ['Trống'];
  colorCollect: any[] = ['#d0e1ef'];
  totalRevenueCollect = 0;
  percentMoney: any[] = [100];
  checkIdCollect: any[] = [];
  totalCollect: any[] = [];


  getDataCollect() {
    let pm = 0;
    this.transactionService.findAllByMonth(1).subscribe((transactions) => {
      this.transactionsCollect = transactions.data;
      if (this.transactionsCollect.length != 0) {
        this.labelsCollect.pop();
        this.colorCollect.pop();
        this.percentMoney.pop();
        for (let i = 0; i < this.transactionsCollect.length; i++) {
          if (!this.checkIdCollect.includes(this.transactionsCollect[i].category_id)) {
            this.labelsCollect.push(this.transactionsCollect[i].categoryName);
            this.colorCollect.push(this.transactionsCollect[i].categoryColor);
            this.checkIdCollect.push(this.transactionsCollect[i].category_id);
            this.totalCollect.push(this.transactionsCollect[i].total);
          } else {
            for (let j = 0; j < this.checkIdCollect.length; j++) {
              if (this.checkIdCollect[j] == this.transactionsCollect[i].category.id) {
                this.totalCollect[j] += this.transactionsCollect[i].total;
              }
            }
          }
          this.totalRevenueCollect += this.transactionsCollect[i].total;
        }
        for (let i = 0; i < this.totalCollect.length; i++) {
          pm = (this.totalCollect[i] / this.totalRevenueCollect) * 100;
          this.percentMoney.push(pm);
        }
      }
    });
  }

  chart() {
    this.getDataCollect();
    const ctx = document.getElementById('myChart');
    // @ts-ignore
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labelsCollect,
        datasets: [{
          label: 'My First Dataset',
          data: this.percentMoney,
          backgroundColor: this.colorCollect,
          hoverOffset: 4
        }]
      },
    });
  }


  //biểu đồ 6 tháng gần nhất
  transactionsIncomeMonth: any[] = [];
  totalIncome: any[] = [];
  lab: any[] = [];

  getData6Month() {
    let today = new Date();
    this.transactionService.findAllTransactionsIncomeFor6Months().subscribe((transaction) => {
      for(let i = 5; i >= 0; i--){
        this.pushTotalIncome(transaction.data[today.getFullYear() + '-' + ((today.getMonth() - i + 1) >= 10 ?(today.getMonth() - i + 1): '0' + (today.getMonth() - i + 1))  + '']);
      }
      // this.pushTotalIncome(transaction.data[today.getMonth() - 3 + '']);
      // this.pushTotalIncome(transaction.data[today.getMonth() - 2 + '']);
      // this.pushTotalIncome(transaction.data[today.getMonth() - 1 + '']);
      // this.pushTotalIncome(transaction.data[today.getMonth() + '']);
      // this.pushTotalIncome(transaction.data[today.getMonth() + 1 + '']);
    })

  }

  pushTotalIncome(transactions: any) {
    this.transactionsIncomeMonth = transactions;
    let total = 0;
    if (this.transactionsIncomeMonth.length == 0) {
      this.totalIncome.push(0);
    } else if (this.transactionsIncomeMonth.length != 0) {
      for (let i = 0; i < this.transactionsIncomeMonth.length; i++) {
        if (this.transactionsIncomeMonth[i].status == 1) {
          total += this.transactionsIncomeMonth[i].total;
        }
      }
      this.totalIncome.push(total);
    }
  }

  transactionsExpenseMonth: any[] = [];
  totalExpense: any[] = [];

  getData6MonthExpense() {
    let today = new Date();
    this.transactionService.findAllTransactionsExpenseFor6Months().subscribe((transaction) => {
      for(let i = 5; i >= 0; i--){
        this.pushTotalExpense(transaction.data[today.getFullYear() + '-' + ((today.getMonth() - i + 1) >= 10 ?(today.getMonth() - i + 1): '0' + (today.getMonth() - i + 1))  + '']);
      }

      this.lab.push('Tháng ' + (today.getMonth() - 4) + '', 'Tháng ' + (today.getMonth() - 3) + '', 'Tháng ' + (today.getMonth() - 2) + '', 'Tháng ' + (today.getMonth() - 1) + '', 'Tháng ' + today.getMonth() + '', 'Tháng ' + (today.getMonth() + 1) + '')
    })
  }

  pushTotalExpense(transactions: any) {
    this.transactionsExpenseMonth = transactions;
    let total = 0;
    if (this.transactionsExpenseMonth.length == 0) {
      this.totalExpense.push(0);
    } else if (this.transactionsExpenseMonth.length != 0) {
      for (let i = 0; i < this.transactionsExpenseMonth.length; i++) {
        if (this.transactionsExpenseMonth[i].status == 2) {
          total += this.transactionsExpenseMonth[i].total;
        }
      }
      this.totalExpense.push(total);
    }
  }

  chart2() {
    const ctx2 = document.getElementById('myChart2');
    // @ts-ignore
    const myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: this.lab,
          datasets: [{
            label: 'Thu',
            data: this.totalIncome,
            backgroundColor: 'rgb(114,231,217)',
            borderColor: 'rgb(108,231,202)',
            borderWidth: 1
          },
            {
              label: 'Chi',
              data: this.totalExpense,
              backgroundColor: 'rgb(217,122,136)',
              borderColor: 'rgb(225,117,140)',
              borderWidth: 1
            }
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }


  // exportFile
  transactionFile: any[] = [];
  categoryStatus: any;
  totalFile: any;

  transactionList() {
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].categoryStatus == '1') {
        this.categoryStatus = 'Thu';
      } else if (this.transactions[i].categoryStatus == '2') {
        this.categoryStatus = 'Chi';
      }
      this.transactionFile.push({
        'Số thứ tự': `${i + 1}`,
        'Danh mục chi tiêu': `${this.categoryStatus}`,
        'Tên danh mục chi tiêu': `${this.transactions[i].categoryName}`,
        'Tổng tiền': `${this.transactions[i].total + ' ' + this.transactions[i].MoneyTypeName}`,
        'Thời gian': `${this.transactions[i].time}`,
        'Ghi chú': `${this.transactions[i].description}`
      })
    }
  }

  export() {
    let timerInterval: any;
    Swal.fire({
      title: '<h3 style="color: #5ec05e"><img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw340" style="width: 100px;height: 100px"><\h3>',
      html: 'Các giao dịch tải trong <b></b> mili giây',
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        // @ts-ignore
        const b = Swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          // @ts-ignore
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval);
        this.exportService.exportExcel(this.transactionFile, 'danh_sach_giao_dich');
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    })
  }

  confirmDelete(id: number) {
      let timerInterval: any;
      Swal.fire({
        title: '<h3 style="color: #5ec05e"><img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw340" style="width: 100px;height: 100px"><\h3>',
        html: 'Giao dịch sẽ được xóa trong <b></b> mili giây',
        timer: 2850,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          // @ts-ignore
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            // @ts-ignore
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        this.transactionService.delete(id).subscribe(() => {
          this.toast.success({detail:"Thông báo", summary: "Xóa giao dich thành công!",duration: 3000,position:'br'})
          setInterval(() => {
            location.reload()
          }, 600)
        })
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
      })
  }

  //ranger
  value: number = 0;
  highValue: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1,
  };
  max = 1000;
  min = 0;
  nameCate: any;
  formSearch = new FormGroup({
    startTime: new FormControl(),
    endTime: new FormControl(),
    status: new FormControl("1")
  })

  getNameCate() {
    this.walletService.findById(this.idWallet).subscribe((wallet) => {
      this.nameCate = wallet.data.data[0].moneyTypeName;
    })
  }

  searchWallet() {
    if (this.formSearch.value.startTime == null) {
      this.formSearch.value.startTime = "";
    }
    if (this.formSearch.value.endTime == null) {
      this.formSearch.value.endTime = "";
    }
    this.transactionService.findAllTransactions(String(this.formSearch.value.startTime), String(this.formSearch.value.endTime), Number(this.formSearch.value.status), this.value, this.highValue).subscribe((transactions) => {
      this.transactions = transactions.data;
      this.transactionFile = [];
      this.transactionList();
    }, error => {
    })
  }

  resetForm() {
    this.value = this.min;
    this.highValue = this.max;
    this.options = {
      floor: this.min,
      ceil: this.max,
    };
    this.formSearch = new FormGroup({
      startTime: new FormControl(),
      endTime: new FormControl(),
      status: new FormControl("1")
    })
    this.showTransaction()
  }

  findMaxMin() {
    this.transactionService.findAll().subscribe((transactions) => {
      this.max = transactions.data[0].total;
      this.min = transactions.data[0].total;
      for (let i = 0; i < transactions.data.length; i++) {
        if (transactions.data[i].total < this.min) {
          this.min = transactions.data[i].total;
        }
        if (transactions.data[i].total > this.max) {
          this.max = transactions.data[i].total;
        }
      }
      this.value = this.min;
      this.highValue = this.max;
      this.options = {
        floor: this.min,
        ceil: this.max,
      };
    })
  }

  //Edit Transaction
  updateTransactionForm = new FormGroup({
    time: new FormControl(),
    total: new FormControl(),
    description: new FormControl(),
  })
  transaction: any;
  transactionUpdate: any;
  category: any;
  color: string = '#E9E612';
  idCategory: any;
  nameCategory: string = 'Danh mục giao dich';
  expenseCategoriesUpdate: Category[] = [];
  incomeCategoriesUpdate: Category[] = [];

  showExpenseCategoryUpdate() {
    this.categoryService.findByStatus(2).subscribe((categories) => {
      this.expenseCategoriesUpdate = categories.data.data;
    }, e => {
      console.log(e);
    })
  }

  showIncomeCategoryUpdate() {
    this.categoryService.findByStatus(1).subscribe((categories) => {
      this.incomeCategoriesUpdate = categories.data.data;
    }, e => {
      console.log(e);
    })
  }

  getTransaction(idEdit: any) {
    this.transactionService.findById(idEdit).subscribe(transaction => {
      this.transaction = transaction.data[0];
      this.nameCategory = transaction.data[0].categoryName;
      this.color = transaction.data[0].categoryColor;
      this.idCategory = transaction.data[0].category_id;
      this.updateTransactionForm = new FormGroup({
        time: new FormControl(transaction.data[0].time),
        total: new FormControl(transaction.data[0].total),
        description: new FormControl(transaction.data[0].description),
      })
    })
  }

  getCategory(id: number) {
    this.categoryService.findById(id).subscribe(category => {
      this.category = category.data;
      this.nameCategory = this.category.name;
      this.color = this.category.color;
      this.idCategory = this.category.id;
    })
  }

  updateTransaction() {
    this.transactionUpdate = {
      category_id: this.idCategory,
      time: this.updateTransactionForm.value.time,
      total: this.updateTransactionForm.value.total,
      description: this.updateTransactionForm.value.description,
      wallet_id: localStorage.getItem('ID_WALLET')
    }
    this.transactionService.update(this.transaction.id, this.transactionUpdate).subscribe((data) => {
      this.toast.success({detail: "Thông Báo", summary: "Sửa giao dịch thành công", duration: 3000, position: "br"});
      setInterval(() => {
        location.reload()
      }, 400)
    }, e => {
      console.log(e)
      this.toast.error({detail: "Thông Báo", summary: "Sửa giao dịch thất bại", duration: 3000, position: "br"});
    })
  }

  //Paging
  p: number = 1;
  totalSpend: number = 0;

  pageChangeEvent(event: number) {
    this.p = event;
  }

}
