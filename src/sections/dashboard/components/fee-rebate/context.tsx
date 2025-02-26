import { createContext } from 'react';
import { FeeRebate } from '@/sections/dashboard/components/fee-rebate/hooks';

export const FeeRebaseContext = createContext<Partial<FeeRebate>>({});
