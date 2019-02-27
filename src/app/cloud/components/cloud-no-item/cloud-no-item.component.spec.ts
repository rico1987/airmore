import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudNoItemComponent } from './cloud-no-item.component';

describe('CloudNoItemComponent', () => {
  let component: CloudNoItemComponent;
  let fixture: ComponentFixture<CloudNoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudNoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudNoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
