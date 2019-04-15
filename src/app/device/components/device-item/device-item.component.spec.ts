import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemComponent } from './device-item.component';

describe('DeviceItemComponent', () => {
  let component: DeviceItemComponent;
  let fixture: ComponentFixture<DeviceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
