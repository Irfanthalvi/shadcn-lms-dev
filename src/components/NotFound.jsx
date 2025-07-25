import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Frown } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Frown size={64} className="text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-base">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} className="text-base px-6 py-2 cursor-pointer">
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
