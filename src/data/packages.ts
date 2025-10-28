export interface HostingPackage {
  name: string;
  price: number;
  storage: string;
  bandwidth: string;
  domain: string;
  features: string[];
}

export const packages: HostingPackage[] = [
  // PAKET PELAJAR (Khusus Pendidikan)
  {
    name: "Pelajar Pemula",
    price: 10000,
    storage: "10 MB",
    bandwidth: "1 Mbps",
    domain: "Subdomain",
    features: ["24/7 Support", "SSL Gratis", "Backup Mingguan"]
  },
  {
    name: "Pelajar Basic",
    price: 15000,
    storage: "50 MB",
    bandwidth: "3 Mbps",
    domain: "Subdomain",
    features: ["24/7 Support", "SSL Gratis", "Backup Harian"]
  },
  {
    name: "Pelajar Advance",
    price: 25000,
    storage: "100 MB",
    bandwidth: "7 Mbps",
    domain: "Subdomain",
    features: ["24/7 Support", "SSL Gratis", "Backup Harian", "Priority Support"]
  },
  {
    name: "Pelajar Pro",
    price: 50000,
    storage: "250 MB",
    bandwidth: "15 Mbps",
    domain: "Subdomain",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Priority Support"]
  },
  {
    name: "Pelajar Expert",
    price: 120000,
    storage: "1 GB",
    bandwidth: "Unlimited",
    domain: "Subdomain",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "CDN"]
  },
  {
    name: "Pelajar Enterprise",
    price: 150000,
    storage: "5 GB",
    bandwidth: "Unlimited",
    domain: "Free Custom Domain",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "CDN", "Full Control"]
  },
  // PAKET PERSONAL
  {
    name: "Personal Standard",
    price: 150000,
    storage: "3 GB",
    bandwidth: "50 Mbps",
    domain: "Free Custom Domain",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "Priority Deployment"]
  },
  {
    name: "Personal Pro",
    price: 300000,
    storage: "10 GB",
    bandwidth: "100 Mbps",
    domain: "Free Custom Domain",
    features: ["24/7 Support", "SSL Gratis", "Backup Real-time", "Dedicated Support", "CDN", "Priority Deployment", "Full Control"]
  }
];
