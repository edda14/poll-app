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

  async publishSurvey() {
    if (this.isPublishing) return;

    this.isPublishing = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid()) {
      this.isPublishing = false;
      this.cdr.detectChanges();
      return;
    }

    await this.surveyService.createSurvey(
      this.surveyTitle,
      this.description,
      this.deadline,
      this.selectedCategory,
      this.questions
    );

    this.resetForm();

    this.successMessage = 'Survey published successfully!';
    this.isPublishing = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  addAnswer(question: any) {
    if (question.answers.length < 6) {
      question.answers.push('');
    }
  }

  addQuestion() {
    if (this.questions.length < 4) {
      this.questions.push({
        question: '',
        multiple: false,
        answers: ['', ''],
      });
    }
  }

  toggleCategoryDropdown() {

    this.isCategoryOpen = !this.isCategoryOpen;

    this.cdr.detectChanges();

  }

  deleteAnswer(question: any, answerIndex: number) {
    question.answers.splice(answerIndex, 1);
  }

  deleteQuestion(questionIndex: number) {
    this.questions.splice(questionIndex, 1);
  }

  isFormValid(): boolean {
    if (!this.surveyTitle.trim()) {
      this.errorMessage = 'Please enter a survey name.';
      return false;
    }
    if (!this.selectedCategory) {
      this.errorMessage = 'Please choose a category.';
      this.isCategoryOpen = true;
      this.cdr.detectChanges();
      return false;
    }

    const hasEmptyQuestion = this.questions.some(
      question => !question.question.trim()
    );

    if (hasEmptyQuestion) {
      this.errorMessage = 'Please fill in all questions.';
      return false;
    }

    const hasInvalidAnswers = this.questions.some(
      question => question.answers.filter(answer => answer.trim()).length < 2
    );

    if (hasInvalidAnswers) {
      this.errorMessage = 'Please add at least two answers for each question.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

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

  closeSuccessHint() {
    this.successMessage = '';
  }
}
