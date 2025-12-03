import { supabase } from './supabaseClient';

export interface FormSubmissionData {
  full_name: string;
  work_email: string;
  contact_number: string;
  company_name: string;
  company_size: string;
  demo_request_message?: string;
  terms_accepted: boolean;
  selected_date: string | null;
  selected_time: string | null;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  data?: any;
}

export async function submitFormData(formData: FormSubmissionData): Promise<SubmissionResult> {
  try {
    const { data, error } = await supabase
      .from('user_submissions')
      .insert([formData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: `Database error: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Form submitted successfully!',
      data,
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}






