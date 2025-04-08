
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, CreditCard, User, Phone, Mail, MapPin, Clock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  getMemberById, 
  getMembershipById, 
  getPaymentsByMemberId, 
  getAccessLogsByMemberId 
} from "../data/mockData";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const member = getMemberById(id ?? "");
  const membership = member ? getMembershipById(member.membershipId) : undefined;
  const payments = member ? getPaymentsByMemberId(member.id) : [];
  const accessLogs = member ? getAccessLogsByMemberId(member.id) : [];

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">Miembro no encontrado</h2>
        <Button onClick={() => navigate("/members")}>Volver a Miembros</Button>
      </div>
    );
  }

  const getStatusClass = () => {
    switch (member.status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "suspended": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate("/members")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">Detalles del Miembro</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Member Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                <img 
                  src={member.photo} 
                  alt={`${member.firstName} ${member.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">{member.firstName} {member.lastName}</h2>
              <Badge className={`mt-2 ${getStatusClass()}`} variant="outline">
                {member.status === "active" && "Activo"}
                {member.status === "inactive" && "Inactivo"}
                {member.status === "pending" && "Pendiente"}
                {member.status === "suspended" && "Suspendido"}
              </Badge>
              
              <div className="w-full mt-6 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.address}, {member.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Nacimiento: {member.birthDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Registro: {member.registrationDate}</span>
                </div>
                {member.lockerId && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Locker: {member.lockerId}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Details */}
        <div className="md:col-span-3">
          <Tabs defaultValue="membership">
            <TabsList className="w-full">
              <TabsTrigger value="membership" className="flex-1">Membresía</TabsTrigger>
              <TabsTrigger value="payments" className="flex-1">Pagos</TabsTrigger>
              <TabsTrigger value="attendance" className="flex-1">Asistencia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="membership" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Membresía</CardTitle>
                  <CardDescription>Detalles de la membresía actual</CardDescription>
                </CardHeader>
                <CardContent>
                  {membership ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{membership.name}</h3>
                        <p className="text-muted-foreground mb-4">{membership.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Precio:</span>
                            <span className="font-medium">${membership.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duración:</span>
                            <span className="font-medium">{membership.duration} días</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Horario:</span>
                            <span className="font-medium">{membership.accessTimeStart} - {membership.accessTimeEnd}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Visitas por día:</span>
                            <span className="font-medium">{membership.maxVisitsPerDay ?? "Ilimitadas"}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Días de acceso</h4>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                          {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => {
                            const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                            const isActive = membership.accessDays.includes(days[i]);
                            return (
                              <div 
                                key={day} 
                                className={`flex items-center justify-center w-8 h-8 rounded-full 
                                  ${isActive ? "bg-gym-primary text-white" : "bg-gray-100 text-gray-400"}`}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>
                        
                        <h4 className="font-medium mb-2">Notas</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.notes || "Sin notas adicionales."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No hay información de membresía disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pagos</CardTitle>
                  <CardDescription>Registro de pagos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.concept}</TableCell>
                            <TableCell>
                              {payment.type === "cash" && "Efectivo"}
                              {payment.type === "card" && "Tarjeta"}
                              {payment.type === "transfer" && "Transferencia"}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"} 
                                variant="outline"
                              >
                                {payment.status === "completed" ? "Completado" : "Pendiente"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">${payment.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No hay pagos registrados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Asistencia</CardTitle>
                  <CardDescription>Historial de ingresos al gimnasio</CardDescription>
                </CardHeader>
                <CardContent>
                  {accessLogs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessLogs.map((log) => {
                          const date = new Date(log.date);
                          return (
                            <TableRow key={log.id}>
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
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No hay registros de asistencia</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
