import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitTemplateComponent } from './sit-template.component';

describe('SitTemplateComponent', () => {
  let component: SitTemplateComponent;
  let fixture: ComponentFixture<SitTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
