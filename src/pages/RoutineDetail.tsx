import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileEdit, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const studentsData = [
  { 
    id: 1, 
    name: "John Doe", 
    age: 22, 
    membershipType: "Premium",
    goals: "Ganancia muscular y aumento de peso",
    notes: "Enfoque en fuerza de la parte superior del cuerpo y consumo de proteínas",
    routines: {
      monday: {
        exercises: [
          { name: "Press de Banca", sets: 4, reps: "8-10", weight: "80kg" },
          { name: "Press Inclinado", sets: 3, reps: "10-12", weight: "60kg" },
          { name: "Vuelos con Cable", sets: 3, reps: "12-15", weight: "15kg" },
          { name: "Extensión de Tríceps", sets: 3, reps: "12", weight: "35kg" }
        ],
        notes: "Enfoque en pecho y tríceps. Descansar 60-90 segundos entre series."
      },
      tuesday: {
        exercises: [
          { name: "Sentadillas", sets: 4, reps: "8", weight: "100kg" },
          { name: "Prensa de Piernas", sets: 3, reps: "10-12", weight: "160kg" },
          { name: "Extensiones de Pierna", sets: 3, reps: "12", weight: "50kg" },
          { name: "Elevaciones de Pantorrilla", sets: 4, reps: "15", weight: "60kg" }
        ],
        notes: "Enfoque en piernas. Mantener buena forma en las sentadillas."
      },
      wednesday: {
        exercises: [
          { name: "Dominadas", sets: 4, reps: "8-10", weight: "Peso corporal" },
          { name: "Jalones en Polea", sets: 3, reps: "10-12", weight: "65kg" },
          { name: "Remo Sentado", sets: 3, reps: "12", weight: "60kg" },
          { name: "Curl de Bíceps", sets: 3, reps: "12", weight: "20kg" }
        ],
        notes: "Enfoque en espalda y bíceps. Comenzar con ejercicios compuestos."
      },
      thursday: {
        exercises: [
          { name: "Press de Hombros", sets: 4, reps: "8-10", weight: "50kg" },
          { name: "Elevaciones Laterales", sets: 3, reps: "12", weight: "12kg" },
          { name: "Elevaciones Frontales", sets: 3, reps: "12", weight: "10kg" },
          { name: "Encogimientos", sets: 3, reps: "12", weight: "60kg" }
        ],
        notes: "Enfoque en hombros. Mantener peso moderado y forma perfecta."
      },
      friday: {
        exercises: [
          { name: "Peso Muerto", sets: 4, reps: "6-8", weight: "120kg" },
          { name: "Remo Inclinado", sets: 3, reps: "10", weight: "70kg" },
          { name: "Curl Martillo", sets: 3, reps: "12", weight: "18kg" },
          { name: "Curl de Concentración", sets: 3, reps: "12", weight: "15kg" }
        ],
        notes: "Enfoque en espalda y bíceps. Tomar tiempo extra para calentar antes del peso muerto."
      },
      saturday: {
        exercises: [],
        notes: "Día de descanso o cardio ligero (20-30 minutos)"
      },
      sunday: {
        exercises: [],
        notes: "Día de descanso completo"
      }
    }
  },
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const weekdaysSpanish = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const RoutineDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const student = studentsData.find(s => s.id === Number(studentId));
  
  const [isEditing, setIsEditing] = useState(false);
  const [routineData, setRoutineData] = useState(student?.routines || {});
  const [selectedDay, setSelectedDay] = useState("monday");
  const [intensity, setIntensity] = useState("moderate");
  const [weekStartDate, setWeekStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekDates = weekdays.map((day, index) => {
    return {
      day,
      date: addDays(weekStartDate, index)
    };
  });
  
  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 text-center bg-[#1A1F2C] text-white min-h-screen">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Estudiante no encontrado</h2>
        <p className="mb-6">No pudimos encontrar al estudiante que buscas.</p>
        <Button onClick={() => navigate('/routines')} className="bg-blue-700 hover:bg-blue-800 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Rutinas de Estudiantes
        </Button>
      </div>
    );
  }
  
  const handleSaveRoutine = () => {
    toast({
      title: "Rutina Guardada",
      description: `La rutina para ${student.name} ha sido actualizada con éxito.`,
    });
    setIsEditing(false);
  };
  
  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const handlePreviousWeek = () => {
    setWeekStartDate(prevDate => subDays(prevDate, 7));
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
    <div className="p-0 pb-6">
      <div className="flex justify-between items-center mb-4 md:mb-6 px-2 md:px-0">
        <div className={isMobile ? "ml-14" : ""}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/members')} 
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 text-xs md:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Volver
          </Button>
        </div>
        <div className="text-white text-xs md:text-sm">Administrador</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
        <Card className="lg:col-span-1 bg-[#1A1F2C] border-gray-800 shadow-lg">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="flex items-center gap-2 text-white text-base md:text-lg">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" /> {student.name}
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs md:text-sm">
              Edad: {student.age} • Membresía {student.membershipType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 text-gray-300 p-3 md:p-6">
            <div>
              <h3 className="text-xs md:text-sm font-medium mb-1 text-white">Objetivos de Fitness</h3>
              <p className="text-xs md:text-sm">{student.goals}</p>
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-medium mb-1 text-white">Notas del Entrenador</h3>
              <p className="text-xs md:text-sm">{student.notes}</p>
            </div>
            <div className="pt-3 md:pt-4 border-t border-gray-700">
              <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3 text-white">Intensidad Semanal</h3>
              <div>
                <RadioGroup 
                  value={intensity}
                  onValueChange={setIntensity}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" className="border-gray-600 h-3 w-3 md:h-4 md:w-4" />
                    <Label htmlFor="light" className="text-xs md:text-sm">Ligera</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" className="border-gray-600 h-3 w-3 md:h-4 md:w-4" />
                    <Label htmlFor="moderate" className="text-xs md:text-sm">Moderada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intense" id="intense" className="border-gray-600 h-3 w-3 md:h-4 md:w-4" />
                    <Label htmlFor="intense" className="text-xs md:text-sm">Intensa</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-[#1A1F2C] border-gray-800 shadow-lg">
          <CardHeader className="p-3 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <CardTitle className="text-white text-base md:text-lg">Rutina Semanal</CardTitle>
                <CardDescription className="text-gray-400 text-xs md:text-sm">Ver y editar la rutina de ejercicios</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className={`${isEditing ? "bg-blue-700 text-white" : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"} mt-2 md:mt-0 text-xs md:text-sm`}
                size={isMobile ? "sm" : "default"}
              >
                {isEditing ? (
                  "Modo Edición"
                ) : (
                  <>
                    <FileEdit className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Editar Rutina
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-gray-300 p-3 md:p-6">
            <div className="flex items-center justify-between mb-4 text-xs md:text-sm">
              <Button 
                variant="outline" 
                onClick={handlePreviousWeek} 
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 text-xs md:text-sm px-2 md:px-3"
              >
                <ChevronLeft className="mr-0 md:mr-1 h-3 w-3 md:h-4 md:w-4" /> 
                {!isMobile && "Semana Anterior"}
              </Button>
              <p className="text-xs md:text-sm font-medium mx-1 md:mx-0">
                {format(weekStartDate, 'dd MMM')} - {format(addDays(weekStartDate, 6), 'dd MMM, yyyy')}
              </p>
              <Button 
                variant="outline" 
                onClick={handleNextWeek} 
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 text-xs md:text-sm px-2 md:px-3"
              >
                {!isMobile && "Siguiente Semana"} 
                <ChevronRight className="ml-0 md:ml-1 h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>

            <Tabs 
              defaultValue="monday" 
              value={selectedDay}
              onValueChange={handleDayChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-7 mb-4 md:mb-6 bg-[#222732] h-auto">
                {weekDates.map(({ day, date }, index) => (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="capitalize flex flex-col data-[state=active]:bg-blue-700 text-gray-300 py-1 md:py-2 px-0 h-auto min-w-0 text-xs md:text-sm"
                  >
                    <span>{isMobile ? weekdaysSpanish[index].substring(0, 1) : weekdaysSpanish[index].substring(0, 3)}</span>
                    <span className="text-[10px] md:text-xs font-normal text-gray-400 mt-0 md:mt-1">
                      {format(date, 'd')}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {weekdays.map((day, index) => (
                <TabsContent key={day} value={day} className="space-y-3 md:space-y-4">
                  <div className="mb-2 md:mb-4 flex items-center justify-between">
                    <h3 className="text-sm md:text-lg font-semibold capitalize text-white">
                      {weekdaysSpanish[index]}, {format(weekDates[index].date, 'd MMM')}
                    </h3>
                  </div>
                  
                  {routineData[day]?.exercises?.length > 0 ? (
                    <div className="border border-gray-700 rounded-lg overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#222732]">
                          <tr>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">Ejercicio</th>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">Series</th>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">Reps</th>
                            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">Peso</th>
                            {isEditing && (
                              <th className="px-2 md:px-4 py-2 md:py-3 text-right text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-[#1A1F2C] divide-y divide-gray-700">
                          {routineData[day]?.exercises.map((exercise, index) => (
                            <tr key={index}>
                              <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.name}
                                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                    className="w-full bg-[#222732] border-gray-700 text-white text-xs md:text-sm h-7 md:h-10"
                                  />
                                ) : (
                                  <span className="font-medium text-white text-xs md:text-sm">{exercise.name}</span>
                                )}
                              </td>
                              <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Select 
                                    value={exercise.sets.toString()} 
                                    onValueChange={(value) => handleExerciseChange(index, 'sets', parseInt(value))}
                                  >
                                    <SelectTrigger className="w-full bg-[#222732] border-gray-700 text-white text-xs md:text-sm h-7 md:h-10">
                                      <SelectValue placeholder="Series" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#222732] border-gray-700 text-white">
                                      {[1, 2, 3, 4, 5, 6].map(num => (
                                        <SelectItem key={num} value={num.toString()}>
                                          {num}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <span className="text-xs md:text-sm">{exercise.sets}</span>
                                )}
                              </td>
                              <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.reps}
                                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                    className="w-full bg-[#222732] border-gray-700 text-white text-xs md:text-sm h-7 md:h-10"
                                  />
                                ) : (
                                  <span className="text-xs md:text-sm">{exercise.reps}</span>
                                )}
                              </td>
                              <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">
                                {isEditing ? (
                                  <Input
                                    value={exercise.weight}
                                    onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                    className="w-full bg-[#222732] border-gray-700 text-white text-xs md:text-sm h-7 md:h-10"
                                  />
                                ) : (
                                  <span className="text-xs md:text-sm">{exercise.weight}</span>
                                )}
                              </td>
                              {isEditing && (
                                <td className="px-2 md:px-4 py-2 md:py-3 text-right">
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleRemoveExercise(index)}
                                    className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                                  >
                                    {isMobile ? "✕" : "Eliminar"}
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 md:p-6 bg-[#222732] rounded-lg">
                      <p className="text-gray-400 text-xs md:text-sm">No hay ejercicios programados para este día.</p>
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="flex justify-center mt-2 md:mt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleAddExercise}
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 text-xs md:text-sm"
                        size={isMobile ? "sm" : "default"}
                      >
                        Añadir Ejercicio
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-4 md:mt-6">
                    <h3 className="text-xs md:text-sm font-medium mb-1 md:mb-2 text-white">Notas del Día</h3>
                    {isEditing ? (
                      <Textarea
                        value={routineData[day]?.notes || ''}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Añadir notas para la rutina de este día..."
                        className="min-h-[80px] md:min-h-[100px] bg-[#222732] border-gray-700 text-white text-xs md:text-sm"
                      />
                    ) : (
                      <div className="p-2 md:p-3 bg-[#222732] rounded-md">
                        <p className="text-xs md:text-sm">{routineData[day]?.notes || 'No hay notas para este día.'}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end p-3 md:p-6">
              <Button 
                onClick={handleSaveRoutine} 
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs md:text-sm"
                size={isMobile ? "sm" : "default"}
              >
                <Save className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Guardar Rutina
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RoutineDetail;
