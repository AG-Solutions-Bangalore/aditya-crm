
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
      status_change: "Order Cancel",
      created_by: "ace",
      created_at: "2025-01-13T06:20:30.000000Z",
      
      comment:"",
      status_label_comment:"",
      acknowledged:"",
      sent_via:"",
      date_sample_sent:"",
      description_sample_sent :"",
     
      
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
      id:2,
      type: "status_changed", // this is the first comment show
      status_change: "Order Cancel",
      created_by: "ace",
      created_at: "2025-01-13T06:20:30.000000Z",
    },  
    { 
      id: 2,
      type: "product_sBang",
      date: "25-01-2024",
      
      created_by: "aditya",
      created_at: "2025-01-14T10:30:00.000000Z",
    
    },  
    {
      id: 2,
      type: "sample_dispatch",
      date: "25-01-2024",
     
      created_by: "aditya",
      created_at: "2025-01-14T10:30:00.000000Z",
      
    },  
    {
      id: 2,
      type: "cargo",
      date: "25-01-2024",
   
      created_by: "aditya",
      created_at: "2025-01-14T10:30:00.000000Z",
   
    },  
    {
      id: 2,
      type: "stuffing",
      date: "25-01-2024",
     
      created_by: "aditya",
      created_at: "2025-01-14T10:30:00.000000Z",
     
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
    }, body- sent_via , description , sent_date
  ],
},
