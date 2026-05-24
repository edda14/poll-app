import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-small-survey-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './small-survey-card.html',
  styleUrl: './small-survey-card.scss',
})
export class SmallSurveyCard {
  @Input() survey: any;
}
