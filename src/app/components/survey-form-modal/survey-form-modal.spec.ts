import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFormModal } from './survey-form-modal';

describe('SurveyFormModal', () => {
  let component: SurveyFormModal;
  let fixture: ComponentFixture<SurveyFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
