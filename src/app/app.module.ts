import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { DialogComponent } from './dialog/dialog.component';
import {ChatModule} from './core/chat.module';
import {ChatService} from './firebase/chat.service';
import {AuthService} from './firebase/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ChatModule
  ],
  providers: [
    AuthService,
    ChatService
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
