import { OptimizationResult, toRoman, AnvilItem } from '../data/optimizer';
import { ItemType } from '../data/enchantments';
import { ItemIcon, BookIcon } from './ItemIcon';
import { TreeView } from './TreeView';
import { ArrowDown, AlertTriangle, Sparkles, Anvil } from 'lucide-react';
import { cn } from '../utils/cn';

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  itemName: string;
  itemType: ItemType | null;
}

function AnvilItemIcon({ item, itemType, size = 20 }: { item: AnvilItem; itemType: ItemType; size?: number }) {
  if (item.isBook) {
    return <BookIcon size={size} className="text-amber-400" strokeWidth={1.75} />;
  }
  return <ItemIcon itemType={itemType} size={size} className="text-blue-400" strokeWidth={1.75} />;
}

export function ResultsDisplay({ result, itemName, itemType }: ResultsDisplayProps) {
  if (!result || result.steps.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
        <Anvil size={48} strokeWidth={1.25} className="mb-4 opacity-30" />
        <p className="text-center text-sm">
          Select an item and enchantments to see<br />
          the optimal combining order
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        Optimal Enchanting Route
      </h2>

      {/* Summary */}
      <div className={cn(
        'rounded-xl p-4 mb-4 border',
        result.tooExpensive
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Total Experience Levels</div>
            <div className={cn(
              'text-3xl font-bold',
              result.tooExpensive ? 'text-red-400' : 'text-emerald-400'
            )}>
              {result.totalCost} levels
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Steps</div>
            <div className="text-2xl font-bold text-white">{result.steps.length}</div>
          </div>
        </div>
        {result.tooExpensive && (
          <div className="mt-2 text-red-400 text-sm flex items-center gap-1.5">
            <AlertTriangle size={16} />
            Warning: One or more steps exceed the 39 level anvil limit!
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {result.steps.map((step, index) => {
          const isLastStep = index === result.steps.length - 1;
          const stepTooExpensive = step.cost > 39;

          return (
            <div
              key={index}
              className={cn(
                'rounded-xl border p-3 transition-all',
                stepTooExpensive
                  ? 'border-red-500/40 bg-red-500/5'
                  : isLastStep
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-gray-700/50 bg-gray-800/30'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-full',
                  isLastStep
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-gray-700 text-gray-300'
                )}>
                  Step {step.stepNumber}
                </span>
                <span className={cn(
                  'text-sm font-bold flex items-center gap-1',
                  stepTooExpensive ? 'text-red-400' : 'text-yellow-400'
                )}>
                  {step.cost} levels
                  {stepTooExpensive && <AlertTriangle size={14} />}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Target */}
                <div className="flex-1 rounded-lg p-2 border bg-gray-900/50 border-gray-700/50">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Target (Left)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AnvilItemIcon item={step.target} itemType={itemType!} size={18} />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white">
                        {step.target.isBook ? 'Book' : itemName}
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight truncate">
                        {step.target.enchantments
                          .map((e) => `${e.enchantment.name} ${toRoman(e.level)}`)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plus sign */}
                <div className="text-lg text-gray-600 font-bold flex-shrink-0">+</div>

                {/* Sacrifice */}
                <div className="flex-1 rounded-lg p-2 border bg-gray-900/50 border-gray-700/50">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    Sacrifice (Right)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AnvilItemIcon item={step.sacrifice} itemType={itemType!} size={18} />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white">
                        {step.sacrifice.isBook ? 'Book' : itemName}
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight truncate">
                        {step.sacrifice.enchantments
                          .map((e) => `${e.enchantment.name} ${toRoman(e.level)}`)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-2 flex items-center gap-2">
                <ArrowDown size={16} className="text-gray-600 flex-shrink-0" />
                <div className={cn(
                  'flex-1 rounded-lg p-2 border',
                  isLastStep
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-purple-500/10 border-purple-500/30'
                )}>
                  <div className="flex items-center gap-1.5">
                    <AnvilItemIcon item={step.result} itemType={itemType!} size={18} />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white flex items-center gap-1">
                        {isLastStep && <Sparkles size={12} className="text-yellow-400" />}
                        {isLastStep ? itemName : step.result.isBook ? 'Combined Book' : itemName}
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight truncate">
                        {step.result.enchantments
                          .map((e) => `${e.enchantment.name} ${toRoman(e.level)}`)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tree View */}
      {result.steps.length > 1 && itemType && (
        <div className="mt-4 rounded-xl border border-gray-700/50 bg-gray-800/20 p-4">
          <TreeView result={result} itemType={itemType} />
        </div>
      )}

      {/* Final Item Summary */}
      {result.steps.length > 0 && itemType && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <h3 className="text-sm font-bold text-emerald-400 mb-2">Final Item</h3>
          <div className="flex items-center gap-3">
            <ItemIcon itemType={itemType} size={36} className="text-emerald-400" strokeWidth={1.5} />
            <div>
              <div className="text-base font-bold text-white">{itemName}</div>
              <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                {result.steps[result.steps.length - 1].result.enchantments.map((e) => (
                  <div key={e.enchantment.id} className="flex items-center gap-1">
                    <span className="text-emerald-400">◆</span>
                    {e.enchantment.name} {toRoman(e.level)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
