function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M23.04 12.2613C23.04 11.4459 22.9668 10.6618 22.8309 9.90906H12V14.3575H18.1891C17.9225 15.795 17.1123 17.0129 15.8943 17.8284V20.7138H19.6109C21.7855 18.7118 23.04 15.7636 23.04 12.2613Z" fill="#4285F4" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 23.4998C15.105 23.4998 17.7081 22.47 19.6109 20.7137L15.8943 17.8282C14.8645 18.5182 13.5472 18.9259 12 18.9259C9.00474 18.9259 6.46951 16.903 5.56519 14.1848H1.72314V17.1644C3.61542 20.9228 7.50451 23.4998 12 23.4998Z" fill="#34A853" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.56523 14.1851C5.33523 13.4951 5.20455 12.7581 5.20455 12.0001C5.20455 11.2422 5.33523 10.5051 5.56523 9.81512V6.83557H1.72318C0.944318 8.38807 0.5 10.1444 0.5 12.0001C0.5 13.8558 0.944318 15.6122 1.72318 17.1647L5.56523 14.1851Z" fill="#FBBC05" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12 5.07386C13.6884 5.07386 15.2043 5.65409 16.3961 6.79364L19.6945 3.49523C17.7029 1.63955 15.0997 0.5 12 0.5C7.50451 0.5 3.61542 3.07705 1.72314 6.83545L5.56519 9.815C6.46951 7.09682 9.00474 5.07386 12 5.07386Z" fill="#EA4335" />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8491 8.56267L4.91687 0H0V16H5.15088V7.436L11.0831 16H16V0H10.8491V8.56267Z" fill="white" />
    </svg>
  );
}

const PROVIDERS = [
  {
    key: 'google',
    name: 'Google',
    icon: <GoogleIcon />,
    className:
      'relative w-full h-12 flex items-center justify-center border border-slate-200 rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-transform bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0',
  },
  {
    key: 'naver',
    name: '네이버',
    icon: <NaverIcon />,
    className:
      'relative w-full h-12 flex items-center justify-center border border-[#03C75A] rounded-lg font-inherit text-sm font-semibold cursor-pointer transition-colors bg-[#03C75A] text-white hover:bg-[#02b351] hover:border-[#02b351]',
  },
];

export default function SocialLoginButtons({ actionLabel }) {
  const handleSelect = (provider) => {
    // TODO: 추후 Spring Boot OAuth2 로그인/회원가입 API 연결
    console.log(`${provider} ${actionLabel}`);

    /*
      추후 예시

      window.location.href =
        `http://localhost:8080/oauth2/authorization/${provider}`;
    */
  };

  return (
    <div className="mt-6">

      <div className="flex items-center w-full mb-4">
        <span className="flex-1 h-px bg-slate-200" />
        <span className="mx-3 text-xs text-slate-400 whitespace-nowrap">또는</span>
        <span className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.key}
            type="button"
            onClick={() => handleSelect(provider.key)}
            className={provider.className}
          >
            <span className="absolute left-4 w-[22px] h-[22px] flex items-center justify-center">
              {provider.icon}
            </span>

            <span>{provider.name}로 {actionLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
