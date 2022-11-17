import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {User} from '../model/user';
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService,
              private router: Router,
              private toast: NgToastService) {
  }

  ngOnInit(): void {
  }

  register() {
    const user = this.setNewUser();
    if(this.registerForm.value.password === this.registerForm.value.confirmPassword) {
      this.userService.register(user).subscribe((data) => {
        console.log(data)
        this.toast.success({detail:"Thông báo", summary: "Đăng kí thành công!",duration: 3000,position:'br'})
        // this.router.navigate(['/']);
      }, err => {
        this.toast.success({detail:"Thông báo", summary: "Đăng kí thất bại!",duration: 3000,position:'br'})
        console.log(err);
      });
    }
  }

  private setNewUser() {
    // @ts-ignore
    const user: User = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };
    return user;
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword')
  }


}
