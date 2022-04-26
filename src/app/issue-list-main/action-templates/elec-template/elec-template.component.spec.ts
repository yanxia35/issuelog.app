import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecTemplateComponent } from './elec-template.component';

describe('ElecTemplateComponent', () => {
  let component: ElecTemplateComponent;
  let fixture: ComponentFixture<ElecTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElecTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
