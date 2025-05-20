export interface WorkoutExercise {
  id: string; // Primary Key
  workout_routine_day_id: string; // Foreign Key to WorkoutRoutineDays
  tenant_id: string;
  exercise_name: string;
  sets?: number; // Optional, e.g., 3
  repetitions?: string; // Optional, e.g., "10-12 reps"
  weight?: string; // Optional, e.g., "50 kg", "Bodyweight"
  notes?: string; // Optional, e.g., "Focus on form", "Rest 60s"
  created_at: string;
  updated_at: string;
}

export interface WorkoutRoutineDay {
  id: string; // Primary Key
  workout_routine_id: string; // Foreign Key to WorkoutRoutines
  tenant_id: string;
  day_of_week?: number; // e.g., 1 for Monday, 7 for Sunday, or null if it's just Day 1, Day 2 etc.
  day_number?: number; // e.g., Day 1, Day 2 of the routine cycle
  name?: string; // Optional, e.g., "Chest Day", "Cardio & Abs"
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[]; // Optional: For easily embedding exercises if fetched together
}

export interface WorkoutRoutine {
  id: string; // Primary Key
  member_id: string; // Foreign Key to Members table
  tenant_id: string;
  name: string; // e.g., "Week 1 Chest & Back", "Leg Day Routine"
  description?: string; // Optional, details about the routine
  created_at: string;
  updated_at: string;
  routine_days?: WorkoutRoutineDay[]; // Optional: For easily embedding days if fetched together
}
