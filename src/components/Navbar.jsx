import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  import { Button } from "@/components/ui/button"


    

export default function Navbar() {
    return (
        <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1000, padding: "10px 20px" }}>
            <NavigationMenu className="bg-background text-foreground" style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
                <NavigationMenuList style={{ display: "flex", gap: "20px" }}>
                    <NavigationMenuItem>
                        <Button
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#000000";
                                e.target.style.color = "#FFFFFF";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#FFFFFF";
                                e.target.style.color = "#000000";
                            }}
                        >
                            Home
                        </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#000000";
                                e.target.style.color = "#FFFFFF";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#FFFFFF";
                                e.target.style.color = "#000000";
                            }}
                        >
                            Login
                        </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button
                            style={{
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s, color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#FFFFFF";
                                e.target.style.color = "#000000";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#000000";
                                e.target.style.color = "#FFFFFF";
                            }}
                        >
                            Register
                        </Button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
