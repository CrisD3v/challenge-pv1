export interface HeaderProps {
  onCartOpen: () => void;
}

export interface CartButtonProps {
  totalItems: number;
  onClick: () => void;
}

export interface ItemsGridProps {
  items: (Product | Event)[];
  isLoading?: boolean;
}

export interface ItemCardProps {
  item: Item;
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

export interface FilterTabsProps {
  filter: "all" | "product" | "event";
  search: string;
  onFilterChange: (filter: "all" | "product" | "event") => void;
  onSearchChange: (search: string) => void;
}

export interface CartContextType {
  cartId: string | null;
  totalItems: number;
  totalPrice: number;
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  isLoading: boolean;
  hasPendingOperations: boolean;
}

export interface QueryProviderProps {
  children: React.ReactNode;
}
