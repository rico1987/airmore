import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSidebarComponent } from './device-sidebar.component';

describe('DeviceSidebarComponent', () => {
  let component: DeviceSidebarComponent;
  let fixture: ComponentFixture<DeviceSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
