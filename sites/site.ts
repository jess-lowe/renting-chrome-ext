export type SiteData = {
  rooms: number;
  price: number;
  priceElement: HTMLElement;
};

export type Site = {
  checkHref: (url: string) => boolean;

  getElements: () => SiteData[];

  createObserver: (invokeObserver: () => void) => MutationObserver;
};
