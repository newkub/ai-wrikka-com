export interface NavigationItem {
  title: string;
  items: {
    name: string;
    href: string;
  }[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
