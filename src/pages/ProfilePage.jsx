import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogOut,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, userProfile, isAdmin, updateProfile, logout } = useAuth();

  const [name, setName] = useState(userProfile?.name || user?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          My Account & Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View your assigned account permissions and update your profile details.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-black text-xl flex items-center justify-center border border-primary/20 shrink-0">
            {(userProfile?.name || user?.displayName || "US").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5">
              {userProfile?.name || user?.displayName || "User"}
              {isAdmin && <ShieldCheck className="w-4 h-4 text-primary" />}
            </h2>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground">Assigned Role</span>
            <div className="font-bold text-foreground capitalize text-sm">
              {isAdmin ? "Administrator" : userProfile?.role || "Student"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground">Approval Status</span>
            <div
              className={`font-bold text-sm flex items-center gap-1 ${
                userProfile?.isApproved
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {userProfile?.isApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Approved
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" /> Pending
                </>
              )}
            </div>
          </div>
        </div>

        {/* Update Name Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label htmlFor="profName">Display Name</Label>
            <Input
              id="profName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profEmail">Email Address (Managed by Firebase Auth)</Label>
            <Input id="profEmail" value={user?.email || ""} disabled className="bg-muted text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
