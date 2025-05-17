
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Download, ZoomIn, RefreshCw } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { memberServices } from '../../../services/memberService';
import DataExportActions from './DataExportActions';

interface MembershipExportProps {
  onRefresh?: () => void;
  isUpdating?: boolean;
  onZoom?: () => void;
}

const MembershipExport: React.FC<MembershipExportProps> = ({ 
  onRefresh,
  isUpdating = false,
  onZoom
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (type: 'json' | 'csv') => {
    setIsLoading(true);
    try {
      // Obtener datos frescos de Supabase
      const freshData = await memberServices.getAll();
      if (!freshData || freshData.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay datos para exportar',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      let dataStr = '';
      let fileName = '';
      if (type === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(freshData));
        fileName = 'membership_data.json';
      } else {
        // CSV
        const header = Object.keys(freshData[0]).join(',');
        const rows = freshData.map(row => Object.values(row).join(','));
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([header, ...rows].join('\n'));
        fileName = 'membership_data.csv';
      }
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', fileName);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({
        title: 'Descarga exitosa',
        description: `Archivo ${fileName} descargado correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener los datos actualizados',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-1">
      {onRefresh && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-textSecondary hover:text-text hover:bg-accent/10 rounded-full h-8 w-8 p-0 flex items-center justify-center"
          onClick={onRefresh}
          disabled={isLoading || isUpdating}
        >
          <RefreshCw className={`h-4 w-4 ${(isLoading || isUpdating) ? 'animate-spin' : ''}`} />
        </Button>
      )}
      {onZoom && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-textSecondary hover:text-text hover:bg-accent/10 rounded-full h-8 w-8 p-0 flex items-center justify-center"
          onClick={onZoom}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      )}
      <DataExportActions onExport={handleDownload} isLoading={isLoading} />
    </div>
  );
};

export default MembershipExport;
