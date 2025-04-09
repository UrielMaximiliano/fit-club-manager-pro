import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileEdit, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format, addDays, startOfWeek } from 'date-fns';

const studentsData = [
  { 
    id: 1, 
    name: "John Doe", 
    age: 22, 
    membershipType: "Premium",
    goals: "Muscle gain and weight increase",
    notes: "Focusing on upper body strength and protein intake",
    routines: {
      monday: {
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: "80kg" },
          { name: "Incline Press", sets: 3, reps: "10-12", weight: "60kg" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", weight: "15kg" },
          { name: "Tricep Pushdowns", sets: 3, reps: "12", weight: "35kg" }
        ],
        notes: "Focus on chest and triceps. Rest 60-90 seconds between sets."
      },
      tuesday: {
        exercises: [
          { name: "Squats", sets: 4, reps: "8", weight: "100kg" },
          { name: "Leg Press", sets: 3, reps: "10-12", weight: "160kg" },
          { name: "Leg Extensions", sets: 3, reps: "12", weight: "50kg" },
          { name: "Calf Raises", sets: 4, reps: "15", weight: "60kg" }
        ],
        notes: "Focus on legs. Make sure to maintain proper form on squats."
      },
      wednesday: {
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "8-10", weight: "Body weight" },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", weight: "65kg" },
          { name: "Seated Rows", sets: 3, reps: "12", weight: "60kg" },
          { name: "Bicep Curls", sets: 3, reps: "12", weight: "20kg" }
        ],
        notes: "Focus on back and biceps. Start with compound exercises."
      },
      thursday: {
        exercises: [
          { name: "Shoulder Press", sets: 4, reps: "8-10", weight: "50kg" },
          { name: "Lateral Raises", sets: 3, reps: "12", weight: "12kg" },
          { name: "Front Raises", sets: 3, reps: "12", weight: "10kg" },
          { name: "Shrugs", sets: 3, reps: "12", weight: "60kg" }
        ],
        notes: "Focus on shoulders. Keep moderate weight and perfect form."
      },
      friday: {
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", weight: "120kg" },
          { name: "Bent Over Rows", sets: 3, reps: "10", weight: "70kg" },
          { name: "Hammer Curls", sets: 3, reps: "12", weight: "18kg" },
          { name: "Concentration Curls", sets: 3, reps: "12", weight: "15kg" }
        ],
        notes: "Focus on back and biceps. Take extra time to warm up before deadlifts."
      },
      saturday: {
        exercises: [],
        notes: "Rest day or light cardio (20-30 minutes)"
      },
      sunday: {
        exercises: [],
        notes: "Complete rest day"
      }
    }
  },
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const RoutineDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const student = studentsData.find(s => s.id === Number(studentId));
  
  const [isEditing, setIsEditing] = useState(false);
  const [routineData, setRoutineData] = useState(student?.routines || {});
  const [selectedDay, setSelectedDay] = useState("monday");
  const [intensity, setIntensity] = useState("moderate");
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(new Date()));
  
  const weekDates = weekdays.map((day, index) => {
    return {
      day,
      date: addDays(weekStartDate, index)
    };
  });
  
  if (!student) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
        <p className="mb-6">We couldn't find the student you're looking for.</p>
        <Button onClick={() => navigate('/routines')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student Routines
        </Button>
      </div>
    );
  }
  
  const handleSaveRoutine = () => {
    toast({
      title: "Routine Saved",
      description: `The routine for ${student.name} has been updated successfully.`,
    });
    setIsEditing(false);
  };
  
  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handlePreviousWeek = () => {
    setWeekStartDate(prevDate => addDays(prevDate, -7));
  };

  const handleNextWeek = () => {
    setWeekStartDate(prevDate => addDays(prevDate, 7));
  };
  
  const handleNotesChange = (value) => {
    setRoutineData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        notes: value
      }
    }));
  };
  
  const handleAddExercise = () => {
    setRoutineData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        exercises: [
          ...prev[selectedDay].exercises,
          { name: "", sets: 3, reps: "", weight: "" }
        ]
      }
    }));
  };
  
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = routineData[selectedDay].exercises.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    );
    
    setRoutineData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        exercises: updatedExercises
      }
    }));
  };
  
  const handleRemoveExercise = (index) => {
    const updatedExercises = routineData[selectedDay].exercises.filter((_, i) => i !== index);
    
    setRoutineData(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        exercises: updatedExercises
      }
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/routines')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student List
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> {student.name}
            </CardTitle>
            <CardDescription>
              Age: {student.age} • {student.membershipType} Membership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Fitness Goals</h3>
              <p className="text-sm text-gray-600">{student.goals}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Trainer Notes</h3>
              <p className="text-sm text-gray-600">{student.notes}</p>
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Weekly Intensity</h3>
              <div>
                <RadioGroup 
                  value={intensity}
                  onValueChange={setIntensity}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intense" id="intense" />
                    <Label htmlFor="intense">Intense</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Weekly Routine</CardTitle>
                <CardDescription>View and edit the exercise routine</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  "Editing Mode"
                ) : (
                  <>
                    <FileEdit className="mr-2 h-4 w-4" /> Edit Routine
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" onClick={handlePreviousWeek} size="sm">
                Previous Week
              </Button>
              <p className="text-sm font-medium">
                {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'MMM d, yyyy')}
              </p>
              <Button variant="outline" onClick={handleNextWeek} size="sm">
                Next Week
              </Button>
            </div>

            <Tabs 
              defaultValue="monday" 
              value={selectedDay}
              onValueChange={handleDayChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-7 mb-6">
                {weekDates.map(({ day, date }) => (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="capitalize flex flex-col"
                  >
                    <span>{day.substring(0, 3)}</span>
                    <span className="text-xs font-normal text-muted-foreground mt-1">
                      {format(date, 'd')}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {weekdays.map((day, index) => (
                <TabsContent key={day} value={day} className="space-y-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold capitalize">
                      {day}, {format(weekDates[index].date, 'MMMM d, yyyy')}
                    </h3>
                  </div>
                  
                  {routineData[day]?.exercises?.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                            {isEditing && (
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {routineData[day]?.exercises.map((exercise, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.name}
                                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <span className="font-medium">{exercise.name}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Select 
                                    value={exercise.sets.toString()} 
                                    onValueChange={(value) => handleExerciseChange(index, 'sets', parseInt(value))}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Sets" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5, 6].map(num => (
                                        <SelectItem key={num} value={num.toString()}>
                                          {num}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <span>{exercise.sets}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.reps}
                                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <span>{exercise.reps}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.weight}
                                    onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                    className="w-full"
                                  />
                                ) : (
                                  <span>{exercise.weight}</span>
                                )}
                              </td>
                              {isEditing && (
                                <td className="px-4 py-3 text-right">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleRemoveExercise(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No exercises scheduled for this day.</p>
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={handleAddExercise}
                      >
                        Add Exercise
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Day Notes</h3>
                    {isEditing ? (
                      <Textarea
                        value={routineData[day]?.notes || ''}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Add notes for this day's routine..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-700">{routineData[day]?.notes || 'No notes for this day.'}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveRoutine}>
                <Save className="mr-2 h-4 w-4" /> Save Routine
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RoutineDetail;
