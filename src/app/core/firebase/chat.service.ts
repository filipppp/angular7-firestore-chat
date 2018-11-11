import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentReference,
} from '@angular/fire/firestore';
import {Chat, Message, User} from '../../app.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {firestore} from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly batchSize: number = 20;
  chatsRef: AngularFirestoreCollection<Chat>;
  chats: Observable<Chat[]>;

  constructor(private afs: AngularFirestore, public auth: AuthService) {
    this.chatsRef = this.afs.collection<Chat>('chats');
  }


  getChats(): Observable<Chat[]> {
    this.chats = this.chatsRef
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })
      ) as Observable<Chat[]>;
    return this.chats;
  }

  getUserChats(): Observable<Chat[]> {
    return this.auth.currUser
      .pipe(
        take(1),
        switchMap(user => this.afs
            .collection('chats', ref => ref.where('members', 'array-contains', this.afs
              .collection('users')
              .doc<User>(user.uid)
              .ref))
            .snapshotChanges()
            .pipe(
              map(actions => {
                return actions.map(action => {
                  const data = action.payload.doc.data();
                  const id = action.payload.doc.id;
                  return {id, ...data};
                });
              })
            ) as Observable<Chat[]>
        )
      );
  }

  getChat(reference: string | AngularFirestoreDocument<Chat>): Observable<Chat> {
    if (typeof reference === 'string') {
      return this.chatsRef
        .doc<Chat>(reference)
        .snapshotChanges()
        .pipe(
          map(document => {
            return {id: document.payload.id, ...document.payload.data()};
          })
        ) as Observable<Chat>;;
    } else {
      return reference
        .snapshotChanges()
        .pipe(
          map(document => {
            return {id: document.payload.id, ...document.payload.data()};
          })
        ) as Observable<Chat>;
    }
  }

  getMessagesFromChat(ChatDocRef: AngularFirestoreDocument<Chat>): Observable<Message[]> {
    return this.auth.joinUsers(
      ChatDocRef
      .collection('messages', ref => ref.orderBy('postedAt'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return {id, ...data};
          });
        })
      ) as Observable<Message[]>);
  }

  addMessage(message: Message, ref: AngularFirestoreDocument<Chat>): Promise<DocumentReference> {
      return ref
        .collection('messages')
        .add(message as DocumentData);
  }

  addChat(chat: Chat): void {
    try {
      this.afs.collection('chats')
        .add(chat as DocumentData);
    } catch (e) {
      throw new Error(e);
    }
  }
}
