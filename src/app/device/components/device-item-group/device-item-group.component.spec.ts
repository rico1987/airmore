import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemGroupComponent } from './device-item-group.component';

describe('DeviceItemGroupComponent', () => {
  let component: DeviceItemGroupComponent;
  let fixture: ComponentFixture<DeviceItemGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceItemGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
