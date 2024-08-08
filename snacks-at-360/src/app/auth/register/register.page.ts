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
  username: string = '';
  allowedDomains: string[] = ['adignite.co.za', 'cfo360.co.za', 'gmail.com'];

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {}

  // register() {
  //   this.authService.signUp(this.email, this.password).then(() => {
  //     this._snackBar.open('Registration done. Have fun grabbing a snack', 'Close', { duration: 3000 });
  //     this.router.navigate(['/tabs']); // adjust as necessary
  //   }).catch(error => {
  //     this._snackBar.open('Registration failed. How about we try again?', 'Sure', { duration: 3000 });
  //   });
  // }

  register() {
    if (this.isValidDomain(this.email)) {
      this.authService.signUp2(this.email, this.password, this.username).then(() => {
        this._snackBar.open('Registration done. Have fun grabbing a snack.', 'Ciao', { duration: 3000 });
        this.router.navigate(['/tabs']); // Adjust as necessary
      }).catch(error => {
        this._snackBar.open('Registration failed. Please try again.', 'Okay', { duration: 3000 });
      });
    } else {
      this._snackBar.open('Uhm...please use your work email.', 'Cool', { duration: 3000 });
    }
  }


  private isValidDomain(email: string): boolean {
    const domain = email.split('@')[1]; // Split the email string to extract the domain
    return this.allowedDomains.includes(domain);
  }

}
