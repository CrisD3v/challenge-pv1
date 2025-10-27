/**
 * Entidad de dominio que representa un evento
 * Contiene la lógica de negocio relacionada con eventos
 */
export class Event {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly thumbnail: string | null,
    public readonly description: string | null,
    public readonly unit: number,
    public readonly unitPrice: number,
    public readonly date: Date,
    public readonly location: string,
    public readonly duration: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }

  /**
   * Calcula el precio total basado en la cantidad de entradas
   * @param quantity - Cantidad de entradas
   * @returns Precio total calculado
   */
  calculateTotalPrice(quantity: number): number {
    return this.unitPrice * quantity;
  }

  /**
   * Verifica si el evento está disponible (precio mayor a 0 y fecha futura)
   * @returns true si el evento está disponible
   */
  isAvailable(): boolean {
    const now = new Date();
    return this.unitPrice > 0 && this.date > now;
  }

  /**
   * Verifica si el evento ya pasó
   * @returns true si el evento ya ocurrió
   */
  isPastEvent(): boolean {
    const now = new Date();
    return this.date < now;
  }

  /**
   * Verifica si el evento es hoy
   * @returns true si el evento es hoy
   */
  isToday(): boolean {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    return today.getTime() === eventDate.getTime();
  }

  /**
   * Obtiene los días restantes hasta el evento
   * @returns Número de días hasta el evento (negativo si ya pasó)
   */
  getDaysUntilEvent(): number {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica si el evento tiene imagen
   * @returns true si el evento tiene thumbnail
   */
  hasThumbnail(): boolean {
    return this.thumbnail !== null && this.thumbnail.length > 0;
  }

  /**
   * Obtiene un resumen del evento para mostrar
   * @returns Objeto con información resumida del evento
   */
  getSummary(): {
    id: string;
    name: string;
    unitPrice: number;
    date: Date;
    location: string;
    isAvailable: boolean;
    daysUntilEvent: number;
  } {
    return {
      id: this.id,
      name: this.name,
      unitPrice: this.unitPrice,
      date: this.date,
      location: this.location,
      isAvailable: this.isAvailable(),
      daysUntilEvent: this.getDaysUntilEvent(),
    };
  }
}
