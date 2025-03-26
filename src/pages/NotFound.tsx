
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-quran p-6">
      <div className="text-center bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md w-full animate-scale-in">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-bold mb-6 text-foreground">صفحة غير موجودة</h2>
        <p className="text-lg text-muted-foreground mb-8">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          <br />
          <span className="block mt-2 text-base">
            (The page you are looking for doesn't exist or has been moved.)
          </span>
        </p>
        
        <Button asChild className="animate-slide-up animate-delay-200">
          <Link to="/" className="font-medium">
            العودة إلى الصفحة الرئيسية
            <span className="block text-xs mt-1">Return to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
