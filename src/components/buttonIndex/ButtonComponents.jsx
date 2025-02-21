import {
    Download,
    Edit,
    Eye,
    FileDown,
    FilePlus2,
    History,
    SquarePlus,
    Trash,
    UserPen,
  } from "lucide-react";
  import React from "react";
  import { checkPermission } from "./checkPermission";
  import { Button } from "@/components/ui/button";
  import { ButtonConfig } from "@/config/ButtonConfig";
  import { useNavigate } from "react-router-dom";
  
  const getStaticPermissions = () => {
    const buttonPermissions = localStorage.getItem("buttonControl");
    try {
      return buttonPermissions ? JSON.parse(buttonPermissions) : [];
    } catch (error) {
      console.error(
        "Error parsing StaticPermission data from localStorage",
        error
      );
      return [];
    }
  };



 /*------------------------Customer--------------------- */
  export const CustomerCreate = ({ onClick, className }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "CustomerCreate", staticPermissions)) {
      return null;
    }
  
    return (
      <Button variant="default" className={className} onClick={onClick}>
        <SquarePlus className="h-4 w-4" /> Customer
      </Button>
    );
  };
  CustomerCreate.page = "Customers";
  
  export const CustomerEdit = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "CustomerEdit", staticPermissions)) {
      return null;
    }
  
    return (
      <Button onClick={onClick} className={className} variant="ghost" size="icon">
        <Edit className="h-4 w-4 text-black" />
      </Button>
    );
  };
  CustomerEdit.page = "Customers";

 
/*-------------------------Products------------------- */
export const ProductsCreate = ({ onClick, className }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "ProductsCreate", staticPermissions)) {
      return null;
    }
  
    return (
      <Button variant="default" className={className} onClick={onClick}>
        <SquarePlus className="h-4 w-4" /> Product
      </Button>
    );
  };
  ProductsCreate.page = "Products";
  
  export const ProductsEdit = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "ProductsEdit", staticPermissions)) {
      return null;
    }
  
    return (
      <Button onClick={onClick}  className={className} variant="ghost" size="icon">
        <Edit className="h-4 w-4 text-black" />
      </Button>
    );
  };
  ProductsEdit.page = "Products";

  /*-------------------------Report--------------------------------- */
  export const ReportGenerateReport = ({ onClick, className }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "ReportGenerateReport", staticPermissions)) {
      return null;
    }
  
    return (
      <Button type="submit" variant="default" className={className} onClick={onClick}>
        <FileDown className="h-4 w-4" /> Generate Report
      </Button>
    );
  };

  ReportGenerateReport.page = "Report";
  /*---------------------------------Enquiry----------------- */
  export const EnquiriesEnquiryCreate = ({ onClick, className }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesEnquiryCreate", staticPermissions)) {
      return null;
    }
  
    return (
      <Button  variant="default" className={className} onClick={onClick}>
        <SquarePlus className="h-4 w-4" /> Enquiry
      </Button>
    );
  };
  EnquiriesEnquiryCreate.page = "Enquiries";

  export const EnquiriesSampleCreate = ({ onClick, className }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesSampleCreate", staticPermissions)) {
      return null;
    }
  
    return (
      <Button  variant="default" className={className} onClick={onClick}>
        <SquarePlus className="h-4 w-4" /> Sample
      </Button>
    );
  };
  EnquiriesSampleCreate.page = "Enquiries";





  export const EnquiriesView = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesView", staticPermissions)) {
      return null;
    }
  
    return (
      <Button
        onClick={onClick}
        className={className}
        title="View"
        variant="ghost"
        size="icon"
      >
        <Eye className="h-4 w-4 text-black" />
      </Button>
    );
  };
  EnquiriesView.page = "Enquiries";

  export const EnquiriesTimeline = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesTimeline", staticPermissions)) {
      return null;
    }
  
    return (
      <Button
        onClick={onClick}
        className={className}
        title="View"
        variant="ghost"
        size="icon"
      >
        <History className="h-4 w-4 text-black" />
      </Button>
    );
  };
  EnquiriesTimeline.page = "Enquiries";




  export const EnquiriesEdit = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesEdit", staticPermissions)) {
      return null;
    }
  
    return (
      <Button onClick={onClick}  className={className} variant="ghost" size="icon">
        <Edit className="h-4 w-4 text-black" />
      </Button>
    );
  };
  EnquiriesEdit.page = "Enquiries";

  export const EnquiriesReplyFollowup = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesReplyFollowup", staticPermissions)) {
      return null;
    }
  
    return (
      <Button onClick={onClick}  className={className} variant="ghost" size="icon">
        <UserPen className="h-4 w-4 text-black" />
      </Button>
    );
  };
  EnquiriesReplyFollowup.page = "Enquiries";
  export const EnquiriesDelete = ({ onClick, className }) => {
    const userId = localStorage.getItem("id") || "";
    const staticPermissions = getStaticPermissions();
    if (!checkPermission(userId, "EnquiriesDelete", staticPermissions)) {
      return null;
    }
  
    return (
      <Button onClick={onClick}  className={className} variant="ghost" size="icon">
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    );
  };
  EnquiriesDelete.page = "Enquiries";



  export default {
    CustomerCreate,
    CustomerEdit,
    ProductsCreate,
    ProductsEdit,
    ReportGenerateReport,
    EnquiriesEnquiryCreate,
    EnquiriesSampleCreate,
    EnquiriesView,
    EnquiriesTimeline,
    EnquiriesEdit,
    EnquiriesReplyFollowup,
    EnquiriesDelete,
  };
  