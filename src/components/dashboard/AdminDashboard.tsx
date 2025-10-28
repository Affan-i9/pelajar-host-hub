import { User } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, MessageSquare, Clock, ShoppingCart, TrendingUp, Activity, Settings, Shield, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardProps {
  user: User | null;
}

interface Order {
  id: string;
  package_name: string;
  status: string;
  created_at: string;
  profiles: {
    username: string;
    email: string;
  };
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    openTickets: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkRole = async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      if (roleData) {
        setIsSuperAdmin(roleData.role === "super_admin");
      }
    };

    checkRole();
    const fetchStats = async () => {
      const [usersRes, ordersRes, ticketsRes, profilesRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("orders").select("*"),
        supabase.from("tickets").select("*").eq("status", "open"),
        supabase.from("profiles").select("id, username, email"),
      ]);

      const orders = ordersRes.data || [];
      const profiles = profilesRes.data || [];
      const pendingOrders = orders.filter(o => o.status === "pending");
      const approvedOrders = orders.filter(o => o.status === "approved");

      // Calculate mock revenue (you can update this based on actual package prices)
      const revenue = approvedOrders.length * 100000; // Mock calculation

      setStats({
        totalUsers: usersRes.count || 0,
        pendingOrders: pendingOrders.length,
        approvedOrders: approvedOrders.length,
        openTickets: ticketsRes.data?.length || 0,
        totalRevenue: revenue,
        monthlyGrowth: 15.5, // Mock growth percentage
      });

      // Join orders with profiles data
      const ordersWithProfiles: Order[] = orders.slice(0, 5).map(order => {
        const profile = profiles.find(p => p.id === order.user_id);
        return {
          id: order.id,
          package_name: order.package_name,
          status: order.status,
          created_at: order.created_at,
          profiles: {
            username: profile?.username || 'N/A',
            email: profile?.email || 'N/A',
          }
        };
      });

      setRecentOrders(ordersWithProfiles);
    };

    fetchStats();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "secondary",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Kelola hosting Smart-Hosting</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total User
              </CardTitle>
              <Users className="w-5 h-5 text-primary animate-bounce-subtle" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Pending
              </CardTitle>
              <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Approved
              </CardTitle>
              <Package className="w-5 h-5 text-secondary animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.approvedOrders}</div>
              <p className="text-xs text-muted-foreground">Order aktif</p>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Open
              </CardTitle>
              <MessageSquare className="w-5 h-5 text-destructive animate-bounce-subtle" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stats.openTickets}</div>
              <p className="text-xs text-muted-foreground">Perlu ditangani</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Growth */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 stagger-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </div>
              <p className="text-sm text-muted-foreground">Dari {stats.approvedOrders} order approved</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Monthly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary mb-2">
                +{stats.monthlyGrowth}%
              </div>
              <p className="text-sm text-muted-foreground">Pertumbuhan bulan ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="glass-card mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-medium">{order.package_name}</TableCell>
                      <TableCell>{order.profiles?.username || 'N/A'}</TableCell>
                      <TableCell>{order.profiles?.email || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Belum ada order
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform glow-yellow"
            onClick={() => navigate("/admin/orders")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <ShoppingCart className="w-12 h-12 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">Kelola Order</h3>
                <p className="text-sm text-muted-foreground">Verifikasi & approve order</p>
              </div>
            </CardContent>
          </Card>

          {isSuperAdmin && (
            <Card 
              className="glass-card cursor-pointer hover:scale-105 transition-transform glow-yellow"
              onClick={() => navigate("/admin/users")}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-12 h-12 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-1">Kelola User</h3>
                  <p className="text-sm text-muted-foreground">Block/unblock & manage admin</p>
                  <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform glow-yellow"
            onClick={() => navigate("/admin/tickets")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="w-12 h-12 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">Kelola Tiket</h3>
                <p className="text-sm text-muted-foreground">Balas & tutup tiket support</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="glass-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Package className="w-12 h-12 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1">Lihat Paket</h3>
                <p className="text-sm text-muted-foreground">Daftar paket hosting</p>
              </div>
            </CardContent>
          </Card>

          {isSuperAdmin && (
            <Card className="glass-card cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="w-12 h-12 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-1">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Revenue & performance stats</p>
                  <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
