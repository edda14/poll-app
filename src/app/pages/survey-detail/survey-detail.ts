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

  survey: any = null;

  surveyId = '';

ngOnInit() {
  this.route.paramMap.subscribe(async (params) => {
    const id = params.get('id');

    if (!id) return;

    this.survey = null;

    this.survey = await this.surveyService.getSurveyById(id);

    this.cdr.detectChanges();

    console.log('Loaded survey:', this.survey);
  });
}

goHome() {
  this.router.navigate(['/'], {
    state: { scrollToAllSurveys: true }
  });
}
}
