import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {}

  register() {
    this.authService.signUp(this.email, this.password).then(() => {
      this._snackBar.open('Registration done. Have fun grabbing a snack', 'Close', { duration: 3000 });
      this.router.navigate(['/tabs']); // adjust as necessary
    }).catch(error => {
      this._snackBar.open('Registration failed. How about we try again?', 'Sure', { duration: 3000 });
    });
  }

}
