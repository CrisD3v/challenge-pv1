export interface ShopLayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  onCartOpen: () => void;
}

export interface CartButtonProps {
  totalItems: number;
  onClick: () => void;
}

export type ItemType = "product" | "event";

export interface BaseItem {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  stock: number;
  type: ItemType;
}

export interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Product extends BaseItem {
  type: "product";
  category: string;
  brand: string;
}

export interface Event extends BaseItem {
  type: "event";
  date: string;
  location: string;
  duration: string;
}

export type Item = Product | Event;

export interface CartItem {
  item: Item;
  quantity: number;
}
