import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatComponent} from './core/chat/chat.component';
import {LoginComponent} from './login/login.component';
import {ErrorComponent} from './error/error.component';
import {ConversationComponent} from './core/conversation/conversation.component';
import {AuthGuard} from './guards/auth.guard';
import {AlreadyloggedGuard} from './guards/alreadylogged.guard';

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AlreadyloggedGuard], data: {type: 'login'}},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], data: {type: 'list'}},
  {path: 'chat/:id', component: ConversationComponent, canActivate: [AuthGuard], data: {type: 'chat'}},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
