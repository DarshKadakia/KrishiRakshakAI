import React, { createContext, useContext, useState, useCallback } from 'react';

interface ActuatorState {
  state: 'ON' | 'OFF';
  updatedAt: string;
}

interface ActuatorsState {
  pump: ActuatorState;
  fan: ActuatorState;
}

interface ActuatorsContextType {
  actuators: ActuatorsState;
  toggleActuator: (id: 'pump' | 'fan') => void;
}

const defaultState: ActuatorsState = {
  pump: { state: 'OFF', updatedAt: new Date().toISOString() },
  fan: { state: 'OFF', updatedAt: new Date().toISOString() },
};

const ActuatorsContext = createContext<ActuatorsContextType>({
  actuators: defaultState,
  toggleActuator: () => {},
});

export const ActuatorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actuators, setActuators] = useState<ActuatorsState>(defaultState);

  const toggleActuator = useCallback((id: 'pump' | 'fan') => {
    setActuators(prev => ({
      ...prev,
      [id]: {
        state: prev[id].state === 'ON' ? 'OFF' : 'ON',
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  return (
    <ActuatorsContext.Provider value={{ actuators, toggleActuator }}>
      {children}
    </ActuatorsContext.Provider>
  );
};

export const useActuators = () => useContext(ActuatorsContext);
