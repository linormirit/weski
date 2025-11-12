export interface Hotel {
  id: string;
  name: string;
  rating: number;
  beds: number;
  priceInfo: {
    amountAfterTax: number;
    amountBeforeTax: number;
  };
  HotelContent: {
    images: string[];
  };
  provider?: string;
}
