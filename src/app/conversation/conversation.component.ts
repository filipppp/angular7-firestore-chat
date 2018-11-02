import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from '../app.model';
import {FormControl, FormGroupDirective, Validators} from '@angular/forms';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ViewChild(FormGroupDirective) myForm;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  chatMessages: Subject<Message>;
  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(250)
  ]);
  messages: Array<Message> = [
    {
      author: 'nigger',
      content: 'Was geht',
      postedAt: new Date()
    },
    {
      author: 'e',
      content: 'Bastard',
      postedAt: new Date()
    },
    {
      author: 'nigg3er',
      content: 'Halt die goschen',
      postedAt: new Date()
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    const chatName = this.route.snapshot.paramMap.get('name');
  }

  backToList() {
    this.router.navigateByUrl('/chat');
  }

  async sendMessage(element: HTMLInputElement) {
    element.value = '';
   // this.viewport.getRenderedRange().start;
   // this.viewport.scrollToIndex();
    console.log(this.viewport.getDataLength());
  }
}
