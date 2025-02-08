export const TOKENS: any = {
  // ramen: {
  //   isFixed: true,
  //   allocationAnnouncementTime: "2025-02-09T02:00:00Z",
  //   privateSale: "2025-02-09T10:00:00Z",
  //   gachaRound: "2025-02-09T14:00:00Z",
  //   claimTime: "2025-02-09T20:00:00Z",
  //   isActive: false
  // },
  yeet: {
    claimTime: "2025-02-10T14:00:00Z",
    lotId: "2"
  }
};

export const DIS_STEPS = [
  {
    label: "Auction",
    icon: "/images/ramen/icon-check.svg"
  },
  {
    label: "Decrypting Bids",
    icon: "/images/ramen/icon-check.svg"
  },
  {
    label: "Claim",
    icon: "/images/ramen/icon-claim.svg"
  }
];

export enum E_LAUNCH_STATUS {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
}
export const LAUNCH_STATUS: Record<E_LAUNCH_STATUS, { value: E_LAUNCH_STATUS; label: string; color: string; }> = {
  [E_LAUNCH_STATUS.UPCOMING]: {
    value: E_LAUNCH_STATUS.UPCOMING,
    label: 'Upcoming',
    color: '#DBECF8',
  },
  [E_LAUNCH_STATUS.LIVE]: {
    value: E_LAUNCH_STATUS.LIVE,
    label: 'Live Now',
    color: '#EBF479',
  },
};
