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

export interface AmazonQuery {
  query: {
    ski_site: number;
    from_date: string;
    to_date: string;
    group_size: number;
  };
}

export interface BookingQuery {
}

export interface AmazonHotelType {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: {
    Images: { URL: string; MainImage?: string }[];
  };
  HotelInfo: {
    Position: {
      Latitude: string;
      Longitude: string;
      Distances: { type: string; distance: string }[];
    };
    Rating: string;
    Beds: string;
  };
  PricesInfo: {
    AmountAfterTax: string;
    AmountBeforeTax: string;
  };
}

export interface AmazonResonseType {
  statusCode: number;
  body: {
    success: boolean;
    accommodations: AmazonHotelType[];
  };
}
