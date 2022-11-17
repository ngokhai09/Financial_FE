import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../service/user.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | any;
  id: any;
  title = "cloudsSorage";
  image: any
  downloadURL: any;

  updateForm = new FormGroup({
    email: new FormControl(),
    username: new FormControl(),
    address: new FormControl(),
    age: new FormControl(),
    sex: new FormControl(),
  })

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private storage: AngularFireStorage,
              private toast : NgToastService) {
  }

  ngOnInit(): void {
    this.findById();
  }

  findById() {
    this.userService.findById(localStorage.getItem('ID')).subscribe(data => {
      console.log(data.data)
      this.updateForm.patchValue({
        email: data.data.email,
        username: data.data.username,
        address: data.data.address,
        age: data.data.age,
        sex: data.data.sex + "",
      })
      this.image = data.data.avatar;
    }, error => {
      console.log(error)
    })
  }

  update() {
    this.user = {
      email: this.updateForm.value.email,
      username: this.updateForm.value.username,
      address: this.updateForm.value.address,
      age: this.updateForm.value.age,
      sex: this.updateForm.value.sex,
      avatar: this.image,
    }
    this.userService.updateUserProfile(localStorage.getItem('ID'), this.user).subscribe(() => {
      this.toast.success({detail:"Thông báo", summary: "Cập nhật trang cá nhân thành công!",duration: 3000,position:'br'})
      localStorage.setItem('USERNAME', this.user.username);
      localStorage.setItem('AVATAR', this.user.avatar);
      this.router.navigateByUrl("/profile")
    }, error => {
      console.log(error)
    })
  }

  onFileSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url: any) => {
            if (url) {
              this.image = url;
            }
            console.log("img",this.image);
          });
        })
      )
      .subscribe((url: any) => {
        if (url) {
          console.log(url);
        }
      });
  }
}
