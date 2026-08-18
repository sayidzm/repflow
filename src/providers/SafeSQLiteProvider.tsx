import React, { Component, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';

import { initializeDatabase } from '@/database/initializeDatabase';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SQLiteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[SQLite] Web Fallback mode activated:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }
    return this.props.children;
  }
}

export function SafeSQLiteProvider({ children }: Props) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  return (
    <SQLiteErrorBoundary>
      <SQLiteProvider databaseName="repflow.db" onInit={initializeDatabase} useSuspense>
        {children}
      </SQLiteProvider>
    </SQLiteErrorBoundary>
  );
}
