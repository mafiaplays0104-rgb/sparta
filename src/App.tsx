import React, { useEffect } from 'react';
import { CallProvider, useCallContext } from './context/CallContext';
import { TopBar } from './components/TopBar';
import { ProgressBar } from './components/ProgressBar';
import { SayThisCard } from './components/SayThisCard';
import { ResponseCategories } from './components/ResponseCategories';
import { ActionBar } from './components/ActionBar';
import { HardStopCard } from './components/HardStopCard';
import { CallCompletionCard } from './components/CallCompletionCard';
import { ObjectionHandlerDrawer } from './components/ObjectionHandlerDrawer';
import { ToolsRail } from './components/ToolsRail';
import { HomeConfirmModal } from './components/HomeConfirmModal';
import { ObjectionSearchModal } from './components/ObjectionSearchModal';
import { AdminConfigModal } from './components/AdminConfigModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

const CallCockpit: React.FC = () => {
  const {
    currentStage,
    isHardStopped,
    selectCategory,
    goNext,
    goBack,
    openHomeModal,
    toggleSoften,
    setIsObjectionHandlerOpen,
    setIsShortcutsModalOpen,
    isHomeModalOpen,
    isObjectionSearchOpen,
    isAdminModalOpen,
    isShortcutsModalOpen,
    isObjectionHandlerOpen,
    isToolsRailOpen,
    setIsToolsRailOpen,
    fontSize,
  } = useCallContext();

  const isCompletionStage = currentStage.id === 'completion' || currentStage.id === 'closing';

  // Global Keyboard Navigation (1-5, N, B, H, O, S, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (isObjectionHandlerOpen) {
          setIsObjectionHandlerOpen(false);
          return;
        }
        if (isToolsRailOpen) {
          setIsToolsRailOpen(false);
          return;
        }
        return;
      }

      switch (e.key) {
        case '1':
          e.preventDefault();
          if (!isHardStopped) selectCategory('POSITIVE');
          break;
        case '2':
          e.preventDefault();
          if (!isHardStopped) selectCategory('NEGATIVE');
          break;
        case '3':
          e.preventDefault();
          if (!isHardStopped) selectCategory('CONFUSED');
          break;
        case '4':
          e.preventDefault();
          if (!isHardStopped) selectCategory('OBJECTION');
          break;
        case '5':
          e.preventDefault();
          if (!isHardStopped) selectCategory('STOP');
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          if (!isHardStopped) goNext();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          if (!isHardStopped) goBack();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          openHomeModal();
          break;
        case 'o':
        case 'O':
          e.preventDefault();
          setIsObjectionHandlerOpen((prev) => !prev);
          break;
        case 's':
        case 'S':
          e.preventDefault();
          toggleSoften();
          break;
        case '?':
          e.preventDefault();
          setIsShortcutsModalOpen(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectCategory,
    goNext,
    goBack,
    openHomeModal,
    toggleSoften,
    setIsObjectionHandlerOpen,
    setIsShortcutsModalOpen,
    isHomeModalOpen,
    isObjectionSearchOpen,
    isAdminModalOpen,
    isShortcutsModalOpen,
    isObjectionHandlerOpen,
    isToolsRailOpen,
    setIsToolsRailOpen,
    isHardStopped,
  ]);

  return (
    <div className="cockpit-shell" data-font-size={fontSize}>
      <TopBar />

      <main className="cockpit-main">
        {isCompletionStage ? (
          <>
            <ProgressBar />
            <CallCompletionCard />
          </>
        ) : (
          <>
            {/* 1. Progress & Current Stage */}
            <ProgressBar />

            {/* 2. THE SINGLE PRIMARY "SAY THIS" BOX */}
            <SayThisCard />

            {/* 3. Five Customer Response Category Buttons */}
            <ResponseCategories />

            {/* 4. If Hard Stopped, show Full-Screen Lock Alert; Otherwise Action Bar */}
            {isHardStopped ? (
              <HardStopCard />
            ) : (
              <ActionBar />
            )}
          </>
        )}
      </main>

      {/* Right-Side Objection Handler Drawer */}
      <ObjectionHandlerDrawer />

      {/* Bottom Collapsible Tools Rail */}
      <ToolsRail />

      {/* Cockpit Modals */}
      <HomeConfirmModal />
      <ObjectionSearchModal />
      <AdminConfigModal />
      <KeyboardShortcutsModal />
    </div>
  );
};

export default function App() {
  return (
    <CallProvider>
      <CallCockpit />
    </CallProvider>
  );
}
