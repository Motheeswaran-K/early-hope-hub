-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create storage bucket for medical images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-images',
  'medical-images',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
);

-- Storage policies for medical images
CREATE POLICY "Users can upload their own medical images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own medical images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own medical images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'medical-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create predictions table for AI analysis results
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('benign', 'malignant', 'normal')),
  confidence_score DECIMAL(5, 2) NOT NULL,
  analysis_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on predictions
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Predictions policies
CREATE POLICY "Users can view their own predictions"
  ON public.predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create symptoms table for tracking
CREATE TABLE public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptom_name TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on symptoms
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

-- Symptoms policies
CREATE POLICY "Users can view their own symptoms"
  ON public.symptoms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own symptoms"
  ON public.symptoms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptoms"
  ON public.symptoms FOR DELETE
  USING (auth.uid() = user_id);

-- Create health quiz responses table
CREATE TABLE public.health_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_data JSONB NOT NULL,
  risk_score INTEGER,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on health quiz
ALTER TABLE public.health_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Health quiz policies
CREATE POLICY "Users can view their own quiz responses"
  ON public.health_quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz responses"
  ON public.health_quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  reminder_date DATE NOT NULL,
  message TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on reminders
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Reminders policies
CREATE POLICY "Users can view their own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at trigger to profiles
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();