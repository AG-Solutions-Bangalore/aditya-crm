import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings2,
  Trash2,
  PlusCircle,
  MinusCircle,
  Calendar,
  Clock,
  User,
  FileText,
  Globe2,
  Building2,
  Globe,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import { decryptId } from "@/utils/encyrption/Encyrption";
import { useStatus } from "@/hooks/useStatus";
import BASE_URL from "@/config/BaseUrl";

// Header Component

const EnquiryHeader = ({ enquiryDetails }) => {
  return (
    <div className="flex sticky top-0 z-10 border border-blue-200 rounded-lg justify-between items-start gap-8 mb-2 bg-blue-100 p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-800">Edit Enquiry</h1>

          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {enquiryDetails?.enquiry?.enquiry_status || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-4 ">
          <p className="text-gray-800 mt-2">Update your enquiry details</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 text-sm">
          <Building2 className="h-4 w-4 text-yellow-500" />
          <span>{enquiryDetails?.company?.company_name || "N/A"}</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <FileText className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">
            Ref: {enquiryDetails?.enquiry?.enquiry_ref || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 text-sm">
          <Globe className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">
            Country: {enquiryDetails?.customer?.customer_country || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};
const EnquiryEdit = () => {
  const { id } = useParams();
  const originalId = decryptId(id);
  if (!originalId) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Decrypting Data
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </Page>
    );
  }
  const { toast } = useToast();
  const navigate = useNavigate();
  const [initialStatus, setInitialStatus] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
    "enquirySub_product_name",
    "enquirySub_shu",
    "enquirySub_asta",
    "enquirySub_qlty_type",
    "enquirySub_course_type",
    "enquirySub_qnty",
    "enquirySub_quoted_price",
    "enquirySub_remarks",
  ]);

  const defaultTableHeaders = [
    { key: "enquirySub_product_name", label: "Product Name", required: true },
    { key: "enquirySub_shu", label: "SHU (in K)" },
    { key: "enquirySub_asta", label: "ASTA" },
    { key: "enquirySub_qlty_type", label: "Quality Type" },
    { key: "enquirySub_course_type", label: "Coarse Type" },
    { key: "enquirySub_qnty", label: "Quantity (in MT)" },
    { key: "enquirySub_quoted_price", label: "Quoted Price" },
    { key: "enquirySub_remarks", label: "Remarks" },
  ];

  const optionalHeaders = [
    { key: "enquirySub_product_code", label: "Product Code" },
    { key: "enquirySub_stem_type", label: "Stem Type" },
    { key: "enquirySub_moist_value", label: "Moisture Value" },
    { key: "enquirySub_final_price", label: "Final Price" },
    { key: "enquirySub_p2b_blend", label: "P2B Blend" },
  ];

  const [enquiryData, setEnquiryData] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    enquiry_date: "",
    packing_type: "",
    marking: "",
    shipment_date: "",
    special_instruction: "",
    sample_required: "No",
    treatment_required: "No",
    etd: "No",
    customer_feedback: "",
    gama_rediations: "No",
    steam_sterlizaton: "No",
    enquiry_status: "",
  });

  const packingTypes = ["5 Kg", "10 Kg", "15 Kg", "20 Kg", "25 Kg"];

  const {
    data: statusData,
    isLoading: isStatusLoading,
    error: statusError,
  } = useStatus();

  const statusOptions =
    statusData?.status?.map((status) => status?.status_name) || [];

  // Fetch Enquiry Data
  const {
    data: enquiryDetails,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["enquiry", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-fetch-enquiry-by-id/${originalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch enquiry");
      return response.json();
    },
  });
  useEffect(() => {
    if (enquiryDetails?.enquiry?.enquiry_status) {
      setInitialStatus(enquiryDetails.enquiry.enquiry_status);
    }
  }, [enquiryDetails]);

  // fetch customer
  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-fetch-customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  // Fetch Products
  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-fetch-product`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  useEffect(() => {
    if (enquiryDetails) {
      setFormData({
        customer_id: enquiryDetails.enquiry.customer_id.toString(),
        enquiry_date: enquiryDetails.enquiry.enquiry_date,
        packing_type: enquiryDetails.enquiry.packing_type,
        marking: enquiryDetails.enquiry.marking,
        shipment_date: enquiryDetails.enquiry.shipment_date,
        special_instruction: enquiryDetails.enquiry.special_instruction,
        customer_feedback: enquiryDetails.enquiry.customer_feedback,
        sample_required: enquiryDetails.enquiry.sample_required,
        treatment_required: enquiryDetails.enquiry.treatment_required,
        etd: enquiryDetails.enquiry.etd,
        gama_rediations: enquiryDetails.enquiry.gama_rediations,
        steam_sterlizaton: enquiryDetails.enquiry.steam_sterlizaton,
        enquiry_status: enquiryDetails?.enquiry?.enquiry_status,
      });
      setEnquiryData(enquiryDetails.enquirySub);

      const columnsWithValues = optionalHeaders
        .filter((header) =>
          enquiryDetails.enquirySub.some(
            (row) => row[header.key] && row[header.key].toString().trim() !== ""
          )
        )
        .map((header) => header.key);
      setVisibleColumns((prev) => [
        ...new Set([...prev, ...columnsWithValues]),
      ]);
    }
  }, [enquiryDetails]);

  // timeline
  const createTimelineEvent = async (data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
       `${BASE_URL}/api/panel-create-enquiry-timeline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Failed to create timeline event");
    return response.json();
  };
  const { mutate: addTimelineEvent } = useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: () => {
      console.log("timeline created");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete Product Row Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-delete-enquirySub/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
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
  console.log("eeeeeee", initialStatus);
  // Update Enquiry Mutation
  const updateEnquiryMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-update-enquiry/${originalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to update enquiry");
      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Enquiry updated successfully",
      });
      const token = localStorage.getItem("token");
      const updatedResponse = await fetch(
         `${BASE_URL}/api/panel-fetch-enquiry-by-id/${originalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated enquiry");

      const updatedData = await updatedResponse.json();

      if (
        initialStatus &&
        updatedData?.enquiry?.enquiry_status !== initialStatus
      ) {
        addTimelineEvent({
          enquiry_ref: updatedData?.enquiry.enquiry_ref,
          type: "status_changed",
          status_label: updatedData?.enquiry.enquiry_status,
        });
      }

      navigate("/enquiries");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e, field) => {
    let value;
    if (e.target.type === "checkbox") {
      value = e.target.checked ? "Yes" : "No";
    } else {
      value = e.target.value;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRowDataChange = (rowIndex, field, value) => {
    const newData = [...enquiryData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [field]: value,
    };
    setEnquiryData(newData);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const addRow = () => {
    setEnquiryData([
      ...enquiryData,
      {
        enquirySub_product_name: "",
        enquirySub_product_code: "",
        enquirySub_shu: "",
        enquirySub_asta: "",
        enquirySub_qlty_type: "",
        enquirySub_stem_type: "",
        enquirySub_remarks: "",
        enquirySub_course_type: "",
        enquirySub_moist_value: "",
        enquirySub_qnty: "",
        enquirySub_quoted_price: "",
        enquirySub_final_price: 0,
        enquirySub_p2b_blend: "",
      },
    ]);
  };
  const removeRow = (index) => {
    if (enquiryData.length > 1) {
      setEnquiryData((prevData) => prevData.filter((_, i) => i !== index));
    }
  };

  const handleDeleteRow = (productId) => {
    setDeleteItemId(productId);
    setDeleteConfirmOpen(true);
  };

  // Actual delete function
  const confirmDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(deleteItemId);
      setEnquiryData((prevData) =>
        prevData.filter((row) => row.id !== deleteItemId)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
    }
  };

  const RadioOption = ({ label, value, onChange, currentValue }) => (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <RadioGroup
        value={currentValue}
        onValueChange={(newValue) =>
          onChange({ target: { value: newValue } }, value)
        }
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="Yes" id={`${value}-yes`} />
          <label htmlFor={`${value}-yes`} className="cursor-pointer">
            Yes
          </label>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="No" id={`${value}-no`} />
          <label htmlFor={`${value}-no`} className="cursor-pointer">
            No
          </label>
        </div>
      </RadioGroup>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      ...formData,
      enquiry_data: enquiryData,
    };
    updateEnquiryMutation.mutate(updateData);
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className=" h-4 w-4 animate-spin" />
            Loading Enquiry Data
          </Button>
        </div>
      </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Enquiry Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <EnquiryHeader enquiryDetails={enquiryDetails} />

        <Card className="mb-6 bg-gray-100 border-gray-200">
          <CardContent className="p-6">
            {/* Basic Details Section */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "customer_id")
                    }
                  >
                    <SelectTrigger className="bg-white border-blue-300">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-blue-300">
                      {customerData?.customer?.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.customer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enquiry Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.enquiry_date}
                    onChange={(e) => handleInputChange(e, "enquiry_date")}
                    className="bg-white border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Shipment Date
                  </label>
                  <Input
                    type="date"
                    value={formData.shipment_date}
                    onChange={(e) => handleInputChange(e, "shipment_date")}
                    className="bg-white border-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData?.enquiry_status}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "enquiry_status")
                    }
                  >
                    <SelectTrigger className="bg-white border-blue-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-blue-300">
                      {statusOptions?.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Products</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white border-blue-300">
                      <Settings2 className="h-4 w-4 mr-2" />
                      Customize Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border-blue-300">
                    {optionalHeaders.map((header) => (
                      <DropdownMenuItem
                        key={header.key}
                        onClick={() => toggleColumn(header.key)}
                      >
                        <span>{header.label}</span>
                        {visibleColumns.includes(header.key) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      {[...defaultTableHeaders, ...optionalHeaders]
                        .filter((header) => visibleColumns.includes(header.key))
                        .map((header) => (
                          <th
                            key={header.key}
                            className="p-2 text-left border text-sm font-medium"
                          >
                            {header.label}
                            {header.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </th>
                        ))}
                      <th className="p-2 text-left border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiryData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-yellow-50">
                        {[...defaultTableHeaders, ...optionalHeaders]
                          .filter((header) =>
                            visibleColumns.includes(header.key)
                          )
                          .map((header) => (
                            <td key={header.key} className="p-2 border">
                              {header.key === "enquirySub_product_name" ? (
                                <Select
                                  value={row[header.key]}
                                  onValueChange={(value) =>
                                    handleRowDataChange(
                                      rowIndex,
                                      header.key,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="bg-white border-blue-300">
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-blue-300">
                                    {productData?.product?.map((product) => (
                                      <SelectItem
                                        key={product.id}
                                        value={product.product_name}
                                      >
                                        {product.product_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={row[header.key]}
                                  onChange={(e) =>
                                    handleRowDataChange(
                                      rowIndex,
                                      header.key,
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-blue-300 bg-white"
                                />
                              )}
                            </td>
                          ))}
                        <td className="p-2 border">
                          {row.id ? (
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteRow(row.id)}
                              className="text-red-500"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              onClick={() => removeRow(rowIndex)}
                              className="text-red-500"
                              type="button"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={addRow}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Packing Type <span className="text-red-500">*</span>
                  </label>
                  {/* <Select
                    value={formData.packing_type}
                    onValueChange={(value) =>
                      handleInputChange({ target: { value } }, "packing_type")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select packing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Input
                    type="text"
                    placeholder="Enter Package details"
                    value={formData.packing_type}
                    onChange={(e) => handleInputChange(e, "packing_type")}
                    className="bg-white border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Marking
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter marking details"
                    value={formData.marking}
                    onChange={(e) => handleInputChange(e, "marking")}
                    className="bg-white border-blue-300"
                  />
                </div>

                <RadioOption
                  label="Treatment Required"
                  value="treatment_required"
                  onChange={handleInputChange}
                  currentValue={formData.treatment_required}
                />

                <RadioOption
                  label="Sample Required"
                  value="sample_required"
                  onChange={handleInputChange}
                  currentValue={formData.sample_required}
                />
                {/* Conditional Treatment Options */}
                {formData.treatment_required === "Yes" && (
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.etd === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "etd"
                          )
                        }
                      />
                      <label>ETD</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.gama_rediations === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "gama_rediations"
                          )
                        }
                      />
                      <label>Gama Radiations</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.steam_sterlizaton === "Yes"}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            { target: { checked, type: "checkbox" } },
                            "steam_sterlizaton"
                          )
                        }
                      />
                      <label>Steam Sterilization</label>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.special_instruction}
                    onChange={(e) =>
                      handleInputChange(e, "special_instruction")
                    }
                    placeholder="Pls enter special instruction..."
                    className="border rounded-md bg-white border-blue-300 p-2 w-full h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Feedback
                  </label>
                  <textarea
                    value={formData.customer_feedback}
                    onChange={(e) => handleInputChange(e, "customer_feedback")}
                    placeholder="Pls enter customer feedback..."
                    className="border border-blue-300 bg-white rounded-md p-2 w-full h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          {updateEnquiryMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
            disabled={updateEnquiryMutation.isPending}
          >
            {updateEnquiryMutation.isPending ? "Updating..." : "Update Enquiry"}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from this enquiry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-yellow-500 text-black hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
};

export default EnquiryEdit;
