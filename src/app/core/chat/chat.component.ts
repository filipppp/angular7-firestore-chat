import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ChatService} from '../firebase/chat.service';
import {Observable} from 'rxjs';
import {Chat} from '../../app.model';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {AuthService} from '../firebase/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: Observable<Chat[]>;
  constructor(private router: Router, public chatService: ChatService, public dialog: MatDialog, public auth: AuthService) { }

  ngOnInit() {
    this.chatService.getUserChats().subscribe(l => console.log(l));
    console.log(this.chatService.getUserChats())
    this.chats = this.chatService.getUserChats();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed()
      .subscribe(data => console.log(data));
  }

  handleClick(chats) {
    const selectedArray = chats.selectedOptions.selected;
    if (selectedArray.length !== 0 ) {
      const selected = selectedArray[selectedArray.length - 1].value;
      this.router.navigateByUrl(`/chat/${selected}`);
    }
  }
}
