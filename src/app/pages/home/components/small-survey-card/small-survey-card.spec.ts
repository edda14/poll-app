import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSurveyCard } from './small-survey-card';

describe('SmallSurveyCard', () => {
  let component: SmallSurveyCard;
  let fixture: ComponentFixture<SmallSurveyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallSurveyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallSurveyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
