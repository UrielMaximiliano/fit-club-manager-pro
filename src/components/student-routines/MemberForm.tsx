
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema validation
const memberRoutineSchema = z.object({
  first_name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  phone: z.string().min(8, {
    message: "El número de teléfono debe tener al menos 8 caracteres.",
  }),
  age: z.coerce.number().min(16).max(99),
  membership_type: z.string({
    required_error: "Por favor selecciona un tipo de membresía.",
  }),
  routineName: z.string().min(3, {
    message: "El nombre de la rutina debe tener al menos 3 caracteres.",
  }),
  routineDays: z.coerce.number().min(1).max(7),
  notes: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberRoutineSchema>;

interface MemberFormProps {
  onSubmit: (values: MemberFormValues) => void;
  loading: boolean;
  onCancel: () => void;
}

export const MemberForm = ({ onSubmit, loading, onCancel }: MemberFormProps) => {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberRoutineSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      age: 18,
      membership_type: "",
      routineName: "",
      routineDays: 3,
      notes: "",
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl text-white">Nuevo Miembro con Rutina</DialogTitle>
        <DialogDescription>Completa los datos del miembro y su rutina de ejercicios</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-300 border-b border-gray-700 pb-1">Datos del Miembro</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Nombre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nombre del miembro" 
                        className="bg-[#222732] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Apellido</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Apellido del miembro" 
                        className="bg-[#222732] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="correo@ejemplo.com" 
                        className="bg-[#222732] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Teléfono</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123456789" 
                        className="bg-[#222732] border-gray-700 text-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Edad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-[#222732] border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membership_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Tipo de membresía</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#222732] border-gray-700 text-white">
                          <SelectValue placeholder="Selecciona tipo de membresía" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1A1F2C] border-gray-700 text-white">
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Basic">Basic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <h3 className="font-medium text-sm text-gray-300 border-b border-gray-700 pb-1">Información de Rutina</h3>
            <FormField
              control={form.control}
              name="routineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Nombre de la Rutina</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Rutina de fuerza" 
                      className="bg-[#222732] border-gray-700 text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routineDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Días por semana</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={7}
                      className="bg-[#222732] border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observaciones o recomendaciones..." 
                      className="bg-[#222732] border-gray-700 text-white resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-xs">
                    Cualquier detalle importante sobre la rutina o el miembro.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="mr-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
