import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ProductChart = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        No product data available for graph.
      </p>
    );
  }

  const chartData = products.slice(0, 7).map((product) => ({
    name:
      product.name && product.name.length > 10
        ? `${product.name.substring(0, 10)}...`
        : product.name || "Unnamed",
    Stock: Number(product.stock) || 0,
    Price: Number(product.price) || 0,
  }));

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        marginBottom: "30px",
      }}
    >
      <h3
        style={{
          marginBottom: "20px",
          color: "#333",
          fontFamily: "sans-serif",
        }}
      >
        Product Stock & Price Analytics
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <Legend />
            <Bar
              dataKey="Stock"
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
              name="Available Stock"
            />
            <Bar
              dataKey="Price"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Price ($/₹)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductChart;
