import { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import ReportPhotoStep from "../../components/citizen/ReportPhotoStep";
import ReportDamageTypeStep from "../../components/citizen/ReportDamageTypeStep";
import ReportLocationStep from "../../components/citizen/ReportLocationStep";
import ReportSeverityStep from "../../components/citizen/ReportSeverityStep";
import ReportDetailStep from "../../components/citizen/ReportDetailStep";
import ReportNotice from "../../components/citizen/ReportNotice";
import SuccessScreen from "../../components/citizen/SuccessScreen";
import MessageModal from "../../components/citizen/MessageModal";
import { useMessageModal } from "../../hooks/useMessageModal";
import { useKakaoGeocoder } from "../../hooks/useKakaoGeocoder";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useFileAttachments } from "../../hooks/useFileAttachments";

const PAGE_ROOT = "min-h-screen bg-slate-50 text-slate-900 pt-[72px] max-[768px]:pt-16 text-left";

export default function Report() {
  const navigate = useNavigate();

  const { items: images, addFiles, removeItem: removeImage } = useFileAttachments({ max: 3, createPreview: true });
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
    addFiles(e.target.files, {
      onLimitExceeded: () =>
        showInfo("사진은 최대 3장까지 등록할 수 있습니다.\n초과한 사진은 추가되지 않았습니다."),
    });
  };

  const { reverseGeocode: kakaoReverseGeocode } = useKakaoGeocoder();
  const { requestLocation } = useCurrentLocation();

  const reverseGeocode = (lat, lng) => {
    kakaoReverseGeocode(lat, lng, {
      onSuccess: setAddress,
      onError: setAddress,
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
    requestLocation({
      onSuccess: (coords) => {
        setMapCenter({ lat: coords.latitude, lng: coords.longitude });
        setMarkerPos({ lat: coords.latitude, lng: coords.longitude });
        reverseGeocode(coords.latitude, coords.longitude);
      },
      onUnsupported: () => setAddress("현재 위치를 사용할 수 없습니다."),
      onError: () => setAddress("현재 위치를 가져오지 못했습니다. 주소를 직접 입력해주세요."),
    });
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
          <ReportPhotoStep images={images} onChange={handleImageChange} onRemove={removeImage} />

          <ReportDamageTypeStep value={damageType} onChange={setDamageType} />

          <ReportLocationStep
            address={address}
            onAddressChange={setAddress}
            onCurrentLocation={handleCurrentLocation}
            mapCenter={mapCenter}
            markerPos={markerPos}
            onMapClick={handleMapClick}
          />

          <ReportSeverityStep value={severity} onChange={setSeverity} />

          <ReportDetailStep value={detail} onChange={setDetail} />

          <ReportNotice agree={agree} onAgreeChange={setAgree} />

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
