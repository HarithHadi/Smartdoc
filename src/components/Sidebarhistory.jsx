import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { MoreHorizontal } from "lucide-react";
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
// import { error } from "console";

function SidebarHistory({ onSelectCode, codes, fetchCodes }) {
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
    </Sidebar>
  );
}

export default SidebarHistory;
