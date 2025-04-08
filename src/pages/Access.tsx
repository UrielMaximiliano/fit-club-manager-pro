
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { accessLogs, members, getMemberById } from "../data/mockData";
import { Search, Check, X, UserCheck, QrCode } from "lucide-react";
import { toast } from "sonner";

const Access = () => {
  const [memberId, setMemberId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessResult, setAccessResult] = useState<{
    member?: typeof members[0];
    allowed: boolean;
    message: string;
  } | null>(null);

  const handleCheckAccess = () => {
    if (!memberId) {
      toast.error("Por favor, ingresa un ID de miembro");
      return;
    }

    const member = getMemberById(memberId);
    
    if (!member) {
      setAccessResult({
        allowed: false,
        message: "Miembro no encontrado",
      });
      return;
    }

    if (member.status !== "active") {
      setAccessResult({
        member,
        allowed: false,
        message: "Membresía inactiva",
      });
      return;
    }

    // In a real system we would check more conditions like time restrictions
    setAccessResult({
      member,
      allowed: true,
      message: "Acceso permitido",
    });

    // Log the access
    if (member) {
      // This would be saved to the database in a real system
      toast.success(`Acceso registrado para ${member.firstName} ${member.lastName}`);
    }
  };

  const filteredLogs = accessLogs
    .filter(log => {
      if (!searchTerm) return true;
      
      const member = getMemberById(log.memberId);
      if (!member) return false;
      
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Control de Acceso</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Acceso</CardTitle>
            <CardDescription>Ingresa el ID o escanea el código para verificar el acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex space-x-2">
                <Input 
                  placeholder="ID de miembro" 
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
                <Button onClick={handleCheckAccess} className="bg-gym-primary hover:bg-blue-600">
                  Verificar
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                <QrCode className="mr-2 h-4 w-4" /> Escanear Código
              </Button>

              {accessResult && (
                <div className={`mt-4 p-4 rounded-md border ${accessResult.allowed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center">
                    {accessResult.allowed ? (
                      <Check className="h-6 w-6 text-green-500 mr-2" />
                    ) : (
                      <X className="h-6 w-6 text-red-500 mr-2" />
                    )}
                    <div>
                      <p className={`font-semibold ${accessResult.allowed ? "text-green-700" : "text-red-700"}`}>
                        {accessResult.message}
                      </p>
                      {accessResult.member && (
                        <p className="text-sm mt-1">
                          {accessResult.member.firstName} {accessResult.member.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Miembros Presentes</CardTitle>
            <CardDescription>Miembros actualmente en el gimnasio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* In a real app, we would track who is currently in the gym */}
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-gym-primary mr-3" />
                  <div>
                    <p className="font-medium">Juan Pérez</p>
                    <p className="text-sm text-muted-foreground">Entrada: 10:15 AM</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Presente
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-gym-primary mr-3" />
                  <div>
                    <p className="font-medium">Ana González</p>
                    <p className="text-sm text-muted-foreground">Entrada: 11:30 AM</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Presente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Accesos</CardTitle>
          <CardDescription>Historial reciente de entradas y salidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Buscar por nombre..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const member = getMemberById(log.memberId);
                  const date = new Date(log.date);
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {member ? `${member.firstName} ${member.lastName}` : "Desconocido"}
                      </TableCell>
                      <TableCell>{date.toLocaleDateString()}</TableCell>
                      <TableCell>{date.toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={log.type === "entry" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"} 
                          variant="outline"
                        >
                          {log.type === "entry" ? "Entrada" : "Salida"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Access;
