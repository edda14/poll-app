import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey';


@Component({
  selector: 'app-create-survey',
  imports: [FormsModule
  ],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  private surveyService = inject(SurveyService);
  surveyTitle = '';
  description = '';
  deadline = '';
  category = '';
  question = '';
  answerA = '';
  answerB = '';
  selectedCategory = '';

  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];
  isCategoryOpen = false;

  async publishSurvey() {

    await this.surveyService.createSurvey(
      this.surveyTitle,
      this.description,
      this.deadline,
      this.selectedCategory,
      this.question,
      [this.answerA, this.answerB]
    );
  }
}
