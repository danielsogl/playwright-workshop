'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';

import { PageHeader } from '@/components/page-header';

export default function DialogDemoPage() {
  const [result, setResult] = useState<string>('');

  const handleAlert = () => {
    alert('This is a simple alert dialog!');
    setResult('Alert dialog was shown');
  };

  const handleConfirm = () => {
    const confirmed = confirm('Do you want to proceed with this action?');
    setResult(`Confirm dialog result: ${confirmed ? 'OK' : 'Cancel'}`);
  };

  const handlePrompt = () => {
    const userInput = prompt('Please enter your name:', 'Default Name');
    setResult(`Prompt dialog result: ${userInput || 'User cancelled'}`);
  };

  const handleBeforeUnload = () => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
      return 'Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    setResult('Beforeunload event listener added. Try refreshing the page.');

    // Remove listener after 5 seconds
    setTimeout(() => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      setResult('Beforeunload event listener removed');
    }, 5000);
  };

  const handleCustomDialog = () => {
    // Create a custom modal dialog
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(18, 22, 19, 0.55);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'custom-dialog-title');

    // Theme variables resolve for light and dark mode alike
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: var(--surface);
      color: var(--foreground);
      padding: 28px;
      border-radius: 20px;
      box-shadow: 0 30px 60px -20px rgba(18, 22, 19, 0.5);
      max-width: 440px;
      width: 90%;
      border: 1px solid var(--border);
      font-family: var(--font-sans);
    `;

    const button = `min-height: 44px; padding: 0 20px; border-radius: 999px; font: inherit; font-weight: 600; cursor: pointer;`;
    dialog.innerHTML = `
      <h3 id="custom-dialog-title" style="margin: 0 0 12px; font-family: var(--font-display); font-size: 26px; font-weight: 700;">Custom Dialog</h3>
      <p style="margin: 0; color: var(--muted);">This is a custom modal dialog created with JavaScript.</p>
      <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px;">
        <button id="custom-cancel" style="${button} border: 1px solid var(--field-border); background: var(--surface); color: var(--foreground);">Cancel</button>
        <button id="custom-ok" style="${button} border: 0; background: var(--accent); color: var(--accent-foreground);">OK</button>
      </div>
    `;

    modal.appendChild(dialog);
    document.body.appendChild(modal);

    const cancelBtn = dialog.querySelector('#custom-cancel');
    const okBtn = dialog.querySelector('#custom-ok');

    // Focus the OK button for keyboard accessibility
    (okBtn as HTMLElement)?.focus();

    const cleanup = () => {
      document.body.removeChild(modal);
    };

    cancelBtn?.addEventListener('click', () => {
      setResult('Custom dialog result: Cancelled');
      cleanup();
    });

    okBtn?.addEventListener('click', () => {
      setResult('Custom dialog result: OK');
      cleanup();
    });

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setResult('Custom dialog result: Cancelled (Escape)');
        cleanup();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        setResult('Custom dialog result: Cancelled (clicked outside)');
        cleanup();
        document.removeEventListener('keydown', handleKeyDown);
      }
    });
  };

  const dialogButtons = [
    {
      id: 'alert',
      kind: 'Alert',
      label: 'Show Alert',
      handler: handleAlert,
      description: 'Simple notification dialog with OK button',
    },
    {
      id: 'confirm',
      kind: 'Confirm',
      label: 'Show Confirm',
      handler: handleConfirm,
      description: 'Dialog with OK/Cancel buttons returning boolean',
    },
    {
      id: 'prompt',
      kind: 'Prompt',
      label: 'Show Prompt',
      handler: handlePrompt,
      description: 'Dialog with text input field returning string or null',
    },
    {
      id: 'beforeunload',
      kind: 'BeforeUnload',
      label: 'Add BeforeUnload',
      handler: handleBeforeUnload,
      description: 'Triggered when user tries to leave the page',
    },
  ];

  const isPositive = result.includes('OK') || result.includes('shown');

  return (
    <section
      className="flex flex-col gap-8 pt-14 pb-24"
      aria-labelledby="dialog-demo-title"
    >
      <PageHeader
        id="dialog-demo-title"
        label="06 · page.on('dialog')"
        title="Dialog Handling Demo"
        subtitle="Various types of dialogs that can be tested with Playwright"
      />

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          {/* Native Browser Dialogs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dialogButtons.map((btn) => (
              <article
                key={btn.id}
                className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-[22px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] text-muted">
                    {btn.kind}
                  </span>
                  <span className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-muted">
                    native
                  </span>
                </div>
                <h2 className="font-display text-[22px] font-bold">
                  {btn.label}
                </h2>
                <p className="text-[15px] text-muted">{btn.description}</p>
                <Button
                  variant="outline"
                  onPress={btn.handler}
                  className="mt-auto min-h-11 self-start rounded-full border-foreground font-semibold hover:bg-foreground hover:text-background"
                  aria-label={`${btn.label} dialog`}
                >
                  {btn.label}
                </Button>
              </article>
            ))}
          </div>

          {/* Custom Modal Dialog */}
          <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-[22px]">
            <div className="flex flex-[1_1_320px] flex-col gap-1">
              <h2 className="font-display text-[22px] font-bold">
                Custom Modal Dialog
              </h2>
              <p className="text-[15px] text-muted">
                Custom modal created with DOM manipulation, supporting keyboard
                navigation
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="rounded-full font-semibold"
              onPress={handleCustomDialog}
              aria-label="Show custom modal dialog"
            >
              Show Custom Dialog
            </Button>
          </article>
        </div>

        <aside className="flex max-w-full flex-[1_1_320px] flex-col gap-4">
          {/* Dialog Results */}
          <section
            aria-labelledby="dialog-result-title"
            className="flex flex-col gap-3.5 rounded-2xl bg-terminal p-[22px] text-terminal-foreground"
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-[15px] font-semibold text-terminal-muted"
                id="dialog-result-title"
              >
                Dialog Result
              </h2>
              {result && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isPositive
                      ? 'bg-[#1f3a2a] text-terminal-accent'
                      : 'bg-[#3a2216] text-[#ffb38a]'
                  }`}
                >
                  Last action
                </span>
              )}
            </div>
            <div
              className={`min-h-6 font-mono text-[15px] ${
                !result
                  ? 'text-terminal-muted'
                  : isPositive
                    ? 'text-terminal-accent'
                    : 'text-[#ffb38a]'
              }`}
              role="status"
              aria-live="polite"
            >
              {result || 'No dialog interactions yet…'}
            </div>
          </section>

          {/* Testing Notes */}
          <section
            aria-labelledby="dialog-hints-title"
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-[22px]"
          >
            <h2 className="text-[15px] font-semibold" id="dialog-hints-title">
              Playwright Testing Hints
            </h2>
            <p className="text-sm text-muted">
              Use these Playwright methods to handle dialogs:
            </p>
            <dl className="m-0 flex flex-col gap-2.5">
              {[
                { label: 'Alert', code: "page.on('dialog', d => d.accept())" },
                {
                  label: 'Confirm',
                  code: "page.on('dialog', d => d.dismiss())",
                },
                {
                  label: 'Prompt',
                  code: "page.on('dialog', d => d.accept('input'))",
                },
                { label: 'Custom Modal', code: "page.getByRole('dialog')" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[13px] text-muted">{item.label}</dt>
                  <dd className="mt-0.5 font-mono text-[13px] text-accent-soft-foreground">
                    {item.code}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
}
