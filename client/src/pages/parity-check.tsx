import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "pending" | "running";
  detail: string;
}

export default function ParityCheckPage() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const [parityReport, setParityReport] = useState<any>(null);

  const updateCheck = (name: string, status: CheckResult["status"], detail: string) => {
    setChecks((prev) => {
      const existing = prev.findIndex((c) => c.name === name);
      const updated = { name, status, detail };
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const runChecks = async () => {
    setRunning(true);
    setChecks([]);

    updateCheck("Parity Report", "running", "Fetching...");
    try {
      const prRes = await fetch("/api/debug/parity-report");
      if (prRes.ok) {
        const pr = await prRes.json();
        setParityReport(pr);
        const du = pr.demoUser;
        const allGood = du.exists && du.hasProfile && du.friendCount >= 5 && du.rsvpCount >= 3 && du.interactionCount >= 3;
        updateCheck(
          "Parity Report",
          allGood ? "pass" : "fail",
          `DemoUser=${du.exists} Profile=${du.hasProfile} Friends=${du.friendCount} RSVPs=${du.rsvpCount} Interactions=${du.interactionCount} | DB=${pr.databaseFingerprint.host}/${pr.databaseFingerprint.dbName} | ENV=${pr.nodeEnv} | Published=${pr.isPublished} | DEMO_BYPASS=${pr.demoModeFlags.DEMO_BYPASS_AUTH}`
        );
      } else {
        updateCheck("Parity Report", "fail", `Returned ${prRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Parity Report", "fail", e.message);
    }

    updateCheck("Auth Status", "running", "Checking...");
    try {
      const authRes = await fetch("/api/auth/user", { credentials: "include" });
      if (authRes.ok) {
        const user = await authRes.json();
        updateCheck("Auth Status", "pass", `Logged in as ${user.firstName} ${user.lastName} (${user.id})`);
      } else {
        updateCheck("Auth Status", "fail", `Auth returned ${authRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Auth Status", "fail", `Auth error: ${e.message}`);
    }

    updateCheck("Runtime Info", "running", "Checking...");
    try {
      const rtRes = await fetch("/api/debug/runtime");
      if (rtRes.ok) {
        const rt = await rtRes.json();
        const c = rt.counts;
        const allGood = c.users >= 10 && c.items >= 40 && c.events >= 20 && c.rsvps >= 10 && c.friendships >= 5;
        updateCheck(
          "Runtime Info",
          allGood ? "pass" : "fail",
          `Users=${c.users} Items=${c.items} Events=${c.events} RSVPs=${c.rsvps} Friends=${c.friendships} Profiles=${c.profiles}`
        );
      } else {
        updateCheck("Runtime Info", "fail", `Runtime returned ${rtRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Runtime Info", "fail", e.message);
    }

    updateCheck("Clubs API", "running", "Checking...");
    try {
      const clubRes = await fetch("/api/recommendations/academic", { credentials: "include" });
      if (clubRes.ok) {
        const data = await clubRes.json();
        const count = data.recommendations?.length || 0;
        const uniqueImages = new Set((data.recommendations || []).map((r: any) => r.imageUrl)).size;
        updateCheck("Clubs API", count >= 5 ? "pass" : "fail", `${count} clubs, ${uniqueImages} unique images`);
      } else {
        updateCheck("Clubs API", "fail", `Returned ${clubRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Clubs API", "fail", e.message);
    }

    updateCheck("Events API", "running", "Checking...");
    try {
      const evtRes = await fetch("/api/events/for-you", { credentials: "include" });
      if (evtRes.ok) {
        const data = await evtRes.json();
        const count = data.length || 0;
        updateCheck("Events API", count >= 10 ? "pass" : "fail", `${count} events returned`);
      } else {
        updateCheck("Events API", "fail", `Returned ${evtRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Events API", "fail", e.message);
    }

    updateCheck("Friends API", "running", "Checking...");
    try {
      const friendRes = await fetch("/api/friends", { credentials: "include" });
      if (friendRes.ok) {
        const data = await friendRes.json();
        const count = data.length || 0;
        const hasNames = (data || []).every((f: any) => f.firstName && f.firstName !== "?");
        updateCheck("Friends API", count >= 3 && hasNames ? "pass" : "fail", `${count} friends, names valid: ${hasNames}`);
      } else {
        updateCheck("Friends API", "fail", `Returned ${friendRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Friends API", "fail", e.message);
    }

    updateCheck("Map Data", "running", "Checking...");
    try {
      const mapRes = await fetch("/api/explore/map-data", { credentials: "include" });
      if (mapRes.ok) {
        const data = await mapRes.json();
        const total = (data.events?.length || 0) + (data.clubs?.length || 0);
        updateCheck("Map Data", total >= 20 ? "pass" : "fail", `${total} total map markers`);
      } else {
        updateCheck("Map Data", "fail", `Returned ${mapRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Map Data", "fail", e.message);
    }

    updateCheck("Profile Data", "running", "Checking...");
    try {
      const profRes = await fetch("/api/taste-profile", { credentials: "include" });
      if (profRes.ok) {
        const data = await profRes.json();
        if (data && data.onboardingComplete) {
          updateCheck("Profile Data", "pass", `Onboarding: ${data.onboardingComplete}, clusters: ${(data.topClusters || []).join(", ")}`);
        } else {
          updateCheck("Profile Data", "fail", data ? "Onboarding not complete" : "No taste profile found");
        }
      } else {
        updateCheck("Profile Data", "fail", `Returned ${profRes.status}`);
      }
    } catch (e: any) {
      updateCheck("Profile Data", "fail", e.message);
    }

    setRunning(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  const passCount = checks.filter((c) => c.status === "pass").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 bg-background min-h-screen">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" data-testid="text-parity-title">Deployment Parity Check</h1>
          <p className="text-sm text-muted-foreground">Verifies Published matches Preview</p>
        </div>
        <Button onClick={runChecks} disabled={running} data-testid="button-run-checks">
          {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {running ? "Running..." : "Run Checks"}
        </Button>
      </div>

      {checks.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" data-testid="badge-pass-count">{passCount} passed</Badge>
          {failCount > 0 && <Badge variant="destructive" data-testid="badge-fail-count">{failCount} failed</Badge>}
        </div>
      )}

      <div className="space-y-2">
        {checks.map((check) => (
          <Card key={check.name}>
            <CardContent className="flex items-start gap-3 py-3 px-4">
              <div className="mt-0.5 shrink-0">
                {check.status === "pass" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {check.status === "fail" && <XCircle className="h-5 w-5 text-red-500" />}
                {(check.status === "running" || check.status === "pending") && (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm" data-testid={`text-check-${check.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  {check.name}
                </p>
                <p className="text-xs text-muted-foreground break-all">{check.detail}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {parityReport && (
        <Card>
          <CardContent className="py-3 px-4">
            <p className="font-medium text-sm mb-2">Raw Parity Report</p>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-96 whitespace-pre-wrap" data-testid="text-parity-raw">
              {JSON.stringify(parityReport, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
