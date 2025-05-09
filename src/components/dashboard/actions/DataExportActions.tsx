
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportActionsProps {
  onExport: (type: 'json' | 'csv') => Promise<void>;
  isLoading: boolean;
}

const DataExportActions: React.FC<ExportActionsProps> = ({ onExport, isLoading }) => {
  return (
    <div className="flex gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-textSecondary hover:text-text hover:bg-accent/10 rounded-full h-8 w-8 p-0 flex items-center justify-center"
        onClick={() => onExport('json')}
        disabled={isLoading}
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs text-textSecondary hover:text-text h-8"
        onClick={() => onExport('csv')}
        disabled={isLoading}
      >
        CSV
      </Button>
    </div>
  );
};

export default DataExportActions;
