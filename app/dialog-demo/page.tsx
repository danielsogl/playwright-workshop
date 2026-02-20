'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';

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

  return (
    <section
      className="flex flex-col gap-8 py-8 md:py-10 max-w-4xl mx-auto px-4"
      aria-labelledby="dialog-demo-title"
    >
      <div className="text-center">
        <h1 className={title()} id="dialog-demo-title">
          Dialog Handling Demo
        </h1>
        <p className={subtitle()}>
          This page demonstrates various types of dialogs that can be tested
          with Playwright.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Native Browser Dialogs</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              color="success"
              onClick={handleAlert}
              aria-label="Show alert dialog"
            >
              Show Alert
            </Button>
            <Button
              color="warning"
              onClick={handleConfirm}
              aria-label="Show confirm dialog"
            >
              Show Confirm
            </Button>
            <Button
              color="primary"
              onClick={handlePrompt}
              aria-label="Show prompt dialog"
            >
              Show Prompt
            </Button>
            <Button
              color="danger"
              onClick={handleBeforeUnload}
              aria-label="Add beforeunload handler"
            >
              Add BeforeUnload Handler
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Custom Modal Dialog</h2>
        </CardHeader>
        <CardBody>
          <Button
            color="secondary"
            onClick={handleCustomDialog}
            aria-label="Show custom modal dialog"
          >
            Show Custom Dialog
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Dialog Results</h2>
        </CardHeader>
        <CardBody>
          <div
            className="p-4 bg-content2 rounded-lg min-h-[60px] border border-divider"
            role="status"
            aria-live="polite"
          >
            {result || 'No dialog interactions yet\u2026'}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Testing Notes</h3>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2">
            <li>
              <strong>Alert:</strong> Simple notification dialog with OK button
            </li>
            <li>
              <strong>Confirm:</strong> Dialog with OK/Cancel buttons returning
              boolean
            </li>
            <li>
              <strong>Prompt:</strong> Dialog with text input field returning
              string or null
            </li>
            <li>
              <strong>BeforeUnload:</strong> Triggered when user tries to leave
              the page
            </li>
            <li>
              <strong>Custom Dialog:</strong> Custom modal created with DOM
              manipulation
            </li>
          </ul>
        </CardBody>
      </Card>
    </section>
  );
}
