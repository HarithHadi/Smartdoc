import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, } from "@/components/ui/sidebar"

function SidebarHistory ({ onSelectCode }) {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const fetchCodes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const codesRef = collection(db, "userData", user.uid, "codes");
      const snapshot = await getDocs(codesRef);
      const codeList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCodes(codeList);
    };

    fetchCodes();
  }, []);

  return (
    // <div className="w-64 bg-gray-100 p-4 h-screen overflow-y-auto">
    //   <h2 className="text-lg font-semibold mb-4">Saved Codes</h2>
    //   {codes.map((item) => (
    //     <div
    //       key={item.id}
    //       className="mb-2 cursor-pointer hover:bg-gray-200 p-2 rounded font-bold"
    //       onClick={() => onSelectCode(item.code)}
    //     >
    //       {item.title || "Untitled"}
    //     </div>
    //   ))}
    // </div>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {codes.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  className="mb-2 cursor-pointer hover:bg-gray-200 p-2 rounded font-bold text-left text-sm"
                  onClick={() => onSelectCode(item.code)}
                >
                  {item.title || "Untitled"}
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
