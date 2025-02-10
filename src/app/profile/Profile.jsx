import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import Page from "../dashboard/page";
import BASE_URL from "@/config/BaseUrl";

const profileSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
});

const Profile = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Fetch profile data
  const { data: profileData, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/panel-fetch-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  // Update form data when profile data is fetched
  useEffect(() => {
    if (isSuccess && profileData?.profile) {
      setFormData(profileData.profile);
    }
  }, [profileData, isSuccess]);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            mobile: data.mobile,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For mobile, only allow digits and max 10 characters
    if (name === "mobile") {
      if (value.length <= 10 && /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedData = profileSchema.parse(formData);
      updateProfile.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Page>
      <div className="w-full p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-rows-4 lg:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  name="name"
                  value={formData.name || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mobile</label>
                <Input
                  name="mobile"
                  type="text"
                  value={formData.mobile || ""}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    value={formData.cpassword || ""}
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default Profile;
