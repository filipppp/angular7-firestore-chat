import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Chat, Message} from '../../app.model';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ChatService} from '../firebase/chat.service';
import {AuthService} from '../firebase/auth.service';
import {firestore} from 'firebase';
import Timestamp = firestore.Timestamp;
import {concatMap, flatMap, map, mergeMap, reduce, scan, tap, throttleTime} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {before} from 'selenium-webdriver/testing';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(250)
  ]);


  private readonly batchSize = 10;
  offsetMessagesSubject = new BehaviorSubject(null);
  infiniteMessages: Observable<Message[]>;
  topReached = false;


  messages;
  chatID: string;
  chat: Observable<Chat>;
  currScrollIndex = -1;
  currChatRef: AngularFirestoreDocument<Chat>;
  loadingNewBatch = false;
  firstTimeScrolledBottom = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public chatService: ChatService,
              public auth: AuthService,
              public afs: AngularFirestore) {

  }

  ngOnInit() {

    this.chatID = this.route.snapshot.paramMap.get('id');
    this.currChatRef = this.chatService
      .chatsRef
      .doc(this.chatID);

    this.infiniteMessages = this.offsetMessagesSubject
      .pipe(
        throttleTime(500),
        mergeMap(endBefore => {
          if (endBefore === 'start') {
            return this.start();
          }
          return this.getMessagesBatch(endBefore);
        }),
        scan((acc: Array<Message>, batch: Array<Message>) => {
          const filteredBatch = batch.filter(message => {
            for (let i = 0; i < acc.length; i++) {
              if (acc[i].id === message.id) {
                acc[i] = message;
                return false;
              }
            }
            return true;
          });
          filteredBatch.push(...acc);
          filteredBatch.sort((a, b) => a.postedAt.toMillis() >= b.postedAt.toMillis() ? 1 : -1);
          return filteredBatch;
        }),
        map(values => {
          return Object.values(values);
        }),
        tap((vals) => {

          this.loadingNewBatch = false;
          /*
          if (vals.length !== 0) {
            setTimeout(() => this.viewport.scrollToIndex(this.viewport.getRenderedRange().end), 100);
            this.firstTimeScrolledBottom = true;
          }*/
        })
      );
    this.offsetMessagesSubject.next('start');

    this.infiniteMessages.subscribe(x => console.log(x));

    this.chat = this.chatService.getChat(this.currChatRef);
    this.messages = this.chatService.getMessagesFromChat(this.currChatRef);
    }

  backToList() {
    this.router.navigateByUrl('/chat');
  }

  async sendMessage(element: HTMLInputElement, form: HTMLFormElement, authorReference) {
    await this.chatService.addMessage({
      postedAt: Timestamp.now(),
      content: element.value,
      author: authorReference
    }, this.currChatRef);
    this.viewport.scrollToOffset(this.viewport.measureScrollOffset('bottom') + 100);
    form.reset();
    this.messageFormControl.reset();
   // this.viewport.getRenderedRange().start;
   // this.viewport.scrollToIndex();
  }

  trackByCreated(id) {
    return id;
  }

  nextMessagesBatch(event: any, datumOffset: Timestamp) {
    if (!this.topReached && this.viewport.getRenderedRange().start === event) {
      this.loadingNewBatch = true;
      this.currScrollIndex = event;
      this.offsetMessagesSubject.next(datumOffset);
    }
  }

  getMessagesBatch(beforeDate: Timestamp) {
    return this.auth.joinUsers(
      this.currChatRef
        .collection('messages', ref =>
          ref
            .orderBy('postedAt', 'desc')
            .startAfter(beforeDate)
            .limit(this.batchSize)
        )
        .snapshotChanges()
        .pipe(
          tap(actions => actions.length === 0 ? (this.topReached = true) : actions),
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              return {id, ...data};
            });
          })
        ) as Observable<Message[]>
    ).pipe(
      map((all: Array<Message>) => all.reverse())
    );
  }
  start() {
    return this.auth.joinUsers(
      this.currChatRef
        .collection('messages', ref =>
          ref.orderBy('postedAt', 'desc')
            .limit(this.batchSize)
        ).snapshotChanges()
        .pipe(
          tap(actions => (actions.length ? null : (this.topReached = true))),
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              return {id, ...data};
            });
          })
        ) as Observable<Message[]>
      )
      .pipe(
      map((all: Array<Message>) => all.reverse())
    );
  }
}
