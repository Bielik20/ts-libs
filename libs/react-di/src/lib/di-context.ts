import { Container } from '@wikia/dependency-injection';
import { createContext } from 'react';

export const DiContext = createContext<Container>(undefined);

export const DiProvider = DiContext.Provider;
