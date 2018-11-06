import {DocumentReference} from '@angular/fire/firestore';

export interface Message {
  author: DocumentReference;
  content: string;
  postedAt: number;
  id?: string;
}

export interface Chat {
  admins: Array<DocumentReference>;
  createdAt: Date;
  members: Array<DocumentReference>;
  messages: Array<Message>;
  name: string;
  id?: string;
}

export interface User {
  email: string;
  name: string;
  uid: string;
  password: string;
}
