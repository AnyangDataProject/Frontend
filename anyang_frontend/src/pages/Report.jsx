import { useState } from "react";
import {
  Camera,
  MapPin,
  Upload,
  X,
  CircleDot,
  Construction,
  Signpost,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  ArrowLeft, // ArrowLeft 아이콘 추가
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";

const PAGE_ROOT = "min-h-screen bg-slate-50 text-slate-900 pt-[72px] max-[768px]:pt-16 text-left";

const DAMAGE_TYPES = [
  { value: "pothole", label: "포트홀", icon: CircleDot, description: "도로가 움푹 파인 상태" },
  { value: "crack", label: "노면 균열", icon: Construction, description: "도로 표면에 균열이 발생한 상태" },
  { value: "sign", label: "표지판 파손", icon: Signpost, description: "표지판이나 안전시설물이 파손된 상태" },
  { value: "manhole", label: "맨홀/시설물", icon: AlertTriangle, description: "맨홀 및 도로시설물 이상" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "낮음", description: "경미한 파손" },
  { value: "mid", label: "보통", description: "통행에 불편이 있는 파손" },
  { value: "high", label: "높음", description: "사고 위험이 높은 파손" },
];

const SEVERITY_DOT_COLOR = {
  low: "bg-emerald-500",
  mid: "bg-amber-500",
  high: "bg-red-500",
};

const SEVERITY_SELECTED_BORDER = {
  low: "border-emerald-500",
  mid: "border-amber-500",
  high: "border-red-500",
};

export default function Report() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [damageType, setDamageType] = useState("");
  const [severity, setSeverity] = useState("");
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.3943, lng: 126.9568 });
  const [markerPos, setMarkerPos] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 3 - images.length).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((image) => image.id !== id);
    });
  };

  const reverseGeocode = (lat, lng) => {
    if (!window.kakao?.maps?.services) {
      setAddress("지도 서비스를 불러오는 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const road = result[0].road_address?.address_name;
        const jibun = result[0].address?.address_name;
        setAddress(road || jibun || "주소를 찾을 수 없습니다.");
      } else {
        setAddress("주소를 찾을 수 없습니다. 직접 입력해주세요.");
      }
    });
  };

  const handleMapClick = (_, mouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    setMarkerPos({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const handleCurrentLocation = () => {
    setAddress("현재 위치를 확인하는 중입니다...");
    if (!navigator.geolocation) {
      setAddress("현재 위치를 사용할 수 없습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setMarkerPos({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
      },
      () => {
        setAddress("현재 위치를 가져오지 못했습니다. 주소를 직접 입력해주세요.");
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("도로파손 사진을 최소 1장 등록해주세요.");
      return;
    }
    if (!damageType) {
      alert("파손 유형을 선택해주세요.");
      return;
    }
    if (!address.trim()) {
      alert("파손 위치를 입력해주세요.");
      return;
    }
    if (!severity) {
      alert("파손 심각도를 선택해주세요.");
      return;
    }
    if (!agree) {
      alert("신고 안내사항에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className={PAGE_ROOT}>
        <main className="w-[min(620px,calc(100%-40px))] mx-auto pt-[90px] pb-[100px] text-center">
          <div className="w-[82px] h-[82px] mx-auto mb-[23px] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={42} />
          </div>

          <span className="text-blue-600 text-xs font-semibold tracking-[0.13em]">
            REPORT SUBMITTED
          </span>
          <h1 className="mt-2.5 mb-3 text-xl font-semibold text-slate-900">신고가 접수되었습니다.</h1>

          <p className="m-0 text-slate-500 text-sm leading-[1.8]">
            시민님의 신고를 담당 부서에 전달했습니다.
            <br />
            등록된 사진은 AI 분석을 거쳐 도로파손 유형과 위험도를 판단합니다.
          </p>

          <div className="flex flex-col gap-1.5 w-[250px] mx-auto my-[30px] p-[17px] border border-slate-200 rounded-xl shadow-sm bg-white text-center">
            <span className="text-slate-400 text-xs">신고 접수번호</span>
            <strong className="text-blue-600 text-base font-semibold tracking-[0.04em]">RS-202609-0009</strong>
          </div>

          <div className="flex justify-center gap-2 max-[430px]:flex-col">
            <button
              className="h-[45px] px-5 rounded-lg font-sans text-sm font-semibold cursor-pointer border border-slate-200 bg-white text-slate-600 max-[430px]:w-full"
              onClick={() => navigate("/")}
            >
              지도 보기
            </button>
            <button
              className="h-[45px] px-5 rounded-lg text-sm font-semibold cursor-pointer border-0 bg-blue-600 text-white max-[430px]:w-full"
              onClick={() => navigate("/my-reports")}
            >
              내 신고 확인
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={PAGE_ROOT}>
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 max-[700px]:pt-8">
        {/* 상단 지도 돌아가기 버튼 추가 */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 p-0 mb-6 border-0 bg-transparent text-slate-500 text-sm font-medium cursor-pointer transition-colors hover:text-slate-900"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          지도 돌아가기
        </button>

        <section className="flex items-end justify-between mb-[30px] text-left max-[700px]:block">
          <div className="flex-1 min-w-0 text-left">
            <span className="text-blue-600 text-xs font-semibold tracking-[0.13em]">
              ROAD DAMAGE REPORT
            </span>
            <h1 className="mt-2 mb-[9px] text-xl font-semibold text-slate-900 text-left">
              도로파손 신고
            </h1>
            <p className="m-0 text-slate-500 text-sm text-left">
              도로파손 현장을 촬영하고 위치와 내용을 입력해주세요.
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium max-[700px]:mt-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold shrink-0">
              01
            </span>
            신고 정보 입력
          </div>
        </section>

        <form onSubmit={handleSubmit} className="max-w-[1080px]">
          {/* 01. Photo */}
          <section className="p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]">
            <div className="flex items-start gap-3 mb-[23px] text-left">
              <div className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
                01
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">파손 현장 사진</h2>
                <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">
                  AI 분석을 위해 파손 부위가 잘 보이도록 촬영해주세요.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 py-[11px] px-[13px] mb-[13px] rounded-lg bg-slate-50 text-slate-500 text-xs text-left">
              <Camera size={18} className="text-blue-600 shrink-0" />
              <span>
                최대 3장까지 등록할 수 있습니다.
                <strong className="text-blue-600"> JPG, PNG</strong> 파일을 권장합니다.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-[430px]:gap-[7px]">
              {images.map((image) => (
                <div
                  className="relative bg-slate-100 rounded-lg overflow-hidden aspect-[1.4/1] max-[430px]:aspect-[1.15/1]"
                  key={image.id}
                >
                  <img
                    src={image.preview}
                    alt="도로파손 신고 이미지"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-[7px] right-[7px] w-[26px] h-[26px] border-0 rounded-full bg-[rgba(20,24,22,0.72)] text-white flex items-center justify-center cursor-pointer"
                    onClick={() => removeImage(image.id)}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="aspect-[1.4/1] max-[430px]:aspect-[1.15/1] rounded-lg overflow-hidden border-[1.5px] border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-center transition-colors hover:border-blue-600 hover:bg-blue-50">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Upload size={22} />
                  </div>
                  <strong className="text-xs text-slate-900">사진 추가</strong>
                  <span className="mt-[3px] text-slate-400 text-xs">{images.length}/3</span>
                </label>
              )}
            </div>
          </section>

          {/* 02. Damage Type */}
          <section className="p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]">
            <div className="flex items-start gap-3 mb-[23px] text-left">
              <div className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
                02
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">파손 유형</h2>
                <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">
                  가장 가까운 파손 유형을 선택해주세요.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[9px] max-[700px]:grid-cols-1">
              {DAMAGE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = damageType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    className={`relative flex items-center gap-3 min-h-[76px] p-[13px] rounded-lg bg-white text-left cursor-pointer transition-colors border ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-[0_0_0_1px_#2563EB]"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                    onClick={() => setDamageType(type.value)}
                  >
                    <div
                      className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={21} />
                    </div>
                    <div className="flex flex-col gap-[3px] text-left">
                      <strong className="text-sm text-slate-900 text-left">{type.label}</strong>
                      <span className="text-slate-400 text-xs text-left">{type.description}</span>
                    </div>
                    <div
                      className={`ml-auto w-[17px] h-[17px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                        isSelected ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-600" : "bg-transparent"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-start gap-2 mt-[13px] py-[11px] px-3 rounded-lg bg-slate-50 text-left">
              <div className="text-blue-600 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <p className="m-0 text-slate-500 text-xs leading-[1.6] text-left">
                선택한 유형은 참고용입니다. 신고 사진은 AI가 별도로 분석하여 파손 유형을 판별합니다.
              </p>
            </div>
          </section>

          {/* 03. Location */}
          <section className="p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]">
            <div className="flex items-start gap-3 mb-[23px] text-left">
              <div className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
                03
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">파손 위치</h2>
                <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">
                  정확한 위치를 입력하면 처리 속도가 빨라집니다.
                </p>
              </div>
            </div>

            <div className="flex items-center h-12 pr-[7px] pl-[14px] border border-slate-200 rounded-lg bg-white max-[430px]:h-auto max-[430px]:p-[10px] max-[430px]:flex-wrap">
              <MapPin size={18} className="shrink-0 text-blue-600" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="도로명 주소를 입력해주세요."
                className="flex-1 min-w-0 h-full px-2.5 border-0 outline-none text-slate-900 text-sm text-left placeholder:text-slate-400 max-[430px]:h-[35px]"
              />
              <button
                type="button"
                className="h-[34px] px-2.5 flex items-center gap-[5px] border-0 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold cursor-pointer shrink-0 transition-colors hover:bg-slate-200 max-[430px]:w-full max-[430px]:justify-center max-[430px]:mt-[5px]"
                onClick={handleCurrentLocation}
              >
                <Navigation size={15} />
                현재 위치
              </button>
            </div>

            <div className="relative h-[220px] mt-3 overflow-hidden border border-slate-200 rounded-xl">
              <Map
                center={mapCenter}
                style={{ width: "100%", height: "100%" }}
                level={4}
                onClick={handleMapClick}
              >
                {markerPos && (
                  <CustomOverlayMap position={markerPos} xAnchor={0.5} yAnchor={1}>
                    <div className="w-12 h-12 rounded-full bg-blue-600/15 text-blue-600 flex items-center justify-center">
                      <MapPin size={26} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.12)]" />
                    </div>
                  </CustomOverlayMap>
                )}
              </Map>

              {!markerPos && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none py-[5px] px-2 rounded-md bg-white/90 text-slate-500 text-xs font-medium">
                  지도를 눌러 위치를 선택하세요
                </span>
              )}
            </div>

            <p className="mt-2 mb-0 text-slate-400 text-xs text-left">
              ※ 지도를 클릭하면 해당 위치의 주소가 자동으로 입력됩니다.
            </p>
          </section>

          {/* 04. Severity */}
          <section className="p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]">
            <div className="flex items-start gap-3 mb-[23px] text-left">
              <div className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
                04
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">파손 심각도</h2>
                <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">
                  현재 도로 이용에 미치는 영향을 선택해주세요.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[9px] max-[700px]:grid-cols-1">
              {SEVERITY_OPTIONS.map((option) => {
                const isSelected = severity === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex items-center gap-2.5 p-[15px] rounded-lg bg-white text-left cursor-pointer transition-colors border ${
                      isSelected
                        ? `${SEVERITY_SELECTED_BORDER[option.value]} bg-slate-50`
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setSeverity(option.value)}
                  >
                    <div className={`w-2.5 h-2.5 shrink-0 rounded-full ${SEVERITY_DOT_COLOR[option.value]}`} />
                    <div className="flex flex-col gap-[3px] text-left">
                      <strong className="text-xs text-slate-900 text-left">{option.label}</strong>
                      <span className="text-slate-400 text-xs text-left">{option.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 05. Detail */}
          <section className="p-7 mb-[15px] bg-white border border-slate-200 rounded-xl shadow-sm text-left max-[700px]:p-5 max-[430px]:p-[17px]">
            <div className="flex items-start gap-3 mb-[23px] text-left">
              <div className="w-8 h-8 min-w-8 max-w-8 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold mt-px">
                05
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h2 className="m-0 mb-1 text-sm font-semibold text-slate-900 text-left">상세 내용</h2>
                <p className="m-0 text-slate-500 text-xs leading-[1.5] text-left">
                  파손 상태나 주변 상황을 알려주세요.
                  <span className="text-slate-400"> (선택)</span>
                </p>
              </div>
            </div>

            <textarea
              className="w-full min-h-[130px] p-[13px] border border-slate-200 rounded-lg outline-none resize-y text-slate-900 bg-white text-sm leading-[1.7] text-left placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              maxLength={500}
              placeholder={
                "예: 차량이 지나갈 때 큰 충격이 발생합니다.\n도로 우측 차선에 포트홀이 있습니다."
              }
            />
            <div className="mt-1.5 text-right text-slate-400 text-xs">{detail.length} / 500</div>
          </section>

          {/* Notice */}
          <section className="flex items-start gap-[13px] p-5 mb-[18px] border border-slate-200 rounded-xl shadow-sm bg-white text-left">
            <div className="w-[35px] h-[35px] shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertTriangle size={19} />
            </div>
            <div>
              <strong className="block mb-2 text-xs text-slate-900 text-left">신고 전 안내사항</strong>
              <ul className="m-0 pl-4 text-slate-500 text-xs leading-[1.8] text-left">
                <li>허위 또는 장난성 신고는 서비스 이용에 제한이 있을 수 있습니다.</li>
                <li>신고 사진 및 위치정보는 도로파손 확인과 행정처리를 위해 사용됩니다.</li>
                <li>AI 분석 결과는 참고용이며 최종 처리는 담당 부서의 현장 확인을 기준으로 합니다.</li>
              </ul>

              <label className="flex items-center gap-[7px] mt-[13px] text-slate-700 text-xs font-medium cursor-pointer text-left">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="accent-blue-600 w-[15px] h-[15px] shrink-0"
                />
                <span>신고 안내사항을 확인했으며 신고 내용 제공에 동의합니다.</span>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end gap-2 max-[700px]:sticky max-[700px]:bottom-0 max-[700px]:py-3 max-[700px]:bg-slate-50/95 max-[700px]:backdrop-blur-[10px]">
            <button
              type="button"
              className="h-12 px-[22px] rounded-lg font-sans text-sm font-semibold cursor-pointer border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 max-[700px]:flex-1"
              onClick={() => navigate(-1)}
            >
              취소
            </button>

            <button
              type="submit"
              className="min-w-[145px] h-12 px-[22px] rounded-lg text-sm font-semibold cursor-pointer border-0 bg-blue-600 text-white flex items-center justify-center gap-[7px] transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed max-[700px]:flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  신고 접수 중...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  파손 신고하기
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
