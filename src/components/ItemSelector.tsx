import { ITEMS, ItemType } from '../data/enchantments';
import { ItemIcon } from './ItemIcon';
import { cn } from '../utils/cn';

interface ItemSelectorProps {
  selectedItem: ItemType | null;
  onSelect: (item: ItemType) => void;
}

export function ItemSelector({ selectedItem, onSelect }: ItemSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        Select Item
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-5 gap-2">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer',
              'hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20',
              selectedItem === item.id
                ? 'border-emerald-400 bg-emerald-400/15 shadow-md shadow-emerald-500/30 text-emerald-400'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 text-gray-400 hover:text-gray-200'
            )}
            title={item.name}
          >
            <ItemIcon
              itemType={item.id}
              size={26}
              strokeWidth={1.75}
              className={cn(
                'mb-1 transition-colors',
                selectedItem === item.id ? 'text-emerald-400' : ''
              )}
            />
            <span className={cn(
              'text-[10px] leading-tight text-center transition-colors',
              selectedItem === item.id ? 'text-emerald-300' : 'text-gray-400'
            )}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
