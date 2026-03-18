"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings2,
  Zap,
  Rocket,
  FlaskConical,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Warehouse", href: "/warehouse", icon: Settings2 },
  { label: "Copilot", href: "/copilot", icon: Zap },
  { label: "Production", href: "/production", icon: Rocket },
  { label: "Studio", href: "/studio", icon: FlaskConical },
  { label: "Account", href: "/account", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{ backgroundColor: "hsl(222 47% 6%)", borderRight: "1px solid hsl(217 33% 17%)" }}>

      {/* Logo */}
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold"
          style={{ color: "hsl(210 100% 56%)" }}>
          Grace
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200"
              style={{
                backgroundColor: isActive ? "hsl(210 100% 56% / 0.15)" : "transparent",
                color: isActive ? "hsl(210 100% 56%)" : "hsl(215 20% 65%)",
              }}>
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: "hsl(217 33% 17%)" }}>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all"
          style={{ color: "hsl(215 20% 65%)" }}>
          <LogOut size={18} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
        <p className="text-xs text-center mt-2" style={{ color: "hsl(215 20% 40%)" }}>
          Powered by Grace
        </p>
      </div>
    </aside>
  );
}