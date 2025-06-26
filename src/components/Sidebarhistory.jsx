import { useEffect, useState } from "react";
import { auth, db,  } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
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
                <DropdownMenuContent
                  side="top"
                  className="min-w-[250px]"
                >
                  <DropdownMenuItem>
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
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
