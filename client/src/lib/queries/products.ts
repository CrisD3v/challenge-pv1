import { fallbackService } from "@api/fallback";
import { eventsService } from "@api/services/events.service";
import { productsService } from "@api/services/products.service";
import { transformApiEvent, transformApiProduct } from "@api/types";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (search?: string) => {
  return useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      try {
        const apiProducts = await productsService.getAll(search);
        return apiProducts.map(transformApiProduct);
      } catch (error) {
        console.warn("API not available, using fallback data for products");
        const fallbackProducts = await fallbackService.products.getAll(search);
        return fallbackProducts.map(transformApiProduct);
      }
    },
  });
};

export const useEvents = (search?: string) => {
  return useQuery({
    queryKey: ["events", search],
    queryFn: async () => {
      try {
        const apiEvents = await eventsService.getAll(search);
        return apiEvents.map(transformApiEvent);
      } catch (error) {
        console.warn("API not available, using fallback data for events");
        const fallbackEvents = await fallbackService.events.getAll(search);
        return fallbackEvents.map(transformApiEvent);
      }
    },
  });
};

export const useAllItems = (search?: string) => {
  const { data: products = [], isLoading: productsLoading } =
    useProducts(search);
  const { data: events = [], isLoading: eventsLoading } = useEvents(search);

  return {
    data: [...products, ...events],
    isLoading: productsLoading || eventsLoading,
    error: null, // No mostramos error ya que tenemos fallback
  };
};
