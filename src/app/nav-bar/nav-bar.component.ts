import { Component, OnInit } from '@angular/core';
import {WalletService} from "../service/wallet.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  image: any;
  wallet: any;
  constructor(private walletService: WalletService) { }

  ngOnInit(): void {
    this.image = localStorage.getItem('AVATAR');
    this.findWallet();
  }

  findWallet() {
    // @ts-ignore
    this.walletService.findById(localStorage.getItem('ID_WALLET')).subscribe((wallet) => {
      this.wallet = wallet.data.data[0];
    })
  }

}
