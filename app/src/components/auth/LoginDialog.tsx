import { useState, type FormEvent } from "react";
import { Mountain } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, FAKE_USER } from "@/contexts/AuthContext";

/**
 * Fake login dialog for the prototype: no credentials are checked, any
 * (or no) input logs the user in as the demo mountaineer {@link FAKE_USER}.
 */
export function LoginDialog() {
  const { isLoginDialogOpen, closeLoginDialog, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog
      open={isLoginDialogOpen}
      onOpenChange={(open) => !open && closeLoginDialog()}
    >
      <DialogContent className="max-w-md p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sac-red/10 text-sac-red">
            <Mountain className="h-6 w-6" />
          </span>
          <DialogTitle>Anmelden</DialogTitle>
          <DialogDescription>
            Demo-Login für den Tourenportal-Prototyp – beliebige Angaben genügen.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <Input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" className="mt-1">
            Einloggen
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Du wirst als{" "}
            <span className="font-bold text-foreground">{FAKE_USER.name}</span>{" "}
            angemeldet.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
