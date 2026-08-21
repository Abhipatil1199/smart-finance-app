import { ChartLineIcon, ShieldCheckIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";

import { BrandMark } from "@/components/common/brand-mark";

const HIGHLIGHTS = [
  {
    icon: ChartLineIcon,
    title: "Every account, one view",
    body: "Balances, spending and subscriptions reconciled the moment they land.",
  },
  {
    icon: SparklesIcon,
    title: "Forecasts that adapt",
    body: "See where the month lands before it gets there, not after.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Encrypted end to end",
    body: "Read-only bank connections. Your credentials never touch our servers.",
  },
];

/**
 * Brand-side panel for the auth screens. Hidden below `lg` — on a phone the
 * form should own the viewport rather than sit below a hero the user has to
 * scroll past.
 */
export function AuthShowcasePanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-strong via-brand to-brand-strong lg:flex lg:flex-col">
      {/* Soft light sources; kept subtle so the panel reads as depth, not decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-[26rem] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-40 size-[30rem] rounded-full bg-success/25 blur-3xl"
      />

      <div className="relative flex flex-1 flex-col justify-between p-safe">
        <div className="p-10 xl:p-14">
          <BrandMark onBrand />
        </div>

        <div className="px-10 pb-4 xl:px-14">
          <h2 className="font-heading max-w-md text-[2.125rem] leading-[1.15] font-semibold tracking-tight text-balance text-white xl:text-[2.5rem]">
            Money decisions, made with the whole picture.
          </h2>
          <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-pretty text-white/70">
            Smart Finance brings your accounts, goals and forecasts together so
            you always know what the next month looks like.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-0.5 max-w-xs text-sm leading-relaxed text-pretty text-white/60">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 xl:p-14">
          <figure className="max-w-md rounded-2xl bg-white/8 p-5 ring-1 ring-white/12 backdrop-blur-sm">
            <blockquote className="text-sm leading-relaxed text-pretty text-white/85">
              “We closed our spreadsheet the week we switched. It pays for
              itself in the time we stopped spending on reconciliation.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5 text-xs text-white/60">
              <span className="grid size-8 place-items-center rounded-full bg-success/20 text-success-foreground ring-1 ring-white/15">
                <TrendingUpIcon aria-hidden="true" className="size-4 text-white" />
              </span>
              <span>
                <span className="block font-medium text-white/85">Maya Okonjo</span>
                Finance lead, Northwind Studio
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </aside>
  );
}
