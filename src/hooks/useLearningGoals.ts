import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LearningGoal {
  id: string;
  title: string;
  description?: string;
  progress_percentage?: number;
  target_date?: string;
  estimated_hours_per_week?: number;
  category?: string;
  status?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useLearningGoals = () => {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      toast.error('Failed to load learning goals');
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<LearningGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('learning_goals')
        .insert({
          ...goalData,
          progress_percentage: 0,
          status: 'active',
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [data, ...prev]);
      toast.success('Goal created successfully');
      return data;
    } catch (err) {
      console.error('Error creating goal:', err);
      toast.error('Failed to create goal');
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<LearningGoal>) => {
    try {
      const { data, error } = await supabase
        .from('learning_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, ...data } : goal
      ));
      toast.success('Goal updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating goal:', err);
      toast.error('Failed to update goal');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('learning_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Goal deleted successfully');
    } catch (err) {
      console.error('Error deleting goal:', err);
      toast.error('Failed to delete goal');
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals
  };
};