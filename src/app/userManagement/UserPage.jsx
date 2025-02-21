import React, { useContext, useEffect, useCallback, useState } from "react";
import { ExternalLink, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "@/lib/ContextPanel";
import Page from "../dashboard/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";

const UserPage = () => {
  const { getStaticUsers } = useContext(ContextPanel);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    userType: "all",
    status: "all"
  });

  const loadUsers = useCallback(() => {
    try {
      const loadedUsers = getStaticUsers();
      console.table("Loaded users:", loadedUsers);
      setUsers(loadedUsers);
      setFilteredUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, [getStaticUsers]);

  const applyFilters = useCallback(() => {
    let result = [...users];
    // console.log("Starting filter with", result.length, "users");

    if (searchTerm) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    //   console.log("After search term filter:", result.length, "users");
    }

    if (filters.userType !== "all") {
      result = result.filter((user) => user.user_type === filters.userType);
    //   console.log("After user type filter:", result.length, "users");
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((user) => user.status === filters.status);
    //   console.log("After status filter:", result.length, "users");
    }

    // console.log("Final filtered result:", result);
    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, users, searchTerm, filters]);

  const handleOpenDashboard = (userId) => {
    window.open(`/management-dashboard/${userId}`, "_blank");
  };
  
  return (
    <Page>
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-md"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                >
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, userType: "all" })}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, userType: 1 })}
                >
                  Document Manager
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, userType: 2 })}
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, userType: 3 })}
                >
                  Super Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, userType: 4 })}
                >
                  Super Admins
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => navigate("/page-management")}
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              + Page
            </Button>
            <Button
              onClick={() => navigate("/button-management")}
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
            >
              + Button
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    User Info
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {user.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            user.user_type === 1
                              ? "bg-red-100 text-red-800"
                              : user.user_type === 2
                              ? "bg-blue-100 text-blue-800"
                              : user.user_type === 3
                              ? "bg-green-100 text-green-800"
                              : user.user_type === 4
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          } capitalize`}
                        >
                          {user.user_type === 1
                            ? "Document Manager"
                            : user.user_type === 2
                            ? "Admin"
                            : user.user_type === 3
                            ? "Superadmin"
                            : user.user_type === 4
                            ? "Superadmins"
                            : "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenDashboard(user.id)}
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            User Managment
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No users found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default UserPage;