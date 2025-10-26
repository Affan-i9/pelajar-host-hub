import { User } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, MessageSquare, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminDashboardProps {
  user: User | null;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    openTickets: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, ordersRes, ticketsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("orders").select("*"),
        supabase.from("tickets").select("*").eq("status", "open"),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        pendingOrders: ordersRes.data?.filter(o => o.status === "pending").length || 0,
        approvedOrders: ordersRes.data?.filter(o => o.status === "approved").length || 0,
        openTickets: ticketsRes.data?.length || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Kelola hosting Smart-Hosting</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total User
              </CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
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
              <Package className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.approvedOrders}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Open
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.openTickets}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur admin lengkap akan segera tersedia untuk kelola users, orders, dan tickets.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
