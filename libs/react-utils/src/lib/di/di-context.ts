import { Container } from '@ns3/di';
import { createContext } from 'react';

export const DiContext = createContext<Container>(undefined!);

export const DiProvider = DiContext.Provider;
