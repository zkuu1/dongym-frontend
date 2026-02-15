import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/prisma";

import Statistic from "@/components/Statistic";
import { generateCustomerStats } from "@/utils/generateCustomerStats";
import CustomerStats from "@/components/CustomerStats";
import CustomerChart from "@/components/CustomerCharts";
import { formatDate } from "@/lib/utils";

import { getAllAbsensi, getAllUser, getAllProduct, getAllCategory } from "@/lib/api";

import type { Absensi, Customer, Product} from "@/types/interface";

// CLIENT COMPONENT
import AbsensiTable from "../admin/client/absensi/page";
import CustomerTable from "../admin/client/customer/page";
import ProductTable from "../admin/client/product/page";
import CategoryTable from "../admin/client/category/page";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);

  // -----------------------------
  // 🔹 Fetch User Count for Stats
  // -----------------------------
  const totalUsersResponse = await getAllUser();
  const totalUsers =
    Array.isArray(totalUsersResponse?.message)
      ? totalUsersResponse.message.length
      : 0;

  const yesterdayUsers = await prisma.user.count({
    where: {
      createdAt: {
        lt: new Date(),
        gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    },
  });

  const growth =
    totalUsers > 0
      ? ((totalUsers - yesterdayUsers) / totalUsers * 100).toFixed(2) + "%"
      : "0%";

  const customerStats = [
    { title: "Customer Satisfaction", value: "75.55%", target: "100%" },
    {
      title: "Customer Growth",
      value: totalUsers.toLocaleString(),
      change: growth,
      changeColor: parseFloat(growth) >= 0 ? "text-green-500" : "text-red-500",
    },
  ];

  // -----------------------------
  // 🔹 Dummy Monthly Sales Chart
  // -----------------------------
  const salesData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 300 },
    { month: "Mar", sales: 600 },
    { month: "Apr", sales: 800 },
    { month: "May", sales: 500 },
    { month: "Jun", sales: 900 },
  ];

  // Dummy user growth chart
  const userGrowthChart = [
    { date: "2023-05-01", count: 10 },
    { date: "2023-05-02", count: 15 },
    { date: "2023-05-03", count: 20 },
    { date: "2023-05-04", count: 25 },
    { date: "2023-05-05", count: 30 },
    { date: "2023-05-06", count: 35 },
  ];

  // -----------------------------
  // 🔹 Fetch Absensi Data (SERVER)
  // -----------------------------

 

  // ======================= FETCH ABSENSI ====================================
  const absensiResponse = await getAllAbsensi();
  const allAbsensi: Absensi[] =
    Array.isArray(absensiResponse?.data?.data) ? absensiResponse.data.data : [];
  
// ======================= FETCH CUSTOMER ====================================
  const customerResponse = await getAllUser();
  
  // console.log("📌 FULL Customer RESPONSE:", JSON.stringify(customerResponse, null, 2));
   const allCustomer: Customer[] =
    Array.isArray(customerResponse.data)
    ? customerResponse.data
    : [];

    const stats = generateCustomerStats(allCustomer);

// ======================= FETCH PRODUCT ====================================
const productResponse = await getAllProduct();
const allProducts: Product[] = 
Array.isArray(productResponse?.data?.data) ? productResponse.data.data : [];

// ======================= FETCH CATEGORY ====================================
const categoryResponse = await getAllCategory();
const allcategroy: Product[] = 
Array.isArray(categoryResponse?.data?.data)
  ? categoryResponse.data.data
  : Array.isArray(categoryResponse?.data)
  ? categoryResponse.data
  : [];



  return (
    <div className="flex h-screen bg-gray-100">
      
    </div>
  );
};

export default AdminPage;
