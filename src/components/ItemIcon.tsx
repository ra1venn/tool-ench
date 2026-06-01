import {
  Sword,
  Pickaxe,
  Axe,
  Shovel,
  Wheat,
  Crosshair,
  HardHat,
  Shirt,
  Footprints,
  Fish,
  Wind,
  Hammer,
  BookOpen,
  type LucideProps,
} from 'lucide-react';
import { ItemType } from '../data/enchantments';

// Custom Leggings icon (no perfect match in Lucide)
function LeggingsIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M6 3h12v4c0 1-1 3-2 5l-1 8H9L8 12c-1-2-2-4-2-5V3z" />
      <path d="M12 3v19" />
    </svg>
  );
}

// Custom Trident icon
function TridentIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M12 2v20" />
      <path d="M5 5l7 5l7-5" />
      <path d="M5 2v5" />
      <path d="M19 2v5" />
      <path d="M12 2v5" />
    </svg>
  );
}

// Custom Bow icon
function BowIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4 20 C4 10 10 4 20 4" />
      <line x1="4" y1="20" x2="20" y2="4" />
      <path d="M16 4l4 0l0 4" />
    </svg>
  );
}

const ICON_MAP: Record<ItemType, React.ComponentType<LucideProps>> = {
  sword: Sword,
  pickaxe: Pickaxe,
  axe: Axe,
  shovel: Shovel,
  hoe: Wheat,
  bow: BowIcon,
  crossbow: Crosshair,
  trident: TridentIcon,
  helmet: HardHat,
  chestplate: Shirt,
  leggings: LeggingsIcon,
  boots: Footprints,
  fishing_rod: Fish,
  elytra: Wind,
  mace: Hammer,
};

interface ItemIconProps {
  itemType: ItemType;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function ItemIcon({ itemType, size = 24, className = '', strokeWidth = 2 }: ItemIconProps) {
  const Icon = ICON_MAP[itemType];
  if (!Icon) return null;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} />;
}

// Book icon for enchanted books
export function BookIcon({ size = 24, className = '', strokeWidth = 2 }: Omit<ItemIconProps, 'itemType'>) {
  return <BookOpen size={size} className={className} strokeWidth={strokeWidth} />;
}


