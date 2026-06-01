import { OptimizationResult, AnvilStep, toRoman, AnvilItem } from '../data/optimizer';
import { ItemType } from '../data/enchantments';
import { ItemIcon, BookIcon } from './ItemIcon';
import { cn } from '../utils/cn';
import { TreeDeciduous } from 'lucide-react';

interface TreeViewProps {
  result: OptimizationResult;
  itemType: ItemType;
}

interface TreeNode {
  item: AnvilItem;
  left?: TreeNode;
  right?: TreeNode;
  stepNumber?: number;
  cost?: number;
}

function buildTree(steps: AnvilStep[]): TreeNode | null {
  if (steps.length === 0) return null;

  const nodeMap = new Map<AnvilItem, TreeNode>();

  for (const step of steps) {
    if (!nodeMap.has(step.target)) {
      nodeMap.set(step.target, { item: step.target });
    }
    if (!nodeMap.has(step.sacrifice)) {
      nodeMap.set(step.sacrifice, { item: step.sacrifice });
    }
  }

  for (const step of steps) {
    const leftNode = nodeMap.get(step.target) || { item: step.target };
    const rightNode = nodeMap.get(step.sacrifice) || { item: step.sacrifice };

    const parentNode: TreeNode = {
      item: step.result,
      left: leftNode,
      right: rightNode,
      stepNumber: step.stepNumber,
      cost: step.cost,
    };

    nodeMap.set(step.result, parentNode);
  }

  return nodeMap.get(steps[steps.length - 1].result) || null;
}

function TreeNodeComponent({
  node,
  itemType,
  depth = 0,
}: {
  node: TreeNode;
  itemType: ItemType;
  depth?: number;
}) {
  const isLeaf = !node.left && !node.right;

  const enchText = node.item.enchantments
    .map((e) => `${e.enchantment.name} ${toRoman(e.level)}`)
    .join(', ');

  if (isLeaf) {
    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'rounded-lg px-2 py-1.5 border text-center min-w-[80px]',
            node.item.isBook
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-blue-500/10 border-blue-500/30'
          )}
        >
          <div className="flex justify-center">
            {node.item.isBook
              ? <BookIcon size={20} className="text-amber-400" strokeWidth={1.75} />
              : <ItemIcon itemType={itemType} size={20} className="text-blue-400" strokeWidth={1.75} />
            }
          </div>
          <div className="text-[9px] text-gray-400 leading-tight max-w-[90px] break-words mt-0.5">
            {enchText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Children */}
      <div className="flex items-end gap-2">
        {node.left && (
          <TreeNodeComponent node={node.left} itemType={itemType} depth={depth + 1} />
        )}
        {node.right && (
          <TreeNodeComponent node={node.right} itemType={itemType} depth={depth + 1} />
        )}
      </div>

      {/* Connector */}
      <div className="flex items-center justify-center my-1">
        <div className="text-gray-600 text-xs">▼</div>
      </div>

      {/* This node */}
      <div
        className={cn(
          'rounded-lg px-2 py-1.5 border text-center min-w-[80px]',
          !node.item.isBook
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-purple-500/10 border-purple-500/30'
        )}
      >
        <div className="flex items-center justify-center gap-1">
          {node.item.isBook
            ? <BookIcon size={18} className="text-purple-400" strokeWidth={1.75} />
            : <ItemIcon itemType={itemType} size={18} className="text-emerald-400" strokeWidth={1.75} />
          }
          {node.stepNumber && (
            <span className="text-[9px] bg-gray-700 text-gray-300 rounded px-1">
              #{node.stepNumber}
            </span>
          )}
        </div>
        {node.cost !== undefined && (
          <div className="text-[10px] text-yellow-400 font-bold">{node.cost}L</div>
        )}
        <div className="text-[8px] text-gray-500 leading-tight max-w-[100px] break-words">
          {enchText.length > 40 ? enchText.substring(0, 37) + '...' : enchText}
        </div>
      </div>
    </div>
  );
}

export function TreeView({ result, itemType }: TreeViewProps) {
  const tree = buildTree(result.steps);
  if (!tree) return null;

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
        <TreeDeciduous size={16} />
        Combining Tree
      </h3>
      <div className="overflow-x-auto pb-2">
        <div className="flex justify-center min-w-fit p-4">
          <TreeNodeComponent node={tree} itemType={itemType} />
        </div>
      </div>
    </div>
  );
}
