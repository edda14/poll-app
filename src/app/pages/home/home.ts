import { Component, inject, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { SurveySection } from './components/survey-section/survey-section';
import { TabSwitcher } from './components/tab-switcher/tab-switcher';

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, SurveySection, TabSwitcher],
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