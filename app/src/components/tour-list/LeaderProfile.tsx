import { Phone, Mail, Globe, Instagram, Facebook, Linkedin } from "lucide-react";
import type { Leader, SocialLink } from "@/types/tour";

function Avatar({ leader }: { leader: Leader }) {
  const initials = leader.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (leader.photoUrl) {
    return (
      <img
        src={leader.photoUrl}
        alt={leader.name}
        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-sac-gray"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sac-gray text-lg font-bold text-sac-gray-dark ring-2 ring-sac-gray">
      {initials}
    </div>
  );
}

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "website":
    default:
      return <Globe className="h-4 w-4" />;
  }
}

const PLATFORM_LABEL: Record<SocialLink["platform"], string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

interface LeaderProfileProps {
  leader: Leader;
  highlight?: boolean;
}

export function LeaderProfile({ leader, highlight = false }: LeaderProfileProps) {
  const hasContact = leader.phone || leader.email || leader.social?.length;

  return (
    <div
      className={`flex gap-4 rounded-xl p-4 ${highlight ? "bg-sac-snow" : "bg-sac-gray/30"}`}
    >
      <Avatar leader={leader} />

      <div className="min-w-0 flex-1">
        <div className="font-bold text-foreground">{leader.name}</div>
        {leader.role && (
          <div className="text-xs text-muted-foreground">{leader.role}</div>
        )}

        {hasContact && (
          <div className="mt-2 flex flex-col gap-1">
            {leader.phone && (
              <a
                href={`tel:${leader.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {leader.phone}
              </a>
            )}
            {leader.email && (
              <a
                href={`mailto:${leader.email}`}
                className="inline-flex items-center gap-1.5 text-sm text-sac-red hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {leader.email}
              </a>
            )}
            {leader.social && leader.social.length > 0 && (
              <div className="mt-0.5 flex flex-wrap gap-2">
                {leader.social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={PLATFORM_LABEL[s.platform]}
                    className="inline-flex items-center gap-1 rounded-md border border-input bg-white px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <SocialIcon platform={s.platform} />
                    {PLATFORM_LABEL[s.platform]}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
