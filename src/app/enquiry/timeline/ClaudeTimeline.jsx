import Page from "@/app/dashboard/page";
import { decryptId } from "@/utils/encyrption/Encyrption";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import { Chrono } from "react-chrono";
import BASE_URL from "@/config/BaseUrl";

const ClaudeTimeline = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: enquiryDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["enquiry", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
         `${BASE_URL}/api/panel-fetch-enquiry-by-id/${id}`,
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

  const statusLabels = [
    { status_name: "Enquiry Received", color: "bg-blue-100 text-blue-800" },
    { status_name: "New Enquiry", color: "bg-green-100 text-green-800" },
    { status_name: "Order Cancel", color: "bg-red-100 text-red-800" },
    { status_name: "Order Closed", color: "bg-gray-100 text-gray-800" },
    { status_name: "Order Confirmed", color: "bg-teal-100 text-teal-800" },
    { status_name: "Order Delivered", color: "bg-purple-100 text-purple-800" },
    { status_name: "Order Progress", color: "bg-yellow-100 text-yellow-800" },
    { status_name: "Order Shipped", color: "bg-orange-100 text-orange-800" },
    { status_name: "Quotation", color: "bg-pink-100 text-pink-800" },
    { status_name: "Sample", color: "bg-indigo-100 text-indigo-800" },
  ];

  if (!id) {
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
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);

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
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        enquiry_ref: timelineData.enquiry.enquiry_ref,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        acknowledged: "false",
      };

      addTimelineEvent(newTimelineItem, {
        onSuccess: () => {
          setSampleSentVia("");
          setSampleSentDate("");
          setSampleSentDescription("");
          setSampleSentDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error adding sample sent event:", error);
        },
      });
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await updateAcknowledgment(id);
      queryClient.invalidateQueries(["enquiryTimeline", enquiryRefbyId]);
    } catch (error) {
      console.error("Error acknowledging timeline event:", error);
    }
  };

  
  const timelineItems = timelineData?.timeline.map((item) => ({
    title: new Date(item.created_at).toLocaleString(),
    cardTitle: item.type,
    cardSubtitle: item.created_by,
    cardDetailedText:
      item.type === "comment"
        ? `${item.comment} (${item.status_label})`
        : item.type === "sample_sent"
        ? `Sent via ${item.sent_via} on ${item.date} - ${item.description}`
        : `Status changed to ${item.status}`,
  }));

  return (
    <Page>
      <div className="flex gap-2 min-h-screen flex-col lg:flex-row">
        <Card className="w-full flex flex-col h-[40rem]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Timeline for Enquiry: {timelineData?.enquiry?.enquiry_ref}
              </CardTitle>
              <div className="flex space-x-2">
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
                        className="w-full"
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
                      <h3 className="text-lg font-semibold">Add Sample Sent</h3>
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
                      <textarea
                        placeholder="Description..."
                        value={sampleSentDescription}
                        className="w-full"
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
          <CardContent className="flex-1 overflow-y-auto">
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
                <Chrono
                  items={timelineItems}
                  mode="VERTICAL_ALTERNATING"
                  theme={{
                    primary: "red",
                    secondary: "gray",
                    cardBgColor: "white",
                    titleColor: "black",
                    titleColorActive: "yellow",
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default ClaudeTimeline;