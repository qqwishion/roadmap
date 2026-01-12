import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { UniversitiesPage } from "./components/UniversitiesPage";
import { CollegesPage } from "./components/CollegesPage";
import { CompaniesPage } from "./components/CompaniesPage";
import { VideosPage } from "./components/VideosPage";
import { RoadmapPage } from "./components/RoadmapPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    document.documentElement.lang = 'ru';
    console.log('dev: qqwishion / mail: qqwishion@gmail.com');
    const metaCharset = document.querySelector('meta[charset]');
    if (!metaCharset) {
      const meta = document.createElement('meta');
      meta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(meta, document.head.firstChild);
    }
    
    const metaHttpEquiv = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!metaHttpEquiv) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.setAttribute('content', 'text/html; charset=UTF-8');
      document.head.appendChild(meta);
    }

    // Установка title
    if (document.title === '') {
      document.title = 'Космический Roadmap | Роскосмос';
    }

    const handleToast = (event: any) => {
      const { title, description, type } = event.detail;
      if (type === 'success') {
        toast.success(title, { description });
      } else if (type === 'error') {
        toast.error(title, { description });
      } else {
        toast(title, { description });
      }
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "universities":
        return <UniversitiesPage />;
      case "colleges":
        return <CollegesPage />;
      case "companies":
        return <CompaniesPage />;
      case "videos":
        return <VideosPage />;
      case "roadmap":
        return <RoadmapPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        darkMode={true}
      />
      {renderPage()}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#031429',
            border: '2px solid #598EBC',
            color: '#FFFFFF',
            boxShadow: '0 0 30px rgba(89,142,188,0.4)'
          },
          className: 'cosmic-toast',
        }}
      />
    </div>
  );
}
