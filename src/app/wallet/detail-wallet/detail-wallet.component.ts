import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import {WalletService} from "../../service/wallet.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail-wallet',
  templateUrl: './detail-wallet.component.html',
  styleUrls: ['./detail-wallet.component.css']
})
export class DetailWalletComponent implements OnInit {

  id: number = 0;
  wallet: any;
  walletDelete: any

  constructor(private walletService: WalletService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      // @ts-ignore
      this.id = +paramMap.get('id');
      this.getWallet(this.id);
    })
  }

  getWallet(id: number) {
    return this.walletService.findById(id).subscribe((wallet) => {
      this.wallet = wallet;
      console.log(this.wallet);
    })
  }

  alertOnOff() {
    Swal.fire(
      '<h3 style="color: #575656">Tắt hoạt động ví ?</h3>',
      'Bạn vui lòng bật hoạt động ví khác để tắt ví này !!!',
      'question'
    )
  }

  confirmDelete() {
    Swal.fire({
      title: '<h3 style="color: #575656">Bạn muốn xóa ?</h3>',
      text: 'Khi xóa ví của bạn sẽ không còn trong danh sách !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng, xóa ngay !',
      cancelButtonText:'Đóng '
    }).then((result) => {
      if (result.isConfirmed) {
        this.walletDelete = {
          name: this.wallet.name,
          moneyType: {
            id: this.wallet.moneyType.id,
          },
          icon: this.wallet.icon,
          moneyAmount: this.wallet.moneyAmount,
          status: this.wallet.status,
          user: {
            id: localStorage.getItem('ID')
          }
        }
        console.log(this.walletDelete);
        this.walletService.delete(this.wallet.id, this.walletDelete).subscribe(() => {
          Swal.fire(
            '<h3 style="color: #575656">Đã xóa !</h3>',
            'Ví này đã bị xóa khỏi danh sách',
            'success'
          )
          this.router.navigate(['/wallet/1']).then(() => {
            location.reload()
          })
        })

      }
    })

  }
}