import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceHeaderComponent } from './device-header.component';

describe('DeviceHeaderComponent', () => {
  let component: DeviceHeaderComponent;
  let fixture: ComponentFixture<DeviceHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
