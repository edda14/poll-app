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
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    console.log('Supabase data:', data);
    return data;
  }
}