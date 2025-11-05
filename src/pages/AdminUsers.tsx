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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "Session tidak valid",
          variant: "destructive",
        });
        return;
      }

      // Call edge function to delete user
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: deleteUserId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menghapus user');
      }

      toast({
        title: "Sukses",
        description: "User berhasil dihapus permanen dari sistem",
      });

      setDeleteUserId(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus user",
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
        {/* Header Section */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">Manajemen User</h1>
              <p className="text-muted-foreground text-lg">
                {isSuperAdmin ? "Kelola semua user dan admin" : "Mode View Only - Hanya Super Admin yang bisa mengubah data"}
              </p>
            </div>
            {isSuperAdmin && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Super Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 stagger-fade-in">
          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total User</p>
                  <h3 className="text-3xl font-bold">{users.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Admin</p>
                  <h3 className="text-3xl font-bold">
                    {Object.values(userRoles).filter(r => r === "admin").length}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-secondary/10">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Super Admin</p>
                  <h3 className="text-3xl font-bold">
                    {Object.values(userRoles).filter(r => r === "super_admin").length}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Blocked</p>
                  <h3 className="text-3xl font-bold">
                    {users.filter(u => u.blocked).length}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" />
              Daftar User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">Belum ada user terdaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Username</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Role</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Tanggal Daftar</TableHead>
                      {isSuperAdmin && <TableHead className="font-bold">Aksi</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-semibold">{user.username}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              userRoles[user.user_id] === "super_admin" 
                                ? "default" 
                                : userRoles[user.user_id] === "admin" 
                                ? "secondary" 
                                : "outline"
                            }
                            className={
                              userRoles[user.user_id] === "super_admin"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                                : ""
                            }
                          >
                            {userRoles[user.user_id] === "super_admin" && <Shield className="w-3 h-3 mr-1" />}
                            {userRoles[user.user_id] || "user"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.blocked ? "destructive" : "default"}
                            className={user.blocked ? "" : "bg-green-600"}
                          >
                            {user.blocked ? "Blocked" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </TableCell>
                        {isSuperAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              {userRoles[user.user_id] === "user" && (
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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
                                className={user.blocked ? "bg-green-600 hover:bg-green-700" : ""}
                              >
                                {user.blocked ? (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-4 h-4 mr-1" />
                                    Block
                                  </>
                                )}
                              </Button>
                              {userRoles[user.user_id] !== "super_admin" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteUserId(user.user_id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Hapus
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-destructive" />
              Hapus User?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Aksi ini tidak bisa dibatalkan. User dan semua datanya akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-muted">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser} 
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
