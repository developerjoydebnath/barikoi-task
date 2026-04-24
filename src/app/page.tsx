import MapWrapper from "@/modules/map/components/MapWrapper";
import SearchComponent from "@/modules/map/components/SearchComponent";

export default function Home() {
  return (
    <div className="relative">
      {/* search & search results bar  */}
      <SearchComponent />

      {/* map */}
      <MapWrapper />
    </div>
  );
}
