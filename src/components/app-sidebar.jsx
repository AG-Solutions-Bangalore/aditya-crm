import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ContextPanel } from "@/lib/ContextPanel";
import { NavMainUpdate } from "./nav-main-update";
import { NavMainReport } from "./nav-main-report";




const isItemAllowed = (item, pageControl, userId) => {
  const itemUrl = item.url?.replace(/^\//, "");
  return pageControl.some((control) => 
    control.page === item.title && 
    control.url === itemUrl && 
    control.userIds.includes(userId) && 
    control.status === "Active"
  );
};


const filterMenuItems = (items, pageControl, userId) => {
  if (!items) return [];

  return items.reduce((acc, item) => {
    if (item.items) {
      const filteredItems = filterMenuItems(item.items, pageControl, userId);
      if (filteredItems.length > 0) {
        acc.push({
          ...item,
          items: filteredItems,
        });
      }
    } else if (isItemAllowed(item, pageControl, userId)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

export function AppSidebar({ ...props }) {
  // const {emailL,nameL,userType} = React.useContext(ContextPanel)
  const nameL = localStorage.getItem("name");
  const emailL = localStorage.getItem("email");
  const userType = localStorage.getItem("userType");
  const pageControl = JSON.parse(localStorage.getItem("pageControl")) || [];
  const userId = localStorage.getItem("id");
  const companyName = localStorage.getItem("company_name");
  const initialData = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: `${companyName}`,
        logo: GalleryVerticalEnd,
        plan: "",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Payment Mediation",
        url: "/amount",
        icon: Settings2,
      },
      {
        title: "Business Expansion",
        url: "/business-opp",
        icon: BookOpen,
      },
      {
        title: "Job Offered",
        url: "/job-offered",
        icon: SquareTerminal,
      },
      {
        title: "Job Require",
        url: "/job-require",
        icon: SquareTerminal,
      },
    ],
    navMain1: [
      {
        title: "Directory",
        url: "/directory",
        icon: Bot,
      },

      {
        title: "Latest News",
        url: "/latest-news",
        icon: SquareTerminal,
      },
    ],
    navReport: [
      {
        title: "Participant Summary",
        url: "/participant-summary",
        icon: Bot,
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Bot,
      },
    ],
    projects: [
      {
        name: "Dashboard",
        url: "/home",
        icon: Frame,
      },
      {
        name: "Customers",
        url: "/customers",
        icon: Map,
      },
      {
        name: "Products",
        url: "/products",
        icon: PieChart,
      },
      {
        name: "Enquiries",
        url: "/enquiries",
        icon: Map,
      },
      {
        name: "Report",
        url: "/report",
        icon: Map,
      },
      {
        name: "User Management",
        url: "/userManagement",
        icon: Map,
      },
    ],
  };
 const filteredProjects = filterMenuItems(initialData.projects.map(p => ({
    title: p.name,
    url: p.url
  })), pageControl, userId).map(p => ({
    name: p.title,
    url: p.url,
    icon: initialData.projects.find(orig => orig.name === p.title)?.icon || Frame
  }));
  const data = {
    ...initialData,
   
    projects: filteredProjects,
   
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
