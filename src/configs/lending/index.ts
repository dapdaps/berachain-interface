import bend from './bend';
import dolomite from './dolomite';
import beraborrow from './beraborrow';

export default {
  Bend: bend,
  Dolomite: dolomite,
  Beraborrow: beraborrow,
} as Record<string, { basic: any; networks: Record<number, any> }>;
