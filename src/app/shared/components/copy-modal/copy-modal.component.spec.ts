import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyModalComponent } from './copy-modal.component';

describe('CopyModalComponent', () => {
  let component: CopyModalComponent;
  let fixture: ComponentFixture<CopyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
