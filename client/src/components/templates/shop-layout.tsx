import { Header } from "@/components/organisms/header.organism";

export interface ShopLayoutProps {
  children: React.ReactNode;
}

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
    </div>
  );
};
