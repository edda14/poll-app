import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  selectedAnswers: { [questionId: string]: string[] } = {};
  isAnswerSelected(questionId: string, optionId: string): boolean {
    return this.selectedAnswers[questionId]?.includes(optionId) ?? false;
  }
  survey: any = null;
  voteErrorMessage = '';
  surveyId = '';

  /**
 * Loads the selected survey when the route id changes.
 */
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (!id) return;
      this.survey = null;
      this.survey = await this.surveyService.getSurveyById(id);
      this.sortSurveyData();
      this.selectedAnswers = {};
      this.cdr.detectChanges();
    });
  }

  /**
 * Finds an answer option by its id.
 */
  findOptionById(optionId: string) {
    return this.survey?.survey_questions
      .flatMap((question: any) => question.survey_options)
      .find((option: any) => option.id === optionId);
  }

  /**
 * Sorts all answer options to keep their order consistent after reloading survey data.
 */
  private sortSurveyData() {
    this.survey.survey_questions.forEach((question: any) => {
      question.survey_options.sort(
        (a: any, b: any) => a.text.localeCompare(b.text)
      );
    });
  }

  /**
 * Completes the survey after validating all answers.
 */
  async completeSurvey() {
    if (!this.isVoteValid()) {
      this.cdr.detectChanges();
      return;
    }
    await this.saveVotes();
    await this.reloadSurvey();
  }

  /**
 * Returns the vote count of an option including the current preview selection.
 */
  getOptionVotes(question: any, option: any): number {
    const savedVotes = option.votes || 0;
    const isSelected = this.selectedAnswers[question.id]?.includes(option.id);
    return isSelected ? savedVotes + 1 : savedVotes;
  }

  /**
 * Saves all selected votes in Supabase.
 */
  private async saveVotes() {
    for (const questionId in this.selectedAnswers) {
      for (const optionId of this.selectedAnswers[questionId]) {
        const option = this.findOptionById(optionId);
        if (!option) continue;
        const success = await this.surveyService.vote(
          option.id,
          option.votes
        );
        if (!success) {
          console.error('Voting failed');
        }
      }
    }
  }

  /**
 * Reloads the survey data and clears selected answers.
 */
  private async reloadSurvey() {
    this.survey = await this.surveyService.getSurveyById(
      this.survey.id
    );
    this.sortSurveyData();
    this.selectedAnswers = {};
    this.cdr.detectChanges();
  }

  /**
 * Checks if every question has at least one selected answer.
 */
  isVoteValid(): boolean {
    const unansweredQuestion = this.survey.survey_questions.some(
      (question: any) => !this.selectedAnswers[question.id]?.length
    );
    if (unansweredQuestion) {
      this.voteErrorMessage = 'Please answer every question before completing the survey!';
      return false;
    }
    this.voteErrorMessage = '';
    return true;
  }

  /**
 * Selects or deselects an answer option.
 */
  selectAnswer(question: any, optionId: string) {
    if (!this.selectedAnswers[question.id]) {
      this.selectedAnswers[question.id] = [];
    }
    if (question.multiple) {
      const selected = this.selectedAnswers[question.id];
      if (selected.includes(optionId)) {
        this.selectedAnswers[question.id] = selected.filter(id => id !== optionId);
      } else {
        this.selectedAnswers[question.id].push(optionId);
      }
    } else {
      this.selectedAnswers[question.id] = [optionId];
    }
    this.cdr.detectChanges();
  }

  /**
 * Calculates the total number of votes for one question.
 */
  getTotalVotes(question: any): number {
    return question.survey_options.reduce(
      (sum: number, option: any) =>
        sum + this.getOptionVotes(question, option),
      0
    );
  }

  /**
   * Calculates the vote percentage for one option.
   */
  getVotePercentage(question: any, option: any): number {
    const totalVotes = this.getTotalVotes(question);
    if (totalVotes === 0) {
      return 0;
    }
    let votes = option.votes;
    if (this.selectedAnswers[question.id]?.includes(option.id)) {
      votes++;
    }
    return Math.round((votes / totalVotes) * 100);
  }

  /**
 * Checks if the survey already has votes.
 */
  hasVotes(): boolean {
    const hasSavedVotes = this.survey?.survey_questions?.some(
      (question: any) =>
        question.survey_options.some(
          (option: any) => option.votes > 0
        )
    );
    const hasPreviewVotes = Object.values(this.selectedAnswers).some(
      (answers) => answers.length > 0
    );
    return hasSavedVotes || hasPreviewVotes;
  }

  /**
 * Navigates back to the home page.
 */
  goHome() {
    this.router.navigate(['/'], {
      state: { scrollToAllSurveys: true }
    });
  }
}
