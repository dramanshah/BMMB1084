import React, { useMemo } from 'react';
import type { SyntaxNode } from '../types/sintaksis';

interface RajahPohonSVGProps {
  tree: SyntaxNode;
  selectedNodeId: string | null;
  onSelectNode: (node: SyntaxNode) => void;
}

interface PositionedNode {
  node: SyntaxNode;
  x: number;
  y: number;
  width: number;
  parentX?: number;
  parentY?: number;
}

const NODE_HEIGHT = 44;
const LEVEL_GAP = 96;
const MIN_LEAF_WIDTH = 136;

function getSubtreeUnits(node: SyntaxNode): number {
  if (!node.children || node.children.length === 0) {
    const textLen = Math.max(node.label.length, node.words?.length ?? 0);
    return Math.max(1, Math.ceil(textLen / 13));
  }
  return node.children.reduce((sum, child) => sum + getSubtreeUnits(child), 0);
}

function getCategoryAccent(category: SyntaxNode['category']): {
  border: string;
  bg: string;
  text: string;
} {
  switch (category) {
    case 'A':
      return { border: '#1E3A8A', bg: '#EFF6FF', text: '#1E3A8A' };
    case 'S':
    case 'FN':
    case 'INTI':
    case 'PENERANG':
    case 'PEN':
      return { border: '#0284C7', bg: '#F0F9FF', text: '#0369A1' };
    case 'P':
    case 'FK':
    case 'KK':
    case 'KB':
      return { border: '#059669', bg: '#ECFDF5', text: '#047857' };
    case 'FA':
    case 'KA':
      return { border: '#D97706', bg: '#FFFBEB', text: '#B45309' };
    case 'FS':
    case 'KSN':
      return { border: '#4F46E5', bg: '#EEF2FF', text: '#4338CA' };
    case 'KLAUSA':
    case 'KH':
      return { border: '#0D9488', bg: '#F0FDFA', text: '#0F766E' };
    default:
      return { border: '#475569', bg: '#F8FAFC', text: '#334155' };
  }
}

export const RajahPohonSVG: React.FC<RajahPohonSVGProps> = ({
  tree,
  selectedNodeId,
  onSelectNode,
}) => {
  const { positioned, totalWidth, totalHeight } = useMemo(() => {
    const unitWidth = MIN_LEAF_WIDTH;
    const totalUnits = getSubtreeUnits(tree);
    const canvasWidth = Math.max(680, totalUnits * unitWidth + 48);

    const list: PositionedNode[] = [];
    let maxDepth = 0;

    function layout(
      node: SyntaxNode,
      depth: number,
      leftX: number,
      spanWidth: number,
      parentX?: number,
      parentY?: number,
    ) {
      maxDepth = Math.max(maxDepth, depth);
      const centerX = leftX + spanWidth / 2;
      const centerY = 36 + depth * LEVEL_GAP;

      const labelWidth = Math.max(112, Math.min(220, node.label.length * 8.5 + 32));
      list.push({
        node,
        x: centerX,
        y: centerY,
        width: labelWidth,
        parentX,
        parentY,
      });

      if (node.children && node.children.length > 0) {
        const childUnits = node.children.map((c) => getSubtreeUnits(c));
        const sumUnits = childUnits.reduce((a, b) => a + b, 0);
        let cursorX = leftX;

        node.children.forEach((child, idx) => {
          const childSpan = (childUnits[idx] / sumUnits) * spanWidth;
          layout(child, depth + 1, cursorX, childSpan, centerX, centerY);
          cursorX += childSpan;
        });
      }
    }

    layout(tree, 0, 24, canvasWidth - 48);
    const canvasHeight = 36 + maxDepth * LEVEL_GAP + NODE_HEIGHT + 72;

    return {
      positioned: list,
      totalWidth: canvasWidth,
      totalHeight: canvasHeight,
    };
  }, [tree]);

  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-xl">
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="mx-auto block select-none"
        role="img"
        aria-label={`Rajah pohon sintaksis bagi ayat: ${tree.label}`}
      >
        {/* Subtle structural baseline grid */}
        <defs>
          <pattern id="syntax-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#F1F5F9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={totalWidth} height={totalHeight} fill="url(#syntax-grid)" />

        {/* Edges */}
        {positioned.map((item) => {
          if (item.parentX === undefined || item.parentY === undefined) return null;
          const x1 = item.parentX;
          const y1 = item.parentY + NODE_HEIGHT / 2;
          const x2 = item.x;
          const y2 = item.y - NODE_HEIGHT / 2;
          const midY = (y1 + y2) / 2;

          return (
            <path
              key={`edge-${item.node.id}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke="#94A3B8"
              strokeWidth={1.75}
            />
          );
        })}

        {/* Nodes */}
        {positioned.map((item) => {
          const isSelected = selectedNodeId === item.node.id;
          const accent = getCategoryAccent(item.node.category);
          const boxX = item.x - item.width / 2;
          const boxY = item.y - NODE_HEIGHT / 2;
          const hasWords = Boolean(item.node.words && item.node.words.trim().length > 0);

          return (
            <g
              key={item.node.id}
              onClick={() => onSelectNode(item.node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectNode(item.node);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              className="cursor-pointer focus:outline-none"
            >
              {isSelected && (
                <rect
                  x={boxX - 4}
                  y={boxY - 4}
                  width={item.width + 8}
                  height={NODE_HEIGHT + 8}
                  rx={10}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth={2}
                />
              )}
              <rect
                x={boxX}
                y={boxY}
                width={item.width}
                height={NODE_HEIGHT}
                rx={7}
                fill={isSelected ? '#1E3A8A' : accent.bg}
                stroke={isSelected ? '#1E3A8A' : accent.border}
                strokeWidth={1.5}
              />
              <text
                x={item.x}
                y={item.y + 4}
                textAnchor="middle"
                fontSize={12.5}
                fontWeight={600}
                fontFamily="Plus Jakarta Sans, sans-serif"
                fill={isSelected ? '#FFFFFF' : accent.text}
              >
                {item.node.label.length > 22
                  ? `${item.node.label.slice(0, 20)}…`
                  : item.node.label}
              </text>

              {hasWords && (
                <>
                  <line
                    x1={item.x}
                    y1={item.y + NODE_HEIGHT / 2}
                    x2={item.x}
                    y2={item.y + NODE_HEIGHT / 2 + 16}
                    stroke="#CBD5E1"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                  <text
                    x={item.x}
                    y={item.y + NODE_HEIGHT / 2 + 34}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={600}
                    fontFamily="Fraunces, Georgia, serif"
                    fill="#0F172A"
                  >
                    {item.node.words}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
