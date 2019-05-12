import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationModalComponent } from './invitation-modal.component';

describe('InvitationModalComponent', () => {
  let component: InvitationModalComponent;
  let fixture: ComponentFixture<InvitationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
