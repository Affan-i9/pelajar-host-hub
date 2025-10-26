export interface HostingPackage {
  name: string;
  price: number;
  storage: string;
  bandwidth: string;
  domain: string;
  features: string[];
}

export const packages: HostingPackage[] = [
  {
    name: "Pelajar Test",
    price: 5000,
    storage: "250MB",
    bandwidth: "3M",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Mingguan"]
  },
  {
    name: "Pelajar Basic",
    price: 15000,
    storage: "1GB",
    bandwidth: "10M",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Harian"]
  },
  {
    name: "Pelajar Advance",
    price: 25000,
    storage: "5GB",
    bandwidth: "20M",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Harian", "Priority Support"]
  },
  {
    name: "Pelajar Pro",
    price: 50000,
    storage: "10GB",
    bandwidth: "30M",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Priority Support"]
  },
  {
    name: "Pelajar Pro+",
    price: 100000,
    storage: "20GB",
    bandwidth: "50M",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "CDN"]
  },
  {
    name: "Pelajar Expert",
    price: 150000,
    storage: "Unlimited",
    bandwidth: "Unlimited",
    domain: "Free",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "CDN", "Full Control"]
  }
];
