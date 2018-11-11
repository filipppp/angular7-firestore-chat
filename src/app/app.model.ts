import {DocumentReference} from '@angular/fire/firestore';
import Timestamp = firestore.Timestamp;
import {firestore} from 'firebase';

export interface Message {
  author: DocumentReference | string;
  content: string;
  postedAt: Timestamp;
  id?: string;
}

export interface Chat {
  admins: Array<DocumentReference>;
  createdAt: Date;
  members: Array<DocumentReference>;
  name: string;
  id?: string;
}

export interface User {
  email: string;
  name: string;
  uid: string;
  password: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}
