'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { AlertTriangle, MessageSquare, HelpCircle, ShieldAlert, Layers, Info } from 'lucide-react';

import { title, subtitle } from '@/components/primitives';

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
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'custom-dialog-title');

    // Detect current theme by checking if dark class is present on html element
    const isDarkMode = document.documentElement.classList.contains('dark');

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: ${isDarkMode ? '#18181b' : 'white'};
      color: ${isDarkMode ? '#f4f4f5' : '#09090b'};
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      border: ${isDarkMode ? '1px solid #27272a' : '1px solid #e4e4e7'};
    `;

    dialog.innerHTML = `
      <h3 id="custom-dialog-title" style="margin-top: 0; color: ${isDarkMode ? '#f4f4f5' : '#09090b'};">Custom Dialog</h3>
      <p style="color: ${isDarkMode ? '#a1a1aa' : '#71717a'};">This is a custom modal dialog created with JavaScript.</p>
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
        <button id="custom-cancel" style="padding: 8px 16px; border: 1px solid ${isDarkMode ? '#52525b' : '#d4d4d8'}; background: ${isDarkMode ? '#27272a' : 'white'}; color: ${isDarkMode ? '#f4f4f5' : '#09090b'}; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button id="custom-ok" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">OK</button>
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
      icon: AlertTriangle,
      label: 'Show Alert',
      color: 'success' as const,
      handler: handleAlert,
      description: 'Simple notification dialog with OK button',
    },
    {
      id: 'confirm',
      icon: HelpCircle,
      label: 'Show Confirm',
      color: 'warning' as const,
      handler: handleConfirm,
      description: 'Dialog with OK/Cancel buttons returning boolean',
    },
    {
      id: 'prompt',
      icon: MessageSquare,
      label: 'Show Prompt',
      color: 'primary' as const,
      handler: handlePrompt,
      description: 'Dialog with text input field returning string or null',
    },
    {
      id: 'beforeunload',
      icon: ShieldAlert,
      label: 'Add BeforeUnload',
      color: 'danger' as const,
      handler: handleBeforeUnload,
      description: 'Triggered when user tries to leave the page',
    },
  ];

  return (
    <section
      className="flex flex-col gap-10 py-8 md:py-10"
      aria-labelledby="dialog-demo-title"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center">
          <h1 className={title()} id="dialog-demo-title">
            Dialog Handling Demo
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            Various types of dialogs that can be tested with Playwright
          </p>
        </div>
      </div>

      {/* Native Browser Dialogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dialogButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <Card
              key={btn.id}
              className="border border-default-200 hover:border-default-300 transition-colors"
            >
              <CardBody className="p-6 gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${btn.color}/10 flex items-center justify-center shrink-0`}
                  >
                    <Icon
                      className={`w-6 h-6 text-${btn.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold mb-1">{btn.label}</h2>
                    <p className="text-sm text-default-500 mb-4">
                      {btn.description}
                    </p>
                    <Button
                      color={btn.color}
                      variant="flat"
                      onPress={btn.handler}
                      className="w-full"
                      aria-label={`${btn.label} dialog`}
                    >
                      {btn.label}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Custom Modal Dialog */}
      <Card className="border border-default-200">
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-secondary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Custom Modal Dialog</h2>
              <p className="text-sm text-default-500 mb-4">
                Custom modal created with DOM manipulation, supporting keyboard navigation
              </p>
              <Button
                color="secondary"
                variant="flat"
                onPress={handleCustomDialog}
                aria-label="Show custom modal dialog"
              >
                Show Custom Dialog
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Dialog Results */}
      <Card className="border border-default-200">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold">Dialog Result</h2>
            {result && (
              <Chip
                color={result.includes('OK') || result.includes('shown') ? 'success' : 'warning'}
                variant="flat"
                size="sm"
              >
                Last action
              </Chip>
            )}
          </div>
          <div
            className="p-4 bg-default-100 rounded-xl min-h-[60px] flex items-center font-mono text-sm"
            role="status"
            aria-live="polite"
          >
            {result || 'No dialog interactions yet…'}
          </div>
        </CardBody>
      </Card>

      <Divider />

      {/* Testing Notes */}
      <section className="flex flex-col gap-4">
        <h2 className={title({ size: 'sm', class: 'text-center' })}>
          Playwright Testing Hints
        </h2>
        <Card className="border border-default-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-default-500">
                Use these Playwright methods to handle dialogs:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'Alert', code: "page.on('dialog', d => d.accept())" },
                { label: 'Confirm', code: "page.on('dialog', d => d.dismiss())" },
                { label: 'Prompt', code: "page.on('dialog', d => d.accept('input'))" },
                { label: 'Custom Modal', code: "page.getByRole('dialog')" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-default-100 rounded-lg"
                >
                  <p className="text-xs text-default-400 mb-1">{item.label}</p>
                  <code className="text-sm text-primary font-mono">
                    {item.code}
                  </code>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </section>
  );
}
