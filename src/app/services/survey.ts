import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private supabaseService = inject(SupabaseService);

  /**
 * Loads all surveys sorted by creation date.
 */
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

  /**
 * Creates a new survey including all questions and answer options.
 */
  async createSurvey(
    title: string,
    description: string,
    deadline: string,
    category: string,
    questions: any[]
  ) {
    const surveyId = await this.insertSurvey(title, description, deadline, category);
    if (!surveyId) return;
    await this.insertQuestions(surveyId, questions);
  }

  /**
 * Inserts a survey into the database and returns its id.
 */
  private async insertSurvey(
    title: string,
    description: string,
    deadline: string,
    category: string
  ): Promise<string | null> {
    const survey = this.buildSurvey(title, description, deadline, category);
    const { data, error } = await this.supabaseService.supabase
      .from('surveys')
      .insert([survey])
      .select('id');
    return this.getInsertedId(data, error);
  }

  /**
 * Builds a survey object for database insertion.
 */
  private buildSurvey(
    title: string,
    description: string,
    deadline: string,
    category: string
  ) {
    return {
      title,
      description,
      deadline: deadline ? this.convertGermanDateToIso(deadline) : null,
      category,
    };
  }

  /**
 * Inserts all survey questions.
 */
  private async insertQuestions(surveyId: string, questions: any[]) {
    for (const question of questions) {
      await this.insertQuestionWithOptions(surveyId, question);
    }
  }

/**
 * Inserts a question and its related answer options.
 */
  private async insertQuestionWithOptions(
    surveyId: string,
    question: any
  ) {
    const questionId = await this.insertQuestion(surveyId, question);
    if (!questionId) return;
    await this.insertOptions(surveyId, questionId, question.answers);
  }

  /**
 * Inserts a single question and returns its id.
 */
  private async insertQuestion(
    surveyId: string,
    question: any
  ): Promise<string | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('survey_questions')
      .insert([this.buildQuestion(surveyId, question)])
      .select('id');
    return this.getInsertedId(data, error);
  }

  /**
 * Builds a question object for database insertion.
 */
  private buildQuestion(surveyId: string, question: any) {
    return {
      survey_id: surveyId,
      question: question.question,
      multiple: question.multiple,
    };
  }

  /**
 * Inserts all answer options for a question.
 */
  private async insertOptions(
    surveyId: string,
    questionId: string,
    answers: string[]
  ) {
    const options = this.buildOptions(surveyId, questionId, answers);
    const { error } = await this.supabaseService.supabase
      .from('survey_options')
      .insert(options);
    if (error) console.error(error);
  }

  /**
 * Builds an array of answer option objects.
 */
  private buildOptions(
    surveyId: string,
    questionId: string,
    answers: string[]
  ) {
    return answers
      .filter((answer) => answer.trim() !== '')
      .map((answer) => this.buildOption(surveyId, questionId, answer));
  }

  /**
 * Builds a single answer option object.
 */
  private buildOption(
    surveyId: string,
    questionId: string,
    answer: string
  ) {
    return {
      survey_id: surveyId,
      question_id: questionId,
      text: answer,
      votes: 0,
    };
  }

  /**
 * Returns the inserted id or null if an error occurred.
 */
  private getInsertedId(data: any[] | null, error: any): string | null {
    if (error) {
      console.error(error);
      return null;
    }
    return data?.[0]?.id ?? null;
  }

  /**
 * Converts a German date string into ISO format.
 */
  private convertGermanDateToIso(date: string): string | null {
    const [day, month, year] = date.split('.');
    if (!day || !month || !year) {
      return null;
    }
    return `${year}-${month}-${day}T23:59:00`;
  }

  /**
 * Loads a survey including all questions and answer options.
 */
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

  /**
 * Increases the vote count of a selected answer option.
 */
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