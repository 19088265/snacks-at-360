import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit  {

  showIcon = false;

  email: string = '';
  password: string = '';

  ngOnInit(): void {
    this.showIcon = false;
  }

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  googleSignIn() {
    //this.showIcon = !this.showIcon;
    this.showIcon = true; // Show the icon when the button is clicked
    setTimeout(() => {
      this.showIcon = false; // Hide the icon after 3000 milliseconds (3 seconds)
    }, 10000);

    this.authService.googleSignIn().then(res => {
      console.log('Successfully signed in with Google!', res);
      this._snackBar.open('Yay! Login successful. Go snack up.', 'Why not?', {
        duration: 5000
      });
      this.router.navigate(['/tabs']);
      // Handle successful sign-in here (navigate or load user data, etc.)
    }).catch(error => {
      console.error('Failed to sign in with Google', error);
    });
  }

  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  signout() {
    this.authService.signOut().then(res => {
      console.log('Successfully signed out with Google!', res);
      //this.router.navigate(['/tabs/tab1']);
      // Handle successful sign-in here (navigate or load user data, etc.)
    }).catch(error => {
      console.error('Failed to sign out with Google', error);
    });
  }

  signIn() {
    this.authService.signIn(this.email, this.password).then(() => {
      this._snackBar.open('Yay! Login successful. Go snack up', 'Why not?', { duration: 3000 });
      this.router.navigate(['/tabs']); // adjust as necessary
    }).catch(error => {
      this._snackBar.open('Login failed. Please input all fields then try again.', 'Okay', { duration: 3000 });
    });
  }


}
