import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

const AdminTickets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [adminReply, setAdminReply] = useState("");

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
        .eq("role", "admin")
        .single();

      if (!roleData) {
        navigate("/dashboard");
        return;
      }

      fetchTickets();
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal memuat tickets",
        variant: "destructive",
      });
      return;
    }

    setTickets(data || []);
  };

  const handleReply = async () => {
    if (!selectedTicket || !adminReply) {
      toast({
        title: "Error",
        description: "Silakan isi balasan",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("tickets")
      .update({ 
        admin_reply: adminReply,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedTicket.id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim balasan",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Balasan berhasil dikirim",
    });

    setAdminReply("");
    setSelectedTicket(null);
    fetchTickets();
  };

  const handleCloseTicket = async (ticketId: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({ 
        status: "closed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menutup ticket",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Ticket berhasil ditutup",
    });

    fetchTickets();
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Kelola Tickets</h1>
          <p className="text-muted-foreground">Kelola semua support tickets dari users</p>
        </div>

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada ticket</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{ticket.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        User ID: {ticket.user_id.slice(0, 8)}... | {new Date(ticket.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                      {ticket.status === "open" ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Pesan User:</p>
                    <p className="text-muted-foreground">{ticket.message}</p>
                  </div>
                  
                  {ticket.admin_reply && (
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium mb-2 text-primary">Balasan Admin:</p>
                      <p className="text-sm">{ticket.admin_reply}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setAdminReply(ticket.admin_reply || "");
                      }}
                      variant="outline"
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      {ticket.admin_reply ? "Edit Balasan" : "Balas"}
                    </Button>
                    
                    {ticket.status === "open" && (
                      <Button
                        onClick={() => handleCloseTicket(ticket.id)}
                        variant="outline"
                        className="border-destructive/50 hover:bg-destructive/10"
                      >
                        Tutup Ticket
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="glass-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Balas Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Subject:</p>
              <p className="text-muted-foreground">{selectedTicket?.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Pesan User:</p>
              <p className="text-muted-foreground">{selectedTicket?.message}</p>
            </div>
            <div>
              <Textarea
                placeholder="Balasan admin"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="bg-background/50 border-primary/20 min-h-[150px]"
              />
            </div>
            <Button 
              onClick={handleReply} 
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              Kirim Balasan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTickets;
