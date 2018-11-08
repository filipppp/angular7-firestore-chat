import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  DocumentReference
} from '@angular/fire/firestore';
import {Chat, Message} from '../app.model';
import {Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {AuthService} from './auth.service';

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
            const data = action.payload.doc.data() as Chat;
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
            .collection('chats', ref => ref.where('members', 'array-contains', new DocumentReference(`/users/${user.uid}`)))
            .snapshotChanges()
            .pipe(
              map(actions => {
                return actions.map(action => {
                  const data = action.payload.doc.data() as Chat;
                  const id = action.payload.doc.id;
                  return {id, ...data};
                });
              })
            ) as Observable<Chat[]>
        )
      );
  }

  getChat(id: string): Observable<Chat> {
    return this.chatsRef
      .doc<Chat>(id)
      .snapshotChanges()
      .pipe(
        map(document => {
          return {id: document.payload.id, ...document.payload.data()};
        })
      ) as Observable<Chat>;
  }

  getMessagesFromChat(chatID: string): Observable<Message[]> {
    return this.auth.joinUsers(this.chatsRef
      .doc(chatID)
      .collection('messages', ref => ref.orderBy('postedAt'))
      .valueChanges() as Observable<Message[]>);
  }

  addMessage(message: Message, chatID: string): void {
    try {
      this.chatsRef
        .doc(chatID)
        .collection('messages')
        .add(message as DocumentData);
    } catch (e) {
      throw new Error(e);
    }
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
