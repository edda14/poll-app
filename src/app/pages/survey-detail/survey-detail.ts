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

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (!id) return;
      this.survey = null;
      this.survey = await this.surveyService.getSurveyById(id);
      this.selectedAnswers = {};
      this.cdr.detectChanges();
      console.log('Loaded survey:', this.survey);
    });
  }

  findOptionById(optionId: string) {
    return this.survey?.survey_questions
      .flatMap((question: any) => question.survey_options)
      .find((option: any) => option.id === optionId);
  }

  async completeSurvey() {
    console.log(this.selectedAnswers);
    if (!this.isVoteValid()) {
      this.cdr.detectChanges();
      return;
    }
    for (const questionId in this.selectedAnswers) {
      for (const optionId of this.selectedAnswers[questionId]) {
        const option = this.findOptionById(optionId);
        if (option) {
          const success = await this.surveyService.vote(
            option.id,
            option.votes
          );
          if (!success) {
            console.error('Voting failed');
          }
        }
      }
      console.log('Vote submitted');
    }
    this.survey = await this.surveyService.getSurveyById(this.survey.id);
    this.selectedAnswers = {};
    this.cdr.detectChanges();
  }

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

  getTotalVotes(question: any): number {
  return question.survey_options.reduce(
    (sum: number, option: any) => sum + option.votes,
    0
  );
}

getVotePercentage(question: any, option: any): number {
  const totalVotes = this.getTotalVotes(question);

  if (totalVotes === 0) {
    return 0;
  }

  return Math.round((option.votes / totalVotes) * 100);
}

hasVotes(): boolean {
  return this.survey?.survey_questions?.some(
    (question: any) =>
      question.survey_options.some(
        (option: any) => option.votes > 0
      )
  );
}

  goHome() {
    this.router.navigate(['/'], {
      state: { scrollToAllSurveys: true }
    });
  }
}
