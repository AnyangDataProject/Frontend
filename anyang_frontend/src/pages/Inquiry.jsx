import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  MessageSquareText,
  Send,
  Paperclip,
  X,
  CheckCircle2,
  Info,
  Mail,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Inquiry.css";

const INQUIRY_TYPES = [
  { value: "report", label: "신고 관련 문의", description: "접수한 신고에 대해 문의합니다." },
  { value: "result", label: "처리 결과 문의", description: "처리 결과 또는 진행 상황을 문의합니다." },
  { value: "service", label: "서비스 이용 문의", description: "로드센스 이용 방법을 문의합니다." },
  { value: "etc", label: "기타 민원", description: "기타 의견이나 민원을 접수합니다." },
];

function Inquiry() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inquiryType) {
      alert("문의 유형을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      alert("답변 받을 이메일을 입력해주세요.");
      return;
    }
    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setSubmitted(true);
  };

  const resetForm = () => {
    setInquiryType("");
    setTitle("");
    setContent("");
    setEmail("");
    setAgree(false);
    setFiles([]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="inq-page">
        <main className="inq-success-page">
          <div className="inq-success-card">
            <button className="inq-back inq-back--card" onClick={() => navigate("/")}>
              <ArrowLeft size={17} />
              지도 돌아가기
            </button>

            <div className="inq-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <p className="inq-success-eyebrow">SUBMISSION COMPLETE</p>

            <h1>
              민원·문의가
              <br />
              접수되었습니다.
            </h1>

            <p className="inq-success-description">
              보내주신 내용을 담당자가 확인한 후 답변드리겠습니다.
              <br />
              답변은 입력하신 이메일로 전달됩니다.
            </p>

            <div className="inq-success-info">
              <div>
                <Mail size={17} />
                <span>답변 이메일</span>
                <strong>{email}</strong>
              </div>

              <div>
                <Clock3 size={17} />
                <span>답변 안내</span>
                <strong>담당자 확인 후 순차적으로 답변</strong>
              </div>
            </div>

            <div className="inq-success-buttons">
              <button className="inq-secondary-button" onClick={() => navigate("/")}>
                지도 돌아가기
              </button>
              <button className="inq-primary-button" onClick={resetForm}>
                문의 하나 더 접수
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="inq-page">
      <main className="inq-main">
        <button className="inq-back" onClick={() => navigate("/")}>
          <ArrowLeft size={17} />
          지도 돌아가기
        </button>

        <section className="inq-title-section">
          <div>
            <p className="inq-eyebrow">CIVIL SERVICE</p>
            <h1>민원 · 문의 접수</h1>
            <p>로드센스 이용 중 궁금한 점이나 개선 의견을 남겨주세요.</p>
          </div>
        </section>

        <div className="inq-layout">
          <section className="inq-form-card">
            <form onSubmit={handleSubmit}>
              {/* 문의 유형 */}
              <div className="inq-form-section">
                <div className="inq-section-title">
                  <span>01</span>
                  <div>
                    <h2>문의 유형</h2>
                    <p>문의하실 내용을 선택해주세요.</p>
                  </div>
                </div>

                <div className="inq-type-grid">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type.value}
                      className={`inq-type-card ${inquiryType === type.value ? "selected" : ""}`}
                      onClick={() => setInquiryType(type.value)}
                    >
                      <div className="inq-type-radio">
                        {inquiryType === type.value && <span />}
                      </div>
                      <div>
                        <strong>{type.label}</strong>
                        <p>{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 / 내용 */}
              <div className="inq-form-section">
                <div className="inq-section-title">
                  <span>02</span>
                  <div>
                    <h2>문의 내용</h2>
                    <p>문의 내용을 자세하게 작성해주세요.</p>
                  </div>
                </div>

                <div className="inq-input-group">
                  <label htmlFor="inq-title">
                    제목
                    <em>*</em>
                  </label>
                  <input
                    id="inq-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문의 제목을 입력해주세요."
                    maxLength={100}
                  />
                  <div className="inq-input-count">{title.length}/100</div>
                </div>

                <div className="inq-input-group">
                  <label htmlFor="inq-content">
                    문의 내용
                    <em>*</em>
                  </label>
                  <textarea
                    id="inq-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`문의하실 내용을 입력해주세요.\n\n예) 신고한 도로 파손이 처리중이라고 표시되는데 현재 어떤 단계인지 궁금합니다.`}
                    maxLength={1000}
                  />
                  <div className="inq-input-count">{content.length}/1000</div>
                </div>
              </div>

              {/* 첨부파일 */}
              <div className="inq-form-section">
                <div className="inq-section-title">
                  <span>03</span>
                  <div>
                    <h2>첨부파일</h2>
                    <p>문의 내용을 설명하는 사진이나 파일을 첨부할 수 있습니다.</p>
                  </div>
                </div>

                <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />

                <button
                  type="button"
                  className="inq-file-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                  파일 첨부하기
                  <span>최대 5개</span>
                </button>

                {files.length > 0 && (
                  <div className="inq-file-list">
                    {files.map((file, index) => (
                      <div className="inq-file-item" key={`${file.name}-${index}`}>
                        <Paperclip size={14} />
                        <span>{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 이메일 */}
              <div className="inq-form-section">
                <div className="inq-section-title">
                  <span>04</span>
                  <div>
                    <h2>답변 받을 정보</h2>
                    <p>문의 답변을 받을 이메일을 입력해주세요.</p>
                  </div>
                </div>

                <div className="inq-input-group">
                  <label htmlFor="inq-email">
                    이메일
                    <em>*</em>
                  </label>
                  <div className="inq-email-input">
                    <Mail size={17} />
                    <input
                      id="inq-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* 개인정보 */}
              <div className="inq-consent">
                <label>
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span className="inq-custom-checkbox">{agree && "✓"}</span>
                  <span>
                    개인정보 수집 및 이용에 동의합니다.
                    <em> *</em>
                  </span>
                </label>
                <p>
                  문의 접수 및 답변을 위해 이메일 등의 정보를 수집하며, 목적 달성 후 관련 법령에
                  따라 안전하게 관리됩니다.
                </p>
              </div>

              {/* 제출 */}
              <div className="inq-submit-area">
                <button type="button" className="inq-cancel-button" onClick={() => navigate("/")}>
                  취소
                </button>
                <button type="submit" className="inq-submit-button">
                  <Send size={17} />
                  민원 · 문의 접수하기
                </button>
              </div>
            </form>
          </section>

          {/* 안내 사이드바 */}
          <aside className="inq-side">
            <div className="inq-guide-card">
              <div className="inq-guide-icon">
                <Info size={20} />
              </div>

              <h3>민원 · 문의 접수 안내</h3>
              <p>도로 파손 신고와 관련된 문의나 서비스 이용 중 발생한 불편사항을 접수할 수 있습니다.</p>

              <div className="inq-guide-divider" />

              <div className="inq-guide-item">
                <strong>도로 파손을 발견했다면?</strong>
                <p>
                  일반 문의보다 <b>파손 신고</b>를 이용해주세요. 사진과 위치를 등록하면 AI 분석을
                  통해 신고가 접수됩니다.
                </p>
                <button type="button" onClick={() => navigate("/report")}>
                  파손 신고하기
                </button>
              </div>
            </div>

            <div className="inq-help-card">
              <div className="inq-help-header">
                <MessageSquareText size={17} />
                문의 처리 절차
              </div>

              <div className="inq-process">
                <div>
                  <span>1</span>
                  <p>
                    <strong>문의 접수</strong>
                    <small>문의 내용을 등록합니다.</small>
                  </p>
                </div>
                <div>
                  <span>2</span>
                  <p>
                    <strong>담당자 확인</strong>
                    <small>담당 부서에서 내용을 확인합니다.</small>
                  </p>
                </div>
                <div>
                  <span>3</span>
                  <p>
                    <strong>답변 전달</strong>
                    <small>입력하신 이메일로 답변드립니다.</small>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Inquiry;