import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTemplateComponent } from './material-template.component';

describe('MaterialTemplateComponent', () => {
  let component: MaterialTemplateComponent;
  let fixture: ComponentFixture<MaterialTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
