import SearchComponent from "@/modules/map/components/SearchComponent";
import Map from "@/shared/components/map/Map";

export default function Home() {
  return (
    <div className="relative">
      {/* search & search results bar  */}
      <SearchComponent />

      {/* map */}
      <div className="h-screen w-screen">
        <Map />
      </div>
    </div>
  );
}
