import { useState } from "react";
import {
  Camera,
  MapPin,
  Upload,
  X,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import StepSection from "../../components/citizen/StepSection";
import SelectableCard from "../../components/citizen/SelectableCard";
import SuccessScreen from "../../components/citizen/SuccessScreen";
import Checkbox from "../../components/citizen/Checkbox";
import MessageModal from "../../components/citizen/MessageModal";
import { useMessageModal } from "../../hooks/useMessageModal";
import { DAMAGE_TYPE_META, SEVERITY_META } from "../../mocks/citizen/constants";

const PAGE_ROOT = "min-h-screen bg-slate-50 text-slate-900 pt-[72px] max-[768px]:pt-16 text-left";

const DAMAGE_TYPES = Object.entries(DAMAGE_TYPE_META).map(([value, meta]) => ({ value, ...meta }));
const SEVERITY_OPTIONS = Object.entries(SEVERITY_META).map(([value, meta]) => ({ value, ...meta }));

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
  const { modal, showError, showInfo, close: closeModal } = useMessageModal();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 3 - images.length;
    const newImages = files.slice(0, remaining).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);

    if (files.length > remaining) {
      showInfo("사진은 최대 3장까지 등록할 수 있습니다.\n초과한 사진은 추가되지 않았습니다.");
    }
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
      showError("도로파손 사진을 최소 1장 등록해주세요.");
      return;
    }
    if (!damageType) {
      showError("파손 유형을 선택해주세요.");
      return;
    }
    if (!address.trim()) {
      showError("파손 위치를 입력해주세요.");
      return;
    }
    if (!severity) {
      showError("파손 심각도를 선택해주세요.");
      return;
    }
    if (!agree) {
      showError("신고 안내사항에 동의해주세요.");
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
        <main className="w-[min(620px,calc(100%-40px))] mx-auto pt-[90px] pb-[100px]">
          <SuccessScreen
            eyebrow="REPORT SUBMITTED"
            title="신고가 접수되었습니다."
            description={
              <>
                시민님의 신고를 담당 부서에 전달했습니다.
                <br />
                등록된 사진은 AI 분석을 거쳐 도로파손 유형과 위험도를 판단합니다.
              </>
            }
            summary={
              <div className="flex flex-col gap-1.5 w-[250px] mx-auto p-[17px] border border-slate-200 rounded-xl shadow-sm bg-white text-center">
                <span className="text-slate-400 text-xs">신고 접수번호</span>
                <strong className="text-blue-600 text-base font-semibold tracking-[0.04em]">RS-202609-0009</strong>
              </div>
            }
            secondaryAction={
              <button
                className="h-[45px] px-5 rounded-lg font-sans text-sm font-semibold cursor-pointer border border-slate-200 bg-white text-slate-600 max-[430px]:w-full"
                onClick={() => navigate("/")}
              >
                지도 보기
              </button>
            }
            primaryAction={
              <button
                className="h-[45px] px-5 rounded-lg text-sm font-semibold cursor-pointer border-0 bg-blue-600 text-white max-[430px]:w-full"
                onClick={() => navigate("/my-reports")}
              >
                내 신고 확인
              </button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className={PAGE_ROOT}>
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 max-[700px]:pt-8">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <PageHeader
          eyebrow="ROAD DAMAGE REPORT"
          title="도로파손 신고"
          description="도로파손 현장을 촬영하고 위치와 내용을 입력해주세요."
        />

        <form onSubmit={handleSubmit}>
          {/* 01. Photo */}
          <StepSection number="01" title="파손 현장 사진" description="AI 분석을 위해 파손 부위가 잘 보이도록 촬영해주세요.">
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
          </StepSection>

          {/* 02. Damage Type */}
          <StepSection number="02" title="파손 유형" description="가장 가까운 파손 유형을 선택해주세요.">
            <div className="grid grid-cols-2 gap-[9px] max-[700px]:grid-cols-1">
              {DAMAGE_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = damageType === type.value;
                return (
                  <SelectableCard
                    key={type.value}
                    selected={isSelected}
                    onClick={() => setDamageType(type.value)}
                    icon={
                      <div
                        className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={21} />
                      </div>
                    }
                    label={type.label}
                    description={type.description}
                  />
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
          </StepSection>

          {/* 03. Location */}
          <StepSection number="03" title="파손 위치" description="정확한 위치를 입력하면 처리 속도가 빨라집니다.">
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
          </StepSection>

          {/* 04. Severity */}
          <StepSection number="04" title="파손 심각도" description="현재 도로 이용에 미치는 영향을 선택해주세요.">
            <div className="grid grid-cols-3 gap-[9px] max-[700px]:grid-cols-1">
              {SEVERITY_OPTIONS.map((option) => (
                <SelectableCard
                  key={option.value}
                  selected={severity === option.value}
                  onClick={() => setSeverity(option.value)}
                  icon={<span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: option.dotColor }} />}
                  label={option.label}
                  description={option.description}
                  radio={false}
                  activeColor={option.color}
                />
              ))}
            </div>
          </StepSection>

          {/* 05. Detail */}
          <StepSection
            number="05"
            title="상세 내용"
            description={
              <>
                파손 상태나 주변 상황을 알려주세요.
                <span className="text-slate-400"> (선택)</span>
              </>
            }
          >
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
          </StepSection>

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

              <div className="mt-[13px]">
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  label="신고 안내사항을 확인했으며 신고 내용 제공에 동의합니다."
                  emphasized
                />
              </div>
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

      <MessageModal
        open={!!modal}
        onClose={closeModal}
        variant={modal?.variant}
        message={modal?.message}
      />
    </div>
  );
}
