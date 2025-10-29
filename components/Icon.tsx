// src/components/Icon.tsx
import React from "react";
import {
  ArrowLeft,
  Trash,
  Pencil,
  Home,
  Settings,
  Plus,
  BarChart,
  FileText,
  Tractor,
  User,
  Save,
  Edit3,
} from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
}

const icons: Record<string, React.ElementType> = {
  "arrow-left": ArrowLeft,
  "trash": Trash,
  "pencil": Pencil,
  "home": Home,
  "settings": Settings,
  "plus": Plus,
  "bar-chart": BarChart,
  "file-text": FileText,
  "tractor": Tractor,
  "user": User,
  "save": Save,
  "edit": Edit3,
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    console.warn(`Ícone "${name}" não encontrado.`);
    return null;
  }
  return <LucideIcon className={className} />;
};

export default Icon;
