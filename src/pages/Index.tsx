import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Server, Shield, Zap, Headphones, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <ParticlesBackground />
      </div>
      <div className="relative z-10">
      <Navbar />
      
      {/* Hero Section - Fixed for Mobile */}
      <section className="relative pt-24 sm:pt-32 pb-20 px-4 z-20">
        <div className="container mx-auto text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-tight">
              <span className="gradient-text drop-shadow-glow block">Smart-Hosting</span>
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] block mt-2">
                Hosting Murah untuk Pelajar
              </span>
            </h1>
          </div>
          <div>
            <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto px-4">
              Mulai dari <span className="text-primary font-bold">Rp 10.000/bulan</span> dengan SSL gratis, 24/7 support, dan backup otomatis
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Daftar Sekarang
            </Button>
            <Button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:scale-105 transition-transform w-full sm:w-auto"
            >
              Lihat Paket
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fade-in px-4">
              <span className="gradient-text">Keunggulan Smart-Hosting</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 animate-fade-in px-4">
              Layanan hosting terbaik dengan fitur lengkap untuk kesuksesan website kamu
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 stagger-fade-in">
            {[
              {
                icon: <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "Performa Tinggi",
                description: "Server cepat dengan uptime 99.9% untuk website kamu"
              },
              {
                icon: <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "Keamanan Terjamin",
                description: "SSL gratis dan backup otomatis setiap hari"
              },
              {
                icon: <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "24/7 Support",
                description: "Tim support siap membantu kapan saja kamu butuh"
              },
              {
                icon: <Server className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "Resource Unlimited",
                description: "Bandwidth dan storage sesuai kebutuhan"
              },
              {
                icon: <Award className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "Harga Pelajar",
                description: "Harga khusus untuk pelajar dan mahasiswa"
              },
              {
                icon: <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />,
                title: "Domain Gratis",
                description: "Dapatkan domain gratis untuk setiap paket"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 sm:p-8 text-center hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary glow-yellow mb-4 sm:mb-6 group-hover:animate-pulse-glow group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 gradient-text">{feature.title}</h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 gradient-text animate-fade-in px-4">
            Pilih Paket Hosting
          </h2>
          <p className="text-center text-foreground/70 mb-12 text-base sm:text-lg animate-fade-in px-4">
            Semua paket sudah termasuk SSL gratis dan 24/7 support
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 stagger-fade-in">
            {packages.map((pkg, index) => (
              <PackageCard
                key={index}
                {...pkg}
                popular={pkg.name === "Pelajar Advance"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="glass-card p-8 sm:p-12 max-w-3xl mx-auto glow-green animate-slide-up hover:scale-105 transition-transform">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Siap Memulai Website Kamu?
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 mb-8">
              Daftar sekarang dan dapatkan hosting terbaik dengan harga pelajar
            </p>
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 glow-yellow text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 transition-transform w-full sm:w-auto"
            >
              Daftar Gratis Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 z-10 relative">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm sm:text-base">&copy; 2025 Smart-Hosting. Hosting Murah untuk Pelajar.</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
