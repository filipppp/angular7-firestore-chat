import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from './chat/chat.component';
import {ConversationComponent} from './conversation/conversation.component';
import {MessageComponent} from './message/message.component';
import {AngularMaterialModule} from '../angular-material-module/angular-material.module';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    AngularMaterialModule,
  ],
  exports: [
    ChatComponent,
    ConversationComponent,
    MessageComponent,
    ScrollingModule,
    AngularMaterialModule,
  ],
  declarations: [
    ChatComponent,
    ConversationComponent,
    MessageComponent
  ]
})
export class ChatModule { }
