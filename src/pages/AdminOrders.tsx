import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  id: string;
  package_name: string;
  package_price: number;
  domain_name: string;
  status: string;
  payment_proof: string | null;
  website_file: string | null;
  created_at: string;
  user_id: string;
}

interface Profile {
  username: string;
  email: string;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<(Order & { profile: Profile })[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewPaymentProof, setViewPaymentProof] = useState(false);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["admin", "super_admin"])
        .single();

      if (!roleData) {
        navigate("/dashboard");
        return;
      }

      fetchOrders();
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (username, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = ordersData.map((order: any) => ({
        ...order,
        profile: Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
      }));

      setOrders(formattedOrders);
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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: `Status order berhasil diubah menjadi ${newStatus}`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewPaymentProofImage = async (fileName: string) => {
    const { data } = await supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);

    setPaymentProofUrl(data.publicUrl);
    setViewPaymentProof(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      active: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">Manajemen Order</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Belum ada order</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{order.profile.username}</div>
                          <div className="text-xs text-muted-foreground">{order.profile.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.package_name}</TableCell>
                      <TableCell>{order.domain_name}</TableCell>
                      <TableCell>Rp {order.package_price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.payment_proof && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewPaymentProofImage(order.payment_proof!)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleStatusUpdate(order.id, "active")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(order.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewPaymentProof} onOpenChange={setViewPaymentProof}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
            <DialogDescription>Review bukti transfer dari user</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <img src={paymentProofUrl} alt="Bukti Pembayaran" className="max-w-full max-h-[70vh] object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
