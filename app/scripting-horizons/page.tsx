import { permanentRedirect } from "next/navigation";

// The Scripting Horizons page moved to /scrhoz (2026-10-14 rebrand). Keep the old URL working.
export default function ScriptingHorizonsPage() {
  permanentRedirect("/scrhoz");
}
