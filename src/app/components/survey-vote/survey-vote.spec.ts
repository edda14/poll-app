import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyVote } from './survey-vote';

describe('SurveyVote', () => {
  let component: SurveyVote;
  let fixture: ComponentFixture<SurveyVote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyVote],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyVote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
