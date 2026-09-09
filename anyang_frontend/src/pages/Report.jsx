import React, { useState } from "react";
import {
  ArrowLeft,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Report.css";

const DAMAGE_TYPES = [
  {
    value: "pothole",
    label: "포트홀",
    icon: CircleDot,
    description: "도로가 움푹 파인 상태",
  },
  {
    value: "crack",
    label: "노면 균열",
    icon: Construction,
    description: "도로 표면에 균열이 발생한 상태",
  },
  {
    value: "sign",
    label: "표지판 파손",
    icon: Signpost,
    description: "표지판이나 안전시설물이 파손된 상태",
  },
  {
    value: "manhole",
    label: "맨홀/시설물",
    icon: AlertTriangle,
    description: "맨홀 및 도로시설물 이상",
  },
];

const SEVERITY_OPTIONS = [
  {
    value: "low",
    label: "낮음",
    description: "경미한 파손",
  },
  {
    value: "mid",
    label: "보통",
    description: "통행에 불편이 있는 파손",
  },
  {
    value: "high",
    label: "높음",
    description: "사고 위험이 높은 파손",
  },
];

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

  /* -------------------------------------------------------
     이미지 업로드
  ------------------------------------------------------- */

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

      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((image) => image.id !== id);
    });
  };

  /* -------------------------------------------------------
     현재 위치
  ------------------------------------------------------- */

  const handleCurrentLocation = () => {
    setAddress("현재 위치를 확인하는 중입니다...");

    if (!navigator.geolocation) {
      setAddress("현재 위치를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 실제 서비스에서는 Kakao/Naver 주소 변환 API 사용
        setAddress(
          `안양시 위치 확인 완료 (${latitude.toFixed(
            5
          )}, ${longitude.toFixed(5)})`
        );
      },
      () => {
        setAddress(
          "현재 위치를 가져오지 못했습니다. 주소를 직접 입력해주세요."
        );
      }
    );
  };

  /* -------------------------------------------------------
     신고 제출
  ------------------------------------------------------- */

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

    // 실제 API 연동 전 Mock 처리
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  /* -------------------------------------------------------
     제출 완료
  ------------------------------------------------------- */

  if (submitted) {
    return (
      <div className="report-page">

        <header className="report-header">
          <div className="report-header-inner">

            <button
              className="report-back"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={19} />
              돌아가기
            </button>

            <div className="report-logo">
              <span className="report-logo-mark" />
              <div>
                <strong>로드센스</strong>
                <span>안양시 AI 도로파손 탐지 서비스</span>
              </div>
            </div>

          </div>
        </header>

        <main className="report-success">

          <div className="success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="success-eyebrow">
            REPORT SUBMITTED
          </span>

          <h1>신고가 접수되었습니다.</h1>

          <p>
            시민님의 신고를 담당 부서에 전달했습니다.
            <br />
            등록된 사진은 AI 분석을 거쳐 도로파손 유형과
            위험도를 판단합니다.
          </p>

          <div className="success-number">
            <span>신고 접수번호</span>
            <strong>RS-202609-0009</strong>
          </div>

          <div className="success-actions">

            <button
              className="success-secondary"
              onClick={() => navigate("/")}
            >
              지도 보기
            </button>

            <button
              className="success-primary"
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
    <div className="report-page">

      {/* =====================================================
          Header
      ===================================================== */}

      <header className="report-header">

        <div className="report-header-inner">

          <button
            className="report-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={19} />
            돌아가기
          </button>

          <div className="report-logo">

            <span className="report-logo-mark" />

            <div>
              <strong>로드센스</strong>
              <span>
                안양시 AI 도로파손 탐지 서비스
              </span>
            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          Main
      ===================================================== */}

      <main className="report-main">

        {/* Page title */}

        <section className="report-title">

          <div>

            <span className="report-eyebrow">
              ROAD DAMAGE REPORT
            </span>

            <h1>도로파손 신고</h1>

            <p>
              도로파손 현장을 촬영하고 위치와 내용을
              입력해주세요.
            </p>

          </div>

          <div className="report-step">
            <span>01</span>
            신고 정보 입력
          </div>

        </section>


        <form onSubmit={handleSubmit}>

          {/* =================================================
              01. Photo
          ================================================= */}

          <section className="report-card">

            <div className="report-card-title">

              <div className="report-number">
                01
              </div>

              <div>
                <h2>파손 현장 사진</h2>
                <p>
                  AI 분석을 위해 파손 부위가 잘 보이도록
                  촬영해주세요.
                </p>
              </div>

            </div>


            <div className="photo-guide">

              <Camera size={18} />

              <span>
                최대 3장까지 등록할 수 있습니다.
                <strong> JPG, PNG</strong> 파일을 권장합니다.
              </span>

            </div>


            <div className="photo-upload-area">

              {images.map((image) => (
                <div
                  className="uploaded-image"
                  key={image.id}
                >

                  <img
                    src={image.preview}
                    alt="도로파손 신고 이미지"
                  />

                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(image.id)}
                  >
                    <X size={15} />
                  </button>

                </div>
              ))}


              {images.length < 3 && (
                <label className="photo-upload">

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />

                  <div className="upload-icon">
                    <Upload size={22} />
                  </div>

                  <strong>
                    사진 추가
                  </strong>

                  <span>
                    {images.length}/3
                  </span>

                </label>
              )}

            </div>

          </section>


          {/* =================================================
              02. Damage Type
          ================================================= */}

          <section className="report-card">

            <div className="report-card-title">

              <div className="report-number">
                02
              </div>

              <div>
                <h2>파손 유형</h2>
                <p>
                  가장 가까운 파손 유형을 선택해주세요.
                </p>
              </div>

            </div>


            <div className="damage-type-grid">

              {DAMAGE_TYPES.map((type) => {

                const Icon = type.icon;

                return (
                  <button
                    key={type.value}
                    type="button"
                    className={`damage-type ${
                      damageType === type.value
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setDamageType(type.value)
                    }
                  >

                    <div className="damage-type-icon">
                      <Icon size={21} />
                    </div>

                    <div className="damage-type-text">

                      <strong>
                        {type.label}
                      </strong>

                      <span>
                        {type.description}
                      </span>

                    </div>

                    <div className="damage-radio">
                      <span />
                    </div>

                  </button>
                );
              })}

            </div>

            <div className="ai-notice">

              <div>
                <AlertTriangle size={16} />
              </div>

              <p>
                선택한 유형은 참고용입니다.
                신고 사진은 AI가 별도로 분석하여
                파손 유형을 판별합니다.
              </p>

            </div>

          </section>


          {/* =================================================
              03. Location
          ================================================= */}

          <section className="report-card">

            <div className="report-card-title">

              <div className="report-number">
                03
              </div>

              <div>
                <h2>파손 위치</h2>
                <p>
                  정확한 위치를 입력하면 처리 속도가
                  빨라집니다.
                </p>
              </div>

            </div>


            <div className="location-input-wrap">

              <MapPin size={18} />

              <input
                type="text"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="도로명 주소를 입력해주세요."
              />

              <button
                type="button"
                className="location-button"
                onClick={handleCurrentLocation}
              >
                <Navigation size={15} />
                현재 위치
              </button>

            </div>


            {/* Mock Map */}

            <div className="location-map">

              <div className="mock-map-road road-a" />
              <div className="mock-map-road road-b" />
              <div className="mock-map-road road-c" />
              <div className="mock-map-road road-d" />

              <div className="location-marker">
                <MapPin size={26} />
              </div>

              <span className="map-label">
                신고 위치
              </span>

            </div>

            <p className="location-help">
              ※ 실제 서비스에서는 지도에서 직접 위치를
              선택할 수 있습니다.
            </p>

          </section>


          {/* =================================================
              04. Severity
          ================================================= */}

          <section className="report-card">

            <div className="report-card-title">

              <div className="report-number">
                04
              </div>

              <div>
                <h2>파손 심각도</h2>
                <p>
                  현재 도로 이용에 미치는 영향을 선택해주세요.
                </p>
              </div>

            </div>


            <div className="severity-grid">

              {SEVERITY_OPTIONS.map((option) => (

                <button
                  key={option.value}
                  type="button"
                  className={`severity-option severity-${option.value} ${
                    severity === option.value
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSeverity(option.value)
                  }
                >

                  <div className="severity-dot" />

                  <div>
                    <strong>
                      {option.label}
                    </strong>

                    <span>
                      {option.description}
                    </span>
                  </div>

                </button>

              ))}

            </div>

          </section>


          {/* =================================================
              05. Detail
          ================================================= */}

          <section className="report-card">

            <div className="report-card-title">

              <div className="report-number">
                05
              </div>

              <div>
                <h2>상세 내용</h2>
                <p>
                  파손 상태나 주변 상황을 알려주세요.
                  <span> (선택)</span>
                </p>
              </div>

            </div>


            <textarea
              className="detail-textarea"
              value={detail}
              onChange={(e) =>
                setDetail(e.target.value)
              }
              maxLength={500}
              placeholder={
                "예: 차량이 지나갈 때 큰 충격이 발생합니다.\n" +
                "도로 우측 차선에 포트홀이 있습니다."
              }
            />

            <div className="text-count">
              {detail.length} / 500
            </div>

          </section>


          {/* =================================================
              Notice
          ================================================= */}

          <section className="report-notice">

            <div className="report-notice-icon">
              <AlertTriangle size={19} />
            </div>

            <div>

              <strong>
                신고 전 안내사항
              </strong>

              <ul>
                <li>
                  허위 또는 장난성 신고는 서비스 이용에
                  제한이 있을 수 있습니다.
                </li>

                <li>
                  신고 사진 및 위치정보는 도로파손 확인과
                  행정처리를 위해 사용됩니다.
                </li>

                <li>
                  AI 분석 결과는 참고용이며 최종 처리는
                  담당 부서의 현장 확인을 기준으로 합니다.
                </li>
              </ul>

              <label className="agreement">

                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                />

                <span>
                  신고 안내사항을 확인했으며
                  신고 내용 제공에 동의합니다.
                </span>

              </label>

            </div>

          </section>


          {/* Submit */}

          <div className="report-submit-area">

            <button
              type="button"
              className="report-cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>

            <button
              type="submit"
              className="report-submit"
              disabled={submitting}
            >

              {submitting ? (
                <>
                  <span className="submit-spinner" />
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