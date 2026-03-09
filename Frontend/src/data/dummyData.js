// Dummy data for the admin dashboard

export const DUMMY_USERS = [
  { id: 1, name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98765 43210", signupDate: "2024-01-15 10:30 AM", isVerified: true, status: "Active" },
  { id: 2, name: "Priya Patel", email: "priya.patel@outlook.com", phone: "+91 87654 32109", signupDate: "2024-01-18 02:45 PM", isVerified: true, status: "Active" },
  { id: 3, name: "Rohan Gupta", email: "rohan.gupta@yahoo.com", phone: "+91 76543 21098", signupDate: "2024-02-01 09:15 AM", isVerified: false, status: "Active" },
  { id: 4, name: "Sneha Reddy", email: "sneha.reddy@gmail.com", phone: "+91 65432 10987", signupDate: "2024-02-10 11:20 AM", isVerified: true, status: "Active" },
  { id: 5, name: "Vikram Singh", email: "vikram.singh@hotmail.com", phone: "+91 54321 09876", signupDate: "2024-02-15 04:50 PM", isVerified: true, status: "inActive" },
  { id: 6, name: "Ananya Iyer", email: "ananya.iyer@gmail.com", phone: "+91 43210 98765", signupDate: "2024-02-20 01:10 PM", isVerified: false, status: "Active" },
  { id: 7, name: "Karthik Nair", email: "karthik.nair@gmail.com", phone: "+91 32109 87654", signupDate: "2024-03-01 08:35 AM", isVerified: true, status: "Active" },
  { id: 8, name: "Meera Joshi", email: "meera.joshi@outlook.com", phone: "+91 21098 76543", signupDate: "2024-03-05 12:00 PM", isVerified: true, status: "Active" },
  { id: 9, name: "Arjun Verma", email: "arjun.verma@gmail.com", phone: "+91 10987 65432", signupDate: "2024-03-10 03:25 PM", isVerified: false, status: "inActive" },
  { id: 10, name: "Divya Menon", email: "divya.menon@yahoo.com", phone: "+91 98712 34567", signupDate: "2024-03-15 10:05 AM", isVerified: true, status: "Active" },
  { id: 11, name: "Rahul Deshmukh", email: "rahul.desh@gmail.com", phone: "+91 87612 34567", signupDate: "2024-03-20 05:40 PM", isVerified: true, status: "Active" },
  { id: 12, name: "Kavitha Rao", email: "kavitha.rao@gmail.com", phone: "+91 76512 34567", signupDate: "2024-04-01 09:50 AM", isVerified: false, status: "Active" },
  { id: 13, name: "Siddharth Malhotra", email: "sid.malhotra@outlook.com", phone: "+91 65412 34567", signupDate: "2024-04-05 02:15 PM", isVerified: true, status: "Active" },
  { id: 14, name: "Neha Kapoor", email: "neha.kapoor@gmail.com", phone: "+91 54312 34567", signupDate: "2024-04-10 11:30 AM", isVerified: true, status: "inActive" },
  { id: 15, name: "Aditya Banerjee", email: "aditya.ban@gmail.com", phone: "+91 43212 34567", signupDate: "2024-04-15 04:00 PM", isVerified: false, status: "Active" },
];

// Placeholder document images (demo) – in production use real uploaded URLs
const DOC_IMAGE = (seed) => `https://picsum.photos/seed/${seed}/300/400`;

// User-uploaded documents (Aadhaar, PAN, etc.) per user – shown in Eye action
export const DUMMY_USER_DOCUMENTS = {
  1: [
    { type: "Aadhaar", uploadedAt: "2024-01-16", status: "Verified", ref: "XXXX XXXX 4521", imageUrl: DOC_IMAGE("aadhaar1") },
    { type: "PAN", uploadedAt: "2024-01-16", status: "Verified", ref: "ABCDE1234F", imageUrl: DOC_IMAGE("pan1") },
    { type: "Bank Statement", uploadedAt: "2024-01-20", status: "Verified", ref: "Last 3 months", imageUrl: DOC_IMAGE("bank1") },
  ],
  2: [
    { type: "Aadhaar", uploadedAt: "2024-01-19", status: "Verified", ref: "XXXX XXXX 7890", imageUrl: DOC_IMAGE("aadhaar2") },
    { type: "PAN", uploadedAt: "2024-01-19", status: "Pending", ref: "FGHIJ5678K", imageUrl: DOC_IMAGE("pan2") },
  ],
  3: [
    { type: "Aadhaar", uploadedAt: "2024-02-02", status: "Verified", ref: "XXXX XXXX 1122", imageUrl: DOC_IMAGE("aadhaar3") },
  ],
  4: [
    { type: "Aadhaar", uploadedAt: "2024-02-11", status: "Verified", ref: "XXXX XXXX 3344", imageUrl: DOC_IMAGE("aadhaar4") },
    { type: "PAN", uploadedAt: "2024-02-11", status: "Verified", ref: "KLMNO9012P", imageUrl: DOC_IMAGE("pan4") },
    { type: "Salary Slip", uploadedAt: "2024-02-12", status: "Verified", ref: "Feb 2024", imageUrl: DOC_IMAGE("salary4") },
  ],
  5: [
    { type: "Aadhaar", uploadedAt: "2024-02-16", status: "Verified", ref: "XXXX XXXX 5566", imageUrl: DOC_IMAGE("aadhaar5") },
    { type: "PAN", uploadedAt: "2024-02-16", status: "Verified", ref: "PQRST3456U", imageUrl: DOC_IMAGE("pan5") },
  ],
};
export function getUserDocuments(userId) {
  return DUMMY_USER_DOCUMENTS[userId] || [
    { type: "Aadhaar", uploadedAt: "—", status: "Not uploaded", ref: "—", imageUrl: null },
    { type: "PAN", uploadedAt: "—", status: "Not uploaded", ref: "—", imageUrl: null },
  ];
}

export const DUMMY_CARDS = [
  { id: 1, userId: 1, userName: "Aarav Sharma", cardType: "Credit", brand: "Visa", maskedNumber: "•••• •••• •••• 4242", addedOn: "2024-01-20", isPrimary: true, status: "Active" },
  { id: 2, userId: 1, userName: "Aarav Sharma", cardType: "Debit", brand: "Mastercard", maskedNumber: "•••• •••• •••• 8831", addedOn: "2024-02-01", isPrimary: false, status: "Active" },
  { id: 3, userId: 2, userName: "Priya Patel", cardType: "Credit", brand: "Rupay", maskedNumber: "•••• •••• •••• 1234", addedOn: "2024-01-25", isPrimary: true, status: "Active" },
  { id: 4, userId: 3, userName: "Rohan Gupta", cardType: "Debit", brand: "Visa", maskedNumber: "•••• •••• •••• 5678", addedOn: "2024-02-05", isPrimary: true, status: "Expired" },
  { id: 5, userId: 4, userName: "Sneha Reddy", cardType: "Credit", brand: "Mastercard", maskedNumber: "•••• •••• •••• 9012", addedOn: "2024-02-15", isPrimary: true, status: "Active" },
  { id: 6, userId: 5, userName: "Vikram Singh", cardType: "Debit", brand: "Rupay", maskedNumber: "•••• •••• •••• 3456", addedOn: "2024-02-20", isPrimary: true, status: "Blocked" },
  { id: 7, userId: 7, userName: "Karthik Nair", cardType: "Credit", brand: "Visa", maskedNumber: "•••• •••• •••• 7890", addedOn: "2024-03-05", isPrimary: true, status: "Active" },
  { id: 8, userId: 8, userName: "Meera Joshi", cardType: "Debit", brand: "Mastercard", maskedNumber: "•••• •••• •••• 2345", addedOn: "2024-03-10", isPrimary: true, status: "Active" },
  { id: 9, userId: 10, userName: "Divya Menon", cardType: "Credit", brand: "Visa", maskedNumber: "•••• •••• •••• 6789", addedOn: "2024-03-20", isPrimary: true, status: "Active" },
  { id: 10, userId: 11, userName: "Rahul Deshmukh", cardType: "Debit", brand: "Rupay", maskedNumber: "•••• •••• •••• 0123", addedOn: "2024-03-25", isPrimary: true, status: "Expired" },
  { id: 11, userId: 13, userName: "Siddharth Malhotra", cardType: "Credit", brand: "Mastercard", maskedNumber: "•••• •••• •••• 4567", addedOn: "2024-04-08", isPrimary: true, status: "Active" },
  { id: 12, userId: 14, userName: "Neha Kapoor", cardType: "Debit", brand: "Visa", maskedNumber: "•••• •••• •••• 8901", addedOn: "2024-04-12", isPrimary: false, status: "Active" },
];

export const DUMMY_BILLS = [
  { id: 1, userId: 1, userName: "Aarav Sharma", billerName: "Tata Power", category: "Electricity", amount: 2450, paymentDate: "2024-03-05", status: "Success", gateway: "Razorpay" },
  { id: 2, userId: 2, userName: "Priya Patel", billerName: "BSNL", category: "Internet", amount: 999, paymentDate: "2024-03-08", status: "Success", gateway: "Stripe" },
  { id: 3, userId: 3, userName: "Rohan Gupta", billerName: "Mahanagar Gas", category: "Gas", amount: 1800, paymentDate: "2024-03-10", status: "Pending", gateway: "Razorpay" },
  { id: 4, userId: 4, userName: "Sneha Reddy", billerName: "Airtel", category: "Mobile Recharge", amount: 599, paymentDate: "2024-03-12", status: "Success", gateway: "Stripe" },
  { id: 5, userId: 5, userName: "Vikram Singh", billerName: "Mumbai Water Board", category: "Water", amount: 750, paymentDate: "2024-03-14", status: "Failed", gateway: "Razorpay" },
  { id: 6, userId: 7, userName: "Karthik Nair", billerName: "Adani Electricity", category: "Electricity", amount: 3200, paymentDate: "2024-03-16", status: "Success", gateway: "Razorpay" },
  { id: 7, userId: 8, userName: "Meera Joshi", billerName: "Jio Fiber", category: "Internet", amount: 1499, paymentDate: "2024-03-18", status: "Success", gateway: "Stripe" },
  { id: 8, userId: 10, userName: "Divya Menon", billerName: "Tata Sky", category: "DTH", amount: 450, paymentDate: "2024-03-20", status: "Pending", gateway: "Razorpay" },
  { id: 9, userId: 11, userName: "Rahul Deshmukh", billerName: "Vi Mobile", category: "Mobile Recharge", amount: 399, paymentDate: "2024-03-22", status: "Success", gateway: "Stripe" },
  { id: 10, userId: 12, userName: "Kavitha Rao", billerName: "BESCOM", category: "Electricity", amount: 2100, paymentDate: "2024-03-24", status: "Failed", gateway: "Razorpay" },
  { id: 11, userId: 13, userName: "Siddharth Malhotra", billerName: "Delhi Jal Board", category: "Water", amount: 550, paymentDate: "2024-03-26", status: "Success", gateway: "Stripe" },
  { id: 12, userId: 14, userName: "Neha Kapoor", billerName: "IGL Gas", category: "Gas", amount: 1650, paymentDate: "2024-03-28", status: "Success", gateway: "Razorpay" },
  { id: 13, userId: 15, userName: "Aditya Banerjee", billerName: "Dish TV", category: "DTH", amount: 350, paymentDate: "2024-03-30", status: "Pending", gateway: "Stripe" },
  { id: 14, userId: 1, userName: "Aarav Sharma", billerName: "ACT Fibernet", category: "Internet", amount: 1199, paymentDate: "2024-04-02", status: "Success", gateway: "Razorpay" },
  { id: 15, userId: 4, userName: "Sneha Reddy", billerName: "Reliance Energy", category: "Electricity", amount: 2850, paymentDate: "2024-04-05", status: "Success", gateway: "Stripe" },
];

export const DUMMY_TAXES = [
  { id: 1, userId: 1, userName: "Aarav Sharma", taxType: "Income Tax", assessmentYear: "2024-25", amount: 125000, filedOn: "2024-07-15", dueDate: "2024-07-31", status: "Filed", refNo: "TXN-2024-A1B2C" },
  { id: 2, userId: 2, userName: "Priya Patel", taxType: "GST", assessmentYear: "2024-25", amount: 45000, filedOn: "2024-03-20", dueDate: "2024-03-31", status: "Filed", refNo: "TXN-2024-D3E4F" },
  { id: 3, userId: 3, userName: "Rohan Gupta", taxType: "Advance Tax", assessmentYear: "2024-25", amount: 75000, filedOn: "", dueDate: "2024-06-15", status: "Due Soon", refNo: "TXN-2024-G5H6I" },
  { id: 4, userId: 4, userName: "Sneha Reddy", taxType: "TDS", assessmentYear: "2024-25", amount: 32000, filedOn: "2024-04-07", dueDate: "2024-04-30", status: "Filed", refNo: "TXN-2024-J7K8L" },
  { id: 5, userId: 5, userName: "Vikram Singh", taxType: "Property Tax", assessmentYear: "2024-25", amount: 18000, filedOn: "", dueDate: "2024-03-01", status: "Overdue", refNo: "TXN-2024-M9N0O" },
  { id: 6, userId: 7, userName: "Karthik Nair", taxType: "Income Tax", assessmentYear: "2024-25", amount: 95000, filedOn: "2024-07-20", dueDate: "2024-07-31", status: "Filed", refNo: "TXN-2024-P1Q2R" },
  { id: 7, userId: 8, userName: "Meera Joshi", taxType: "GST", assessmentYear: "2024-25", amount: 28000, filedOn: "", dueDate: "2024-04-20", status: "Processing", refNo: "TXN-2024-S3T4U" },
  { id: 8, userId: 10, userName: "Divya Menon", taxType: "Advance Tax", assessmentYear: "2024-25", amount: 50000, filedOn: "", dueDate: "2024-09-15", status: "Due Soon", refNo: "TXN-2024-V5W6X" },
  { id: 9, userId: 11, userName: "Rahul Deshmukh", taxType: "TDS", assessmentYear: "2023-24", amount: 22000, filedOn: "2024-01-10", dueDate: "2024-01-31", status: "Filed", refNo: "TXN-2024-Y7Z8A" },
  { id: 10, userId: 13, userName: "Siddharth Malhotra", taxType: "Income Tax", assessmentYear: "2024-25", amount: 180000, filedOn: "", dueDate: "2024-03-15", status: "Overdue", refNo: "TXN-2024-B9C0D" },
  { id: 11, userId: 14, userName: "Neha Kapoor", taxType: "Property Tax", assessmentYear: "2024-25", amount: 15000, filedOn: "2024-02-28", dueDate: "2024-03-31", status: "Filed", refNo: "TXN-2024-E1F2G" },
  { id: 12, userId: 15, userName: "Aditya Banerjee", taxType: "GST", assessmentYear: "2024-25", amount: 38000, filedOn: "", dueDate: "2024-05-20", status: "Processing", refNo: "TXN-2024-H3I4J" },
];

