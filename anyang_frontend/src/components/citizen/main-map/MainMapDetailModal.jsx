import Modal from "../../common/Modal";
import { DAMAGE_TYPE_META, SEVERITY_META, REPORT_STATUS_META } from "../../../mocks/citizen/constants";

export default function MainMapDetailModal({ pin, onClose }) {
  const damageType = DAMAGE_TYPE_META[pin?.type] ?? { label: pin?.type ?? '-' };

  return (
    <Modal open={!!pin} onClose={onClose} className="px-[22px] pt-14 pb-5">
      {pin && (
        <>
          <div className="w-full h-40 rounded-xl bg-slate-50 mb-3.5 overflow-hidden flex items-center justify-center border border-slate-200">
            {pin.photoUrl ? (
              <img
                className="w-full h-full object-cover"
                src={pin.photoUrl}
                alt={`${damageType.label} 현장 사진`}
              />
            ) : (
              <span className="text-xs text-slate-500">사진 없음</span>
            )}
          </div>

          <div className="text-lg font-semibold text-slate-900 mt-0.5">{damageType.label}</div>
          <div className="text-sm text-slate-500 mb-3.5">{pin.address}</div>

          <div className="flex justify-between py-[9px] border-b border-slate-200 text-sm text-slate-900">
            <span className="text-slate-500">심각도</span>
            <span style={{ color: SEVERITY_META[pin.severity].dotColor, fontWeight: 700 }}>
              {SEVERITY_META[pin.severity].label}
            </span>
          </div>
          <div className="flex justify-between py-[9px] border-b border-slate-200 text-sm text-slate-900">
            <span className="text-slate-500">처리 상태</span>
            <span style={{ color: REPORT_STATUS_META[pin.status].color, fontWeight: 700 }}>
              {REPORT_STATUS_META[pin.status].label}
            </span>
          </div>
          <div className="flex justify-between py-[9px] text-sm text-slate-900">
            <span className="text-slate-500">신고일</span>
            <span>{pin.reportedAt}</span>
          </div>
        </>
      )}
    </Modal>
  );
}
