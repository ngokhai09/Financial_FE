import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {FormControl, FormGroup} from "@angular/forms";
import {first} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {UserService} from "../service/user.service";
import {WalletService} from "../service/wallet.service";
import {Wallet} from "../model/wallet";
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {OauthService} from "../service/oauth.service";
import {TokenService} from "../service/token.service";
import {TokenDto} from "../model/token-dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  wallets: Wallet[] = [];
  // @ts-ignore
  socialUser: SocialUser;
  // @ts-ignore
  userLogged: SocialUser;
  // @ts-ignore
  isLogged : boolean
  GoogleLoginProvider = GoogleLoginProvider;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService,
              private oauthService: OauthService,
              private tokenService:TokenService,
              private toast: NgToastService,
              private userService: UserService,
              private walletService: WalletService,
              private readonly authService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.userLogged = user;
      this.isLogged = (this.userLogged != null);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      data => {
        console.log('sign in with facebook', data);
        this.socialUser = data;
        const tokenFace = new TokenDto(this.socialUser.authToken);
        this.oauthService.facebook(tokenFace).subscribe(
          res => {
            this.tokenService.setToken(res.value);
            this.isLogged = true;
            localStorage.setItem('USERNAME', data.name);
            this.userService.findByUsername(data.email).subscribe(data => {
              localStorage.setItem('ID', data.id);
              localStorage.setItem('AVATAR', data.avatar);
              this.toast.success({detail: "Thông báo", summary: "Đăng nhập thành công!", duration: 3000, position: 'br'});
              this.router.navigate(['/home']).then();
              this.walletService.findAll().subscribe(wallets => {
                this.wallets = wallets;
                if (this.wallets.length == 0) {
                  this.router.navigateByUrl('/create').then();
                } else if (this.wallets.length != 0) {
                  for (let i = 0; i < this.wallets.length; i++) {
                    if (this.wallets[i].status == 2) {
                      localStorage.setItem('ID_WALLET', String(this.wallets[i].id));
                    }
                  }
                  location.reload();
                }
              })
            })
          },
          err => {
            console.log(err);
          }
        );
      }
    ).catch(
      err => {
        console.log(err);
      }
    );
  }

  login() {
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).pipe(first()).subscribe(data => {
      localStorage.setItem('ROLE', data.data.roleName);
      localStorage.setItem('USERNAME', data.data.username);
      localStorage.setItem('PASS', this.loginForm.value.password);
      localStorage.setItem('ID', data.data.id);
      console.log(data.data, "USER")
      if (data.data.roleName == "USER") {
        this.userService.findById(localStorage.getItem('ID')).subscribe(data => {
          localStorage.setItem('AVATAR', data.data.avatar);
          this.toast.success({detail: "Thông báo", summary: "Đăng nhập thành công!", duration: 3000, position: 'br'});
          this.router.navigateByUrl('/home')
          this.walletService.findAll().subscribe(wallets => {
            this.wallets = wallets.data.data;
            console.log(this.wallets)
            if (this.wallets.length == 0) {
              this.router.navigateByUrl('/create').then();
            } else if (this.wallets.length != 0) {
              for (let i = 0; i < this.wallets.length; i++) {
                if (this.wallets[i].status == 2) {
                  localStorage.setItem('ID_WALLET', String(this.wallets[i].id));
                }
              }
              this.router.navigateByUrl('/home')
            }
          })
        })
      }
    }, error => {
      console.log(error)
      this.toast.error({detail: "Thông báo", summary: "Sai tài khoản hoặc mật khẩu!", duration: 3000, position: 'br'})
      this.router.navigate(['/']).then();
    })
  }
}
