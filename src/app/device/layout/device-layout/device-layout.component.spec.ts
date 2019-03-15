import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceLayoutComponent } from './device-layout.component';

describe('DeviceLayoutComponent', () => {
  let component: DeviceLayoutComponent;
  let fixture: ComponentFixture<DeviceLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
