import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudSidebarComponent } from './cloud-sidebar.component';

describe('CloudSidebarComponent', () => {
  let component: CloudSidebarComponent;
  let fixture: ComponentFixture<CloudSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
