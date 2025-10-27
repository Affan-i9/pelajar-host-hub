import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

const Tickets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", message: "" });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      fetchTickets(session.user.id);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchTickets = async (userId: string) => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !newTicket.subject || !newTicket.message) {
      toast({
        title: "Error",
        description: "Silakan isi semua field",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("tickets").insert({
      user_id: user.id,
      subject: newTicket.subject,
      message: newTicket.message,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal membuat ticket",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sukses",
      description: "Ticket berhasil dibuat",
    });

    setNewTicket({ subject: "", message: "" });
    setIsDialogOpen(false);
    fetchTickets(user.id);
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Support Tickets</h1>
            <p className="text-muted-foreground">Kelola semua ticket support kamu</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-yellow">
                <Plus className="w-4 h-4 mr-2" />
                Buat Ticket Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-primary/20">
              <DialogHeader>
                <DialogTitle>Buat Ticket Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <Input
                    placeholder="Subject"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="bg-background/50 border-primary/20"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Pesan"
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                    className="bg-background/50 border-primary/20 min-h-[150px]"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                  Kirim Ticket
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
                        {new Date(ticket.created_at).toLocaleDateString("id-ID", {
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
                    <p className="text-sm font-medium mb-2">Pesan:</p>
                    <p className="text-muted-foreground">{ticket.message}</p>
                  </div>
                  
                  {ticket.admin_reply && (
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium mb-2 text-primary">Balasan Admin:</p>
                      <p className="text-sm">{ticket.admin_reply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
