import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {AuthService} from '../firebase/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyloggedGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.currUser.pipe(
      take(1),
      map(user => !user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigateByUrl('/chat');
        }
      })
    );
  }
}
