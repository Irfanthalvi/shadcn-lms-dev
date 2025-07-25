import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/validation/profile/profileSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const ProfileModal = ({ setIsModalOpen, setProfile }) => {
  const [preview, setPreview] = useState("/images/profile.png");
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      profilePicture: undefined,
    },
  });

  // Automatically open modal when mounted
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 150);
  };

  const onSubmit = (data) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const imageUrl = data.profilePicture
      ? URL.createObjectURL(data.profilePicture)
      : preview;

    setProfile({
      name: fullName || "IRFAN ALI",
      image: imageUrl,
    });

    toast.success("✅ Profile updated successfully!");
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[99] bg-black/40 flex items-center justify-center px-4 sm:px-6"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-background border border-border rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto px-6 py-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-xl font-semibold">Update Profile</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Change your personal details and password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} placeholder="John" />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} placeholder="Doe" />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full space-y-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("profilePicture", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {errors.profilePicture && (
                <p className="text-sm text-red-500">{errors.profilePicture.message}</p>
              )}
            </div>
            <Avatar className="h-14 w-14 mt-6">
              <AvatarImage src={preview} />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                placeholder="********"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="********"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
