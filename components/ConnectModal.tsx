"use client";

import { useId, useState } from "react";
import { Profile } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button, buttonClasses } from "@/components/ui/Button";

export function ConnectModal({
  profile,
  subject,
  body,
  open,
  onClose,
}: {
  profile: Profile;
  subject: string;
  body: string;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const mailtoHref = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function legacyCopy(text: string): boolean {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let succeeded = false;
    try {
      succeeded = document.execCommand("copy");
    } catch {
      succeeded = false;
    }
    document.body.removeChild(textarea);
    return succeeded;
  }

  async function handleCopy() {
    // navigator.clipboard.writeText() can hang indefinitely if a permission
    // prompt never resolves (locked-down browsers), so race it against a
    // synchronous fallback rather than trusting it'll ever settle.
    try {
      await Promise.race([
        navigator.clipboard.writeText(profile.email),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1000)),
      ]);
    } catch {
      legacyCopy(profile.email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal open={open} onClose={onClose} titleId={titleId}>
      <h2 id={titleId} className="font-display text-display-md text-foreground mb-1">
        Connect with {profile.name}
      </h2>
      <p className="text-sm text-muted mb-4 font-mono">{profile.email}</p>

      <div className="rounded-none border border-surface-border bg-missing-soft p-3 mb-5">
        <p className="text-micro font-mono font-semibold uppercase text-muted mb-1">Subject</p>
        <p className="text-sm text-foreground mb-3 font-mono">{subject}</p>
        <p className="text-micro font-mono font-semibold uppercase text-muted mb-1">Message</p>
        <p className="text-sm text-foreground whitespace-pre-wrap font-mono">{body}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy email"}
        </Button>
        <a href={mailtoHref} className={buttonClasses("secondary")}>
          Open email app
        </a>
        <Button type="button" variant="ghost" onClick={onClose} className="ml-auto">
          Close
        </Button>
      </div>
    </Modal>
  );
}
