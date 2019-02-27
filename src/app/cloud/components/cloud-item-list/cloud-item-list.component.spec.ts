import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudItemListComponent } from './cloud-item-list.component';

describe('CloudItemListComponent', () => {
  let component: CloudItemListComponent;
  let fixture: ComponentFixture<CloudItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
