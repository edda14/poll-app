import { Component, inject, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private surveyService = inject(SurveyService);

  surveys: any[] = [];

  async ngOnInit() {
    this.surveys = await this.surveyService.getSurveys();
  }
}