import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {WalletService} from "../../service/wallet.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.css']
})
export class AddWalletComponent implements OnInit {

  walletForm = new FormGroup({
    name: new FormControl(),
    moneyType: new FormControl(),
  });
  icon: any;
  wallet: any;

  constructor(private walletService: WalletService,
              private router: Router,
              private toast : NgToastService) { }

  ngOnInit(): void {
    this.icon = "https://static.moneylover.me/img/icon/icon_32.png"
  }

  changeIcon(event: any) {
    this.icon = event.target.src;
  }

  @Output()
  onNewWallet = new EventEmitter<any>()

  addWallet() {
    this.wallet = {
      name: this.walletForm.value.name,
      money_type_id: parseInt(this.walletForm.value.moneyType),
      icon: this.icon,
      money: 0,
      status: 1,
      user_id: parseInt(localStorage.getItem('ID') || "")
    }
    console.log(this.wallet)
    this.walletService.save(this.wallet).subscribe((data) => {
      console.log(data)
      this.onNewWallet.emit(data)
      this.toast.success({detail:"Thông báo", summary: "Thêm ví thành công!",duration: 3000,position:'br'})
      this.router.navigate(['/wallet' + localStorage.getItem('ID_WALLET')]).then();
    }, error => {
      console.log(error)
      this.toast.error({detail:"Thông báo", summary: "Thêm ví thất bại!",duration: 3000,position:'br'})
    })
  }
}
