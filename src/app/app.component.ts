import { Component } from '@angular/core';
import { trigger, transition, style, group, query, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('chat => list, list => login', [
        style({ height: '!' }),

        query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
        query(':enter', style({ transform: 'translateX(-100vw)' }), { optional: true }),

        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(100vw)' })),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
        ])
      ]),
      transition('list => chat, login => list', [
        style({ height: '!' }),

        query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
        query(':enter', style({ transform: 'translateX(100vw)' }), { optional: true }),

        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(-100vw)' })),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
        ])
      ]),
    ])
  ]
})
export class AppComponent {


  getState(outlet) {
    return outlet.activatedRouteData.type;
  }
}
