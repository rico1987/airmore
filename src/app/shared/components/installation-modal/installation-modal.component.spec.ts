import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationModalComponent } from './installation-modal.component';

describe('InstallationModalComponent', () => {
  let component: InstallationModalComponent;
  let fixture: ComponentFixture<InstallationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
