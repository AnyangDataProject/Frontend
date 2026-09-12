import { useRef, useState } from "react";
import {
  MessageSquareText,
  Send,
  Paperclip,
  X,
  Info,
  Mail,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import StepSection from "../../components/citizen/StepSection";
import InfoNotice from "../../components/citizen/InfoNotice";
import SuccessScreen from "../../components/citizen/SuccessScreen";
import { INQUIRY_TYPES } from "../../mocks/citizen/inquiryData";

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
      <div className="min-h-screen bg-slate-50 pt-[72px]">
        <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-5 pb-20">
          <div className="relative w-[min(580px,100%)] rounded-xl border border-slate-200 bg-white p-9 max-[650px]:px-5 max-[650px]:py-[38px] text-center shadow-sm">
            <div className="absolute left-[22px] top-[22px]">
              <BackButton to="/" />
            </div>

            <SuccessScreen
              eyebrow="SUBMISSION COMPLETE"
              title={
                <>
                  민원·문의가
                  <br />
                  접수되었습니다.
                </>
              }
              description={
                <>
                  보내주신 내용을 담당자가 확인한 후 답변드리겠습니다.
                  <br />
                  답변은 입력하신 이메일로 전달됩니다.
                </>
              }
              summary={
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <div className="flex min-h-[32px] items-center gap-2">
                    <Mail size={17} className="text-blue-600" />
                    <span className="w-20 text-xs text-slate-400">답변 이메일</span>
                    <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-900">
                      {email}
                    </strong>
                  </div>

                  <div className="flex min-h-[32px] items-center gap-2">
                    <Clock3 size={17} className="text-blue-600" />
                    <span className="w-20 text-xs text-slate-400">답변 안내</span>
                    <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-900">
                      담당자 확인 후 순차적으로 답변
                    </strong>
                  </div>
                </div>
              }
              secondaryAction={
                <button
                  className="h-[45px] flex-1 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
                  onClick={() => navigate("/")}
                >
                  지도 돌아가기
                </button>
              }
              primaryAction={
                <button
                  className="h-[45px] flex-1 rounded-lg border-0 bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  onClick={resetForm}
                >
                  문의 하나 더 접수
                </button>
              }
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <PageHeader
          eyebrow="CIVIL SERVICE"
          title="민원 · 문의 접수"
          description="로드센스 이용 중 궁금한 점이나 개선 의견을 남겨주세요."
        />

        <div className="grid grid-cols-[minmax(0,1fr)_300px] max-[850px]:grid-cols-1 items-start gap-[18px]">
          <section className="rounded-xl border border-slate-200 bg-white p-7 max-[650px]:p-5 shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* 문의 유형 */}
              <StepSection number="01" title="문의 유형" description="문의하실 내용을 선택해주세요." card={false}>
                <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-[9px]">
                  {INQUIRY_TYPES.map((type) => {
                    const isSelected = inquiryType === type.value;
                    return (
                      <button
                        type="button"
                        key={type.value}
                        className={`flex min-h-[76px] items-start gap-3 rounded-lg border p-[13px] text-left transition-colors ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                        onClick={() => setInquiryType(type.value)}
                      >
                        <div
                          className={`mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                            isSelected ? "border-blue-600" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                        </div>
                        <div>
                          <strong className="block text-sm text-slate-900">{type.label}</strong>
                          <p className="mt-[3px] text-xs leading-[1.4] text-slate-400">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepSection>

              {/* 제목 / 내용 */}
              <StepSection number="02" title="문의 내용" description="문의 내용을 자세하게 작성해주세요." card={false}>
                <div className="relative mb-4 text-left">
                  <label htmlFor="inq-title" className="mb-[7px] block text-xs font-medium text-slate-700">
                    제목
                    <em className="ml-[3px] not-italic text-red-600">*</em>
                  </label>
                  <input
                    id="inq-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문의 제목을 입력해주세요."
                    maxLength={100}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-[13px] font-[inherit] text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                  <div className="absolute bottom-2.5 right-3 text-xs text-slate-400">
                    {title.length}/100
                  </div>
                </div>

                <div className="relative text-left">
                  <label htmlFor="inq-content" className="mb-[7px] block text-xs font-medium text-slate-700">
                    문의 내용
                    <em className="ml-[3px] not-italic text-red-600">*</em>
                  </label>
                  <textarea
                    id="inq-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`문의하실 내용을 입력해주세요.\n\n예) 신고한 도로 파손이 처리중이라고 표시되는데 현재 어떤 단계인지 궁금합니다.`}
                    maxLength={1000}
                    className="min-h-[150px] w-full resize-y rounded-lg border border-slate-200 bg-white p-[13px] font-[inherit] text-sm leading-[1.7] text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  />
                  <div className="absolute bottom-2.5 right-3 text-xs text-slate-400">
                    {content.length}/1000
                  </div>
                </div>
              </StepSection>

              {/* 첨부파일 */}
              <StepSection
                number="03"
                title="첨부파일"
                description="문의 내용을 설명하는 사진이나 파일을 첨부할 수 있습니다."
                card={false}
              >
                <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />

                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-lg border-[1.5px] border-dashed border-slate-200 bg-slate-50 px-3.5 font-[inherit] text-sm font-medium text-slate-500 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={17} />
                  파일 첨부하기
                  <span className="ml-1 text-xs font-normal text-slate-400">최대 5개</span>
                </button>

                {files.length > 0 && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    {files.map((file, index) => (
                      <div
                        className="flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                        key={`${file.name}-${index}`}
                      >
                        <Paperclip size={14} />
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-0 bg-transparent text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </StepSection>

              {/* 이메일 */}
              <div>
                <div className="mb-5 flex items-start gap-3 text-left">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600">
                    04
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <h2 className="mb-[3px] text-sm font-semibold text-slate-900">답변 받을 정보</h2>
                    <p className="text-xs text-slate-400">문의 답변을 받을 이메일을 입력해주세요.</p>
                  </div>
                </div>

                <div className="text-left">
                  <label htmlFor="inq-email" className="mb-[7px] block text-xs font-medium text-slate-700">
                    이메일
                    <em className="ml-[3px] not-italic text-red-600">*</em>
                  </label>
                  <div className="flex h-11 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-[13px] transition-shadow focus-within:border-blue-600 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
                    <Mail size={17} className="shrink-0 text-blue-600" />
                    <input
                      id="inq-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="h-full w-full border-0 font-[inherit] text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* 개인정보 */}
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="relative flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-900">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="pointer-events-none absolute opacity-0"
                  />
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] text-xs font-semibold text-white transition-colors ${
                      agree ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"
                    }`}
                  >
                    {agree && "✓"}
                  </span>
                  <span>
                    개인정보 수집 및 이용에 동의합니다.
                    <em className="not-italic text-red-600"> *</em>
                  </span>
                </label>
                <p className="ml-6 mt-1.5 text-xs leading-[1.6] text-slate-500">
                  문의 접수 및 답변을 위해 이메일 등의 정보를 수집하며, 목적 달성 후 관련 법령에
                  따라 안전하게 관리됩니다.
                </p>
              </div>

              {/* 제출 */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center gap-[7px] rounded-lg border border-slate-200 bg-white px-[22px] max-[650px]:flex-1 max-[650px]:px-2.5 font-[inherit] text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
                  onClick={() => navigate("/")}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex h-12 min-w-[145px] items-center justify-center gap-[7px] rounded-lg border-0 bg-blue-600 px-[22px] max-[650px]:flex-1 max-[650px]:px-2.5 font-[inherit] text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Send size={17} />
                  민원 · 문의 접수하기
                </button>
              </div>
            </form>
          </section>

          {/* 안내 사이드바 */}
          <aside className="sticky top-[90px] max-[850px]:static flex flex-col max-[850px]:grid max-[850px]:grid-cols-2 max-[650px]:!grid-cols-1 gap-[15px]">
            <InfoNotice variant="panel" icon={<Info size={20} />}>
              <h3 className="text-sm font-semibold text-slate-900">
                민원 · 문의 접수 안내
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                도로 파손 신고와 관련된 문의나 서비스 이용 중 발생한 불편사항을 접수할 수 있습니다.
              </p>

              <div className="my-[18px] h-px w-full bg-slate-200" />

              <div className="w-full text-left">
                <strong className="text-sm font-semibold text-slate-900">도로 파손을 발견했다면?</strong>
                <p className="mb-3.5 mt-1.5 text-xs leading-[1.6] text-slate-500">
                  일반 문의보다 <b className="font-semibold text-blue-600">파손 신고</b>를 이용해주세요. 사진과
                  위치를 등록하면 AI 분석을 통해 신고가 접수됩니다.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/report")}
                  className="h-9 w-full rounded-lg border border-blue-200 bg-blue-50 font-[inherit] text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  파손 신고하기
                </button>
              </div>
            </InfoNotice>

            <div className="rounded-xl border border-slate-200 bg-white p-[22px] text-left shadow-sm">
              <div className="mb-[18px] flex items-center gap-2 text-left text-sm font-semibold text-slate-900">
                <MessageSquareText size={17} className="text-blue-600" />
                문의 처리 절차
              </div>

              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-start gap-2.5 text-left">
                  <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    1
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <strong className="block text-sm font-medium text-slate-900">문의 접수</strong>
                    <small className="mt-[3px] block text-xs leading-[1.4] text-slate-500">
                      문의 내용을 등록합니다.
                    </small>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-left">
                  <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    2
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <strong className="block text-sm font-medium text-slate-900">담당자 확인</strong>
                    <small className="mt-[3px] block text-xs leading-[1.4] text-slate-500">
                      담당 부서에서 내용을 확인합니다.
                    </small>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-left">
                  <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    3
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <strong className="block text-sm font-medium text-slate-900">답변 전달</strong>
                    <small className="mt-[3px] block text-xs leading-[1.4] text-slate-500">
                      입력하신 이메일로 답변드립니다.
                    </small>
                  </div>
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
