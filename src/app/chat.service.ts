import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Chat, Message} from './app.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly batchSize: number = 20;
  chatsCollection: AngularFirestoreCollection<Chat>;
  chats: Observable<Chat[]>;

  constructor(private db: AngularFirestore) {
  }

  getChats(): Observable<Chat[]> {
    this.chatsCollection = this.db.collection<Chat>('chats');
    this.chats = this.chatsCollection.valueChanges();
    return this.chats;
  }
  addMessage(message: Message, chat: Chat) {

  }

  addChat(chat: Chat) {

  }

}
