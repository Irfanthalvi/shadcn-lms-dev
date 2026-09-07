import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Settings,
  Moon,
  Sun,
  Laptop,
  School,
  Bell,
  Shield,
  User,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, toggleTheme } = useLms();

  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: "Academic Excellence High School & College",
    academicSession: "2025-2026",
    gradingStandard: "Standard Letter Scale (A+, A, B, C, D, F)",
    emailNotifications: true,
    examPublishAlerts: true,
    smsNotifications: false,
    autoArchiving: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("✅ System preferences saved successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
          LMS Dashboard Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure appearance theme, academic session years, grading scales, and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme Section */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Display Theme & Appearance
              </h2>
              <p className="text-xs text-muted-foreground">
                Toggle between light and dark interface modes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => theme !== "light" && toggleTheme()}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                theme === "light"
                  ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card text-foreground hover:bg-muted/40"
              }`}
            >
              <Sun className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-sm font-bold">Light Mode</div>
                <div className="text-xs text-muted-foreground">
                  Crisp, high-contrast light theme
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => theme !== "dark" && toggleTheme()}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                theme === "dark"
                  ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card text-foreground hover:bg-muted/40"
              }`}
            >
              <Moon className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-sm font-bold">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  Sleek, low-light dark theme
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Academic Session & Grading */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                School Information & Academic Session
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure academic calendar and grading criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sName">School / Institute Name</Label>
              <Input
                id="sName"
                value={schoolSettings.schoolName}
                onChange={(e) =>
                  setSchoolSettings((p) => ({
                    ...p,
                    schoolName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sSession">Active Academic Session</Label>
              <Input
                id="sSession"
                value={schoolSettings.academicSession}
                onChange={(e) =>
                  setSchoolSettings((p) => ({
                    ...p,
                    academicSession: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sGrading">Grading Standard</Label>
              <Input
                id="sGrading"
                value={schoolSettings.gradingStandard}
                onChange={(e) =>
                  setSchoolSettings((p) => ({
                    ...p,
                    gradingStandard: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Notifications & Automation
              </h2>
              <p className="text-xs text-muted-foreground">
                Automated student email alerts and exam notifications.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Exam Publication Notifications
                </div>
                <div className="text-xs text-muted-foreground">
                  Send immediate notifications to students when a paper is published.
                </div>
              </div>
              <Switch
                checked={schoolSettings.examPublishAlerts}
                onCheckedChange={(checked) =>
                  setSchoolSettings((p) => ({
                    ...p,
                    examPublishAlerts: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Email Circular Digest
                </div>
                <div className="text-xs text-muted-foreground">
                  Send daily summary of new announcements and homework.
                </div>
              </div>
              <Switch
                checked={schoolSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSchoolSettings((p) => ({
                    ...p,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" size="default" className="px-8 shadow-md">
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
