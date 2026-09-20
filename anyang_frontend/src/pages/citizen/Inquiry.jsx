import { useState } from "react";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/citizen/BackButton";
import PageHeader from "../../components/citizen/PageHeader";
import InquiryTypeStep from "../../components/citizen/inquiry/InquiryTypeStep";
import InquiryContentStep from "../../components/citizen/inquiry/InquiryContentStep";
import InquiryAttachmentStep from "../../components/citizen/inquiry/InquiryAttachmentStep";
import InquiryContactStep from "../../components/citizen/inquiry/InquiryContactStep";
import InquiryPrivacyConsent from "../../components/citizen/inquiry/InquiryPrivacyConsent";
import InquirySidebar from "../../components/citizen/inquiry/InquirySidebar";
import InquirySubmittedView from "../../components/citizen/inquiry/InquirySubmittedView";
import MessageModal from "../../components/common/MessageModal";
import { useMessageModal } from "../../hooks/useMessageModal";
import { useFileAttachments } from "../../hooks/citizen/useFileAttachments";
import { submitInquiry } from "../../api/inquiry";
import { INQUIRY_TYPE_TO_BACKEND } from "../../api/enumMapping";

function Inquiry() {
  const navigate = useNavigate();
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { modal, showError, showInfo, close: closeModal } = useMessageModal();
  const { items: files, addFiles, removeItem: removeFile, clear: clearFiles } = useFileAttachments({ max: 5 });

  const handleFileChange = (event) => {
    addFiles(event.target.files, {
      onLimitExceeded: () =>
        showInfo("파일은 최대 5개까지 첨부할 수 있습니다.\n초과한 파일은 추가되지 않았습니다."),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inquiryType) {
      showError("문의 유형을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      showError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      showError("문의 내용을 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      showError("답변 받을 이메일을 입력해주세요.");
      return;
    }
    if (!agree) {
      showError("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        inquiryType: INQUIRY_TYPE_TO_BACKEND[inquiryType],
        title,
        content,
        email,
        files,
      });
      setSubmitted(true);
    } catch (err) {
      showError(err.message || "문의 접수 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setInquiryType("");
    setTitle("");
    setContent("");
    setEmail("");
    setAgree(false);
    clearFiles();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <InquirySubmittedView
        email={email}
        onGoToMap={() => navigate("/")}
        onGoToMyInquiries={() => navigate("/my-inquiries")}
        onReset={resetForm}
      />
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
          description="알로드 이용 중 궁금한 점이나 개선 의견을 남겨주세요."
        />

        <div className="grid grid-cols-[minmax(0,1fr)_300px] max-[850px]:grid-cols-1 items-start gap-[18px]">
          <section className="rounded-xl border border-slate-200 bg-white p-7 max-[650px]:p-5 shadow-sm">
            <form onSubmit={handleSubmit}>
              <InquiryTypeStep value={inquiryType} onChange={setInquiryType} />

              <InquiryContentStep
                title={title}
                onTitleChange={setTitle}
                content={content}
                onContentChange={setContent}
              />

              <InquiryAttachmentStep files={files} onChange={handleFileChange} onRemove={removeFile} />

              <InquiryContactStep email={email} onChange={setEmail} />

              <InquiryPrivacyConsent agree={agree} onChange={setAgree} />

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
                  disabled={submitting}
                  className="flex h-12 min-w-[145px] items-center justify-center gap-[7px] rounded-lg border-0 bg-blue-600 px-[22px] max-[650px]:flex-1 max-[650px]:px-2.5 font-[inherit] text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed">
                  <Send size={17} />
                  {submitting ? "접수 중..." : "민원 · 문의 접수하기"}
                </button>
              </div>
            </form>
          </section>

          <InquirySidebar onGoToReport={() => navigate("/report")} />
        </div>
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

export default Inquiry;
