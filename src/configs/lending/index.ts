import bend from './bend';
import dolomite from './dolomite';

export default {
  Bend: bend,
  Dolomite: dolomite,
} as Record<string, { basic: any; networks: Record<number, any> }>;
