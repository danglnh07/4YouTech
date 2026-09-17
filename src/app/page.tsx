import { BookingSite } from "@/components/booking-site";
import { services } from "@/data/services";

export default function Home() {
  return <BookingSite services={services} />;
}
