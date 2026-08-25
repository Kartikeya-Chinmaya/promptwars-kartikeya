"use client";

import { KeyboardEvent, useState } from "react";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function MultiSelectChips({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [customValue, setCustomValue] = useState("");

  const allTags = [
    ...options,
    ...selected.filter((s) => !options.some((o) => normalize(o) === normalize(s))),
  ];

  function toggle(option: string) {
    const isSelected = selected.some((s) => normalize(s) === normalize(option));
    if (isSelected) {
      onChange(selected.filter((s) => normalize(s) !== normalize(option)));
    } else {
      onChange([...selected, option]);
    }
  }

  function addCustom() {
    const trimmed = customValue.trim();
    if (!trimmed) return;
    const alreadySelected = selected.some((s) => normalize(s) === normalize(trimmed));
    if (!alreadySelected) {
      onChange([...selected, trimmed]);
    }
    setCustomValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {allTags.map((option, i) => {
          const active = selected.some((s) => normalize(s) === normalize(option));
          return (
            <button
              key={option + i}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={`tag animate-enter px-3 py-1.5 font-mono text-sm font-medium ${
                active
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-surface text-foreground border-surface-border hover:border-accent"
              }`}
              style={{ animationDelay: `${i * 20}ms` }}
            >
              [{option}]
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-muted-2">+</span>
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add custom..."
          className="rounded-none border border-surface-border bg-surface px-2.5 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:border-accent transition-colors duration-150"
        />
        <button
          type="button"
          onClick={addCustom}
          className="btn-hover font-mono text-xs font-semibold uppercase tracking-wide text-accent-text border border-accent/40 px-2.5 py-1.5 hover:border-accent"
        >
          Add
        </button>
      </div>
    </div>
  );
}
