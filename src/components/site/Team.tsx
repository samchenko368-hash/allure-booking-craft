import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { staffQuery } from "@/lib/cms";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "./Reveal";

export function Team() {
  const { t, tr } = useI18n();
  const { data: staff } = useQuery(staffQuery);
  const visible = (staff ?? []).filter((s) => s.is_active);
  if (visible.length === 0) return null;

  return (
    <section id="team" className="section-shell">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-5xl">{t("team.heading")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("team.subheading")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((member, i) => (
            <Reveal key={member.id} delay={i * 70}>
              <article className="glass-panel h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe">
                <div className="h-64 overflow-hidden bg-secondary/50">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{member.name}</h3>
                  <p className="text-sm tracking-widest uppercase text-primary">
                    {tr(member.role_label)}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{tr(member.bio)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
