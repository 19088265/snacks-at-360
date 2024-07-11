import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage  {


  email: string = '';
  // password: string = '';

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  resetPassword() {
    this.afAuth.sendPasswordResetEmail(this.email)
      .then(() => {
        console.log('Password Reset Email Sent!');
        this._snackBar.open('Password Reset Email Sent. Please check your email', 'Sure', {
          duration: 5000
        });
        // Handle response - show message, redirect, etc.
      })
      .catch(error => {
        console.error('Error sending password reset email:', error);
        this._snackBar.open('Password Reset Failed. How about we try again', 'Sure', {
          duration: 5000
        });
        // Handle errors (e.g., user not found)
      });
  }

}
