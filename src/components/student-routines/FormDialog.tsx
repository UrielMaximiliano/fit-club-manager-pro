
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { MemberForm, MemberFormValues } from './MemberForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (values: MemberFormValues) => void;
  loading: boolean;
}

export const FormDialog = ({ isOpen, setIsOpen, onSubmit, loading }: FormDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {!isMobile && "Nuevo Miembro con Rutina"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1F2C] border-gray-700 text-white">
        <MemberForm 
          onSubmit={onSubmit}
          loading={loading}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
