import Login from "./app/auth/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./app/home/Home";

import CustomerList from "./app/customer/CustomerList";
import ProductList from "./app/product/ProductList";
import EnquiryList from "./app/enquiry/EnquiryList";
import EnquiryCreate from "./app/enquiry/EnquiryCreate";
import EnquiryEdit from "./app/enquiry/EnquiryEdit";
import EnquiryReplyEdit from "./app/enquiry/EnquiryReplyEdit";
import EnquiryView from "./app/enquiry/EnquiryView";
import EnquiryCreateOne from "./app/test/EnquiryCreateOne";
import ReportForm from "./app/report/ReportForm";
import Profile from "./app/profile/Profile";
import SampleEnquiryCreate from "./app/enquiry/sampleEnquiry/SampleEnquiryCreate";
import EnquiryTimeline from "./app/enquiry/timeline/EnquiryTimeline";
import ClaudeTimeline from "./app/enquiry/timeline/ClaudeTimeline";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          {/* Login Page        */}
          <Route path="/" element={<Login />} />
          {/* Dashboard  */}
          <Route path="/home" element={<Home />} />
          {/* profile  */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<Profile />} />
          {/* Registration  */}
          <Route path="/customers" element={<CustomerList />} />
          {/* customer  */}
          <Route path="/products" element={<ProductList />} />
          {/* enquiry */}
          <Route path="/enquiries" element={<EnquiryList />} />
          <Route path="/create-enquiries" element={<EnquiryCreate />} />
          <Route path="/edit-enquiry/:id" element={<EnquiryEdit />} />
          <Route
            path="/reply-edit-enquiry/:id"
            element={<EnquiryReplyEdit />}
          />
          <Route path="/view-enquiry/:id" element={<EnquiryView />} />
          <Route path="/test" element={<EnquiryCreateOne />} />
          <Route
            path="/create-sample-enquiries"
            element={<SampleEnquiryCreate />}
          />
          <Route
            path="/timeline-enquiry/:id"
            element={<EnquiryTimeline  />}
          />
          <Route
            path="/timeline-enquiry-test/:id"
            element={<ClaudeTimeline  />}
          />
          {/* report  */}
          <Route path="/report" element={<ReportForm />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
