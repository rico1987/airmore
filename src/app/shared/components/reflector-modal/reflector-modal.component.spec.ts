import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflectorModalComponent } from './reflector-modal.component';

describe('ReflectorModalComponent', () => {
  let component: ReflectorModalComponent;
  let fixture: ComponentFixture<ReflectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReflectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReflectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
