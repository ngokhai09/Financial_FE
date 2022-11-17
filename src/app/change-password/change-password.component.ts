import { Component, OnInit } from '@angular/core';
import {User} from "../model/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from '../service/authentication.service';
import {NgToastService} from "ng-angular-popup";
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  pass=localStorage.getItem('PASS')
  // @ts-ignore
  currentUser: User;
  // @ts-ignore
  sub: Subscription;
  // @ts-ignore
  currentUserToken: UserToken;
  newPasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    password: new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService,
              private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private authService: AuthenticationService,
              private toast: NgToastService) {
  }

  ngOnInit() {
  }


  changePassword() {
    const user = this.setNewUser();
    Swal.fire({
      title: '<h3 style="color: #575656">Bạn muốn thay đổi ?</h3>',
      text: 'Mật khẩu thay đổi sẽ được cập nhật !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng, thay đổi !',
      cancelButtonText:'Đóng '
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.newPasswordForm.value.oldPassword === localStorage.getItem('PASS')) {
          if (this.newPasswordForm.value.password === this.newPasswordForm.value.confirmPassword) {
            this.authService.currentUser.subscribe(
                (currentUser: { id: any; }) => {
                this.userService.changePass(currentUser.id, user).subscribe(() => {
                  this.toast.success({detail:"Thông báo", summary: "Đổi mật khẩu thành công!",duration: 3000,position:'br'});
                  localStorage.setItem('PASS', this.newPasswordForm.value.password);
                  this.newPasswordForm.reset();
                  Swal.fire(
                    '<h3 style="color: #575656">Đã thay đổi !</h3>',
                    'Mật khẩu đã được thay đổi',
                    'success'
                  )
                  this.router.navigate(['/home']);
                }, err => {
                  console.log(err)
                });
              }
            )
          }
          else {
            this.toast.warning({detail:"Thông báo", summary: "Mật khẩu không trùng!",duration: 3000,position:'br'})
          }
        }else {
          this.toast.warning({detail:"Thông báo", summary: "Mật khẩu cũ không đúng!",duration: 3000,position:'br'});
        };
      }
    })
  }

  private setNewUser() {
    // @ts-ignore
    const user: User = {
      password: this.newPasswordForm.value.password,
      confirmPassword: this.newPasswordForm.value.confirmPassword,
    };
    return user;
  }

  get password(){
   return  this.newPasswordForm.get('password')
  }
  get oldPassword(){
    return  this.newPasswordForm.get('oldPassword')
  }
  get confirmPassword(){
    return  this.newPasswordForm.get('confirmPassword')
  }


}
