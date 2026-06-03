import { Component, Input, ChangeDetectorRef, inject } from '@angular/core';
import { SmallSurveyCard } from '../small-survey-card/small-survey-card';

@Component({
  selector: 'app-all-surveys',
  imports: [SmallSurveyCard],
  templateUrl: './all-surveys.html',
  styleUrl: './all-surveys.scss',
})

export class AllSurveys {
  private cdr = inject(ChangeDetectorRef);
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
  selectedCategory = '';
  isCategoryOpen = false;

/**
 * Switches between active and past surveys.
 * Resets the selected category filter.
 */
  selectTab(tab: 'active' | 'past') {
    this.selectedTab = tab;
    this.selectedCategory = '';
    this.isCategoryOpen = false;
    this.cdr.detectChanges();
  }

/**
 * Opens or closes the category dropdown.
 */
  toggleCategoryDropdown() {
    this.isCategoryOpen = !this.isCategoryOpen;
    this.cdr.detectChanges();
  }

  /**
 * Selects a category and closes the dropdown.
 */
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isCategoryOpen = false;
    this.cdr.detectChanges();
  }

  /**
 * Returns surveys filtered by the selected tab and category.
 */
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