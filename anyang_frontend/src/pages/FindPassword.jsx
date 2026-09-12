import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function FindPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
  });

  const [result, setResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: 추후 백엔드 비밀번호 찾기 API 연결
    console.log('비밀번호 찾기 요청:', form);

    // 임시 결과
    setResult(true);
  };

  const handleReset = () => {
    setForm({
      email: '',
    });

    setResult(false);
  };

  const inputClass =
    'w-full h-12 px-[14px] box-border border border-slate-200 rounded-lg outline-none font-inherit text-sm text-slate-900 bg-white transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 text-left">
      <Header />

      <main className="min-h-screen flex justify-center pt-[72px] max-[768px]:pt-16 box-border">
        <section className="w-full max-w-[480px] box-border px-6 pt-[60px] max-[768px]:pt-10 pb-20 max-[480px]:px-4 max-[480px]:pt-[30px] max-[480px]:pb-[60px]">

          {/* 타이틀 */}
          <div className="text-center mb-7">
            <h1 className="m-0 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              비밀번호 찾기
            </h1>
            <p className="mt-2.5 mb-0 text-sm leading-relaxed text-slate-500">
              가입한 이메일을 입력하면<br />
              비밀번호를 재설정할 수 있습니다.
            </p>
          </div>

          {/* 카드 */}
          <div className="w-full box-border px-7 pt-8 pb-7 max-[480px]:px-[18px] max-[480px]:pt-6 max-[480px]:pb-5 bg-white border border-slate-200 rounded-xl shadow-sm">

            {!result ? (
              <>
                <form onSubmit={handleSubmit}>

                  {/* 이메일 */}
                  <div className="mb-[18px] text-left">
                    <label htmlFor="password-email" className="block mb-2 text-xs font-medium text-slate-700">
                      가입 이메일
                    </label>

                    <input
                      id="password-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="가입할 때 사용한 이메일을 입력해주세요"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* 찾기 버튼 */}
                  <button
                    type="submit"
                    className="w-full h-12 mt-2 border-none rounded-lg bg-blue-600 text-white font-inherit text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-700"
                  >
                    비밀번호 찾기
                  </button>

                </form>

                {/* 안내 */}
                <div className="flex items-start gap-2.5 mt-5 p-[14px] text-left bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="shrink-0 w-[18px] h-[18px] mt-px flex items-center justify-center border border-slate-300 rounded-full text-[10px] font-extrabold text-slate-400">
                    i
                  </div>

                  <p className="m-0 text-xs leading-relaxed text-slate-400">
                    가입한 이메일로 비밀번호 재설정 안내를<br />
                    보내드립니다.
                  </p>
                </div>
              </>
            ) : (
              /* 결과 */
              <div className="text-center">

                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[22px] font-bold">
                  ✓
                </div>

                <h2 className="m-0 text-xl font-semibold tracking-[-0.03em] text-slate-900">
                  메일을 확인해주세요.
                </h2>

                <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">
                  입력하신 이메일로 비밀번호 재설정<br />
                  안내 메일을 보내드렸습니다.
                </p>

                <div className="px-5 py-4 text-center border border-slate-200 rounded-lg bg-slate-50">
                  <span className="block mb-1 text-xs text-slate-400">전송된 이메일</span>
                  <strong className="text-base font-semibold text-slate-900">{form.email}</strong>
                </div>

                <div className="mt-3.5">
                  <p className="m-0 text-xs leading-relaxed text-slate-400">
                    이메일이 도착하지 않았다면<br />
                    스팸 메일함을 확인해주세요.
                  </p>
                </div>

                <div className="flex max-[480px]:flex-col gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex-1 h-12 border-none rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    로그인하기
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 h-12 rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  >
                    다시 찾기
                  </button>

                </div>

              </div>
            )}

            {/* 하단 메뉴 */}
            <div className="flex items-center justify-center mt-6">

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                로그인
              </button>

              <span className="w-px h-[10px] bg-slate-200" />

              <button
                type="button"
                onClick={() => navigate('/find-id')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                아이디 찾기
              </button>

              <span className="w-px h-[10px] bg-slate-200" />

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-3 max-[480px]:px-2 border-none bg-transparent font-inherit text-xs max-[480px]:text-[11px] font-medium text-slate-500 cursor-pointer transition-colors hover:text-blue-600"
              >
                회원가입
              </button>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default FindPassword;
