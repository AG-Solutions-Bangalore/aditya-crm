import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Page from "../dashboard/page";
import { useStatus } from "@/hooks/useStatus";
import { FileDown } from "lucide-react";
import BASE_URL from "@/config/BaseUrl";

// Fetch customers API
const fetchCustomers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
     `${BASE_URL}/api/panel-fetch-customer`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch customer data");
  return response.json();
};
const ReportForm = () => {
     const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    customer_id: "",
    enquiry_status: "",
  });

  // Fetch customers
  const { data: customerData, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  // Fetch status
  const { data: statusData, isLoading: isStatusLoading } = useStatus();

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate form completion progress
    const totalFields = 4;
    const filledFields = Object.values({ ...formData, [field]: value }).filter(Boolean).length;
    setProgress((filledFields / totalFields) * 100);
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.from_date || !formData.to_date) {
      toast({
        title: "Validation Error",
        description: "Please select both from and to dates.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(
         `${BASE_URL}/api/panel-download-enquiry-details-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to generate report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enquiry_report.csv"; 
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast({
        title: "Success",
        description: "Report generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Page>
      <div className="w-full p-4">
        {/* Header with Progress */}
        <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-4 bg-white p-4 shadow-sm">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Generate Report</h1>
            <p className="text-gray-600 mt-2">Download your enquiry reports</p>
          </div>

          <div className="flex-1 pt-2">
            <div className="sticky top-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Form Completion</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-sm font-medium text-yellow-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.from_date}
                    onChange={(e) => handleInputChange("from_date", e.target.value)}
                    className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.to_date}
                    onChange={(e) => handleInputChange("to_date", e.target.value)}
                    className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                  />
                </div>
              </div>

              {/* Filters Section */}
              <div className="grid grid-cols-2 gap-6">
                {/* Customer Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer
                  </label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => handleInputChange("customer_id", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {isCustomerLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        customerData?.customer?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.customer_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enquiry Status
                  </label>
                  <Select
                    value={formData.enquiry_status}
                    onValueChange={(value) => handleInputChange("enquiry_status", value)}
                  >
                    <SelectTrigger className="w-full border border-gray-300 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {isStatusLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        statusData?.status?.map((status) => (
                          <SelectItem key={status.status_name} value={status.status_name}>
                            {status.status_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" />
                  Generate Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default ReportForm;
