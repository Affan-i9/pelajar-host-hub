import { User } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserDashboardProps {
  user: User | null;
}

export const UserDashboard = ({ user }: UserDashboardProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);

      if (orders) {
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === "pending").length,
          approvedOrders: orders.filter(o => o.status === "approved").length,
        });
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang kembali!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Order
              </CardTitle>
              <Package className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Pending
              </CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Approved
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.approvedOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Pesan Paket Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pilih paket hosting yang sesuai dengan kebutuhan kamu
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow"
              >
                <Package className="w-4 h-4 mr-2" />
                Lihat Paket
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Butuh Bantuan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Hubungi kami melalui support ticket
              </p>
              <Button
                onClick={() => navigate("/tickets")}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Buat Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
