// types.ts
// BalanceContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
interface BalanceContextType {
    balance: number;
    setBalance: (balance: number) => void;
}

// Create the context with a default of undefined
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
    children: ReactNode;
}

// Provider component
export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
    const [balance, setBalance] = useState<number>(0); // Initial balance set to 0

    return (
        <BalanceContext.Provider value={{ balance, setBalance }
        }>
            {children}
        </BalanceContext.Provider>
    );
};

// Custom hook to use the BalanceContext
export const useBalance = (): BalanceContextType => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
};
