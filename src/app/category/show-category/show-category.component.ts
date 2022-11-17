import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {Category} from "../../model/category";
import {CategoryService} from "../../service/category.service";
import {NgToastService} from "ng-angular-popup";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from '@angular/router';
import {TransactionService} from "../../service/transaction.service";
import {Transaction} from "../../model/transaction";


@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.css']
})
export class ShowCategoryComponent implements OnInit {

  updateCategoryForm = new FormGroup({
    name: new FormControl(),
    status: new FormControl(),
    description: new FormControl(),
    color: new FormControl(),
  })
  categories: Category[] = [];
  transactions: Transaction[] = [];
  category: any;
  categoryUpdate: any;

  constructor(private categoryService: CategoryService,
              private transactionService: TransactionService,
              private router: Router,
              private toast: NgToastService) {
  }

  ngOnInit(): void {
    this.showCategory();
  }

  findAllTransaction(id: number) {
    this.transactionService.findAllTransactionsByCategoryID(id).subscribe(transactions => {
      this.transactions = transactions.data;
      this.confirmDelete(id);
    })
  }

  getCategory(id: number) {
    this.categoryService.findById(id).subscribe(category => {
      this.category = category.data;
      console.log(category.data)
      this.updateCategoryForm = new FormGroup({
        name: new FormControl(category.data.name),
        status: new FormControl(category.data.status + ""),
        description: new FormControl(category.data.description),
        color: new FormControl(category.data.color),
      })
    })
  }

  confirmDelete(id: number) {
    if (this.transactions.length < 1 || typeof this.transactions.length == 'undefined') {
      let timerInterval: any;
      Swal.fire({
        title: '<h3 style="color: #5ec05e"><img src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw340" style="width: 100px;height: 100px"><\h3>',
        html: 'Danh mục sẽ được xóa trong <b></b> mili giây',
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
        this.categoryService.delete(id).subscribe(() => {
          this.toast.success({
            detail: "Thông báo",
            summary: "Xóa giao dich thành công!",
            duration: 3000,
            position: 'br'
          })
          this.showCategory();
        })
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
      })
    }
    else {
      Swal.fire({
        title: '<h3 style="color: #575656">Bạn muốn xóa danh mục ?</h3>',
        text: 'Danh mục này hiện đang có giao dịch nên không thể xóa !',
        icon: 'warning',
        confirmButtonText: 'Xác nhận',
      })
    }
  }

  showCategory() {
    this.categoryService.findAll().subscribe(categories => {
      this.categories = categories.data.data;
    })
  }

  updateCategory() {
    this.categoryUpdate = {
      name: this.updateCategoryForm.value.name,
      status: this.updateCategoryForm.value.status,
      description: this.updateCategoryForm.value.description,
      color: this.updateCategoryForm.value.color,
      user_id: parseInt(localStorage.getItem('ID') || "")
    }
    console.log(this.category);
    this.categoryService.update(this.category.id, this.categoryUpdate).subscribe(() => {
      this.toast.success({detail: "Thông Báo", summary: "Sửa danh mục thành công", duration: 3000, position: "br"})
      this.router.navigate(['/category/']).then(() => {
        this.showCategory()
      })
    }, e => {
      this.toast.error({detail: "Thông Báo", summary: "Sửa danh mục thất bại", duration: 3000, position: "br"})
      console.log(e);
    });
  }

  pushNewCategory($event: any) {
    this.categories.push($event);
  }

  p: number = 1;
  total: number = 0;

  pageChangeEvent(event: number) {
    this.p = event;
  }
}

