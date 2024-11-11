import useIsMobile from "@/hooks/use-isMobile";

export const config: any = {
  laptop: {
    dashboard: {
      tabHeight: 62,
      tabWidth: 294,
      tabMarginWidth: 62
    },
    earn: {
      tabHeight: 62,
      tabWidth: 400,
      tabMarginWidth: 62
    }
  },
  mobile: {
    dashboard: {
      tabHeight: 62,
      tabWidth: 180,
      tabMarginWidth: 62
    },
    earn: {
      tabHeight: 62,
      tabWidth: 128,
      tabMarginWidth: 62
    }
  }
};

export const useTabConfig = (page: any) => {
  const isMobile = useIsMobile();
  const device = isMobile ? "mobile" : "laptop";
  return config[device][page];
};
