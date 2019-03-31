import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceItemListComponent } from './device-item-list.component';

describe('DeviceItemListComponent', () => {
  let component: DeviceItemListComponent;
  let fixture: ComponentFixture<DeviceItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
