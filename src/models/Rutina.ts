export interface Ejercicio {
  nombre: string;
  repeticiones: number;
  peso: number;
}

export interface DiaRutina {
  dia: string;
  ejercicios: Ejercicio[];
}

export interface Rutina {
  idMiembro: string;
  dias: DiaRutina[];
} 