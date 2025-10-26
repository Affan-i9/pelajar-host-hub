import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PackageCardProps {
  name: string;
  price: number;
  storage: string;
  bandwidth: string;
  domain: string;
  features: string[];
  popular?: boolean;
}

export const PackageCard = ({ name, price, storage, bandwidth, domain, features, popular }: PackageCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`glass-card relative overflow-hidden transition-all hover:scale-105 hover:shadow-2xl ${
      popular ? 'border-primary glow-yellow' : ''
    }`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 text-sm font-bold">
          POPULER
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          <div className="mt-2">
            <span className="text-4xl font-bold gradient-text">Rp {price.toLocaleString('id-ID')}</span>
            <span className="text-muted-foreground">/bulan</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-semibold text-foreground">{storage}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Bandwidth</span>
            <span className="font-semibold text-foreground">{bandwidth}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Domain</span>
            <span className="font-semibold text-foreground">{domain}</span>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-secondary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`/order?package=${encodeURIComponent(name)}&price=${price}`)}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold"
        >
          Pesan Sekarang
        </Button>
      </CardFooter>
    </Card>
  );
};
