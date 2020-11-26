import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EuPopupService } from 'eu-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-result-tryout-user',
  templateUrl: './result-tryout-user.component.html',
  styleUrls: ['./result-tryout-user.component.css']
})
export class ResultTryoutUserComponent implements OnInit {

  id_user: string
  id_tryout: string
  siswa_waktu: string
  nilaitryout = []
  nilai: number = 0
  benar: number = 0
  salah: number = 0
  kosong: number = 0
  

  constructor(private popup: EuPopupService, private router: Router, private spinner: NgxSpinnerService, private userService: UserService, private store: StorageService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id_tryout = this.activateRoute.snapshot.params['id']
    this.id_user = this.store.getBio()
    this.scoring()
    this.listnilaitryout()
  }

  segarkan(){
    this.listnilaitryout()
  }

  scoring() {
    let jawaban = JSON.parse(localStorage.getItem('0128a3dda9f6fb74c24bbb3031dc272b'))
    let answer = ""
    if (jawaban) {
      let sisa_waktu = localStorage.getItem('041fbd4713f43b21ee69cd368aff7dd9')

      jawaban.forEach(e => {
        answer += e.id + "-" + e.piljaw + ","
      })

      let formdata = new FormData()
      formdata.append('user_id', this.id_user)
      formdata.append('tryout_id', this.id_tryout)
      formdata.append('answer', answer)
      sisa_waktu && formdata.append('sisa_waktu', sisa_waktu)
      this.userService.nilaitryout(formdata).subscribe(val => {
        if (val.status == 201) {
          this.store.deleteItem('041fbd4713f43b21ee69cd368aff7dd9')
          this.store.deleteItem('0128a3dda9f6fb74c24bbb3031dc272b')
          this.getNilai()
        }
      })
    }else{
      this.getNilai()
    }

  }

  getNilai(){
    let formdata = new FormData()
      formdata.append('user_id', this.id_user)
      formdata.append('tryout_id', this.id_tryout)
      this.userService.getNilaiTryoutUser(formdata).subscribe(val => {
        if (val.status == 200) {
          this.benar = val.data.benar
          this.salah = val.data.salah
          this.kosong = val.data.kosong
          this.nilai = val.data.nilai
        }
      })
  }

  listnilaitryout() {
    let form  = new FormData()
    form.append('tryout_id', this.id_tryout)
    this.spinner.show()
    this.userService.getNilaiTryout(form).subscribe(val => {
      if (val.status = 200) {
        this.nilaitryout = val
        this.spinner.hide();
      }
    }, err => {
      if (err.status == 403) {
        this.spinner.hide()
        this.store.refreshToken(err.error.newtoken)
        return this.listnilaitryout()
      } else {
        this.spinner.hide()
        this.popup.open({
          type: 'error',
          title: 'Terjadi Kesalahan!',
          text: err.error.message,
          showCancelButton: true,
          cancelButtonText: 'OK'
        })
        this.store.deleteStorage()
        this.router.navigate(['/'])
      }

    })
  }

}
