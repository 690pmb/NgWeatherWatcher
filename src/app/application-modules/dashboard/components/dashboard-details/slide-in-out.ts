import {
  animate,
  AnimationTriggerMetadata,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInOutAnimation: (
  name: string,
) => AnimationTriggerMetadata = name =>
  trigger(name, [
    transition(':increment', [
      query(
        ':enter',
        [
          style({transform: 'translateX(100%)'}),
          stagger(50, [
            animate('200ms ease-out', style({transform: 'translateX(0%)'})),
          ]),
        ],
        {optional: true},
      ),
    ]),
    transition(':decrement', [
      query(
        ':enter',
        [
          style({transform: 'translateX(-100%)'}),
          stagger(50, [
            animate('200ms ease-out', style({transform: 'translateX(0%)'})),
          ]),
        ],
        {optional: true},
      ),
    ]),
  ]);
