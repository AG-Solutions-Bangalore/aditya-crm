import React, { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings2,
  Loader2,
  Building2,
  FileText,
  Globe,
  Calendar,
  Clock,
  Package,
  TestTubes,
  Truck,
  ChevronUp,
  ChevronDown,
  Repeat1,
  SquareChartGantt,
} from "lucide-react";
import Page from "../dashboard/page";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "@/components/spinner/ProgressBar";
import { gsap } from "gsap";
import { decryptId } from "@/utils/encyrption/Encyrption";
// Header Component (same as EnquiryEdit)

const EnquiryHeader = ({ enquiryDetails }) => {
  return (
    <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-800">Reply to Enquiry</h1>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {enquiryDetails?.enquiry?.enquiry_status || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600 mt-2">Update enquiry reply details</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2 text-sm">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span>{enquiryDetails?.enquiry?.enquiry_date || "N/A"}</span>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <FileText className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">
            Ref: {enquiryDetails?.enquiry?.enquiry_ref || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Shipping Details Card Component
const ShippingDetailsCard = ({ replyData, handleInputChange, RadioOption }) => {
  if (replyData.enquiry_status !== "Order Confirmed") {
    return null;
  }

  return (
    <Card className="mb-2">
      <div className="p-4 bg-yellow-50 cursor-pointer rounded-t-xl flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Truck className="h-5 w-5 " />
          Shipping Details
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cargo Dispatch
            </label>
            <Input
              type="date"
              value={replyData.cargo_dispatch}
              onChange={(e) => handleInputChange(e, "cargo_dispatch")}
              className={`border rounded-md p-2 ${
                replyData.cargo_dispatch ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Stuffing Date
            </label>
            <Input
              type="date"
              value={replyData.stuffing_date}
              onChange={(e) => handleInputChange(e, "stuffing_date")}
              className={`border rounded-md p-2 ${
                replyData.stuffing_date ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Final Product Sample BLR
            </label>
            <Input
              type="date"
              value={replyData.f_product_sample_blr}
              onChange={(e) => handleInputChange(e, "f_product_sample_blr")}
              className={`border rounded-md p-2 ${
                replyData.f_product_sample_blr ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
          <RadioOption
            label="Received BLR"
            value="received_blr"
            onChange={handleInputChange}
            currentValue={replyData.received_blr}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Final Product Sample SB
            </label>
            <Input
              type="date"
              value={replyData.f_product_sample_sb}
              onChange={(e) => handleInputChange(e, "f_product_sample_sb")}
              className={`border rounded-md p-2 ${
                replyData.f_product_sample_sb ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Report Date
            </label>
            <Input
              type="date"
              value={replyData.report_dt}
              onChange={(e) => handleInputChange(e, "report_dt")}
              className={`border rounded-md p-2 ${
                replyData.report_dt ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Shipment ETD
            </label>
            <Input
              type="date"
              value={replyData.shipment_etd}
              onChange={(e) => handleInputChange(e, "shipment_etd")}
              className={`border rounded-md p-2 ${
                replyData.shipment_etd ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Shipment ETA
            </label>
            <Input
              type="date"
              value={replyData.shipment_eta}
              onChange={(e) => handleInputChange(e, "shipment_eta")}
              className={`border rounded-md p-2 ${
                replyData.shipment_eta ? "bg-white" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EnquiryReplyEdit = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
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
              <CardContent>
                
              </CardContent>
            </Card>
          </Page>
        )
      }

  // Form state for reply-specific fields
  const [replyData, setReplyData] = useState({
    production_date: "",
    completion_date: "",
    uct_sample_bangalore: "",
    received: "No",
    ple_dispatch_customer: "",
    delivered: "No",
    customer_feedback: "",
    special_instruction: "",
    cargo_dispatch: "",
    stuffing_date: "",
    f_product_sample_blr: "",
    received_blr: "No",
    f_product_sample_sb: "",
    report_dt: "",
    shipment_etd: "",
    shipment_eta: "",
    enquiry_status: "",
    enquiry_data: [],
  });

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
        `https://adityaspice.com/app/public/api/panel-fetch-enquiry-by-id/${originalId}`,
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

  // Update Enquiry Mutation
  const updateEnquiryMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://adityaspice.com/app/public/api/panel-update-enquiry/${originalId}`,
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
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Enquiry reply updated successfully",
      });
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
  const [visibleColumns, setVisibleColumns] = useState([
    "enquirySub_product_name",
    "enquirySub_shu",
    "enquirySub_asta",
    "enquirySub_qlty_type",
    "enquirySub_course_type",
    "enquirySub_qnty",
    "enquirySub_quoted_price",
    "enquirySub_final_price",
    "enquirySub_p2b_blend",
  ]);

  const defaultTableHeaders = [
    { key: "enquirySub_product_name", label: "Product Name" },
    { key: "enquirySub_shu", label: "SHU (in K)" },
    { key: "enquirySub_asta", label: "ASTA" },
    { key: "enquirySub_qlty_type", label: "Quality Type" },
    { key: "enquirySub_course_type", label: "Course Type" },
    { key: "enquirySub_qnty", label: "Quantity (in MT)" },
    { key: "enquirySub_quoted_price", label: "Quoted Price" },
    { key: "enquirySub_final_price", label: "Final Price" },
    { key: "enquirySub_p2b_blend", label: "P2B Blend" },
  ];

  const optionalHeaders = [
    { key: "enquirySub_product_code", label: "Product Code" },
    { key: "enquirySub_stem_type", label: "Stem Type" },
    { key: "enquirySub_moist_value", label: "Moisture Value" },
  ];

  const [enquiryData, setEnquiryData] = useState([]);

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

  useEffect(() => {
    if (enquiryDetails) {
      // Extract product data
      const products = enquiryDetails.enquirySub.map((product) => ({
        id: product.id,
        enquirySub_product_name: product.enquirySub_product_name,
        enquirySub_product_code: product.enquirySub_product_code,
        enquirySub_shu: product.enquirySub_shu,
        enquirySub_asta: product.enquirySub_asta,
        enquirySub_qlty_type: product.enquirySub_qlty_type,
        enquirySub_stem_type: product.enquirySub_stem_type,
        enquirySub_course_type: product.enquirySub_course_type,
        enquirySub_moist_value: product.enquirySub_moist_value,
        enquirySub_qnty: product.enquirySub_qnty,
        enquirySub_quoted_price: product.enquirySub_quoted_price || "",
        enquirySub_final_price: product.enquirySub_final_price || "",
        enquirySub_p2b_blend: product.enquirySub_p2b_blend || "",
      }));

      // Set enquiryData and replyData
      setEnquiryData(products);
      setReplyData((prev) => ({
        ...prev,
        production_date: enquiryDetails.enquiry.production_date || "",
        completion_date: enquiryDetails.enquiry.completion_date || "",
        uct_sample_bangalore: enquiryDetails.enquiry.uct_sample_bangalore || "",
        received: enquiryDetails.enquiry.received || "No",
        ple_dispatch_customer:
          enquiryDetails.enquiry.ple_dispatch_customer || "",
        delivered: enquiryDetails.enquiry.delivered || "No",
        customer_feedback: enquiryDetails.enquiry.customer_feedback || "",
        special_instruction: enquiryDetails.enquiry.special_instruction || "",
        cargo_dispatch: enquiryDetails.enquiry.cargo_dispatch || "",
        stuffing_date: enquiryDetails.enquiry.stuffing_date || "",
        f_product_sample_blr: enquiryDetails.enquiry.f_product_sample_blr || "",
        received_blr: enquiryDetails.enquiry.received_blr || "No",
        f_product_sample_sb: enquiryDetails.enquiry.f_product_sample_sb || "",
        report_dt: enquiryDetails.enquiry.report_dt || "",
        shipment_etd: enquiryDetails.enquiry.shipment_etd || "",
        shipment_eta: enquiryDetails.enquiry.shipment_eta || "",
        enquiry_status: enquiryDetails.enquiry.enquiry_status || "",
        enquiry_data: products,
      }));
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

  const handleInputChange = (e, field) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setReplyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const RadioOption = ({ label, value, onChange, currentValue }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
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

    // Prepare the submission data with all required fields
    const submitData = {
      customer_id: enquiryDetails?.customer?.id,
      enquiry_date: enquiryDetails?.enquiry?.enquiry_date,
      packing_type: enquiryDetails?.enquiry?.packing_type,
      marking: enquiryDetails?.enquiry?.marking,
      shipment_date: enquiryDetails?.enquiry?.shipment_date,
      sample_required: enquiryDetails?.enquiry?.sample_required,
      production_date: replyData.production_date,
      completion_date: replyData.completion_date,
      uct_sample_bangalore: replyData.uct_sample_bangalore,
      received: replyData.received,
      ple_dispatch_customer: replyData.ple_dispatch_customer,
      delivered: replyData.delivered,
      customer_feedback: replyData.customer_feedback,
      special_instruction: replyData.special_instruction,
      treatment_required: enquiryDetails?.enquiry?.treatment_required,
      etd: enquiryDetails?.enquiry?.etd,
      gama_rediations: enquiryDetails?.enquiry?.gama_rediations,
      steam_sterlizaton: enquiryDetails?.enquiry?.steam_sterlizaton,
      cargo_dispatch: replyData.cargo_dispatch,
      stuffing_date: replyData.stuffing_date,
      f_product_sample_blr: replyData.f_product_sample_blr,
      received_blr: replyData.received_blr,
      f_product_sample_sb: replyData.f_product_sample_sb,
      report_dt: replyData.report_dt,
      shipment_etd: replyData.shipment_etd,
      shipment_eta: replyData.shipment_eta,
      enquiry_status: replyData.enquiry_status,
      enquiry_data: enquiryData.map((product) => ({
        id: product.id,
        enquirySub_product_name: product.enquirySub_product_name,
        enquirySub_product_code: product.enquirySub_product_code,
        enquirySub_shu: product.enquirySub_shu,
        enquirySub_asta: product.enquirySub_asta,
        enquirySub_qlty_type: product.enquirySub_qlty_type,
        enquirySub_stem_type: product.enquirySub_stem_type,
        enquirySub_course_type: product.enquirySub_course_type,
        enquirySub_moist_value: product.enquirySub_moist_value,
        enquirySub_qnty: product.enquirySub_qnty,
        enquirySub_quoted_price: product.enquirySub_quoted_price,
        enquirySub_final_price: product.enquirySub_final_price,
        enquirySub_p2b_blend: product.enquirySub_p2b_blend,
      })),
    };

    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    // Send the data to the server
    updateEnquiryMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Enquiry Data
          </Button>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <div className="p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Error Loading Enquiry
              </h2>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  // Original enquiry details in view mode
  const CompactViewSection = ({ enquiryDetails }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const InfoItem = ({ icon: Icon, label, value }) => (
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-yellow-600 shrink-0" />
        <span className="text-sm text-gray-600">{label}:</span>
        <span className="text-sm font-medium">{value || "N/A"}</span>
      </div>
    );

    const toggleView = () => {
      const content = contentRef.current;

      if (isExpanded) {
        // Folding animation
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          transformOrigin: "top",
          transformStyle: "preserve-3d",
          rotateX: -90,
          onComplete: () => setIsExpanded(false),
        });
      } else {
        // Unfolding animation
        setIsExpanded(true);
        gsap.fromTo(
          content,
          {
            height: 0,
            opacity: 0,
            rotateX: -90,
          },
          {
            height: "auto",
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut",
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            rotateX: 0,
          }
        );
      }
    };

    const TreatmentInfo = () =>
      enquiryDetails?.enquiry?.treatment_required === "Yes" && (
        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <InfoItem
              icon={Clock}
              label="ETD"
              value={enquiryDetails.enquiry.etd}
            />
            <InfoItem
              icon={TestTubes}
              label="Gama Radiations"
              value={enquiryDetails.enquiry.gama_rediations}
            />
            <InfoItem
              icon={TestTubes}
              label="Steam Sterilization"
              value={enquiryDetails.enquiry.steam_sterlizaton}
            />
          </div>
        </div>
      );

    return (
      <Card className="mb-2 overflow-hidden" ref={containerRef}>
        <div
          className="p-4 bg-yellow-50 cursor-pointer flex items-center justify-between"
          onClick={toggleView}
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {enquiryDetails?.customer?.customer_name} -
            <span className="text-sm uppercase">
              {enquiryDetails?.customer?.customer_country}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {enquiryDetails?.enquiry?.enquiry_status}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-yellow-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-yellow-600" />
            )}
          </div>
        </div>
        <div
          ref={contentRef}
          className="transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          <CardContent className="p-4">
            {/* Basic Info */}

            <div className="space-y-2 flex items-center justify-between">
              <InfoItem
                icon={FileText}
                label="Marking"
                value={enquiryDetails?.enquiry?.marking}
              />
              <InfoItem
                icon={Package}
                label="Packing Type"
                value={enquiryDetails?.enquiry?.packing_type}
              />

              <InfoItem
                icon={TestTubes}
                label="Sample Required"
                value={enquiryDetails?.enquiry?.sample_required}
              />
              <InfoItem
                icon={Truck}
                label="Treatment Required"
                value={enquiryDetails?.enquiry?.treatment_required}
              />
            </div>

            <TreatmentInfo />

            {/* Products Table */}
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <Page>
      <form onSubmit={handleSubmit} className="w-full p-4">
        <EnquiryHeader enquiryDetails={enquiryDetails} />

        {/* View Section */}
        <CompactViewSection enquiryDetails={enquiryDetails} />

        {/* Products Section */}
        <Card className="mb-2">
          <div className="p-4 bg-yellow-50 cursor-pointer rounded-t-xl flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <SquareChartGantt className="h-5 w-5 " />
              Product Details
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Customize Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
          <CardContent className="p-1">
            <div className="mb-2">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
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
                    </tr>
                  </thead>
                  <tbody>
                    {enquiryData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-gray-50">
                        {[...defaultTableHeaders, ...optionalHeaders]
                          .filter((header) =>
                            visibleColumns.includes(header.key)
                          )
                          .map((header) => (
                            <td key={header.key} className="p-2 border">
                              {header.key === "enquirySub_product_name" ? (
                                <>
                                  <Input
                                    value={row[header.key]}
                                    className="w-full border border-gray-300 cursor-not-allowed bg-white"
                                  />
                                </>
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
                                  disabled={[
                                    "enquirySub_shu",
                                    "enquirySub_asta",
                                    "enquirySub_qlty_type",
                                    "enquirySub_course_type",
                                    "enquirySub_qnty",
                                  ].includes(header.key)}
                                  className={`w-full border border-gray-300 bg-yellow-50 ${
                                    [
                                      "enquirySub_shu",
                                      "enquirySub_asta",
                                      "enquirySub_qlty_type",
                                      "enquirySub_course_type",
                                      "enquirySub_qnty",
                                    ].includes(header.key)
                                      ? "text-black font-bold bg-white cursor-not-allowed"
                                      : ""
                                  }`}
                                />
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Section */}
        <Card className="mb-2">
          <div className="p-4 bg-yellow-50 cursor-pointer flex items-center rounded-t-xl justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Repeat1 className="h-5 w-5" />
              Reply Details
            </h2>
          </div>
          <CardContent className="p-6">
            {/* Dates Section */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Production Date
                </label>
                <Input
                  type="date"
                  value={replyData.production_date}
                  onChange={(e) => handleInputChange(e, "production_date")}
                  className={`border rounded-md p-2 ${
                    replyData.production_date ? "bg-white" : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Completion Date
                </label>
                <Input
                  type="date"
                  value={replyData.completion_date}
                  onChange={(e) => handleInputChange(e, "completion_date")}
                  className={`border rounded-md p-2 ${
                    replyData.completion_date ? "bg-white" : "text-gray-400"
                  }`}
                />
              </div>

              {/* Sample Status Section */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  UCT Sample Bangalore
                </label>
                <Input
                  type="date"
                  value={replyData.uct_sample_bangalore}
                  onChange={(e) => handleInputChange(e, "uct_sample_bangalore")}
                  className={`border rounded-md p-2 ${
                    replyData.uct_sample_bangalore
                      ? "bg-white"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <RadioOption
                label="Sample Received"
                value="received"
                onChange={handleInputChange}
                currentValue={replyData.received}
              />
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sample Dispatch to Customer
                </label>
                <Input
                  type="date"
                  value={replyData.ple_dispatch_customer}
                  onChange={(e) =>
                    handleInputChange(e, "ple_dispatch_customer")
                  }
                  className={`border rounded-md p-2 ${
                    replyData.ple_dispatch_customer
                      ? "bg-white"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <RadioOption
                label="Delivered"
                value="delivered"
                onChange={handleInputChange}
                currentValue={replyData.delivered}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={replyData.enquiry_status}
                  onValueChange={(value) =>
                    handleInputChange({ target: { value } }, "enquiry_status")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Enquiry Received",
                      "New Enquiry",
                      "Order Cancel",
                      "Order Closed",
                      "Order Confirmed",
                      "Order Delivered",
                      "Order Progress",
                      "Order Shipped",
                      "Quotation",
                    ].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Delivery Section */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={replyData.special_instruction}
                  placeholder="Pls enter special instruction..."
                  onChange={(e) => handleInputChange(e, "special_instruction")}
                  className="border rounded-md p-2 w-full h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Feedback
                </label>
                <textarea
                  value={replyData.customer_feedback}
                  placeholder="Pls enter customer feedback..."
                  onChange={(e) => handleInputChange(e, "customer_feedback")}
                  className="border rounded-md p-2 w-full h-24 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <ShippingDetailsCard
          replyData={replyData}
          handleInputChange={handleInputChange}
          RadioOption={RadioOption}
        />

        {/* Submit Button */}
        <div className="flex flex-col items-end">
          {updateEnquiryMutation.isPending && <ProgressBar progress={70} />}
          <Button
            type="submit"
            className="bg-yellow-500 text-black hover:bg-yellow-400 flex items-center mt-2"
            disabled={updateEnquiryMutation.isPending}
          >
            {updateEnquiryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Reply"
            )}
          </Button>
        </div>
      </form>
    </Page>
  );
};

export default EnquiryReplyEdit;
