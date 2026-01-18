// app/providers/LayoutProvider.js
'use client';

import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext(undefined);

export function LayoutProvider({ children }) {
  const [layoutState, setLayoutState] = useState({
    sidebarOpen: true,
    headerTitle: 'Dashboard',
    loading: false,
    notifications: 0,
    breadcrumbs: ['Home'],
    files: [], // always initialize as array
  });

  // Generic updater: merges updates into layoutState
  const updateLayoutState = (updates) => {
    setLayoutState(prev => ({ ...prev, ...updates }));
  };

  // Specific setters
  const toggleSidebar = () => {
    setLayoutState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const setHeaderTitle = (title) => {
    setLayoutState(prev => ({ ...prev, headerTitle: title }));
  };

  const setLoading = (loading) => {
    setLayoutState(prev => ({ ...prev, loading }));
  };

  const setNotifications = (count) => {
    setLayoutState(prev => ({ ...prev, notifications: count }));
  };

  const setBreadcrumbs = (values) => {
    setLayoutState(prev => ({
      ...prev,
      breadcrumbs: Array.isArray(values) ? values : prev.breadcrumbs
    }));
  };

  const setFiles = (files) => {
    setLayoutState(prev => ({
      ...prev,
      files: Array.isArray(files) ? files : prev.files || [] // never undefined
    }));
  };

  return (
    <LayoutContext.Provider
      value={{
        layoutState,
        updateLayoutState,
        toggleSidebar,
        setHeaderTitle,
        setLoading,
        setNotifications,
        setBreadcrumbs,
        setFiles
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook to use LayoutContext
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};
