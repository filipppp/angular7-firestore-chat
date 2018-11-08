import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Chat, Message, User} from '../app.model';
import {combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {map, switchMap, take} from 'rxjs/operators';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState = null;
  public currUser: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.currUser = this.afAuth.authState
      .pipe(
        switchMap(user => user ? this.afs.doc<User>(`users/${user.uid}`).valueChanges() : of(null))
      );
  }

  private googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: firebase.auth.GoogleAuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(loginData => {
        this.updateUserDate(loginData.user);
      });
  }

  private updateUserDate(user) {
    const userRef: AngularFirestoreDocument = this.afs.doc<User>(`users/${user.uid}`);
    this.router.navigateByUrl('/chat');
    return userRef.set({
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName
    },
      {
        merge: true
      });
  }

  joinUsers(messages: Observable<Message[]>) {
    let nachrichten;
    const joinKeys = {};

    return messages.pipe(
      switchMap(tempMessages => {
        nachrichten = tempMessages;
        const uids = Array.from(new Set(nachrichten.map(v => v.author.id)));
        const userDocs = uids.map(id =>
          this.afs.doc(`users/${id}`).valueChanges()
        );
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => joinKeys[v.uid] = v);
        nachrichten = nachrichten.map(v => {
          return { ...v, user: joinKeys[v.author.id] };
        });
        return nachrichten;
      })
    );
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}
