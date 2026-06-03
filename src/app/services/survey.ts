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
    questions: any[]
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
          },
        ])
        .select('id');

    if (surveyError) {
      console.error(surveyError);
      return;
    }

    const surveyId = surveyData?.[0]?.id;

    if (!surveyId) {
      console.error('No survey id returned');
      return;
    }

    for (const question of questions) {
      const { data: questionData, error: questionError } =
        await this.supabaseService.supabase
          .from('survey_questions')
          .insert([
            {
              survey_id: surveyId,
              question: question.question,
              multiple: question.multiple,
            },
          ])
          .select('id');

      if (questionError) {
        console.error(questionError);
        return;
      }

      const questionId = questionData?.[0]?.id;

      const options = question.answers
        .filter((answer: string) => answer.trim() !== '')
        .map((answer: string) => ({
          survey_id: surveyId,
          question_id: questionId,
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

      .select(`

      *,

      survey_questions (

        *,

        survey_options (*)

      )

    `)

      .eq('id', id)

      .single();

    if (error) {

      console.error('Survey detail error:', error);

      return null;

    }

    return data;

  }

 async vote(optionId: string, currentVotes: number) {

  const { error } = await this.supabaseService.supabase

    .from('survey_options')

    .update({

      votes: currentVotes + 1,

    })

    .eq('id', optionId);

  if (error) {

    console.error('Vote error:', error);

    return false;

  }

  return true;

}


}