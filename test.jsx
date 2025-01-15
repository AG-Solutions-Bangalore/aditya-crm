import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check, MessageCircle, Calendar, Truck, Package } from "lucide-react";

const TimelinePage = () => {
  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry",
      created_by: "ace",
      updated_by: "user2",
      timeline: [
        {
          id: 1,
          type: "status_change",
          status: "New Enquiry",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "Discussion",
          created_by: "user2",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },
        {
          id: 3,
          type: "date_event",
          event: "Completion Date",
          date: "2025-01-20",
          description: "Production completed.",
          created_by: "ace",
          created_at: "2025-01-15T12:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "user2",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const currentUser = localStorage.getItem("username") || "ace";

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
    }
  };

  const handleAddDateEvent = () => {
    if (selectedEvent && eventDate && eventDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "date_event",
        event: selectedEvent,
        date: eventDate,
        description: eventDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSelectedEvent("");
      setEventDate("");
      setEventDescription("");
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Display */}
          <div className="border-l-2 border-gray-200 pl-4 space-y-4">
            {timelineData.enquiry.timeline.map((item) => (
              <div
                key={item.id}
                className={`relative pl-6 ${
                  item.created_by === currentUser ? "border-blue-500" : "border-red-500"
                }`}
              >
                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-gray-200"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {item.type === "status_change"
                      ? `Status changed to ${item.status} by ${item.created_by}`
                      : item.type === "comment"
                      ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                      : item.type === "date_event"
                      ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                      : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  {item.type !== "status_change" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAcknowledge(item.id)}
                      disabled={item.acknowledged}
                    >
                      {item.acknowledged ? <Check className="h-4 w-4" /> : "Acknowledge"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="space-y-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Input
              placeholder="Status label..."
              value={newStatusLabel}
              onChange={(e) => setNewStatusLabel(e.target.value)}
            />
            <Button onClick={handleAddComment}>
              <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
            </Button>
          </div>

          {/* Add Date Event */}
          <div className="space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Select Event
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSelectedEvent("Completion Date")}>
                  Completion Date
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedEvent("Production Date")}>
                  Production Date
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedEvent("Cargo Dispatch")}>
                  Cargo Dispatch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <Input
              placeholder="Description..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <Button onClick={handleAddDateEvent}>
              <Calendar className="mr-2 h-4 w-4" /> Add Date Event
            </Button>
          </div>

          {/* Add Sample Sent */}
          <div className="space-y-2">
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
            <Input
              placeholder="Description..."
              value={sampleSentDescription}
              onChange={(e) => setSampleSentDescription(e.target.value)}
            />
            <Button onClick={handleAddSampleSent}>
              <Package className="mr-2 h-4 w-4" /> Add Sample Sent
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelinePage;


// 2nd code from deepseek 


// all the button from top 

import Page from "@/app/dashboard/page";
import { decryptId } from "@/utils/encyrption/Encyrption";
import React, { useState } from "react";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, MessageCircle, Calendar, Truck, Package } from "lucide-react";
import { useParams } from "react-router-dom";

const EnquiryTimeline = () => {
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

  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry",
      created_by: "ace",
      updated_by: "Aditya",
      timeline: [
        {
          id: 1,
          type: "status_change",
          status: "New Enquiry",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "Discussion",
          created_by: "Aditya",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },
        {
          id: 3,
          type: "date_event",
          event: "Completion Date",
          date: "2025-01-20",
          description: "Production completed.",
          created_by: "ace",
          created_at: "2025-01-15T12:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "Aditya",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const currentUser = localStorage.getItem("username") || "ace";

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
    }
  };

  const handleAddDateEvent = () => {
    if (selectedEvent && eventDate && eventDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "date_event",
        event: selectedEvent,
        date: eventDate,
        description: eventDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSelectedEvent("");
      setEventDate("");
      setEventDescription("");
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Page>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}</CardTitle>
            <div className="flex space-x-2">
              {/* Add Comment Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Input
                    placeholder="Status label..."
                    value={newStatusLabel}
                    onChange={(e) => setNewStatusLabel(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Date Event Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" /> Add Date Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Date Event</DialogTitle>
                  </DialogHeader>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" /> Select Event
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setSelectedEvent("Completion Date")}>
                        Completion Date
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedEvent("Production Date")}>
                        Production Date
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setSelectedEvent("Cargo Dispatch")}>
                        Cargo Dispatch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <Input
                    placeholder="Description..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                  <Button onClick={handleAddDateEvent}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Sample Sent Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Add Sample Sent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sample Sent</DialogTitle>
                  </DialogHeader>
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
                  <Input
                    placeholder="Description..."
                    value={sampleSentDescription}
                    onChange={(e) => setSampleSentDescription(e.target.value)}
                  />
                  <Button onClick={handleAddSampleSent}>Submit</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Display */}
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {timelineData.enquiry.timeline.map((item) => (
                <div
                  key={item.id}
                  className={`relative pl-6 ${
                    item.created_by === currentUser ? "border-blue-500" : "border-red-500"
                  }`}
                >
                  <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-gray-200"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {item.type === "status_change"
                        ? `Status changed to ${item.status} by ${item.created_by}`
                        : item.type === "comment"
                        ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                        : item.type === "date_event"
                        ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                        : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    {item.type !== "status_change" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAcknowledge(item.id)}
                        disabled={item.acknowledged}
                      >
                        {item.acknowledged ? <Check className="h-4 w-4" /> : "Acknowledge"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EnquiryTimeline;



// nd on time label make like label  with diffrent color for diffrent label give me full code and for who created that vertical line show blue and those created by othe give verticla line red give me full code


import Page from "@/app/dashboard/page";
import { decryptId } from "@/utils/encyrption/Encyrption";
import React, { useState } from "react";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageCircle, Calendar, Package } from "lucide-react";
import { useParams } from "react-router-dom";

const EnquiryTimeline = () => {
  const { id } = useParams();
  const originalId = decryptId(id);

  // Status labels and their colors
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

  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry",
      created_by: "ace",
      updated_by: "Aditya",
      timeline: [
        {
          id: 1,
          type: "status_change",
          status: "New Enquiry",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "New Enquiry",
          created_by: "Aditya",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },
        {
          id: 3,
          type: "date_event",
          event: "Completion Date",
          date: "2025-01-20",
          description: "Production completed.",
          created_by: "ace",
          created_at: "2025-01-15T12:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "Aditya",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isDateEventDialogOpen, setDateEventDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);

  const currentUser = localStorage.getItem("username") || "ace";

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
      setCommentDialogOpen(false); // Close the dialog
    }
  };

  const handleAddDateEvent = () => {
    if (selectedEvent && eventDate && eventDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "date_event",
        event: selectedEvent,
        date: eventDate,
        description: eventDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSelectedEvent("");
      setEventDate("");
      setEventDescription("");
      setDateEventDialogOpen(false); // Close the dialog
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
      setSampleSentDialogOpen(false); // Close the dialog
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Page>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}</CardTitle>
            <div className="flex space-x-2">
              {/* Add Comment Dialog */}
              <Dialog open={isCommentDialogOpen} onOpenChange={setCommentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
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
                          onSelect={() => setNewStatusLabel(status.status_name)}
                        >
                          {status.status_name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddComment}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Date Event Dialog */}
              <Dialog open={isDateEventDialogOpen} onOpenChange={setDateEventDialogOpen}>
  <DialogTrigger asChild>
    <Button>
      <Calendar className="mr-2 h-4 w-4" /> Add Date Event
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Date Event</DialogTitle>
    </DialogHeader>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          {selectedEvent || "Select Event"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setSelectedEvent("Completion Date")}>
          Completion Date
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedEvent("Production Date")}>
          Production Date
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedEvent("Cargo Dispatch")}>
          Cargo Dispatch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Input
      type="date"
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
    />
    <Input
      placeholder="Description..."
      value={eventDescription}
      onChange={(e) => setEventDescription(e.target.value)}
    />
    <Button onClick={handleAddDateEvent}>Submit</Button>
  </DialogContent>
</Dialog>

              {/* Add Sample Sent Dialog */}
              <Dialog open={isSampleSentDialogOpen} onOpenChange={setSampleSentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Add Sample Sent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sample Sent</DialogTitle>
                  </DialogHeader>
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
                  <Input
                    placeholder="Description..."
                    value={sampleSentDescription}
                    onChange={(e) => setSampleSentDescription(e.target.value)}
                  />
                  <Button onClick={handleAddSampleSent}>Submit</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Display */}
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {timelineData.enquiry.timeline.map((item) => {
                const statusColor = statusLabels.find(
                  (status) => status.status_name === item.status_label
                )?.color;

                return (
                  <div
                    key={item.id}
                    className={`relative pl-6 ${
                      item.created_by === currentUser ? "border-blue-500" : "border-red-500"
                    }`}
                  >
                    <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-gray-200"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {item.type === "status_change"
                          ? `Status changed to ${item.status} by ${item.created_by}`
                          : item.type === "comment"
                          ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                          : item.type === "date_event"
                          ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                          : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
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
                      {item.type !== "status_change" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(item.id)}
                          disabled={item.acknowledged}
                        >
                          {item.acknowledged ? <Check className="h-4 w-4" /> : "Acknowledge"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EnquiryTimeline;


// Automating Timeline on Enquiry Status Change

import Page from "@/app/dashboard/page";
import { decryptId } from "@/utils/encyrption/Encyrption";
import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageCircle, Calendar, Package } from "lucide-react";
import { useParams } from "react-router-dom";

const EnquiryTimeline = () => {
  const { id } = useParams();
  const originalId = decryptId(id);

  // Status labels and their colors
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

  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry",  // whenever the status will change here it reflecte and also add the comment 
      created_by: "ace",
      updated_by: "Aditya",
      timeline: [
        {
          id: 1,
          type: "status_change",   // this is the first comment show 
          status: "Order Cancel",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "New Enquiry",
          created_by: "Aditya",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },
        {
          id: 3,
          type: "date_event",
          event: "Completion Date",
          date: "2025-01-20",
          description: "Production completed.",
          created_by: "ace",
          created_at: "2025-01-15T12:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "Aditya",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isDateEventDialogOpen, setDateEventDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);

  const currentUser = localStorage.getItem("username") || "ace";

    // Track changes to enquiry_status
    useEffect(() => {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "status_change",
        status: timelineData.enquiry.enquiry_status,
        created_by: currentUser,
        created_at: new Date().toISOString(),
      };
  
      // Add the new timeline item if the status has changed
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
    }, [timelineData.enquiry.enquiry_status]); // Trigger when enquiry_status changes

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
      setCommentDialogOpen(false); // Close the dialog
    }
  };

  const handleAddDateEvent = () => {
    if (selectedEvent && eventDate && eventDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "date_event",
        event: selectedEvent,
        date: eventDate,
        description: eventDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSelectedEvent("");
      setEventDate("");
      setEventDescription("");
      setDateEventDialogOpen(false); // Close the dialog
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
      setSampleSentDialogOpen(false); // Close the dialog
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Page>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}
            </CardTitle>
            <div className="flex space-x-2">
              {/* Add Comment Dialog */}
              <Dialog
                open={isCommentDialogOpen}
                onOpenChange={setCommentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
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
                          onSelect={() => setNewStatusLabel(status.status_name)}
                        >
                          {status.status_name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddComment}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Date Event Dialog */}
              <Dialog
                open={isDateEventDialogOpen}
                onOpenChange={setDateEventDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" /> Add Date Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Date Event</DialogTitle>
                  </DialogHeader>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {selectedEvent || "Select Event"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Completion Date")}
                      >
                        Completion Date
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Production Date")}
                      >
                        Production Date
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Cargo Dispatch")}
                      >
                        Cargo Dispatch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <Input
                    placeholder="Description..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                  <Button onClick={handleAddDateEvent}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Sample Sent Dialog */}
              <Dialog
                open={isSampleSentDialogOpen}
                onOpenChange={setSampleSentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Add Sample Sent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sample Sent</DialogTitle>
                  </DialogHeader>
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
                  <Input
                    placeholder="Description..."
                    value={sampleSentDescription}
                    onChange={(e) => setSampleSentDescription(e.target.value)}
                  />
                  <Button onClick={handleAddSampleSent}>Submit</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Display */}
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {timelineData.enquiry.timeline.map((item) => {
                const statusColor = statusLabels.find(
                  (status) => status.status_name === item.status_label
                )?.color;

                return (
                  <div
                    key={item.id}
                    className={`relative pl-6 ${
                      item.created_by === currentUser
                        ? "border-blue-500"
                        : "border-red-500"
                    }`}
                  >
                    <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-gray-200"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {item.type === "status_change"
                          ? `Status changed to ${item.status} by ${item.created_by}`
                          : item.type === "comment"
                          ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                          : item.type === "date_event"
                          ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                          : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
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
                      {item.type !== "status_change" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(item.id)}
                          disabled={item.acknowledged}
                        >
                          {item.acknowledged ? (
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
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EnquiryTimeline;


// befor final code 

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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageCircle, Calendar, Package } from "lucide-react";
import { useParams } from "react-router-dom";

const EnquiryTimeline = () => {
  const { id } = useParams();
  const originalId = decryptId(id);

  // Status labels and their colors
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

  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry",  // whenever the status will change here it reflecte and also add the comment 
      created_by: "ace",
      updated_by: "aditya",
      timeline: [
        {
          id: 1,
          type: "status_change",   // this is the first comment show 
          status: "Order Cancel",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "New Enquiry",
          created_by: "aditya",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },
        {
          id: 3,
          type: "date_event",
          event: "Completion Date",
          date: "2025-01-20",
          description: "Production completed.",
          created_by: "ace",
          created_at: "2025-01-15T12:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "ace",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 5,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via train.",
          created_by: "ace",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isDateEventDialogOpen, setDateEventDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);
  const lastEnquiryStatusRef = useRef(null);
  const currentUser = localStorage.getItem("username") || "ace";
  const enquiryStatus = timelineData.enquiry.enquiry_status;
  console.log("::::",enquiryStatus)
    // Track changes to enquiry_status
    useEffect(() => {
        if (lastEnquiryStatusRef.current !== timelineData.enquiry.enquiry_status) {
            lastEnquiryStatusRef.current = timelineData.enquiry.enquiry_status;
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length +1,
        type: "status_change",
        status: enquiryStatus,
        created_by: currentUser,
        created_at: new Date().toISOString(),
      };
  
      
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
    }
    }, [enquiryStatus]); 

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
      setCommentDialogOpen(false); 
    }
  };

  const handleAddDateEvent = () => {
    if (selectedEvent && eventDate && eventDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "date_event",
        event: selectedEvent,
        date: eventDate,
        description: eventDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSelectedEvent("");
      setEventDate("");
      setEventDescription("");
      setDateEventDialogOpen(false); 
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
      setSampleSentDialogOpen(false); 
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Page>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}
            </CardTitle>
            <div className="flex space-x-2">
         
              <Dialog
                open={isCommentDialogOpen}
                onOpenChange={setCommentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
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
                          onSelect={() => setNewStatusLabel(status.status_name)}
                        >
                          {status.status_name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddComment}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Date Event Dialog */}
              <Dialog
                open={isDateEventDialogOpen}
                onOpenChange={setDateEventDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" /> Add Date Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Date Event</DialogTitle>
                  </DialogHeader>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {selectedEvent || "Select Event"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Completion Date")}
                      >
                        Completion Date
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Production Date")}
                      >
                        Production Date
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setSelectedEvent("Cargo Dispatch")}
                      >
                        Cargo Dispatch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <Input
                    placeholder="Description..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                  <Button onClick={handleAddDateEvent}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Sample Sent Dialog */}
              <Dialog
                open={isSampleSentDialogOpen}
                onOpenChange={setSampleSentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Add Sample Sent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sample Sent</DialogTitle>
                  </DialogHeader>
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
                  <Input
                    placeholder="Description..."
                    value={sampleSentDescription}
                    onChange={(e) => setSampleSentDescription(e.target.value)}
                  />
                  <Button onClick={handleAddSampleSent}>Submit</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Display */}
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {timelineData.enquiry.timeline.map((item) => {
                const statusColor = statusLabels.find(
                  (status) => status.status_name == item.status_label
                )?.color;

                return (
                  <div
                    key={item.id}
                    className={`relative border-l-2 pl-6  ${
                      item.created_by == currentUser
                        ? " border-red-200"
                        : " border-blue-200"
                    }`}
                  >
                    <div className={`absolute -left-2.5 top-0 h-5 w-5 rounded-full ${
                      item.created_by == currentUser
                        ? " bg-red-200"
                        : " bg-blue-200"
                    }`}></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {item.type === "status_change"
                          ? `Status changed to ${item.status} by ${item.created_by}`
                          : item.type === "comment"
                          ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                          : item.type === "date_event"
                          ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                          : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
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
                      {item.type !== "status_change" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(item.id)}
                          disabled={item.acknowledged}
                        >
                          {item.acknowledged ? (
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
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EnquiryTimeline;


// 50% card view 

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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageCircle, Calendar, Package } from "lucide-react";
import { useParams } from "react-router-dom";

const EnquiryTimeline = () => {
  const { id } = useParams();
  const originalId = decryptId(id);

  // Status labels and their colors
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

  const [timelineData, setTimelineData] = useState({
    enquiry: {
      id: 1,
      enquiry_ref: "AAE-HGMPL-1",
      enquiry_status: "New Enquiry", // whenever the status will change here it reflecte and also add the comment
      created_by: "ace",
      updated_by: "aditya",
      timeline: [
        {
          id: 1,
          type: "status_change", // this is the first comment show
          status: "Order Cancel",
          created_by: "ace",
          created_at: "2025-01-13T06:20:30.000000Z",
        },
        {
          id: 2,
          type: "comment",
          comment: "Initial discussion completed.",
          status_label: "New Enquiry",
          created_by: "aditya",
          created_at: "2025-01-14T10:30:00.000000Z",
          acknowledged: false,
        },

        {
          id: 4,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via bus.",
          created_by: "ace",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
        {
          id: 5,
          type: "sample_sent",
          sent_via: "Bus",
          date: "2025-01-18",
          description: "Sample sent via train.",
          created_by: "ace",
          created_at: "2025-01-18T09:00:00.000000Z",
          acknowledged: false,
        },
      ],
    },
  });

  const [newComment, setNewComment] = useState("");
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [sampleSentVia, setSampleSentVia] = useState("");
  const [sampleSentDate, setSampleSentDate] = useState("");
  const [sampleSentDescription, setSampleSentDescription] = useState("");

  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [isDateEventDialogOpen, setDateEventDialogOpen] = useState(false);
  const [isSampleSentDialogOpen, setSampleSentDialogOpen] = useState(false);
  const lastEnquiryStatusRef = useRef(null);
  const currentUser = localStorage.getItem("username") || "ace";
  const enquiryStatus = timelineData.enquiry.enquiry_status;
  console.log("::::", enquiryStatus);
  // Track changes to enquiry_status
  useEffect(() => {
    if (lastEnquiryStatusRef.current !== timelineData.enquiry.enquiry_status) {
      lastEnquiryStatusRef.current = timelineData.enquiry.enquiry_status;
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "status_change",
        status: enquiryStatus,
        created_by: currentUser,
        created_at: new Date().toISOString(),
      };

      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
    }
  }, [enquiryStatus]);

  const handleAddComment = () => {
    if (newComment && newStatusLabel) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "comment",
        comment: newComment,
        status_label: newStatusLabel,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setNewComment("");
      setNewStatusLabel("");
      setCommentDialogOpen(false);
    }
  };

  const handleAddSampleSent = () => {
    if (sampleSentVia && sampleSentDate && sampleSentDescription) {
      const newTimelineItem = {
        id: timelineData.enquiry.timeline.length + 1,
        type: "sample_sent",
        sent_via: sampleSentVia,
        date: sampleSentDate,
        description: sampleSentDescription,
        created_by: currentUser,
        created_at: new Date().toISOString(),
        acknowledged: false,
      };
      setTimelineData((prev) => ({
        ...prev,
        enquiry: {
          ...prev.enquiry,
          timeline: [...prev.enquiry.timeline, newTimelineItem],
        },
      }));
      setSampleSentVia("");
      setSampleSentDate("");
      setSampleSentDescription("");
      setSampleSentDialogOpen(false);
    }
  };

  const handleAcknowledge = (id) => {
    setTimelineData((prev) => ({
      ...prev,
      enquiry: {
        ...prev.enquiry,
        timeline: prev.enquiry.timeline.map((item) =>
          item.id === id ? { ...item, acknowledged: true } : item
        ),
      },
    }));
  };

  return (
    <Page>
        <div className="flex gap-2 min-h-screen flex-col lg:flex-row">
      <Card  className="w-[50%]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Timeline for Enquiry: {timelineData.enquiry.enquiry_ref}
            </CardTitle>
            <div className="flex space-x-2">
              <Dialog
                open={isCommentDialogOpen}
                onOpenChange={setCommentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
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
                          onSelect={() => setNewStatusLabel(status.status_name)}
                        >
                          {status.status_name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddComment}>Submit</Button>
                </DialogContent>
              </Dialog>

              {/* Add Sample Sent Dialog */}
              <Dialog
                open={isSampleSentDialogOpen}
                onOpenChange={setSampleSentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Package className="mr-2 h-4 w-4" /> Add Sample Sent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sample Sent</DialogTitle>
                  </DialogHeader>
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
                  <Input
                    placeholder="Description..."
                    value={sampleSentDescription}
                    onChange={(e) => setSampleSentDescription(e.target.value)}
                  />
                  <Button onClick={handleAddSampleSent}>Submit</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Display */}
            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {timelineData.enquiry.timeline.map((item) => {
                const statusColor = statusLabels.find(
                  (status) => status.status_name == item.status_label
                )?.color;

                return (
                  <div
                    key={item.id}
                    className={`relative border-l-2 pl-6  ${
                      item.created_by == currentUser
                        ? " border-red-200"
                        : " border-blue-200"
                    }`}
                  >
                    <div
                      className={`absolute -left-2.5 top-0 h-5 w-5 rounded-full ${
                        item.created_by == currentUser
                          ? " bg-red-200"
                          : " bg-blue-200"
                      }`}
                    ></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {item.type === "status_change"
                          ? `Status changed to ${item.status} by ${item.created_by}`
                          : item.type === "comment"
                          ? `${item.created_by} commented: ${item.comment} (${item.status_label})`
                          : item.type === "date_event"
                          ? `${item.created_by} added ${item.event}: ${item.date} - ${item.description}`
                          : `${item.created_by} sent sample via ${item.sent_via} on ${item.date} - ${item.description}`}
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
                      {item.type !== "status_change" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(item.id)}
                          disabled={item.acknowledged}
                        >
                          {item.acknowledged ? (
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
          </div>
        </CardContent>
      </Card>
      <Card  className="w-[50%]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
            Timeline View 
            </CardTitle>
            
          </div>
        </CardHeader>
        <CardContent>
        
        </CardContent>
      </Card>
      </div>
    </Page>
  );
};

export default EnquiryTimeline;

