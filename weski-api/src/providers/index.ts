import { fetchHotels as fetchHotelsAmazon } from "./amazon";
import { fetchHotels as fetchHotelsBooking } from "./booking";
import { Hotel } from "../types";

export type Adapter = {
  fetchHotels: (query: any) => Promise<Hotel[]>;
};

export const adapters: {
  [provider: string]: Adapter;
} = {
  ["amazon"]: { fetchHotels: fetchHotelsAmazon },
  ["booking"]: { fetchHotels: fetchHotelsBooking },
};
