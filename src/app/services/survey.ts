import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private supabaseService = inject(SupabaseService);
  async getSurveys() {
    const { data, error } = await this.supabaseService.supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    return data;
  }

  async createSurvey(
    title: string,
    description: string,
    deadline: string,
    category: string,
    question: string,
    answers: string[]
  ) {

    const formattedDeadline = deadline

      ? this.convertGermanDateToIso(deadline)

      : null;
    const { data: surveyData, error: surveyError } =
      await this.supabaseService.supabase
        .from('surveys')
        .insert([
          {
            title,
            description,
            deadline: formattedDeadline,
            category,
            question,
          },
        ])
        .select()
        .single();

    if (surveyError) {
      console.error(surveyError);
      return;
    }

    const surveyId = surveyData.id;

    const options = answers.map((answer) => ({
      survey_id: surveyId,
      text: answer,
      votes: 0,
    }));

    const { error: optionsError } =
      await this.supabaseService.supabase
        .from('survey_options')
        .insert(options);

    if (optionsError) {
      console.error(optionsError);
      return;
    }

    console.log('Survey created successfully');
  }

  private convertGermanDateToIso(date: string): string | null {
    const [day, month, year] = date.split('.');

    if (!day || !month || !year) {
      return null;
    }

    return `${year}-${month}-${day}T23:59:00`;
  }

  async getSurveyById(id: string) {

    const { data, error } = await this.supabaseService.supabase

      .from('surveys')

      .select('*')

      .eq('id', id)

      .single();

    if (error) {

      console.error('Survey detail error:', error);

      return null;

    }

    return data;

  }


}