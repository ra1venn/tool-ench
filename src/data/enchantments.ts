// All enchantment data sourced from https://minecraft.wiki/w/Anvil_mechanics
// Multipliers are for book -> item (since we're combining books onto items)

export interface Enchantment {
  id: string;
  name: string;
  maxLevel: number;
  bookMultiplier: number;
  itemMultiplier: number;
  incompatibleWith: string[];
  appliesTo: string[];
}

export type ItemType =
  | 'sword'
  | 'pickaxe'
  | 'axe'
  | 'shovel'
  | 'hoe'
  | 'bow'
  | 'crossbow'
  | 'trident'
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots'
  | 'fishing_rod'
  | 'elytra'
  | 'mace';

export const ITEMS: { id: ItemType; name: string }[] = [
  { id: 'sword', name: 'Sword' },
  { id: 'pickaxe', name: 'Pickaxe' },
  { id: 'axe', name: 'Axe' },
  { id: 'shovel', name: 'Shovel' },
  { id: 'hoe', name: 'Hoe' },
  { id: 'bow', name: 'Bow' },
  { id: 'crossbow', name: 'Crossbow' },
  { id: 'trident', name: 'Trident' },
  { id: 'helmet', name: 'Helmet' },
  { id: 'chestplate', name: 'Chestplate' },
  { id: 'leggings', name: 'Leggings' },
  { id: 'boots', name: 'Boots' },
  { id: 'fishing_rod', name: 'Fishing Rod' },
  { id: 'elytra', name: 'Elytra' },
  { id: 'mace', name: 'Mace' },
];

// Enchantment groups for tools/weapons/armor
// Melee weapons: sword, axe
const TOOLS = ['pickaxe', 'axe', 'shovel', 'hoe'];
const ALL_ARMOR = ['helmet', 'chestplate', 'leggings', 'boots'];
const ALL_DAMAGEABLE = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe', 'bow', 'crossbow', 'trident', 'helmet', 'chestplate', 'leggings', 'boots', 'fishing_rod', 'elytra', 'mace'];

export const ENCHANTMENTS: Enchantment[] = [
  // Protection enchantments (armor)
  {
    id: 'protection',
    name: 'Protection',
    maxLevel: 4,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: ['fire_protection', 'blast_protection', 'projectile_protection'],
    appliesTo: ALL_ARMOR,
  },
  {
    id: 'fire_protection',
    name: 'Fire Protection',
    maxLevel: 4,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: ['protection', 'blast_protection', 'projectile_protection'],
    appliesTo: ALL_ARMOR,
  },
  {
    id: 'blast_protection',
    name: 'Blast Protection',
    maxLevel: 4,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['protection', 'fire_protection', 'projectile_protection'],
    appliesTo: ALL_ARMOR,
  },
  {
    id: 'projectile_protection',
    name: 'Projectile Protection',
    maxLevel: 4,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: ['protection', 'fire_protection', 'blast_protection'],
    appliesTo: ALL_ARMOR,
  },
  // Helmet specific
  {
    id: 'respiration',
    name: 'Respiration',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['helmet'],
  },
  {
    id: 'aqua_affinity',
    name: 'Aqua Affinity',
    maxLevel: 1,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['helmet'],
  },
  // Armor misc
  {
    id: 'thorns',
    name: 'Thorns',
    maxLevel: 3,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: [],
    appliesTo: ALL_ARMOR,
  },
  // Boots specific
  {
    id: 'feather_falling',
    name: 'Feather Falling',
    maxLevel: 4,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: [],
    appliesTo: ['boots'],
  },
  {
    id: 'depth_strider',
    name: 'Depth Strider',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['frost_walker'],
    appliesTo: ['boots'],
  },
  {
    id: 'frost_walker',
    name: 'Frost Walker',
    maxLevel: 2,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['depth_strider'],
    appliesTo: ['boots'],
  },
  {
    id: 'soul_speed',
    name: 'Soul Speed',
    maxLevel: 3,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: [],
    appliesTo: ['boots'],
  },
  // Leggings specific
  {
    id: 'swift_sneak',
    name: 'Swift Sneak',
    maxLevel: 3,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: [],
    appliesTo: ['leggings'],
  },
  // Sword enchantments
  {
    id: 'sharpness',
    name: 'Sharpness',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: ['smite', 'bane_of_arthropods', 'density', 'breach'],
    appliesTo: ['sword', 'axe'],
  },
  {
    id: 'smite',
    name: 'Smite',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: ['sharpness', 'bane_of_arthropods', 'density', 'breach'],
    appliesTo: ['sword', 'axe'],
  },
  {
    id: 'bane_of_arthropods',
    name: 'Bane of Arthropods',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: ['sharpness', 'smite', 'density', 'breach'],
    appliesTo: ['sword', 'axe'],
  },
  {
    id: 'knockback',
    name: 'Knockback',
    maxLevel: 2,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: [],
    appliesTo: ['sword'],
  },
  {
    id: 'fire_aspect',
    name: 'Fire Aspect',
    maxLevel: 2,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['sword'],
  },
  {
    id: 'looting',
    name: 'Looting',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['sword'],
  },
  {
    id: 'sweeping_edge',
    name: 'Sweeping Edge',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['sword'],
  },
  // Tool enchantments
  {
    id: 'efficiency',
    name: 'Efficiency',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: [],
    appliesTo: TOOLS,
  },
  {
    id: 'silk_touch',
    name: 'Silk Touch',
    maxLevel: 1,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: ['fortune'],
    appliesTo: TOOLS,
  },
  {
    id: 'fortune',
    name: 'Fortune',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['silk_touch'],
    appliesTo: TOOLS,
  },
  // Bow enchantments
  {
    id: 'power',
    name: 'Power',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: [],
    appliesTo: ['bow'],
  },
  {
    id: 'punch',
    name: 'Punch',
    maxLevel: 2,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['bow'],
  },
  {
    id: 'flame',
    name: 'Flame',
    maxLevel: 1,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['bow'],
  },
  {
    id: 'infinity',
    name: 'Infinity',
    maxLevel: 1,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: ['mending'],
    appliesTo: ['bow'],
  },
  // Crossbow enchantments
  {
    id: 'multishot',
    name: 'Multishot',
    maxLevel: 1,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['piercing'],
    appliesTo: ['crossbow'],
  },
  {
    id: 'piercing',
    name: 'Piercing',
    maxLevel: 4,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: ['multishot'],
    appliesTo: ['crossbow'],
  },
  {
    id: 'quick_charge',
    name: 'Quick Charge',
    maxLevel: 3,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: [],
    appliesTo: ['crossbow'],
  },
  // Trident enchantments
  {
    id: 'impaling',
    name: 'Impaling',
    maxLevel: 5,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['trident'],
  },
  {
    id: 'riptide',
    name: 'Riptide',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['loyalty', 'channeling'],
    appliesTo: ['trident'],
  },
  {
    id: 'loyalty',
    name: 'Loyalty',
    maxLevel: 3,
    bookMultiplier: 1,
    itemMultiplier: 1,
    incompatibleWith: ['riptide'],
    appliesTo: ['trident'],
  },
  {
    id: 'channeling',
    name: 'Channeling',
    maxLevel: 1,
    bookMultiplier: 4,
    itemMultiplier: 8,
    incompatibleWith: ['riptide'],
    appliesTo: ['trident'],
  },
  // Fishing rod enchantments
  {
    id: 'luck_of_the_sea',
    name: 'Luck of the Sea',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['fishing_rod'],
  },
  {
    id: 'lure',
    name: 'Lure',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['fishing_rod'],
  },
  // Mace enchantments
  {
    id: 'density',
    name: 'Density',
    maxLevel: 5,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: ['sharpness', 'smite', 'bane_of_arthropods', 'breach'],
    appliesTo: ['mace'],
  },
  {
    id: 'breach',
    name: 'Breach',
    maxLevel: 4,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['sharpness', 'smite', 'bane_of_arthropods', 'density'],
    appliesTo: ['mace'],
  },
  {
    id: 'wind_burst',
    name: 'Wind Burst',
    maxLevel: 3,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: [],
    appliesTo: ['mace'],
  },
  // Universal enchantments
  {
    id: 'unbreaking',
    name: 'Unbreaking',
    maxLevel: 3,
    bookMultiplier: 1,
    itemMultiplier: 2,
    incompatibleWith: [],
    appliesTo: ALL_DAMAGEABLE,
  },
  {
    id: 'mending',
    name: 'Mending',
    maxLevel: 1,
    bookMultiplier: 2,
    itemMultiplier: 4,
    incompatibleWith: ['infinity'],
    appliesTo: ALL_DAMAGEABLE,
  },
  // Elytra
  // (Unbreaking, Mending already cover it)
];

export function getEnchantmentsForItem(itemType: ItemType): Enchantment[] {
  return ENCHANTMENTS.filter((e) => e.appliesTo.includes(itemType));
}

export function getIncompatibleEnchantments(
  selectedIds: string[],
  allEnchantments: Enchantment[]
): Set<string> {
  const incompatible = new Set<string>();
  for (const id of selectedIds) {
    const ench = allEnchantments.find((e) => e.id === id);
    if (ench) {
      for (const inc of ench.incompatibleWith) {
        if (!selectedIds.includes(inc)) {
          incompatible.add(inc);
        }
      }
    }
  }
  return incompatible;
}
