"use client";

import { Package, CheckCircle, Scan, Tags, Radio, AlertTriangle } from "lucide-react";

type Props = {
  totalProducts: number;
  activeProducts: number;
  rfidEnabledProducts: number;
  totalCategories: number;
  totalRFIDTags: number;
  lowStockProducts: number;
};

const cards = [
  {
    label: "Productos totales",
    value: "totalProducts",
    icon: Package,
    gradient: "from-sky-950 to-sky-900",
    border: "border-sky-700",
    labelColor: "text-sky-300",
    valueColor: "text-white",
    descColor: "text-sky-200",
    desc: "Incluye activos e inactivos.",
  },
  {
    label: "Productos activos",
    value: "activeProducts",
    icon: CheckCircle,
    gradient: "from-emerald-950 to-emerald-900",
    border: "border-emerald-700",
    labelColor: "text-emerald-300",
    valueColor: "text-white",
    descColor: "text-emerald-200",
    desc: "Disponibles para venta.",
  },
  {
    label: "Productos RFID",
    value: "rfidEnabledProducts",
    icon: Scan,
    gradient: "from-violet-950 to-violet-900",
    border: "border-violet-700",
    labelColor: "text-violet-300",
    valueColor: "text-white",
    descColor: "text-violet-200",
    desc: "Control RFID activado.",
  },
  {
    label: "Categorías",
    value: "totalCategories",
    icon: Tags,
    gradient: "from-amber-950 to-amber-900",
    border: "border-amber-700",
    labelColor: "text-amber-300",
    valueColor: "text-white",
    descColor: "text-amber-200",
    desc: "Categorías en el catálogo.",
  },
  {
    label: "Etiquetas RFID",
    value: "totalRFIDTags",
    icon: Radio,
    gradient: "from-fuchsia-950 to-fuchsia-900",
    border: "border-fuchsia-700",
    labelColor: "text-fuchsia-300",
    valueColor: "text-white",
    descColor: "text-fuchsia-200",
    desc: "Tags RFID registrados.",
  },
  {
    label: "Stock bajo",
    value: "lowStockProducts",
    icon: AlertTriangle,
    gradient: "from-rose-950 to-rose-900",
    border: "border-rose-700",
    labelColor: "text-rose-300",
    valueColor: "text-white",
    descColor: "text-rose-200",
    desc: "Stock menor o igual a 5.",
  },
];

export default function StatsCards(props: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const val = props[card.value as keyof Props] as number;
        return (
          <div
            key={card.value}
            className={`min-w-0 p-3 md:p-4 rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} shadow-sm space-y-1`}
          >
            <p className={`text-[10px] md:text-xs uppercase ${card.labelColor} tracking-wider truncate`}>
              {card.label}
            </p>
            <div className="flex items-center gap-1.5">
              <span className={`text-xl md:text-2xl font-semibold ${card.valueColor}`}>{val}</span>
              <Icon size={16} className={`${card.labelColor} shrink-0`} />
            </div>
            <p className={`text-[10px] md:text-xs leading-tight ${card.descColor}`}>{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
