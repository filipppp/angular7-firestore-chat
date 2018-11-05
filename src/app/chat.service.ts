import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {Chat, Message} from './app.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly batchSize: number = 20;
  chatsRef: AngularFirestoreCollection<Chat>;
  chats: Observable<Chat[]>;

  constructor(private afs: AngularFirestore) {
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
            return { id, ...data };
          });
        })
      ) as Observable<Chat[]>;
    return this.chats;
  }

  getChat(id: string): Observable<Chat> {
    return this.chatsRef
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(document => {
          return {id: document.payload.id, ...document.payload.data()};
        })
      ) as Observable<Chat>;
  }

  getMessagesFromChat(id: string): Observable<Message[]> {
    return this.chatsRef
      .doc(id)
      .collection('messages',  ref => ref.orderBy('postedAt'))
      .valueChanges() as Observable<Message[]>;
  }

  addMessage(message: Message, chat: Chat) {

  }

  addChat(chat: Chat) {

  }

}
