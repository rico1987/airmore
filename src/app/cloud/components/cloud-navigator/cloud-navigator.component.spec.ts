import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudNavigatorComponent } from './cloud-navigator.component';

describe('CloudNavigatorComponent', () => {
  let component: CloudNavigatorComponent;
  let fixture: ComponentFixture<CloudNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
