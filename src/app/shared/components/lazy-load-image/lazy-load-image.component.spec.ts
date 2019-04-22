import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadImageComponent } from './lazy-load-image.component';

describe('LazyLoadImageComponent', () => {
  let component: LazyLoadImageComponent;
  let fixture: ComponentFixture<LazyLoadImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyLoadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
