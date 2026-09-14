"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { WORDS, type Cell, type WordSolution } from "./manifest";
import { playSfx } from "@/lib/sound";

export type GridPointerProps = Pick<
  ComponentPropsWithoutRef<"div">,
  "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
>;

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

/** Devuelve todas las celdas de la línea recta entre start y end (incluidos extremos). */
export function cellsBetween(start: Cell, end: Cell): Cell[] {
  const dr = Math.sign(end.row - start.row);
  const dc = Math.sign(end.col - start.col);
  const length = Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col));
  return Array.from({ length: length + 1 }, (_, i) => ({
    row: start.row + dr * i,
    col: start.col + dc * i,
  }));
}

/** Ajusta la celda final a una línea recta (horizontal, vertical o diagonal). */
function alignEnd(start: Cell, raw: Cell): Cell {
  const dr = raw.row - start.row;
  const dc = raw.col - start.col;
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) return raw;
  return Math.abs(dr) > Math.abs(dc)
    ? { row: raw.row, col: start.col }
    : { row: start.row, col: raw.col };
}

function cellFromPoint(x: number, y: number): Cell | null {
  if (typeof document === "undefined") return null;
  const element = document.elementFromPoint(x, y) as HTMLElement | null;
  const cellElement = element?.closest("[data-row]") as HTMLElement | null;
  if (!cellElement) return null;
  const row = Number(cellElement.dataset.row);
  const col = Number(cellElement.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return { row, col };
}

function sameCells(a: Cell[], b: Cell[]): boolean {
  return (
    a.length === b.length && a.every((cell, i) => cell.row === b[i].row && cell.col === b[i].col)
  );
}

interface UseWordSearchOptions {
  isFound: (word: string) => boolean;
  onHit: (solution: WordSolution) => void;
  onMiss: () => void;
}

/**
 * Máquina de estados de la selección por Pointer Events.
 * Funciona con dedo (touch) y mouse usando `elementFromPoint` + pointer capture.
 */
export function useWordSearch(options: UseWordSearchOptions) {
  const optionsRef = useRef(options);
  const [selection, setSelection] = useState<{ start: Cell; end: Cell } | null>(null);
  const selectionRef = useRef(selection);
  const [invalidCells, setInvalidCells] = useState<Cell[]>([]);
  const draggingRef = useRef(false);
  const invalidTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  useEffect(
    () => () => {
      if (invalidTimeoutRef.current) window.clearTimeout(invalidTimeoutRef.current);
    },
    []
  );

  const finishSelection = () => {
    draggingRef.current = false;
    const current = selectionRef.current;
    setSelection(null);
    if (!current) return;

    const cells = cellsBetween(current.start, current.end);
    // Un toque suelto de una sola letra no cuenta como error.
    if (cells.length < 2) return;

    const reversed = [...cells].reverse();
    const match = WORDS.find((solution) => {
      const solutionCells = cellsBetween(solution.start, solution.end);
      return sameCells(cells, solutionCells) || sameCells(reversed, solutionCells);
    });

    if (!match) {
      setInvalidCells(cells);
      if (invalidTimeoutRef.current) window.clearTimeout(invalidTimeoutRef.current);
      invalidTimeoutRef.current = window.setTimeout(() => setInvalidCells([]), 500);
      optionsRef.current.onMiss();
      return;
    }

    // Palabra ya encontrada: neutro, sin castigo.
    if (optionsRef.current.isFound(match.word)) return;

    optionsRef.current.onHit(match);
  };

  const handlePointerDown: GridPointerProps["onPointerDown"] = (event) => {
    const cell = cellFromPoint(event.clientX, event.clientY);
    if (!cell) return;
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelection({ start: cell, end: cell });
    playSfx("flip");
  };

  const handlePointerMove: GridPointerProps["onPointerMove"] = (event) => {
    if (!draggingRef.current) return;
    const cell = cellFromPoint(event.clientX, event.clientY);
    const current = selectionRef.current;
    if (!cell || !current) return;
    const end = alignEnd(current.start, cell);
    if (end.row !== current.end.row || end.col !== current.end.col) {
      setSelection({ start: current.start, end });
    }
  };

  const handlePointerUp: GridPointerProps["onPointerUp"] = () => {
    if (draggingRef.current) finishSelection();
  };

  const handlePointerCancel: GridPointerProps["onPointerCancel"] = () => {
    draggingRef.current = false;
    setSelection(null);
  };

  const selectionCells = selection ? cellsBetween(selection.start, selection.end) : [];

  return {
    selectionCells,
    invalidCells,
    containerProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    } satisfies GridPointerProps,
  };
}
