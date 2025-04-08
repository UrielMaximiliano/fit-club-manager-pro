
export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipId: string;
  photo: string;
  address: string;
  city: string;
  postalCode: string;
  birthDate: string;
  registrationDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lockerId?: string | null;
};

export type Membership = {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  description: string;
  accessDays: string[]; // ["monday", "tuesday", etc.]
  accessTimeStart: string; // "09:00"
  accessTimeEnd: string; // "22:00"
  maxVisitsPerDay: number | null;
  status: 'active' | 'inactive';
};

export type Payment = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  type: 'cash' | 'card' | 'transfer';
  concept: string;
  status: 'completed' | 'pending' | 'cancelled';
};

export type CashRegister = {
  id: string;
  openingTime: string;
  closingTime: string | null;
  initialAmount: number;
  closingAmount: number | null;
  status: 'open' | 'closed';
  userId: string;
};

export type CashMovement = {
  id: string;
  registerId: string;
  amount: number;
  type: 'income' | 'expense';
  concept: string;
  date: string;
};

export type User = {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
};

export type AccessLog = {
  id: string;
  memberId: string;
  date: string;
  type: 'entry' | 'exit';
};

// Mock Members
export const members: Member[] = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "555-123-4567",
    membershipId: "1",
    photo: "/placeholder.svg",
    address: "Calle Principal 123",
    city: "Ciudad de México",
    postalCode: "01234",
    birthDate: "1985-05-10",
    registrationDate: "2023-01-15",
    emergencyContact: "María Pérez",
    emergencyPhone: "555-987-6543",
    notes: "Prefiere clases matutinas",
    status: "active",
    lockerId: "15"
  },
  {
    id: "2",
    firstName: "Ana",
    lastName: "González",
    email: "ana.gonzalez@example.com",
    phone: "555-234-5678",
    membershipId: "2",
    photo: "/placeholder.svg",
    address: "Av. Reforma 456",
    city: "Ciudad de México",
    postalCode: "01235",
    birthDate: "1990-03-22",
    registrationDate: "2023-02-01",
    emergencyContact: "Carlos González",
    emergencyPhone: "555-876-5432",
    notes: "Lesión previa en rodilla derecha",
    status: "active",
    lockerId: "23"
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "555-345-6789",
    membershipId: "1",
    photo: "/placeholder.svg",
    address: "Blvd. Insurgentes 789",
    city: "Ciudad de México",
    postalCode: "01236",
    birthDate: "1982-11-05",
    registrationDate: "2023-01-20",
    emergencyContact: "Laura Rodríguez",
    emergencyPhone: "555-765-4321",
    notes: "",
    status: "inactive",
    lockerId: null
  },
  {
    id: "4",
    firstName: "Laura",
    lastName: "Martínez",
    email: "laura.martinez@example.com",
    phone: "555-456-7890",
    membershipId: "3",
    photo: "/placeholder.svg",
    address: "Calle Juárez 101",
    city: "Guadalajara",
    postalCode: "44100",
    birthDate: "1995-07-18",
    registrationDate: "2023-02-10",
    emergencyContact: "Miguel Martínez",
    emergencyPhone: "555-654-3210",
    notes: "Interesada en yoga y pilates",
    status: "active",
    lockerId: "7"
  },
  {
    id: "5",
    firstName: "Miguel",
    lastName: "López",
    email: "miguel.lopez@example.com",
    phone: "555-567-8901",
    membershipId: "2",
    photo: "/placeholder.svg",
    address: "Av. Universidad 202",
    city: "Monterrey",
    postalCode: "64000",
    birthDate: "1988-09-30",
    registrationDate: "2023-01-25",
    emergencyContact: "Sofía López",
    emergencyPhone: "555-543-2109",
    notes: "Preparando para maratón",
    status: "pending",
    lockerId: null
  }
];

// Mock Memberships
export const memberships: Membership[] = [
  {
    id: "1",
    name: "Básico",
    price: 500,
    duration: 30,
    description: "Acceso a equipos básicos y áreas comunes",
    accessDays: ["monday", "wednesday", "friday"],
    accessTimeStart: "07:00",
    accessTimeEnd: "15:00",
    maxVisitsPerDay: 1,
    status: "active"
  },
  {
    id: "2",
    name: "Premium",
    price: 800,
    duration: 30,
    description: "Acceso total a todas las áreas y equipos",
    accessDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    accessTimeStart: "06:00",
    accessTimeEnd: "23:00",
    maxVisitsPerDay: null,
    status: "active"
  },
  {
    id: "3",
    name: "VIP",
    price: 1200,
    duration: 30,
    description: "Acceso total + sesiones con entrenador personal",
    accessDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    accessTimeStart: "00:00",
    accessTimeEnd: "23:59",
    maxVisitsPerDay: null,
    status: "active"
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: "1",
    memberId: "1",
    amount: 500,
    date: "2023-01-15",
    type: "cash",
    concept: "Membresía Enero",
    status: "completed"
  },
  {
    id: "2",
    memberId: "2",
    amount: 800,
    date: "2023-02-01",
    type: "card",
    concept: "Membresía Febrero",
    status: "completed"
  },
  {
    id: "3",
    memberId: "3",
    amount: 500,
    date: "2023-01-20",
    type: "transfer",
    concept: "Membresía Enero",
    status: "completed"
  },
  {
    id: "4",
    memberId: "4",
    amount: 1200,
    date: "2023-02-10",
    type: "cash",
    concept: "Membresía Febrero",
    status: "completed"
  },
  {
    id: "5",
    memberId: "1",
    amount: 500,
    date: "2023-02-15",
    type: "card",
    concept: "Membresía Febrero",
    status: "pending"
  }
];

// Mock Cash Registers
export const cashRegisters: CashRegister[] = [
  {
    id: "1",
    openingTime: "2023-03-01T08:00:00",
    closingTime: "2023-03-01T20:00:00",
    initialAmount: 1000,
    closingAmount: 2500,
    status: "closed",
    userId: "1"
  },
  {
    id: "2",
    openingTime: "2023-03-02T08:00:00",
    closingTime: null,
    initialAmount: 1000,
    closingAmount: null,
    status: "open",
    userId: "1"
  }
];

// Mock Cash Movements
export const cashMovements: CashMovement[] = [
  {
    id: "1",
    registerId: "1",
    amount: 500,
    type: "income",
    concept: "Pago de membresía",
    date: "2023-03-01T10:15:00"
  },
  {
    id: "2",
    registerId: "1",
    amount: 800,
    type: "income",
    concept: "Pago de membresía",
    date: "2023-03-01T14:30:00"
  },
  {
    id: "3",
    registerId: "1",
    amount: 300,
    type: "expense",
    concept: "Compra de productos limpieza",
    date: "2023-03-01T16:45:00"
  },
  {
    id: "4",
    registerId: "2",
    amount: 1200,
    type: "income",
    concept: "Pago de membresía",
    date: "2023-03-02T09:20:00"
  },
  {
    id: "5",
    registerId: "2",
    amount: 200,
    type: "expense",
    concept: "Insumos cafetería",
    date: "2023-03-02T11:10:00"
  }
];

// Mock Users
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Administrador",
    role: "admin",
    status: "active"
  },
  {
    id: "2",
    username: "staff1",
    name: "Empleado 1",
    role: "staff",
    status: "active"
  }
];

// Mock Access Logs
export const accessLogs: AccessLog[] = [
  {
    id: "1",
    memberId: "1",
    date: "2023-03-01T09:15:00",
    type: "entry"
  },
  {
    id: "2",
    memberId: "1",
    date: "2023-03-01T11:45:00",
    type: "exit"
  },
  {
    id: "3",
    memberId: "2",
    date: "2023-03-01T16:30:00",
    type: "entry"
  },
  {
    id: "4",
    memberId: "2",
    date: "2023-03-01T18:00:00",
    type: "exit"
  },
  {
    id: "5",
    memberId: "4",
    date: "2023-03-02T10:00:00",
    type: "entry"
  }
];

export const getMemberById = (id: string): Member | undefined => {
  return members.find(member => member.id === id);
};

export const getMembershipById = (id: string): Membership | undefined => {
  return memberships.find(membership => membership.id === id);
};

export const getPaymentsByMemberId = (memberId: string): Payment[] => {
  return payments.filter(payment => payment.memberId === memberId);
};

export const getAccessLogsByMemberId = (memberId: string): AccessLog[] => {
  return accessLogs.filter(log => log.memberId === memberId);
};
