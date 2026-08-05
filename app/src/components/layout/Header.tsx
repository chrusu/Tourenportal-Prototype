import sacLogo from "@/assets/sac-logo.svg";
import { UserMenu } from "@/components/auth/UserMenu";
import { useEasterEgg } from "@/contexts/EasterEggContext";

export function Header({ section }: { section: string }) {
  const { registerHeaderClick } = useEasterEgg();

  return (
    <header
      className="border-b-2 border-sac-red bg-white"
      onClick={registerHeaderClick}
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-sac-h3 leading-none">Aktivitätenprogramm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            SAC Sektion {section}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
          <img
            src={sacLogo}
            alt="Schweizer Alpen-Club SAC"
            className="h-[3.6rem] w-auto sm:h-[4.2rem]"
          />
        </div>
      </div>
    </header>
  );
}
