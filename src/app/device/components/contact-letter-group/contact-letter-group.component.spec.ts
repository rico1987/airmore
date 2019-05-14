import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLetterGroupComponent } from './contact-letter-group.component';

describe('ContactLetterGroupComponent', () => {
  let component: ContactLetterGroupComponent;
  let fixture: ComponentFixture<ContactLetterGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactLetterGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLetterGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
