import axios, { AxiosResponse } from "axios";
import {
  AmazonHotelType,
  AmazonQuery,
  AmazonResonseType,
  Hotel,
} from "../types";

const url =
  "https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator";

const getHotelInFormat = (accommodation: AmazonHotelType) => {
  return {
    id: accommodation.HotelCode,
    name: accommodation.HotelName || "Unknown",
    HotelContent: {
      images: accommodation.HotelDescriptiveContent.Images.sort((a, b) => {
        const aIsMain = a.MainImage === "True";
        const bIsMain = b.MainImage === "True";
        return (bIsMain ? 1 : 0) - (aIsMain ? 1 : 0);
      }).map((image) => image.URL),
    },
    beds: (() => {
      const val = parseFloat(String(accommodation.HotelInfo.Beds).trim());
      return Number.isFinite(val) ? val : 0;
    })(),
    rating: (() => {
      const val = parseFloat(String(accommodation.HotelInfo.Rating).trim());
      return Number.isFinite(val) ? Math.round(val) : 0;
    })(),
    priceInfo: {
      amountAfterTax: (() => {
        const val = parseFloat(
          String(accommodation.PricesInfo.AmountAfterTax).trim()
        );
        return Number.isFinite(val) ? val : 0;
      })(),
      amountBeforeTax: (() => {
        const val = parseFloat(
          String(accommodation.PricesInfo.AmountBeforeTax).trim()
        );
        return Number.isFinite(val) ? val : 0;
      })(),
    },
    provider: "amazon",
  };
};

async function fetchHotels(query: AmazonQuery): Promise<Hotel[]> {
  try {
    let promises: Promise<AxiosResponse<AmazonResonseType>>[] = []; 
    for (let groupSize = query.query.group_size; groupSize <= 10; groupSize++) {
      query.query.group_size = groupSize;
      const response = axios.post<AmazonResonseType>(url, query);
      promises.push(response)
    }
    const results = await Promise.all(promises);
    const hotels = results.flatMap(result => result.data.body.accommodations.map(getHotelInFormat));

    return hotels;
  } catch (err: any) {
    throw new Error(`amazon fetch error: ${err?.message || String(err)}`);
  }
}

export { fetchHotels };
