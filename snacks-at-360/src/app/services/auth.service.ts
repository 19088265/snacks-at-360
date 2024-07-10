import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(public afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState;
   }

   // Google Sign-In
   async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      return result;
    } catch (error) {
      console.error('Error during Google sign-in', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    await this.afAuth.signOut();
  }

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  async signUp(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Registration successful', result);
      return result;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Login successful', result);
      return result;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  // Sign out
  async logOut() {
    try {
      await this.afAuth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out failed', error);
      throw error;
    }
  }

}
