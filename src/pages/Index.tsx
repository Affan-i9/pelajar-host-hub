import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Server, Shield, Zap, HeadphonesIcon, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in opacity-0 [animation-delay:0.2s] [animation-fill-mode:forwards]">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Hosting Murah Meriah</span>
              <br />
              <span className="text-foreground">untuk Pelajar</span>
            </h1>
          </div>
          <div className="animate-fade-in opacity-0 [animation-delay:0.4s] [animation-fill-mode:forwards]">
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Mulai dari <span className="text-primary font-bold">Rp 5.000/bulan</span> dengan SSL gratis, 24/7 support, dan backup otomatis
            </p>
          </div>
          <div className="flex gap-4 justify-center animate-fade-in opacity-0 [animation-delay:0.6s] [animation-fill-mode:forwards]">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Daftar Sekarang
            </Button>
            <Button
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Lihat Paket
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">
            Keunggulan Smart-Hosting
          </h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-fade-in">
            {[
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Performa Tinggi",
                description: "Server cepat dengan uptime 99.9% untuk website kamu"
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Keamanan Terjamin",
                description: "SSL gratis dan backup otomatis setiap hari"
              },
              {
                icon: <HeadphonesIcon className="w-12 h-12" />,
                title: "24/7 Support",
                description: "Tim support siap membantu kapan saja kamu butuh"
              },
              {
                icon: <Server className="w-12 h-12" />,
                title: "Resource Unlimited",
                description: "Bandwidth dan storage sesuai kebutuhan"
              },
              {
                icon: <Award className="w-12 h-12" />,
                title: "Harga Pelajar",
                description: "Harga khusus untuk pelajar dan mahasiswa"
              },
              {
                icon: <Globe className="w-12 h-12" />,
                title: "Domain Gratis",
                description: "Dapatkan domain gratis untuk setiap paket"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center hover:scale-105 transition-all group"
              >
                <div className="inline-block p-4 rounded-full bg-gradient-to-br from-primary to-secondary glow-yellow mb-4 group-hover:animate-pulse-glow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text animate-fade-in">
            Pilih Paket Hosting
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg animate-fade-in">
            Semua paket sudah termasuk SSL gratis dan 24/7 support
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-fade-in">
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
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <div className="glass-card p-12 max-w-3xl mx-auto glow-green animate-slide-up hover:scale-105 transition-transform">
            <h2 className="text-4xl font-bold mb-4">
              Siap Memulai Website Kamu?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Daftar sekarang dan dapatkan hosting terbaik dengan harga pelajar
            </p>
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-110 glow-yellow text-lg px-12 py-6 transition-transform"
            >
              Daftar Gratis Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Smart-Hosting. Hosting Murah untuk Pelajar.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
