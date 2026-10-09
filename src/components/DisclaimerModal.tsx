import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const IS = ['Educational', 'Research-based', 'Awareness-focused', 'Observation-focused', 'Built to sharpen critical thinking', 'Designed to help you understand patterns of behaviour'];
const IS_NOT = ['Mental health treatment', 'Medical advice', 'Legal advice', 'Professional diagnosis', 'Lie detection software', 'Mind-reading technology', 'A platform for manipulating others', 'A replacement for professional help'];
const CONTEXT = ['Context', 'Environment', 'Culture', 'Timing', 'Baseline behaviour', 'Individual differences'];

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept, onDecline }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-2xl max-h-full bg-surface shadow-2xl flex flex-col overflow-hidden border hairline border-t-2 border-t-accent"
      >
        <div className="px-6 sm:px-8 py-6 border-b hairline shrink-0">
          <div className="kicker kicker-accent mb-2">Please read before you begin</div>
          <h2 className="font-display text-[26px] font-semibold text-ink tracking-tight leading-tight">
            <span className="text-ink">Mind</span><span className="text-accent">Trace</span> — Disclaimer &amp; Responsible Use
          </h2>
        </div>

        <div className="px-6 sm:px-8 py-6 overflow-y-auto grow space-y-7">
          <section>
            <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-accent mb-2">
              <Info className="w-4 h-4" /> Welcome
            </h3>
            <p className="text-[14.5px] leading-relaxed text-ink-soft">
              MindTrace is an educational library for understanding human behaviour, relationships,
              influence, persuasion, negotiation and social dynamics. Its goal is to improve awareness,
              observation and critical thinking through structured reading.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="rounded-xl border hairline p-4 bg-paper">
              <h3 className="font-display text-[15px] font-semibold text-ink mb-3">What MindTrace is</h3>
              <ul className="space-y-1.5">
                {IS.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft">
                    <Check className="w-3.5 h-3.5 text-good mt-0.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border hairline p-4 bg-accent-soft/40">
              <h3 className="font-display text-[15px] font-semibold text-ink mb-3">What MindTrace is not</h3>
              <ul className="space-y-1.5">
                {IS_NOT.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft">
                    <X className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="border-l-2 border-accent pl-4">
            <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-accent mb-2">
              <AlertTriangle className="w-4 h-4" /> Important
            </h3>
            <p className="text-[14px] text-ink-soft mb-2">
              No article, framework or cue can determine someone’s intentions with certainty. Crossed arms
              don’t automatically mean defensiveness; looking away doesn’t automatically mean lying.
            </p>
            <p className="font-display italic text-[15px] text-ink">
              MindTrace teaches patterns and probabilities — not certainty.
            </p>
          </section>

          <section>
            <h3 className="font-display text-[15px] font-semibold text-ink mb-2">Always consider</h3>
            <div className="flex flex-wrap gap-2">
              {CONTEXT.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-md border hairline bg-paper text-[12px] text-ink-soft">{c}</span>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-paper border hairline p-5">
            <h3 className="font-display text-[15px] font-semibold text-ink mb-2">Critical thinking policy</h3>
            <p className="text-[13.5px] text-ink-soft leading-relaxed">
              Question assumptions. Verify claims. Consider alternative explanations. Look at evidence before
              reaching conclusions. The strongest skill MindTrace teaches is not observation — it is critical thinking.
            </p>
          </section>
        </div>

        <div className="px-6 sm:px-8 py-5 border-t hairline shrink-0">
          <label className="flex items-start gap-3 cursor-pointer mb-5 group">
            <span className="relative flex items-center justify-center mt-0.5">
              <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              <span className="w-5 h-5 rounded border border-line-strong bg-surface peer-checked:bg-accent peer-checked:border-accent transition-colors" />
              <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </span>
            <span className="text-[13.5px] text-ink-soft select-none group-hover:text-ink">
              I have read and understood this disclaimer and agree to use MindTrace responsibly.
            </span>
          </label>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button onClick={onDecline} className="btn btn-ghost justify-center">Exit</button>
            <button
              onClick={onAccept}
              disabled={!checked}
              className={`btn justify-center ${checked ? 'btn-accent' : 'bg-line text-faint cursor-not-allowed'}`}
            >
              Enter MindTrace
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
