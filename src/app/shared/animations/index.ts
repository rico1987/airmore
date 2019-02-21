import {
  trigger,
  transition,
  state,
  animate,
  style,
  AnimationEvent
} from '@angular/animations';

export const ANIMATIONS = [
  trigger('errorFadeIn', [
    state('show', style({
      top: '100%',
      opacity: 1,
    })),
    state('hide', style({
      top: '90%',
      opacity: 0.5,
      display: 'none',
    })),
    transition('hide => show', [
      animate('0.3s')
    ]),
    transition('show => hide', [
      animate('0.1s')
    ]),
  ]),
];
