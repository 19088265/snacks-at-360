import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore) {
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

  getUserByUserId(userId: string): Observable<any> {
    return this.firestore.collection('users', ref => ref.where('uid', '==', userId)).valueChanges().pipe(
      map(users => users[0])
    );
  }

  getCurrentUserEmail(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => user ? user.email : null)
    );
  }

  getAllUserIds(): Observable<string[]> {
    return this.firestore.collection('users')  // Assuming 'users' is your collection
      .snapshotChanges()  // Get document changes
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return id;  // Return the document ID, which is the user ID
        }))
      );
  }

  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users')  // Assuming 'users' is your collection
      .snapshotChanges()  // Get document changes
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;  // Cast to any or create an interface
          const id = a.payload.doc.id;
          return {
            id,  // Return the document ID, which is the user ID
            username: data.username,
            email: data.email,
            role: data.role,
          };
        }))
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

  isUsernameAvailable(username: string): Observable<boolean> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username))
      .get()
      .pipe(
        map(snapshot => snapshot.empty)
      );
  }

  async signUp2(email: string, password: string, username: string) {
    // First check if the username is available
    this.isUsernameAvailable(username).subscribe(isAvailable => {
      if (!isAvailable) {
        throw new Error('Username is already taken');
      } else {
        // Proceed with registration if username is available
        this.afAuth.createUserWithEmailAndPassword(email, password).then(result => {
          if (result.user) {
            const userData = {
              uid: result.user.uid,
              email: result.user.email,
              username: username,
              createdAt: new Date(),
              role: 'user'
            };

            this.firestore.doc(`users/${result.user.uid}`).set(userData);
            console.log('User document created in Firestore with username');
          }
          return result;
        }).catch(error => {
          console.error('Registration failed', error);
          throw error;
        });
      }
    });
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
