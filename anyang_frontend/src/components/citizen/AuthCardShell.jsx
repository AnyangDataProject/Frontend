export default function AuthCardShell({ title, description, maxWidth = 440, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 text-left">
      <main className="min-h-screen flex justify-center items-start pt-[72px] max-[768px]:pt-16 box-border">
        <section
          className="w-full box-border px-6 pt-[60px] max-[768px]:pt-10 pb-20 max-[480px]:px-4 max-[480px]:pt-[30px] max-[480px]:pb-[60px]"
          style={{ maxWidth }}
        >
          <div className="text-center mb-7">
            <h1 className="m-0 mb-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">{title}</h1>
            {description && (
              <p className="m-0 text-sm leading-relaxed text-slate-500">{description}</p>
            )}
          </div>

          <div className="w-full box-border px-7 pt-8 pb-7 max-[480px]:px-[18px] max-[480px]:pt-6 max-[480px]:pb-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
