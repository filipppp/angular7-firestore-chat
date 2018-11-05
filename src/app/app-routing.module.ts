import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {ConversationComponent} from './conversation/conversation.component';

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, data: {type: 'login'}},
  {path: 'chat', component: ChatComponent, data: {type: 'list'}},
  {path: 'chat/:id', component: ConversationComponent, data: {type: 'chat'}},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
