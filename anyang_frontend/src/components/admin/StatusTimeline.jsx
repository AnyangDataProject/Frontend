import { Check } from 'lucide-react';

/**
 * steps: [{ key, label, at, done }]
 * 완료된 단계는 채워진 파란 원 + 체크 아이콘, 미완료 단계는 빈 회색 원으로 표시.
 * 데스크톱/태블릿 기준 가로 타임라인 (반응형 요구사항이 태블릿까지라 가로 유지, 좁아지면 스크롤).
 */
export default function StatusTimeline({ steps, currentKey }) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <div className="flex min-w-[560px] items-start overflow-x-auto">
      {steps.map((step, i) => {
        const isCurrent = i === currentIndex;
        const isDone = step.done;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className={`flex items-start ${isLast ? '' : 'flex-1'}`}>
            <div className="flex w-24 shrink-0 flex-col items-center text-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  isDone
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'border-2 border-blue-600 bg-white text-blue-600'
                      : 'border-2 border-slate-200 bg-white text-slate-300'
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-semibold">{i + 1}</span>}
              </div>
              <p className={`mt-2 text-sm font-medium ${isDone || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{step.at ?? '대기 중'}</p>
            </div>

            {!isLast && <div className={`mt-[18px] h-0.5 flex-1 ${isDone ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}
