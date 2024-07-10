import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule,
    MatExpansionModule, MatButtonModule
  ],
  providers: [{provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig},{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"snack-bar-d9e8d","appId":"1:432036453515:web:10dc12ed1460224b74088e","storageBucket":"snack-bar-d9e8d.appspot.com","apiKey":"AIzaSyB96fNsdMDSiDY1b-6dT5iMqg43qydy0eY","authDomain":"snack-bar-d9e8d.firebaseapp.com","messagingSenderId":"432036453515","measurementId":"G-FSSMCRHRCD"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
