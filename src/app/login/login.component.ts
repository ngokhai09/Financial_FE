import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {FormControl, FormGroup} from "@angular/forms";
import {first} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })

  constructor(private activatedRoute : ActivatedRoute, private router : Router,
              private authenticationService : AuthenticationService,
              private toast : NgToastService,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  login() {
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).pipe(first()).subscribe(data => {
      localStorage.setItem('ACCESS_TOKEN', data.accessToken);
      localStorage.setItem('ROLE', data.roles[0].authority);
      localStorage.setItem('USERNAME', data.username);
      localStorage.setItem('PASS', this.loginForm.value.password);
      localStorage.setItem('ID', data.id);
      if (data.roles[0].authority == "ROLE_USER") {
        this.userService.findById(localStorage.getItem('ID')).subscribe( data=>{
          localStorage.setItem('AVATAR', data.avatar);
          this.toast.success({detail:"Thông báo", summary: "Đăng nhập thành công!",duration: 3000,position:'toast-bottom-right'})
          this.router.navigateByUrl('/home');
        })
      }
    }, error => {
      this.toast.error({detail:"Thông báo", summary: "Sai tài khoản hoặc mật khẩu!",duration: 3000,position:'toast-bottom-right'})
      this.router.navigate(['/']);
    })
  }
}
