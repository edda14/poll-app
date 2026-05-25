import { Component, Input } from '@angular/core';
import { SmallSurveyCard } from '../small-survey-card/small-survey-card';

@Component({
  selector: 'app-all-surveys',
  imports: [SmallSurveyCard],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})
export class AllSurveys {
  @Input() selectedTab: 'active' | 'past' = 'active';
  @Input() activeSurveys: any[] = [];
  @Input() pastSurveys: any[] = [];
  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];
  isCategoryOpen = false;
  selectedCategory = '';

  getFilteredSurveys() {

    const surveys =
      this.selectedTab === 'active'
        ? this.activeSurveys
        : this.pastSurveys;

    if (!this.selectedCategory) {
      return surveys;
    }

    return surveys.filter(
      survey => survey.category === this.selectedCategory
    );
  }
}