import sacLogo from "@/assets/sac-logo.svg";

export function Header({ section }: { section: string }) {
  return (
    <header className="border-b-2 border-sac-red bg-white">
      <div className="container flex items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-sac-h3 leading-none">Tourenprogramm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            SAC Sektion {section}
          </p>
        </div>
        <img
          src={sacLogo}
          alt="Schweizer Alpen-Club SAC"
          className="h-[3.6rem] w-auto sm:h-[4.2rem]"
        />
      </div>
    </header>
  );
}
