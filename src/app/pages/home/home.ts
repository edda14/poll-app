import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { SurveySection } from './components/survey-section/survey-section';
import { Footer } from './components/footer/footer';
import { AllSurveys } from './components/all-surveys/all-surveys'
import { AfterViewInit } from '@angular/core';
import { CreateSurvey } from '../create-survey/create-survey';

@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, SurveySection, Footer, AllSurveys, CreateSurvey],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  private surveyService = inject(SurveyService);
  private cdr = inject(ChangeDetectorRef);
  surveys: any[] = [];
  endingSoonSurveys: any[] = [];
  activeSurveys: any[] = [];
  pastSurveys: any[] = [];
  selectedTab: 'active' | 'past' = 'active';
  isCreateSurveyOpen = false;

  */**
  Opens Create Survey */
    openCreateSurvey() {
    this.isCreateSurveyOpen = true;
  }

  */**
  Close Create Survey */
    closeCreateSurvey() {
    this.isCreateSurveyOpen = false;
  }

  /**
 * Loads all surveys and initializes the survey lists.
 */
  async ngOnInit() {
    this.surveys = await this.surveyService.getSurveys();
    this.endingSoonSurveys = this.getEndingSoonSurveys();
    this.activeSurveys = this.getActiveSurveys();
    this.pastSurveys = this.getPastSurveys();
    this.cdr.detectChanges();
  }


  /**
 * Returns surveys that end within the next seven days.
 */
  getEndingSoonSurveys() {
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return this.surveys
      .filter(survey => {
        if (!survey.deadline) return false;
        const deadline = new Date(survey.deadline).getTime();
        return deadline > now && deadline - now <= sevenDays;
      })
      .sort((a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
  }

  /**
 * Returns all currently active surveys.
 */
  getActiveSurveys() {
    const now = new Date().getTime();
    return this.surveys.filter((survey) => {
      if (!survey.deadline) return true;
      return new Date(survey.deadline).getTime() > now;
    });
  }

  /**
 * Returns all completed surveys.
 */
  getPastSurveys() {
    const now = new Date().getTime();
    return this.surveys.filter((survey) => {
      if (!survey.deadline) return false;
      return new Date(survey.deadline).getTime() <= now;
    });
  }
}