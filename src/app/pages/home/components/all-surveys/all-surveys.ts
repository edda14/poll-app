import { Component } from '@angular/core';
import { SmallSurveyCard } from './../small-survey-card/small-survey-card';

@Component({
  selector: 'app-all-surveys',
  imports: [SmallSurveyCard],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys { }
