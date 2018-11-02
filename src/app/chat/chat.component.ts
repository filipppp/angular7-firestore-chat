import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ChatService} from '../chat.service';
import {Observable} from 'rxjs';
import {Chat} from '../app.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: Observable<Chat[]>;
  constructor(private router: Router, public chatService: ChatService) { }

  ngOnInit() {
    this.chats = this.chatService.getChats();
    this.chats.subscribe(chat => console.log(chat))
  }


  handleClick(chats) {
    const selectedArray = chats.selectedOptions.selected;
    if (selectedArray.length !== 0 ) {
      const selected = selectedArray[selectedArray.length - 1].value;
      this.router.navigateByUrl(`/chat/${selected}`);
    }
  }
}
