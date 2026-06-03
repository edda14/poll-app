import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-survey',
  imports: [FormsModule, RouterLink
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
  questions = [
    {
      question: '',
      multiple: false,
      answers: ['', '']
    }
  ];
  selectedCategory = '';
  errorMessage = '';
  private cdr = inject(ChangeDetectorRef);
  isPublishing = false;
  successMessage = '';

  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];
  isCategoryOpen = false;

  /**
 * Publishes a new survey after validating the form.
 */
  async publishSurvey() {
    if (this.isPublishing) return;
    this.startPublishing();
    if (!this.isFormValid()) {
      this.stopPublishing();
      return;
    }
    await this.createSurvey();
    this.showSuccessMessage();
  }

  /**
 * Sets the publishing state and clears previous messages.
 */
  private startPublishing() {
    this.isPublishing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
 * Resets the publishing state and updates the view.
 */
  private stopPublishing() {
    this.isPublishing = false;
    this.cdr.detectChanges();
  }

  /**
   * Creates the survey in Supabase and resets the form afterwards.
   */
  private async createSurvey() {
    await this.surveyService.createSurvey(
      this.surveyTitle,
      this.description,
      this.deadline,
      this.selectedCategory,
      this.questions
    );
    this.resetForm();
  }

  /**
 * Shows a success message after publishing.
 */
  private showSuccessMessage() {
    this.successMessage = 'Survey published successfully!';
    this.stopPublishing();
    setTimeout(() => this.clearSuccessMessage(), 3000);
  }

  /**
 * Clears the success message from the view.
 */
  private clearSuccessMessage() {
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  /**
 * Adds a new answer field to a question.
 */
  addAnswer(question: any) {
    if (question.answers.length < 6) {
      question.answers.push('');
    }
  }

  /**
 * Adds a new question block to the form.
 */
  addQuestion() {
    if (this.questions.length < 4) {
      this.questions.push({
        question: '',
        multiple: false,
        answers: ['', ''],
      });
    }
  }

  /**
 * Opens or closes the category dropdown.
 */
  toggleCategoryDropdown() {
    this.isCategoryOpen = !this.isCategoryOpen;
    this.cdr.detectChanges();
  }


  /**
 * Deletes an answer field from a question.
 */
  deleteAnswer(question: any, answerIndex: number) {
    question.answers.splice(answerIndex, 1);
  }

  /**
 * Deletes a question block from the form.
 */
  deleteQuestion(questionIndex: number) {
    this.questions.splice(questionIndex, 1);
  }

  /**
 * Validates all required form fields.
 *
 * @returns True if the form is valid.
 */
  isFormValid(): boolean {
    if (!this.hasValidTitle()) return false;
    if (!this.hasValidCategory()) return false;
    if (!this.hasValidQuestions()) return false;
    if (!this.hasValidAnswers()) return false;
    this.errorMessage = '';
    return true;
  }

  /**
   * Checks if the survey title is filled.
   */
  private hasValidTitle(): boolean {
    if (this.surveyTitle.trim()) return true;
    this.errorMessage = 'Please enter a survey name.';
    return false;
  }

  /**
 * Checks if a category has been selected.
 */
  private hasValidCategory(): boolean {
    if (this.selectedCategory) return true;
    this.errorMessage = 'Please choose a category.';
    this.isCategoryOpen = true;
    this.cdr.detectChanges();
    return false;
  }

  /**
 * Checks if all question fields are filled.
 */
  private hasValidQuestions(): boolean {
    const hasEmptyQuestion = this.questions.some(
      question => !question.question.trim()
    );
    if (!hasEmptyQuestion) return true;
    this.errorMessage = 'Please fill in all questions.';
    return false;
  }

  /**
 * Checks if every question has at least two answers.
 */
  private hasValidAnswers(): boolean {
    const hasInvalidAnswers = this.questions.some(
      question =>
        question.answers.filter(answer => answer.trim()).length < 2
    );
    if (!hasInvalidAnswers) return true;
    this.errorMessage =
      'Please add at least two answers for each question.';
    return false;
  }

  /**
 * Resets all form fields to their initial state.
 */
  resetForm() {
    this.surveyTitle = '';
    this.description = '';
    this.deadline = '';
    this.selectedCategory = '';
    this.isCategoryOpen = false;
    this.questions = [
      {
        question: '',
        multiple: false,
        answers: ['', ''],
      },
    ];
  }

  /**
 * Closes the success message manually.
 */
  closeSuccessHint() {
    this.successMessage = '';
  }
}
