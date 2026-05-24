import { Component, Input } from '@angular/core';
import { SurveyCard } from '../survey-card/survey-card';

@Component({
  selector: 'app-survey-section',
  imports: [SurveyCard],
  templateUrl: './survey-section.html',
  styleUrl: './survey-section.scss',
})
export class SurveySection {
  @Input() surveys: any[] = [];
}
