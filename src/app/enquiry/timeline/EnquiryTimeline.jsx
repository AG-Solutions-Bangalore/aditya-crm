import Page from "@/app/dashboard/page";
import { decryptId } from "@/utils/encyrption/Encyrption";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select, { components } from "react-select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Check,
  MessageCircle,
  Calendar,
  Package,
  Printer,
  Loader2,
  FileText,
  TestTubes,
  Clock,
  SquarePlus,
} from "lucide-react";

import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodayDate } from "@/utils/currentDate";
import BASE_URL from "@/config/BaseUrl";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const EnquiryTimeline = () => {
  const { id } = useParams();
  const originalId = decryptId(id);
  const userType = localStorage.getItem("userType");
  const queryClient = useQueryClient();
  const timelineContainerRef = useRef(null);

  const {
    data: enquiryDetails,
    isLoading,
    isError,
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
  const enquiryRefbyId = enquiryDetails?.enquiry?.enquiry_ref;
  const productCodeEnquiry = enquiryDetails?.enquirySub;

  const statusLabels = [
    { status_name: "Enquiry Received", color: "bg-blue-100 text-blue-800" },
    { status_name: "New Enquiry", color: "bg-green-100 text-green-800" },
    { status_name: "Order Cancel", color: "bg-red-100 text-red-800" },
    { status_name: "Order Closed", color: "bg-gray-100 text-gray-800" },
    { status_name: "Confirmed", color: "bg-teal-100 text-teal-800" },
    { status_name: "Order Delivered", color: "bg-purple-100 text-purple-800" },
    { status_name: "Order Progress", color: "bg-yellow-100 text-yellow-800" },
    { status_name: "Order Shipped", color: "bg-orange-100 text-orange-800" },
    { status_name: "Quotation", color: "bg-pink-100 text-pink-800" },
    { status_name: "Sample", color: "bg-indigo-100 text-indigo-800" },
    { status_name: "Update", color: "bg-pink-100 text-pink-800" },
  ];

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

  //   const [timelineData, setTimelineData] = useState({
  //     enquiry: {
  //       id: 1,
  //       enquiry_ref: "AAE-HGMPL-1",
  //       enquiry_status: "New Enquiry", // whenever the status will change here it reflecte and also add the comment
  //       created_by: "ace",
  //       updated_by: "aditya",
  //       timeline: [
  //         {
  //           id: 1,
  //           type: "status_change", // this is the first comment show
  //           status: "Order Cancel",
  //           created_by: "ace",
  //           created_at: "2025-01-13T06:20:30.000000Z",
  //         },
  //         {
  //           id: 2,
  //           type: "comment",
  //           comment: "Initial discussion completed.",
  //           status_label: "New Enquiry",
  //           created_by: "aditya",
  //           created_at: "2025-01-14T10:30:00.000000Z",
  //           acknowledged: false,
  //         },

  //         {
  //           id: 4,
  //           type: "sample_sent",
  //           sent_via: "Bus",
  //           date: "2025-01-18",
  //           description: "Sample sent via bus.",
  //           created_by: "ace",
  //           created_at: "2025-01-18T09:00:00.000000Z",
  //           acknowledged: false,
  //         },
  //       ],
  //     },
  //   });

  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    isError: isTimelineError,
  } = useQuery({
    queryKey: ["enquiryTimeline", enquiryRefbyId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-fetch-enquiry-timeline-by-id/${enquiryRefbyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch timeline data");
      return response.json();
    },
    enabled: !!enquiryRefbyId,
  });

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
      queryClient.invalidateQueries(["enquiryTimeline", id]);
    },
  });

  //   for update the acknowledgedment api

  const updateAcknowledgment = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
       `${BASE_URL}/api/panel-update-enquiry-timeline/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ acknowledged: true }),
      }
    );

    if (!response.ok) throw new Error("Failed to update acknowledgment");
    return response.json();
  };

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState(getTodayDate);
  const [sampleSentDescription, setSampleSentDescription] = useState("");
  const [selectedProductCodes, setSelectedProductCodes] = useState([]);
  const [sampleSentQuantity, setSampleSentQuantity] = useState("");
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);
  const [isProductTableDialogOpen, setProductTableDialogOpen] = useState(false);

  const currentUser = localStorage.getItem("username") || "ace";

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        enquiry_ref: timelineData.enquiry.enquiry_ref,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        acknowledged: "false",
      };

      addTimelineEvent(newTimelineItem, {
        onSuccess: () => {
          setNewComment("");
          setNewStatusLabel("");
          setCommentDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error adding comment:", error);
        },
      });
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate) {
      const selectedProductCodesString = selectedProductCodes
        .map((p) => p.value)
        .join(",");
      const sentViaText =
        userType == "1"
          ? `sample to banglore via ${sampleSentVia}`
          : userType == "2"
          ? `sample to customer via ${sampleSentVia}`
          : `sample via ${sampleSentVia}`;
      const newTimelineItem = {
        enquiry_ref: timelineData.enquiry.enquiry_ref,
        type: "sample_sent",
        sent_via: sentViaText,
        date: sampleSentDate,
        description: sampleSentDescription,
        sent_product_code: selectedProductCodesString,
        sent_product_quantity: sampleSentQuantity,
        acknowledged: "false",
      };

      addTimelineEvent(newTimelineItem, {
        onSuccess: () => {
          setSampleSentVia("");
          setSampleSentDate("");
          setSampleSentDescription("");
          setSelectedProductCodes([]);
          setSampleSentQuantity("");
          setSampleSentDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error adding sample sent event:", error);
        },
      });
    }
  };
  useEffect(() => {
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollTo({
        top: timelineContainerRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [timelineData]);

  //   const handleAcknowledge = (id) => {
  //     setTimelineData((prev) => ({
  //       ...prev,
  //       enquiry: {
  //         ...prev.enquiry,
  //         timeline: prev.enquiry.timeline.map((item) =>
  //           item.id === id ? { ...item, acknowledged: true } : item
  //         ),
  //       },
  //     }));
  //   };

  //   const handleAcknowledge = async (id) => {
  //     try {

  //       await updateAcknowledgment(id);

  //       queryClient.setQueryData(["enquiryTimeline", enquiryRefbyId], (oldData) => {
  //         return {
  //           ...oldData,
  //           timeline: oldData.timeline.map((item) =>
  //             item.id === id ? { ...item, acknowledged: true } : item
  //           ),
  //         };
  //       });
  //     } catch (error) {
  //       console.error("Error acknowledging timeline event:", error);
  //     }
  //   };

  const handleAcknowledge = async (id) => {
    try {
      await updateAcknowledgment(id);
      queryClient.invalidateQueries(["enquiryTimeline", enquiryRefbyId]);
    } catch (error) {
      console.error("Error acknowledging timeline event:", error);
    }
  };

  const customer_timeline = timelineData?.enquiry?.customer_name;

  const ProductsTable = ({ products }) => {
    const optionalHeaders = [
      { key: "enquirySub_product_code", label: "Product Code" },
      { key: "enquirySub_stem_type", label: "Stem Type" },
      { key: "enquirySub_moist_value", label: "Moisture Value" },
      { key: "enquirySub_final_price", label: "Final Price" },
      { key: "enquirySub_p2b_blend", label: "P2B Blend" },
      { key: "enquirySub_remarks", label: "Remarks" },
    ];

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-yellow-500">
              <th className="p-2 text-left border border-gray-200 font-medium text-black">
                Product Name
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                SHU
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                ASTA
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                Quality Type
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                Coarse Type
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                Quantity
              </th>
              <th className="p-2 text-center border border-gray-200 font-medium text-black">
                Quoted Price
              </th>
              {optionalHeaders.map(
                (header) =>
                  products?.some((product) => product[header.key]) && (
                    <th
                      key={header.key}
                      className="p-2 text-center border border-gray-200 font-medium text-black"
                    >
                      {header.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {products?.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200">
                  {product.enquirySub_product_name}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_shu}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_asta}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_qlty_type}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_course_type}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_qnty}
                </td>
                <td className="p-2 text-center border border-gray-200">
                  {product.enquirySub_quoted_price}
                </td>
                {optionalHeaders.map(
                  (header) =>
                    products?.some((p) => p[header.key]) && (
                      <td
                        key={header.key}
                        className="p-2 border text-center border-gray-200"
                      >
                        {product[header.key]}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Page>
      <div className="flex gap-2 min-h-screen flex-col lg:flex-row">
        <Card className=" w-full lg:w-[50%] flex flex-col h-[40rem] ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Timeline for Enquiry: {timelineData?.enquiry?.enquiry_ref}
              </CardTitle>
              <div className="flex space-x-2">
                {/* Comment Popover */}
                <Popover
                  open={isCommentDialogOpen}
                  onOpenChange={setCommentDialogOpen}
                >
                  <PopoverTrigger asChild>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-200">
                      <SquarePlus className="h-4 w-4" /> Comment
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Add Comment</h3>
                      <textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        className="w-full p-1 border border-gray-300 rounded-sm "
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full">
                            {newStatusLabel || "Select Status Label"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusLabels.map((status) => (
                            <DropdownMenuItem
                              key={status.status_name}
                              onSelect={() =>
                                setNewStatusLabel(status.status_name)
                              }
                            >
                              {status.status_name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        className="bg-yellow-500 text-black hover:bg-yellow-200"
                        onClick={handleAddComment}
                      >
                        Submit
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={isSampleSentDialogOpen}
                  onOpenChange={setSampleSentDialogOpen}
                >
                  <PopoverTrigger asChild>
                    <Button className="bg-yellow-500 text-black hover:bg-yellow-200">
                      <SquarePlus className="h-4 w-4" /> Sample
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {userType == "1"
                          ? "Sample Sent to Bangalore"
                          : userType == "2"
                          ? "Add Sample Sent to Customer"
                          : "Create Sample"}
                      </h3>
                      <Input
                        placeholder="Sent via (e.g., Bus, Train)..."
                        value={sampleSentVia}
                        onChange={(e) => setSampleSentVia(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={sampleSentDate}
                        onChange={(e) => setSampleSentDate(e.target.value)}
                      />

                      <Select
                        isMulti
                        value={selectedProductCodes}
                        onChange={setSelectedProductCodes}
                        options={productCodeEnquiry?.map((p_code) => ({
                          value: p_code.enquirySub_product_code,
                          label: p_code.enquirySub_product_code,
                        }))}
                        placeholder="Select product"
                        components={{ Option }}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        backspaceRemovesValue={false}
                        isSearchable
                      />
                      <Input
                        placeholder="Quantity/Weight"
                        value={sampleSentQuantity}
                        onChange={(e) => setSampleSentQuantity(e.target.value)}
                      />
                      <textarea
                        placeholder="Description..."
                        value={sampleSentDescription}
                        className="w-full p-1 border border-gray-300 rounded-sm "
                        onChange={(e) =>
                          setSampleSentDescription(e.target.value)
                        }
                      />
                      <Button
                        className="bg-yellow-500 text-black hover:bg-yellow-200"
                        onClick={handleAddSampleSent}
                      >
                        Submit
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent
            ref={timelineContainerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="space-y-4">
              {isTimelineLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Button disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Timeline Data
                  </Button>
                </div>
              ) : isTimelineError ? (
                <div className="p-4">
                  <Card className="w-full max-w-md mx-auto">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-red-600 mb-4">
                        Error Loading Timeline
                      </h2>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="border-l-2 border-yellow-400 pl-4 space-y-2 ">
                  {timelineData?.timeline.map((item) => {
                    const statusColor = statusLabels.find(
                      (status) => status.status_name == item.status_label
                    )?.color;

                    return (
                      <div
                        key={item.id}
                        className={`relative border-l-2 pl-6 ${
                          item.created_by == currentUser
                            ? "border-red-200"
                            : "border-blue-200"
                        }`}
                      >
                        <div
                          className={`absolute -left-2.5 top-0 h-5 w-5 rounded-full ${
                            item.created_by == currentUser
                              ? "bg-red-200"
                              : "bg-blue-200"
                          }`}
                        ></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {item.type === "status_change" ? (
                              ` ${item.status} received from ${customer_timeline}`
                            ) : item.type === "comment" ? (
                              `${item.created_by} commented: ${item.comment} `
                            ) : item.type === "sample_sent" ? (
                              <>
                                <div>{`${item.created_by} sent ${item.sent_via} on ${item.date}`}</div>
                                {/* <div className="mt-2">
                                    {item.sent_product_code && (
                                      <table className="w-full border-collapse border border-gray-200">
                                        <thead>
                                          <tr className="bg-gray-100 ">
                                            <th className="p-2 border border-gray-200 text-left">
                                              Product Code
                                            </th>
                                            <th className="p-2 border border-gray-200 text-left">
                                              Quantity
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {item.sent_product_code
                                            .split(",")
                                            .map((code, index) => (
                                              <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                              >
                                                <td className="p-2 border border-gray-200">
                                                  {code.trim()}
                                                </td>
                                                <td className="p-2 border border-gray-200">
                                                  {item.sent_product_quantity
                                                    .split(",")
                                                    [index]?.trim()}
                                                </td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div> */}
                                {item.sent_product_code && (
                                  <div className="mt-2 text-xs">{`Products: ${item.sent_product_code}`}</div>
                                )}
                                {item.sent_product_quantity && (
                                  <div className="mt-2 text-xs">{`Quantity: ${item.sent_product_quantity}`}</div>
                                )}
                                {item.description && (
                                  <div className="mt-2 text-xs">{`Description: ${item.description}`}</div>
                                )}
                              </>
                            ) : item.type === "status_changed" ? (
                              `Enquiry status has been changed by ${item.created_by}`
                            ) : item.type === "product_sBanglore" ? (
                              `Product sample dispatch to Banglore on ${item.date}`
                            ) : item.type === "sample_dispatch" ? (
                              `Sample dispatch to customer on ${item.date}`
                            ) : item.type === "cargo" ? (
                              `Cargo dispatch to port on ${item.date}`
                            ) : item.type === "stuffing" ? (
                              `Stuffing done on ${item.date}`
                            ) : (
                              ""
                            )}
                          </p>
                          {item.status_label && (
                            <span
                              className={`px-2 py-1 rounded text-xs ${statusColor}`}
                            >
                              {item.status_label}
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                          {item.type !== "status_change" &&
                            item.type !== "status_changed" &&
                            item.type !== "product_sBanglore" &&
                            item.type !== "sample_dispatch" &&
                            item.type !== "cargo" &&
                            item.type !== "stuffing" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAcknowledge(item.id)}
                                disabled={item.acknowledged === "true"}
                              >
                                {item.acknowledged === "true" ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  "Acknowledge"
                                )}
                              </Button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className=" w-full lg:w-[50%] flex flex-col h-[40rem] ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Timeline View</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Button disabled>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading Enquiry Data
                </Button>
              </div>
            ) : isError ? (
              <div className="p-4">
                <Card className="w-full max-w-md mx-auto">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                      Error Loading Enquiry
                    </h2>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="">
                <div className="flex sticky top-0 z-10 border border-gray-200 rounded-lg justify-between items-start gap-8 mb-2 bg-white p-4 shadow-sm">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl  font-bold text-gray-800 flex items-center gap-2">
                          <span>
                            {enquiryDetails?.customer?.customer_name || "N/A"}
                          </span>
                        </h1>
                      </div>
                      {/* <div className="flex flex-row items-center gap-5">
                        <div className="flex  gap-2 text-sm">
                          <FileText className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            Ref: {enquiryDetails?.enquiry?.enquiry_ref || "N/A"}
                          </span>
                        </div>
                        <div className="flex  gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {enquiryDetails?.enquiry?.enquiry_date || "N/A"}
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {enquiryDetails?.enquiry?.enquiry_status || "-"}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {enquiryDetails?.customer?.customer_country || "-"}
                      </span>
                    </div>
                    {/* <div className="flex items-center justify-end gap-2 text-sm">
                     
                    </div> */}
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        <div className="flex justify-between items-center">
                          <span>Basic Information </span>
                          <div className="flex items-center gap-2 justify-end">
                            <div className="flex  gap-2 text-sm">
                              <FileText className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">
                                Ref:{" "}
                                {enquiryDetails?.enquiry?.enquiry_ref || "N/A"}
                              </span>
                            </div>
                            <div className="flex  gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">
                                {enquiryDetails?.enquiry?.enquiry_date || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {" "}
                        {/* Changed to grid-cols-2 */}
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Package className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Packing Type:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.packing_type || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <FileText className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Marking:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.marking || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <TestTubes className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Sample Required:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.sample_required || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Production Date:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.production_date || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <Clock className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Completion Date:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.completion_date || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <TestTubes className="h-4 w-4 text-yellow-600 shrink-0" />
                          <span className="text-xs text-gray-600">
                            Treatment Required:
                          </span>
                          <span className="text-sm font-bold">
                            {enquiryDetails?.enquiry?.treatment_required || "-"}
                          </span>
                        </div>
                        {enquiryDetails?.enquiry?.treatment_required ===
                          "Yes" && (
                          <>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Clock className="h-4 w-4 text-yellow-600 shrink-0" />
                              <span className="text-xs text-gray-600">
                                ETD:
                              </span>
                              <span className="text-sm font-bold">
                                {enquiryDetails?.enquiry?.etd || "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <TestTubes className="h-4 w-4 text-yellow-600 shrink-0" />
                              <span className="text-xs text-gray-600">
                                Gama Radiations:
                              </span>
                              <span className="text-sm font-bold">
                                {enquiryDetails?.enquiry?.gama_rediations ||
                                  "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <TestTubes className="h-4 w-4 text-yellow-600 shrink-0" />
                              <span className="text-xs text-gray-600">
                                Steam Sterilization:
                              </span>
                              <span className="text-sm font-bold">
                                {enquiryDetails?.enquiry?.steam_sterlizaton ||
                                  "-"}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="col-span-2">
                          {" "}
                          {/* Span across 2 columns */}
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <FileText className="h-4 w-4 text-yellow-600 shrink-0" />
                            <span className="text-xs text-gray-600">
                              Special Instruction:
                            </span>
                            <span className="text-sm font-bold">
                              {enquiryDetails?.enquiry?.special_instruction ||
                                "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Button
              className="w-full mt-2 bg-yellow-500 text-black hover:bg-yellow-200"
              onClick={() => setProductTableDialogOpen(true)}
            >
              See Product Table
            </Button>
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={isProductTableDialogOpen}
        onOpenChange={setProductTableDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Table</DialogTitle>
          </DialogHeader>
          <ProductsTable products={enquiryDetails?.enquirySub} />
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default EnquiryTimeline;
