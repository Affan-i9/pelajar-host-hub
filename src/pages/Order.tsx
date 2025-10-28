import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle2, Phone } from "lucide-react";

const Order = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [domainName, setDomainName] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const packageName = searchParams.get("package") || "";
  const packagePrice = parseInt(searchParams.get("price") || "0");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
    };

    checkAuth();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName || !paymentProof) {
      toast({
        title: "Error",
        description: "Mohon isi semua field dan upload bukti pembayaran",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload payment proof
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof);

      if (uploadError) throw uploadError;

      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          package_name: packageName,
          package_price: packagePrice,
          domain_name: domainName,
          payment_proof: fileName,
          status: 'pending'
        });

      if (orderError) throw orderError;

      toast({
        title: "Order Berhasil!",
        description: "Pesanan Anda sedang diproses. Silakan tunggu konfirmasi admin.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Detail Pesanan</CardTitle>
              <CardDescription>Lengkapi form di bawah untuk melanjutkan order</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Paket Dipilih</Label>
                  <Input value={packageName} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Harga</Label>
                  <Input value={`Rp ${packagePrice.toLocaleString('id-ID')}`} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Nama Domain</Label>
                  <Input
                    id="domain"
                    placeholder="contoh: websitesaya.com"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Bukti Pembayaran</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="payment"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {paymentProof && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload screenshot/foto bukti transfer
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="glass-card animate-fade-in [animation-delay:0.2s]">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">Instruksi Pembayaran</CardTitle>
              <CardDescription>Ikuti langkah berikut untuk menyelesaikan pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Transfer ke Rekening</h4>
                    <p className="text-sm text-muted-foreground">
                      Transfer sesuai nominal paket yang dipilih
                    </p>
                  </div>
                </div>

                <div className="glass-card p-4 bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-primary">Nomor Pembayaran</h4>
                  </div>
                  <p className="text-2xl font-bold tracking-wider mb-1">082122011635</p>
                  <p className="text-sm text-muted-foreground">a.n. Smart-Hosting</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Screenshot Bukti Transfer</h4>
                    <p className="text-sm text-muted-foreground">
                      Ambil screenshot atau foto bukti pembayaran
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload & Submit</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload bukti transfer dan submit form order
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Tunggu Verifikasi</h4>
                    <p className="text-sm text-muted-foreground">
                      Admin akan memverifikasi pembayaran Anda dalam 1x24 jam
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Pastikan nominal transfer sesuai dengan harga paket. Order akan diproses setelah pembayaran terverifikasi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;
