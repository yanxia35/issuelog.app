import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechTemplateComponent } from './mech-template.component';

describe('MechTemplateComponent', () => {
  let component: MechTemplateComponent;
  let fixture: ComponentFixture<MechTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MechTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
