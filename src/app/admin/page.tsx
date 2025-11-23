import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

import Statistic from "@/components/Statistic";
import { generateCustomerStats } from "@/utils/generateCustomerStats";
import CustomerStats from "@/components/CustomerStats";
import CustomerChart from "@/components/CustomerCharts";
import { formatDate } from "@/lib/utils";

import { getAllAbsensi, getAllUser, getAllProduct, getAllCategory } from "@/lib/api";

import type { Absensi, Customer, Product} from "@/types/interface";

// CLIENT COMPONENT
import AbsensiTable from "./client/absensi/page";
import CustomerTable from "./client/customer/page";
import ProductTable from "./client/product/page";
import CategoryTable from "./client/category/page";

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
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

         {/* Absensi Table */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Absensi Hari Ini</h2>
            <CustomerTable data={allCustomer}/>
          </div>

          {/* Absensi Table */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Absensi Hari Ini</h2>
            <AbsensiTable data={allAbsensi} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Customer Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CustomerStats stats={stats} />
            </div>

            {/* Customer Growth Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
              <CustomerChart
                customers={
                  allCustomer.map((c) => ({ ...c, name: c.name ?? "" })) as any
                }
              />
            </div>
          </div>

          {/* Absensi Table */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">List Product</h2>
            <ProductTable data={allProducts}/>
          </div>

          {/* Absensi Table */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">List Product</h2>
            <CategoryTable data={allcategroy}/>
          </div>

          {/* Monthly Sales Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Sales
            </h3>
            <div className="flex items-end h-48 space-x-1">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-purple-500 rounded-t-sm"
                    style={{ height: `${data.sales / 10}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminPage;
