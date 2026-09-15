import {
  Award,
  CalendarDays,
  Camera,
  ChevronRight,
  Code2,
  Cpu,
  FileJson2,
  GraduationCap,
  Hammer,
  Handshake,
  Home,
  Mail,
  MapPin,
  Menu,
  Rocket,
  ShieldCheck,
  Sparkles,
  TableProperties,
  Trophy,
  Users,
  Wrench,
  X
} from 'lucide-react';

const icons = {
  award: Award,
  calendar: CalendarDays,
  camera: Camera,
  code: Code2,
  cpu: Cpu,
  file: FileJson2,
  graduation: GraduationCap,
  hammer: Hammer,
  handshake: Handshake,
  home: Home,
  mail: Mail,
  map: MapPin,
  menu: Menu,
  rocket: Rocket,
  shield: ShieldCheck,
  sparkles: Sparkles,
  table: TableProperties,
  trophy: Trophy,
  users: Users,
  wrench: Wrench,
  x: X,
  chevron: ChevronRight
};

export const Icon = ({ name, size = 20, strokeWidth = 2 }) => {
  const Component = icons[name] || Sparkles;
  return <Component aria-hidden="true" size={size} strokeWidth={strokeWidth} />;
};
