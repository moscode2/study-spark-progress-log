-- Create learning goals table
CREATE TABLE public.learning_goals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    target_date DATE,
    estimated_hours_per_week INTEGER,
    total_estimated_hours INTEGER,
    progress_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create progress logs table
CREATE TABLE public.progress_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.learning_goals(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    topic_covered TEXT,
    duration_minutes INTEGER,
    reflection TEXT,
    mood TEXT CHECK (mood IN ('excellent', 'good', 'neutral', 'frustrated')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recommendations table for AI suggestions
CREATE TABLE public.recommendations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.learning_goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    resource_url TEXT,
    resource_type TEXT CHECK (resource_type IN ('article', 'video', 'course', 'practice', 'book')),
    is_viewed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements/badges table
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB
);

-- Create reminders table
CREATE TABLE public.reminders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.learning_goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    reminder_type TEXT CHECK (reminder_type IN ('daily', 'weekly', 'custom')),
    reminder_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for learning_goals
CREATE POLICY "Users can view their own learning goals" 
ON public.learning_goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning goals" 
ON public.learning_goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning goals" 
ON public.learning_goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning goals" 
ON public.learning_goals FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for progress_logs
CREATE POLICY "Users can view their own progress logs" 
ON public.progress_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress logs" 
ON public.progress_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress logs" 
ON public.progress_logs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress logs" 
ON public.progress_logs FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
ON public.recommendations FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Users can view their own achievements" 
ON public.achievements FOR SELECT 
USING (auth.uid() = user_id);

-- Create RLS policies for reminders
CREATE POLICY "Users can view their own reminders" 
ON public.reminders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
ON public.reminders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.reminders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
ON public.reminders FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_learning_goals_updated_at
    BEFORE UPDATE ON public.learning_goals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_learning_goals_user_id ON public.learning_goals(user_id);
CREATE INDEX idx_progress_logs_user_id ON public.progress_logs(user_id);
CREATE INDEX idx_progress_logs_goal_id ON public.progress_logs(goal_id);
CREATE INDEX idx_progress_logs_date ON public.progress_logs(date);
CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);