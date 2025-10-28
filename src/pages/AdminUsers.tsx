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
import { Loader2, UserX, UserCheck, Shield, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UserData {
  id: string;
  username: string;
  email: string;
  user_id: string;
  blocked: boolean;
  created_at: string;
}

interface UserRole {
  role: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

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
        .single();

      if (!roleData || (roleData.role !== "admin" && roleData.role !== "super_admin")) {
        navigate("/dashboard");
        return;
      }

      setIsSuperAdmin(roleData.role === "super_admin");
      fetchUsers();
    };

    checkAuth();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(profilesData);

      // Fetch roles for each user
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const rolesMap: Record<string, string> = {};
      rolesData?.forEach((role) => {
        rolesMap[role.user_id] = role.role;
      });
      setUserRoles(rolesMap);
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

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    if (!isSuperAdmin) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya Super Admin yang bisa block/unblock user",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ blocked: !blocked })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: `User berhasil ${!blocked ? "diblokir" : "diaktifkan"}`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!isSuperAdmin || !deleteUserId) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(deleteUserId);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: "User berhasil dihapus",
      });

      setDeleteUserId(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!isSuperAdmin) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya Super Admin yang bisa mengelola admin",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "admin" })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Sukses",
        description: "User berhasil dijadikan Admin",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <CardTitle className="text-3xl gradient-text">Manajemen User</CardTitle>
            {!isSuperAdmin && (
              <p className="text-sm text-muted-foreground">Mode View Only - Hanya Super Admin yang bisa mengubah data</p>
            )}
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Belum ada user</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    {isSuperAdmin && <TableHead>Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={userRoles[user.user_id] === "super_admin" ? "default" : userRoles[user.user_id] === "admin" ? "secondary" : "outline"}>
                          {userRoles[user.user_id] || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.blocked ? "destructive" : "default"}>
                          {user.blocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            {userRoles[user.user_id] === "user" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMakeAdmin(user.user_id)}
                              >
                                <Shield className="w-4 h-4 mr-1" />
                                Jadikan Admin
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={user.blocked ? "default" : "outline"}
                              onClick={() => handleBlockUser(user.user_id, user.blocked)}
                            >
                              {user.blocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                            </Button>
                            {userRoles[user.user_id] !== "super_admin" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteUserId(user.user_id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. User dan semua datanya akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
