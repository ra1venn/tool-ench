import { Enchantment, getEnchantmentsForItem, getIncompatibleEnchantments, ItemType } from '../data/enchantments';
import { toRoman } from '../data/optimizer';
import { Check, Ban } from 'lucide-react';
import { cn } from '../utils/cn';

interface SelectedEnchantment {
  enchantmentId: string;
  level: number;
}

interface EnchantmentSelectorProps {
  selectedItem: ItemType;
  selectedEnchantments: SelectedEnchantment[];
  onToggleEnchantment: (enchantmentId: string) => void;
  onChangeLevel: (enchantmentId: string, level: number) => void;
}

// Color mapping for enchantment multiplier cost tiers
function getCostTierColor(bookMultiplier: number): string {
  switch (bookMultiplier) {
    case 1:
      return 'text-green-400';
    case 2:
      return 'text-yellow-400';
    case 4:
      return 'text-orange-400';
    default:
      return 'text-red-400';
  }
}

function getCostTierBg(bookMultiplier: number): string {
  switch (bookMultiplier) {
    case 1:
      return 'bg-green-400/10 border-green-400/30';
    case 2:
      return 'bg-yellow-400/10 border-yellow-400/30';
    case 4:
      return 'bg-orange-400/10 border-orange-400/30';
    default:
      return 'bg-red-400/10 border-red-400/30';
  }
}

function getCostLabel(bookMultiplier: number): string {
  switch (bookMultiplier) {
    case 1:
      return 'Cheap';
    case 2:
      return 'Medium';
    case 4:
      return 'Expensive';
    default:
      return 'Very Expensive';
  }
}

export function EnchantmentSelector({
  selectedItem,
  selectedEnchantments,
  onToggleEnchantment,
  onChangeLevel,
}: EnchantmentSelectorProps) {
  const availableEnchantments = getEnchantmentsForItem(selectedItem);
  const selectedIds = selectedEnchantments.map((e) => e.enchantmentId);
  const incompatibleIds = getIncompatibleEnchantments(selectedIds, availableEnchantments);

  // Group enchantments by category
  const grouped = groupEnchantments(availableEnchantments);

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        Select Enchantments
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        Incompatible enchantments are automatically disabled. Cost tier shown by color.
      </p>

      <div className="space-y-4">
        {Object.entries(grouped).map(([category, enchantments]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="space-y-1.5">
              {enchantments.map((ench) => {
                const isSelected = selectedIds.includes(ench.id);
                const isDisabled = incompatibleIds.has(ench.id);
                const selectedEnch = selectedEnchantments.find(
                  (e) => e.enchantmentId === ench.id
                );
                const currentLevel = selectedEnch?.level ?? ench.maxLevel;

                return (
                  <div
                    key={ench.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-lg border transition-all',
                      isDisabled
                        ? 'opacity-30 border-gray-800 bg-gray-900/30 cursor-not-allowed'
                        : isSelected
                        ? `${getCostTierBg(ench.bookMultiplier)} cursor-pointer`
                        : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/60 cursor-pointer'
                    )}
                  >
                    <button
                      onClick={() => !isDisabled && onToggleEnchantment(ench.id)}
                      disabled={isDisabled}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400'
                          : 'border-gray-600 hover:border-gray-400'
                      )}
                    >
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                      {isDisabled && <Ban size={12} className="text-gray-600" strokeWidth={2} />}
                    </button>

                    <button
                      onClick={() => !isDisabled && onToggleEnchantment(ench.id)}
                      disabled={isDisabled}
                      className="flex-1 text-left"
                    >
                      <span className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-gray-300')}>
                        {ench.name}
                      </span>
                    </button>

                    <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded', getCostTierColor(ench.bookMultiplier))}>
                      {getCostLabel(ench.bookMultiplier)}
                    </span>

                    {isSelected && ench.maxLevel > 1 && (
                      <div className="flex items-center gap-0.5 ml-1">
                        {Array.from({ length: ench.maxLevel }, (_, i) => i + 1).map(
                          (lvl) => (
                            <button
                              key={lvl}
                              onClick={() => onChangeLevel(ench.id, lvl)}
                              className={cn(
                                'w-7 h-6 text-xs rounded font-bold transition-all',
                                currentLevel === lvl
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              )}
                            >
                              {toRoman(lvl)}
                            </button>
                          )
                        )}
                      </div>
                    )}

                    {isSelected && ench.maxLevel === 1 && (
                      <span className="text-xs text-gray-500 font-mono ml-1">I</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupEnchantments(enchantments: Enchantment[]): Record<string, Enchantment[]> {
  const groups: Record<string, Enchantment[]> = {};

  for (const ench of enchantments) {
    let category = 'General';

    if (['protection', 'fire_protection', 'blast_protection', 'projectile_protection'].includes(ench.id)) {
      category = 'Protection';
    } else if (['sharpness', 'smite', 'bane_of_arthropods'].includes(ench.id)) {
      category = 'Damage';
    } else if (['knockback', 'fire_aspect', 'looting', 'sweeping_edge'].includes(ench.id)) {
      category = 'Melee';
    } else if (['efficiency', 'silk_touch', 'fortune'].includes(ench.id)) {
      category = 'Mining';
    } else if (['power', 'punch', 'flame', 'infinity'].includes(ench.id)) {
      category = 'Bow';
    } else if (['multishot', 'piercing', 'quick_charge'].includes(ench.id)) {
      category = 'Crossbow';
    } else if (['impaling', 'riptide', 'loyalty', 'channeling'].includes(ench.id)) {
      category = 'Trident';
    } else if (['luck_of_the_sea', 'lure'].includes(ench.id)) {
      category = 'Fishing';
    } else if (['density', 'breach', 'wind_burst'].includes(ench.id)) {
      category = 'Mace';
    } else if (['respiration', 'aqua_affinity'].includes(ench.id)) {
      category = 'Helmet';
    } else if (['thorns'].includes(ench.id)) {
      category = 'Armor';
    } else if (['feather_falling', 'depth_strider', 'frost_walker', 'soul_speed'].includes(ench.id)) {
      category = 'Boots';
    } else if (['swift_sneak'].includes(ench.id)) {
      category = 'Leggings';
    } else if (['unbreaking', 'mending'].includes(ench.id)) {
      category = 'Utility';
    }

    if (!groups[category]) groups[category] = [];
    groups[category].push(ench);
  }

  return groups;
}
