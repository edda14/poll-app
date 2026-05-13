import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySection } from './survey-section';

describe('SurveySection', () => {
  let component: SurveySection;
  let fixture: ComponentFixture<SurveySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveySection],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveySection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
