import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Truck, UserX, Clock, CircleCheck, Route as RouteIcon, Container, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veículos · Status" },
      { name: "description", content: "Painel de status da frota em tempo real." },
      { property: "og:title", content: "Veículos · Status" },
      { property: "og:description", content: "Painel de status da frota em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const data = {
  total: 844,
  semMotorista: 111,
  fila: { total: 17, semMotorista: 1, manutencao: 3 },
  programado: { total: 99, semMotorista: 0, manutencao: 9 },
  viagem: { total: 423, semMotorista: 1, manutencao: 47 },
  vazio: { total: 421, deslocando: 103 },
  manutencao: 109,
  atualizado: "24/11/2026, 10:55:05",
};

type Tone = "red" | "amber" | "blue" | "green" | "pink" | "orange" | "violet";
const tone: Record<Tone, string> = {
  red: "var(--st-red)", amber: "var(--st-amber)", blue: "var(--st-blue)", green: "var(--st-green)",
  pink: "var(--st-pink)", orange: "var(--st-orange)", violet: "var(--st-violet)",
};

function Panel({ title, icon, color, children, className = "" }: { title: string; icon: ReactNode; color: Tone; children: ReactNode; className?: string }) {
  return (
    <section className={`panel flex flex-col rounded-[1.2vw] p-[1.6vw] ${className}`}>
      <h2 className="flex items-center gap-[0.6vw] font-mono text-[1.35vw] font-bold uppercase tracking-wider" style={{ color: tone[color] }}>
        {icon}<span className="text-foreground">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Big({ value, color, size = "8vw" }: { value: number; color: Tone; size?: string }) {
  return (
    <div className="glow font-mono font-bold leading-none" style={{ color: tone[color], fontSize: size, ["--g" as string]: tone[color] }}>
      {value}
    </div>
  );
}

function SubStat({ label, icon, value, total, color }: { label: string; icon: ReactNode; value: number; total: number; color: Tone }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const c = tone[color];
  return (
    <div
      className="flex flex-col gap-[0.6vw] rounded-[0.8vw] border p-[1vw]"
      style={{ background: `color-mix(in oklab, ${c} 10%, transparent)`, borderColor: `color-mix(in oklab, ${c} 35%, transparent)` }}
    >
      <div className="flex items-center gap-[0.5vw] text-[1.1vw] font-medium" style={{ color: c }}>
        <span className="flex h-[2vw] w-[2vw] items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${c} 22%, transparent)` }}>{icon}</span>
        <span className="text-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="glow font-mono text-[3.4vw] font-bold leading-none" style={{ color: c, ["--g" as string]: c }}>{value}</span>
        <span className="font-mono text-[1.4vw] whitespace-nowrap text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-[0.45vw] overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${value ? Math.max(pct, 3) : 0}%`, background: c }} />
      </div>
    </div>
  );
}

function StatusWithBreakdown({ title, icon, color, d }: { title: string; icon: ReactNode; color: Tone; d: { total: number; semMotorista: number; manutencao: number } }) {
  const si = "h-[1.1vw] w-[1.1vw]";
  return (
    <Panel title={title} icon={icon} color={color}>
      <div className="my-[1.2vw]"><Big value={d.total} color={color} /></div>
      <div className="mt-auto grid grid-cols-2 gap-[0.9vw]">
        <SubStat label="Sem motorista" icon={<UserX className={si} />} value={d.semMotorista} total={d.total} color="red" />
        <SubStat label="Em manutenção" icon={<Wrench className={si} />} value={d.manutencao} total={d.total} color="orange" />
      </div>
    </Panel>
  );
}

function Donut({ value, total }: { value: number; total: number }) {
  const r = 42, c = 2 * Math.PI * r, p = total ? value / total : 0;
  return (
    <svg viewBox="0 0 100 100" className="h-[13vw] w-[13vw] -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--st-violet)" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} />
    </svg>
  );
}

function TotalPanel({ title, Icon, color, value, total }: { title: string; Icon: typeof UserX; color: Tone; value: number; total: number }) {
  const c = tone[color];
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <section
      className="relative flex flex-col overflow-hidden rounded-[1.2vw] border p-[1.6vw]"
      style={{ background: `radial-gradient(circle at 85% 20%, color-mix(in oklab, ${c} 22%, transparent), var(--card) 65%)`, borderColor: `color-mix(in oklab, ${c} 40%, transparent)` }}
    >
      <Icon className="pointer-events-none absolute -bottom-[1.5vw] -right-[1.5vw] h-[13vw] w-[13vw] opacity-[0.08]" style={{ color: c }} />
      <h2 className="flex items-center gap-[0.6vw] font-mono text-[1.35vw] font-bold uppercase tracking-wider">
        <span className="flex h-[2.6vw] w-[2.6vw] items-center justify-center rounded-full" style={{ background: `color-mix(in oklab, ${c} 22%, transparent)`, color: c }}>
          <Icon className="h-[1.5vw] w-[1.5vw]" />
        </span>
        {title}
      </h2>
      <div className="flex flex-1 items-center"><Big value={value} color={color} size="9vw" /></div>
      <div className="relative">
        <div className="mb-[0.5vw] flex items-baseline justify-between font-mono">
          <span className="text-[1.1vw] uppercase tracking-wider text-muted-foreground">da frota</span>
          <span className="text-[2vw] font-bold" style={{ color: c }}>{pct}%</span>
        </div>
        <div className="h-[0.6vw] overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c, boxShadow: `0 0 1vw ${c}` }} />
        </div>
      </div>
    </section>
  );
}

function useClock() {
  const [t, setT] = useState<string>("--:--:--");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("pt-BR"));
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return t;
}

function Index() {
  const clock = useClock();
  const ic = "h-[1.6vw] w-[1.6vw]";
  return (
    <main className="grid-bg flex min-h-screen flex-col gap-[1.4vw] p-[2vw]">
      <header className="flex items-end justify-between">
        <div>
          <p className="flex items-center gap-[0.5vw] font-mono text-[0.9vw] uppercase tracking-[0.3em] text-[var(--st-cyan)]">
            <span className="h-[0.5vw] w-[0.5vw] rounded-full bg-[var(--st-cyan)]" /> Todos os dados
          </p>
          <h1 className="text-[3.4vw] font-bold leading-tight">Veículos · Status</h1>
        </div>
        <div className="flex gap-[1vw]">
          <div className="panel rounded-[0.8vw] px-[1.6vw] py-[0.8vw] text-center">
            <p className="font-mono text-[0.9vw] uppercase tracking-wider text-muted-foreground">Total de veículos</p>
            <p className="font-mono text-[2.6vw] font-bold leading-none" style={{ color: tone.green }}>{data.total}</p>
          </div>
          <div className="panel rounded-[0.8vw] px-[1.6vw] py-[0.8vw] text-center">
            <p className="font-mono text-[0.9vw] uppercase tracking-wider text-muted-foreground">Horário local</p>
            <p className="font-mono text-[2.6vw] font-bold leading-none text-[var(--st-cyan)]">{clock}</p>
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-3 gap-[1.4vw]">
        <StatusWithBreakdown title="Fila de carregamento" icon={<Clock className={ic} />} color="amber" d={data.fila} />
        <StatusWithBreakdown title="Programado" icon={<CircleCheck className={ic} />} color="blue" d={data.programado} />
        <StatusWithBreakdown title="Em viagem" icon={<RouteIcon className={ic} />} color="green" d={data.viagem} />
      </div>

      <div className="grid flex-1 grid-cols-4 gap-[1.4vw]">
        <Panel title="Vazio" icon={<Container className={ic} />} color="pink" className="col-span-2">
          <div className="flex flex-1 items-center justify-between gap-[2vw]">
            <Big value={data.vazio.total} color="pink" />
            <div className="flex items-center gap-[1.5vw]">
              <div className="relative">
                <Donut value={data.vazio.deslocando} total={data.vazio.total} />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[1.8vw] font-bold">
                  {Math.round((data.vazio.deslocando / data.vazio.total) * 100)}%
                </span>
              </div>
              <div>
                <p className="flex items-center gap-[0.5vw] text-[1.25vw] text-muted-foreground"><Truck className="h-[1.3vw] w-[1.3vw]" />Deslocando vazio</p>
                <p className="font-mono text-[4.5vw] font-bold leading-none" style={{ color: tone.violet }}>{data.vazio.deslocando}</p>
              </div>
            </div>
          </div>
        </Panel>
        <TotalPanel title="Sem motorista" Icon={UserX} color="red" value={data.semMotorista} total={data.total} />
        <TotalPanel title="Em manutenção" Icon={Wrench} color="orange" value={data.manutencao} total={data.total} />
      </div>

      <p className="text-right font-mono text-[0.9vw] text-muted-foreground">Atualizado em {data.atualizado}</p>
    </main>
  );
}
