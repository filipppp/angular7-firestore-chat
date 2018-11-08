import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Chat, Message} from '../../app.model';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Observable, Subject} from 'rxjs';
import {ChatService} from '../../firebase/chat.service';
import {AuthService} from '../../firebase/auth.service';

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
  messages: Observable<Message[]>;
  chatID: string;
  chat: Observable<Chat>;

  constructor(private route: ActivatedRoute, private router: Router, public chatService: ChatService, public auth: AuthService) {

  }

  ngOnInit() {
    this.chatID = this.route.snapshot.paramMap.get('id');

    this.chat = this.chatService.getChat(this.chatID);

    this.chatService.getMessagesFromChat(this.chatID).subscribe((x) => console.log(x))
    this.messages = this.chatService.getMessagesFromChat(this.chatID);
    }

  backToList() {
    this.router.navigateByUrl('/chat');
  }

  sendMessage(element: HTMLInputElement, form: HTMLFormElement, authorID) {
    this.chatService.addMessage({
      postedAt: Date.now(),
      content: element.value,
      author: authorID
    }, this.chatID);

    form.reset();
    this.messageFormControl.reset();
   // this.viewport.getRenderedRange().start;
   // this.viewport.scrollToIndex();
    console.log(this.viewport.getDataLength());
  }
}