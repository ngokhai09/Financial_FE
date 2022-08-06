import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomePageComponent} from './user/home-page/home-page.component';
import {ListProductComponent} from './user/list-product/list-product.component';
import {JwtInterceptor} from "./helper/jwt-interceptor";
import {ErrorInterceptor} from "./helper/error-interceptor";
import { SideBarComponent } from './side-bar/side-bar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {NgToastModule} from "ng-angular-popup";
import { ShowWalletComponent } from './wallet/show-wallet/show-wallet.component';
import { AddWalletComponent } from './wallet/add-wallet/add-wallet.component';
import { ShowCategoryComponent } from './category/show-category/show-category.component';
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { DetailWalletComponent } from './wallet/detail-wallet/detail-wallet.component';
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import { EditTransactionComponent } from './home/edit-transaction/edit-transaction.component';
import { AddTransactionComponent } from './home/add-transaction/add-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    HomePageComponent,
    ListProductComponent,
    SideBarComponent,
    NavBarComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ShowWalletComponent,
    AddWalletComponent,
    ShowCategoryComponent,
    AddCategoryComponent,
    DetailWalletComponent,
    EditTransactionComponent,
    AddTransactionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgToastModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud"),
    NgxSliderModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor, multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
