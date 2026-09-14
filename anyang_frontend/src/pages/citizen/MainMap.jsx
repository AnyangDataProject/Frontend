import { useMemo, useState } from "react";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Map } from "react-kakao-maps-sdk";
import MainMapSearchHeader from "../../components/citizen/main-map/MainMapSearchHeader";
import MainMapOverlays from "../../components/citizen/main-map/MainMapOverlays";
import MainMapLegend from "../../components/citizen/main-map/MainMapLegend";
import MainMapListPanel from "../../components/citizen/main-map/MainMapListPanel";
import MainMapDetailModal from "../../components/citizen/main-map/MainMapDetailModal";
import { MAP_PINS } from "../../mocks/citizen/reportsData";
import { useKakaoGeocoder } from "../../hooks/useKakaoGeocoder";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

const DEFAULT_CENTER = { lat: 37.3943, lng: 126.9568 };

export default function MainMap() {
  const navigate = useNavigate();
  const [listOpen, setListOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [layer, setLayer] = useState("current"); // current | prediction
  const [statusFilter, setStatusFilter] = useState("all"); // all | open | done
  const [typeFilter, setTypeFilter] = useState("all");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");

  const counts = useMemo(
    () => ({
      all: MAP_PINS.length,
      open: MAP_PINS.filter((p) => p.status !== "done").length,
      done: MAP_PINS.filter((p) => p.status === "done").length,
    }),
    []
  );

  const filteredPins = useMemo(() => {
    let list = MAP_PINS;
    if (statusFilter === "open") list = list.filter((p) => p.status !== "done");
    if (statusFilter === "done") list = list.filter((p) => p.status === "done");
    if (typeFilter !== "all") list = list.filter((p) => p.type === typeFilter);
    return list;
  }, [statusFilter, typeFilter]);

  const { searchAddress } = useKakaoGeocoder();
  const { requestLocation } = useCurrentLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");
    if (!searchText.trim()) return;

    searchAddress(searchText.trim(), {
      onSuccess: setCenter,
      onError: setSearchError,
    });
  };

  const handleLocate = () => {
    requestLocation({
      onSuccess: (coords) => {
        setSearchError("");
        setCenter({ lat: coords.latitude, lng: coords.longitude });
      },
      onUnsupported: () => setSearchError("이 브라우저에서는 위치 확인을 지원하지 않아요."),
      onError: () => setSearchError("위치 권한을 확인해주세요."),
    });
  };

  const handleLayerChange = (v) => {
    setLayer(v);
    setSelected(null);
    setSelectedRisk(null);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white pt-[72px] max-[768px]:pt-16">
      <style>{`
        @keyframes tvFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="flex-1 min-h-0 flex relative">
        <div className="relative flex-1 min-w-0 bg-[#EAEAEA]">
          <MainMapSearchHeader
            listOpen={listOpen}
            onToggleListOpen={setListOpen}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSearchSubmit={handleSearch}
            searchError={searchError}
            layer={layer}
            onLayerChange={handleLayerChange}
            onReport={() => navigate("/report")}
          />

          <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={7}
            onClick={() => {
              setSelected(null);
              setSelectedRisk(null);
            }}
          >
            <MainMapOverlays
              layer={layer}
              selectedPin={selected}
              onSelectPin={setSelected}
              selectedRisk={selectedRisk}
              onSelectRisk={setSelectedRisk}
            />
          </Map>

          <button
            className="absolute right-4 bottom-[54px] z-10 w-10 h-10 rounded-full border-none bg-white text-slate-900 flex items-center justify-center shadow-[0_4px_16px_rgba(15,23,42,0.15)] cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)]"
            onClick={handleLocate}
            aria-label="내 위치로 이동"
          >
            <LocateFixed size={16} />
          </button>

          <MainMapLegend layer={layer} />
        </div>

        <MainMapListPanel
          open={listOpen}
          counts={counts}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          pins={filteredPins}
          onSelectPin={setSelected}
        />
      </div>

      <MainMapDetailModal
        pin={selected}
        onClose={() => setSelected(null)}
        onViewAnalysis={(pin) => navigate("/ai-analysis", { state: { report: pin } })}
      />
    </div>
  );
}
