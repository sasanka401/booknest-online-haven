
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const adminSections = [
  {
    title: "Manage Books",
    description: "Add, update or remove books from the store.",
    path: "/admin/books"
  },
  {
    title: "Manage Orders",
    description: "View and manage customer orders.",
    path: "/order-history"
  },
  // Add more sections here in future (like Users, Analytics)
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <div className="space-y-4">
        {adminSections.map(section => (
          <Link
            to={section.path}
            key={section.path}
            className="block rounded border p-4 hover:bg-muted transition-colors"
          >
            <div className="font-semibold text-lg">{section.title}</div>
            <div className="text-muted-foreground text-sm">{section.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
