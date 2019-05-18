import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelectOptionsComponent } from './dropdown-select-options.component';

describe('DropdownSelectOptionsComponent', () => {
  let component: DropdownSelectOptionsComponent;
  let fixture: ComponentFixture<DropdownSelectOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownSelectOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
