
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { members, payments, accessLogs } from "../data/mockData";
import { Users, CreditCard, CalendarClock, TrendingUp } from "lucide-react";

const Dashboard = () => {
  // Get statistics for today
  const today = new Date().toISOString().split('T')[0];
  const todayVisits = accessLogs.filter(log => log.date.startsWith(today) && log.type === "entry");
  const todayPayments = payments.filter(payment => payment.date === today);
  const totalMembers = members.filter(member => member.status === "active").length;
  const totalIncome = payments.reduce((acc, payment) => {
    if (payment.status === "completed") {
      return acc + payment.amount;
    }
    return acc;
  }, 0);

  const stats = [
    {
      title: "Miembros Activos",
      value: totalMembers,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      description: "Total de miembros activos",
    },
    {
      title: "Visitas Hoy",
      value: todayVisits.length,
      icon: <CalendarClock className="h-8 w-8 text-green-500" />,
      description: "Total de ingresos al gimnasio hoy",
    },
    {
      title: "Pagos Hoy",
      value: todayPayments.length,
      icon: <CreditCard className="h-8 w-8 text-purple-500" />,
      description: "Número de pagos registrados hoy",
    },
    {
      title: "Ingresos Totales",
      value: `$${totalIncome}`,
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      description: "Ingresos totales acumulados",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessLogs.slice(0, 5).map((log, i) => {
                const member = members.find(m => m.id === log.memberId);
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{member?.firstName} {member?.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm ${log.type === "entry" ? "text-green-500" : "text-red-500"}`}>
                      {log.type === "entry" ? "Entrada" : "Salida"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment, i) => {
                const member = members.find(m => m.id === payment.memberId);
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{member?.firstName} {member?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{payment.concept}</p>
                      </div>
                    </div>
                    <span className="font-medium">${payment.amount}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
