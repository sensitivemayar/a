"use client";

import { useState } from "react";
import {
  FileCode,
  LayoutDashboard,
  Loader2,
  Mail,
  Network,
  ShieldAlert,
  Wallet,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";

import Logo from "@/app/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/app/components/dashboard";
import PhishingDetection from "@/app/components/phishing-detection";
import MalwareAnalysis from "@/app/components/malware-analysis";
import NetworkAnomaly from "@/app/components/network-anomaly";
import IncidentResponse from "@/app/components/incident-response";
import FraudDetection from "@/app/components/fraud-detection";
import { Separator } from "@/components/ui/separator";

type View =
  | "dashboard"
  | "phishing"
  | "malware"
  | "network"
  | "incident"
  | "fraud";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "phishing":
        return <PhishingDetection />;
      case "malware":
        return <MalwareAnalysis />;
      case "network":
        return <NetworkAnomaly />;
      case "incident":
        return <IncidentResponse />;
      case "fraud":
        return <FraudDetection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold">CyberMind</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("dashboard")}
                isActive={activeView === "dashboard"}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator className="my-2" />
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("phishing")}
                isActive={activeView === "phishing"}
                tooltip="Phishing Detection"
              >
                <Mail />
                <span>Phishing Detection</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("malware")}
                isActive={activeView === "malware"}
                tooltip="Malware Analysis"
              >
                <FileCode />
                <span>Malware Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("network")}
                isActive={activeView === "network"}
                tooltip="Network Anomaly"
              >
                <Network />
                <span>Network Anomaly</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("incident")}
                isActive={activeView === "incident"}
                tooltip="Incident Response"
              >
                <ShieldAlert />
                <span>Incident Response</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("fraud")}
                isActive={activeView === "fraud"}
                tooltip="Fraud Detection"
              >
                <Wallet />
                <span>Fraud Detection</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
          {renderView()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
