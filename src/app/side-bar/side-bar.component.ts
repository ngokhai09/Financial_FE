import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  image: any
  isLogin = false;
  idUser = localStorage.getItem('ID');
  idWallet = localStorage.getItem("ID_WALLET")
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.image = localStorage.getItem('AVATAR');

  }

  logout() {
    localStorage.clear();
    this.isLogin = false;
    this.router.navigate(['/']).then();
  }
}
