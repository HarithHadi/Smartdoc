import { useEffect, useState } from "react";
import { auth, db,  } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { MoreHorizontal, User2, ChevronUp  } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {signOut } from "firebase/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
// import { error } from "console";

function SidebarHistory({ onSelectCode, codes, fetchCodes, username }) {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState(username || "");
  
  useEffect(() => {
  setNewUsername(username || "");
  }, [username]);

  const deleteCode = async(id) =>{
    const user = auth.currentUser;
    if(!user) return;

    try{
      const codeDocRef = doc(db, "userData", user.uid, "codes", id);
      await deleteDoc(codeDocRef);
      console.log("Document Deleted");
      await fetchCodes();

    }catch(err){
      console.error("Error deleting document :", error);
    }
  }
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleUsernameUpdate = async () => {
    const user = auth.currentUser;
    if (!user || !newUsername.trim()) return;

    try {
      const userRef = doc(db, "userData", user.uid);
      await updateDoc(userRef, { username: newUsername });
      console.log("Username updated successfully");
    } catch (err) {
      console.error("Failed to update username:", err);
    }
};


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {codes.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  className="p-4 mb-2 cursor-pointer hover:bg-gray-200 rounded font-bold text-left text-sm"
                  onClick={() => onSelectCode(item.code, item.id)}
                >
                  {item.title || "Untitled"}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem onClick={()=>deleteCode((item.id))}>
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            <User2 /> {username}
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="min-w-[250px]">
          <Dialog>
            {/* ✅ Trigger the dialog from a styled DropdownMenuItem */}
            <DialogTrigger asChild>
              <DropdownMenuItem  onSelect={(e) => e.preventDefault()}>
                <span>Edit Profile</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="username" className="sr-only">
                    Username
                  </Label>
                  <Input id="username" defaultValue={username} onChange={(e) => setNewUsername(e.target.value)} />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={handleUsernameUpdate}>
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenuItem onClick={handleLogout}>
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>
    </Sidebar>
  );
}

export default SidebarHistory;
