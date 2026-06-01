import { useState, useMemo, useCallback } from 'react';
import { ItemSelector } from './components/ItemSelector';
import { EnchantmentSelector } from './components/EnchantmentSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { VillagerTradesModal } from './components/VillagerTradesModal';
import { ITEMS, ENCHANTMENTS, getEnchantmentsForItem, ItemType } from './data/enchantments';
import { findOptimalOrder, OptimizationResult } from './data/optimizer';
import {
  Anvil,
  Brain,
  Scale,
  TreeDeciduous,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';

interface SelectedEnchantment {
  enchantmentId: string;
  level: number;
}

function App() {
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [selectedEnchantments, setSelectedEnchantments] = useState<SelectedEnchantment[]>([]);
  const [isVillagerTradesOpen, setIsVillagerTradesOpen] = useState(false);

  const handleItemSelect = useCallback((item: ItemType) => {
    setSelectedItem(item);
    setSelectedEnchantments([]);
  }, []);

  const handleToggleEnchantment = useCallback((enchantmentId: string) => {
    setSelectedEnchantments((prev) => {
      const exists = prev.find((e) => e.enchantmentId === enchantmentId);
      if (exists) {
        return prev.filter((e) => e.enchantmentId !== enchantmentId);
      }
      const ench = ENCHANTMENTS.find((e) => e.id === enchantmentId);
      if (!ench) return prev;
      return [...prev, { enchantmentId, level: ench.maxLevel }];
    });
  }, []);

  const handleChangeLevel = useCallback((enchantmentId: string, level: number) => {
    setSelectedEnchantments((prev) =>
      prev.map((e) =>
        e.enchantmentId === enchantmentId ? { ...e, level } : e
      )
    );
  }, []);

  const selectedItemData = useMemo(
    () => ITEMS.find((i) => i.id === selectedItem),
    [selectedItem]
  );

  const result: OptimizationResult | null = useMemo(() => {
    if (!selectedItem || selectedEnchantments.length === 0) return null;

    const availableEnchantments = getEnchantmentsForItem(selectedItem);
    const enchData = selectedEnchantments
      .map((se) => {
        const ench = availableEnchantments.find((e) => e.id === se.enchantmentId);
        if (!ench) return null;
        return { enchantment: ench, level: se.level };
      })
      .filter(Boolean) as { enchantment: (typeof availableEnchantments)[0]; level: number }[];

    if (enchData.length === 0) return null;

    return findOptimalOrder(
      selectedItemData?.name ?? 'Item',
      enchData
    );
  }, [selectedItem, selectedEnchantments, selectedItemData]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Anvil size={22} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                    Enchant Optimizer
                  </h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Minecraft Anvil Cost Calculator
                  </p>
                </div>
              </div>

              {/* Villager Trades Button */}
              <button
                onClick={() => setIsVillagerTradesOpen(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/20"
              >
                <ClipboardList size={18} />
                Villager trades
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Item + Enchantment Selection */}
            <div className="lg:col-span-5 space-y-6">
              {/* Item Selection */}
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-4">
                <ItemSelector
                  selectedItem={selectedItem}
                  onSelect={handleItemSelect}
                />
              </div>

              {/* Enchantment Selection */}
              {selectedItem && (
                <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-4">
                  <EnchantmentSelector
                    selectedItem={selectedItem}
                    selectedEnchantments={selectedEnchantments}
                    onToggleEnchantment={handleToggleEnchantment}
                    onChangeLevel={handleChangeLevel}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-4 lg:sticky lg:top-20">
                <ResultsDisplay
                  result={result}
                  itemName={selectedItemData?.name ?? 'Item'}
                  itemType={selectedItem}
                />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6">
            <h2 className="text-lg font-bold text-emerald-400 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-800/30 p-4 border border-gray-700/30">
                <Brain size={28} className="text-emerald-400 mb-2" strokeWidth={1.5} />
                <h3 className="font-semibold text-white mb-1">Bitmask Dynamic Programming</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The optimizer explores <strong>every possible merge tree</strong> — not just binary trees
                  or sequential orders. Using bitmask DP over all subsets, it guarantees the mathematically
                  optimal solution with the lowest total XP cost for up to 13 enchantments.
                </p>
              </div>
              <div className="rounded-xl bg-gray-800/30 p-4 border border-gray-700/30">
                <Scale size={28} className="text-emerald-400 mb-2" strokeWidth={1.5} />
                <h3 className="font-semibold text-white mb-1">Accurate Anvil Mechanics</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Each enchantment has its exact cost multiplier from the Minecraft Wiki.
                  The calculator accounts for prior work penalties (2<sup>c</sup>−1),
                  enchantment weights, and the target/sacrifice ordering to find the true cheapest route.
                </p>
              </div>
              <div className="rounded-xl bg-gray-800/30 p-4 border border-gray-700/30">
                <TreeDeciduous size={28} className="text-emerald-400 mb-2" strokeWidth={1.5} />
                <h3 className="font-semibold text-white mb-1">All Tree Shapes Explored</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Unlike simple binary-tree or sequential calculators, this optimizer considers
                  every possible combination tree — including mixing books with the tool at
                  any intermediate step — to find the absolute minimum cost.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-800/30 p-4 border border-gray-700/30">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <ClipboardList size={18} className="text-gray-400" />
                Cost Multiplier Reference (Book → Item)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="text-gray-400">×1 — Cheap</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="text-gray-400">×2 — Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                  <span className="text-gray-400">×4 — Expensive</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="text-gray-400">×8 — Very Expensive (item only)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-600 pb-6">
            <p className="flex items-center justify-center gap-1">
              Enchantment data sourced from the{' '}
              <a
                href="https://minecraft.wiki/w/Anvil_mechanics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-400 underline inline-flex items-center gap-0.5"
              >
                Minecraft Wiki <ExternalLink size={10} />
              </a>
            </p>
            <p className="mt-1">
              Uses Java Edition anvil cost formulas. Prior work penalty = 2<sup>c</sup> − 1 where c = anvil use count.
            </p>
          </footer>
        </main>

        {/* Villager Trades Modal */}
        <VillagerTradesModal
          isOpen={isVillagerTradesOpen}
          onClose={() => setIsVillagerTradesOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
