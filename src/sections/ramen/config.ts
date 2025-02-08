export const TOKENS: any = {
  ramen: {
    isFixed: true,
    allocationAnnouncementTime: "2025-02-09T02:00:00Z",
    privateSale: "2025-02-09T10:00:00Z",
    gachaRound: "2025-02-09T14:00:00Z",
    claimTime: "2025-02-09T20:00:00Z",
    isActive: false,
    config: {
      "Reserved for Token Sale": "5000000",
      "Fundraising Hard Cap": "134500",
      "Token Price": "0.0269 BERA",
      "Requirement per Entry": "69",
      "Allocation Cap per Winning Entry": "33.625",
      FDV: "2690000",
      "Private Sale Token Price": "0.0269"
    }
  },
  yeet: {
    claimTime: "2025-02-10T14:00:00Z",
    lotId: "2"
  }
};

export const DIS_STEPS = [
  {
    label: "Auction"
  },
  {
    label: "Decrypting Bids"
  },
  {
    label: "Claim"
  }
];

export const FIX_STEPS = [
  {
    label: "Registration"
  },
  {
    label: "Allocation Announcement",
    key: "allocationAnnouncementTime"
  },
  {
    label: "Private Sale",
    key: "privateSale"
  },
  {
    label: "Gacha Round",
    key: "gachaRound"
  },
  {
    label: "Claim",
    key: "claimTime"
  }
];

export enum E_LAUNCH_STATUS {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE"
}
export const LAUNCH_STATUS: Record<
  E_LAUNCH_STATUS,
  { value: E_LAUNCH_STATUS; label: string; color: string }
> = {
  [E_LAUNCH_STATUS.UPCOMING]: {
    value: E_LAUNCH_STATUS.UPCOMING,
    label: "Upcoming",
    color: "#DBECF8"
  },
  [E_LAUNCH_STATUS.LIVE]: {
    value: E_LAUNCH_STATUS.LIVE,
    label: "Live Now",
    color: "#EBF479"
  }
};
