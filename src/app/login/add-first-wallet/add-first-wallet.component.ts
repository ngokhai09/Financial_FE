import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {WalletService} from "../../service/wallet.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-add-first-wallet',
  templateUrl: './add-first-wallet.component.html',
  styleUrls: ['./add-first-wallet.component.css']
})
export class AddFirstWalletComponent implements OnInit {

  firstWalletForm = new FormGroup({
    name: new FormControl(),
    moneyType: new FormControl(),
  });
  icon: any;
  firstWallet: any;
  wallets: any;

  constructor(private walletService: WalletService,
              private router: Router,
              private toast : NgToastService) { }

  ngOnInit(): void {
    this.icon = "https://static.moneylover.me/img/icon/icon_32.png"
    // @ts-ignore
    document.getElementById('showModal').click();
  }

  changeIcon(event: any) {
    this.icon = event.target.src;
  }

  addFirstWallet() {
    this.firstWallet = {
      name: this.firstWalletForm.value.name,
      money_type_id: parseInt(this.firstWalletForm.value.moneyType),
      icon: this.icon,
      money: 0,
      status: 2,
      user_id: parseInt(localStorage.getItem('ID') || "")
    }
    console.log(this.firstWallet)
    this.walletService.save(this.firstWallet).subscribe((data) => {
      this.toast.success({detail:"Thông báo", summary: "Thêm ví thành công!",duration: 3000,position:'br'})
      this.walletService.findAll().subscribe(wallets => {
        this.wallets = wallets.data.data;
        if (this.wallets.length != 0) {
          for (let i = 0; i < this.wallets.length; i++) {
            if (this.wallets[i].status == 2) {
              localStorage.setItem('ID_WALLET', String(this.wallets[i].id));
            }
          }
          location.reload();
        }
      })
      this.router.navigate(['/home']).then();
    }, error => {
      this.toast.error({detail:"Thông báo", summary: "Thêm ví thất bại!",duration: 3000,position:'br'})
    })
  }

}
