"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Cookies from "js-cookie";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

// -------------------------
// API Helper
// -------------------------
const API_URL = "http://localhost:4000";

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get("token");
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// -------------------------
// Navigation Config
// -------------------------
const navigation = [
  { name: "Dashboard", href: "#", icon: ChartBarIcon, current: true },
  { name: "Teachers", href: "#teachers", icon: UserGroupIcon, current: false },
  { name: "Classes", href: "#classes", icon: AcademicCapIcon, current: false },
];

// -------------------------
// Dashboard section starts 
// -------------------------
export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              EduAIssist
            </h1>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow">
              Admin
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  setActiveTab(item.href.replace("#", "") || "dashboard")
                }
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group
                  ${
                    activeTab === (item.href.replace("#", "") || "dashboard")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    activeTab === (item.href.replace("#", "") || "dashboard")
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="px-4 py-5 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {activeTab === "dashboard" && <DashboardContent />}
            {activeTab === "teachers" && <TeachersContent />}
            {activeTab === "classes" && <ClassesContent />}
          </div>
        </main>
      </div>
    </div>
  );
}

// -------------------------
// Dashboard Content (Counts)
// -------------------------
function DashboardContent() {
  const [teacherCount, setTeacherCount] = useState<number | null>(null);
  const [classesCount, setClassesCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCounts() {
      try {
        // Teachers: API may not expose /teachers/count; fallback to list length
        const teachers = await fetcher("/users/teachers");
        const tCount = Array.isArray(teachers) ? teachers.length : (teachers?.total ?? 0);
        setTeacherCount(tCount);

        // Classes: expected to return { total }
        const classCount = await fetcher("/classes/count");
        setClassesCount(classCount?.total ?? (typeof classCount === 'number' ? classCount : 0));
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    }
    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {/* Teachers Count */}
        <div className="p-6 rounded-2xl bg-white shadow-lg flex items-center hover:shadow-xl transition-shadow">
          <UserGroupIcon className="h-10 w-10 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Teachers</p>
            <p className="text-2xl font-extrabold text-gray-900">
              {teacherCount ?? "..."}
            </p>
          </div>
        </div>

        {/* Classes Count */}
        <div className="p-6 rounded-2xl bg-white shadow-lg flex items-center hover:shadow-xl transition-shadow">
          <AcademicCapIcon className="h-10 w-10 text-green-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Classes</p>
            <p className="text-2xl font-extrabold text-gray-900">
              {classesCount ?? "..."}
            </p>
          </div>
        </div>

        {/* Static */}
        <div className="p-6 rounded-2xl bg-white shadow-lg flex items-center hover:shadow-xl transition-shadow">
          <ChartBarIcon className="h-10 w-10 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Exams This Month</p>
            <p className="text-2xl font-extrabold text-gray-900">8</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white shadow-lg flex items-center hover:shadow-xl transition-shadow">
          <CogIcon className="h-10 w-10 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">System Status</p>
            <p className="text-2xl font-extrabold text-green-600">Active</p>
          </div>
        </div>
      </div>

      {/* Notice Board */}
      <div className="p-6 rounded-2xl bg-white shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notice Board</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-xl shadow-sm">
            <p className="text-sm font-semibold text-blue-800">
              Important Update: System maintenance scheduled for 2025-09-15 at
              3:00 AM PST.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-xl shadow-sm">
            <p className="text-sm font-semibold text-green-800">
              Future Feature Release: Subject management will be available soon!
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-xl shadow-sm">
            <p className="text-sm font-semibold text-yellow-800">
              Reminder: Teacher training session on 2025-09-01 at 10:00 AM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// -------------------------
// Teachers section starts
// -------------------------

function TeachersContent() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For Add Teacher form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "teacher",
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      setLoading(true);
      const res = await fetcher("/users/teachers");
      setTeachers(res);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addTeacher() {
    try {
      await fetcher("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ firstName: "", lastName: "", email: "", role: "teacher" });
      loadTeachers();
    } catch (err) {
      alert("Failed to add teacher: " + err);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👩‍🏫 Teachers</h1>
      </div>

      {/* Add Teacher Form */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          Add New Teacher
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First Name */}
          <div className="relative">
            <input
              id="firstName"
              type="text"
              placeholder=" "
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
            <label
              htmlFor="firstName"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative">
            <input
              id="lastName"
              type="text"
              placeholder=" "
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
            <label
              htmlFor="lastName"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Last Name
            </label>
          </div>

          {/* Email */}
          <div className="relative md:col-span-2">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Email
            </label>
          </div>
        </div>

        <button
          onClick={addTeacher}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg px-6 py-3 shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          ➕ Add Teacher
        </button>
      </div>

      {/* Teacher List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading teachers...</p>
        ) : teachers?.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>No teachers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-gray-700 font-medium">ID</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Name</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Email</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers?.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">{t.id}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {t.firstName} {t.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{t.email}</td>
                    <td className="py-3 px-4">
                      {t.isActive ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// classes section starts

function ClassesContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    grade: "",
    section: "",
    academicYear: "",
    teacherId: "",
  });

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];

  useEffect(() => {
    loadClasses();
    loadTeachersForDropdown();
  }, []);

  async function loadClasses() {
    try {
      setLoading(true);
      const res = await fetcher("/classes");
      setClasses(res);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeachersForDropdown() {
    try {
      const res = await fetcher("/users/teachers");
      setTeachers(res);
    } catch (err) {
      console.error("Failed to fetch teachers for dropdown:", err);
    }
  }

  async function addClass() {
    try {
      await fetcher("/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({
        name: "",
        description: "",
        grade: "",
        section: "",
        academicYear: "",
        teacherId: "",
      });
      loadClasses();
    } catch (err) {
      alert("Failed to add class: " + err);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📚 Classes</h1>
      </div>

      {/* Add Class Form */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Class</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Class Name */}
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder=" "
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
            <label
              htmlFor="name"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Class Name
            </label>
          </div>

          {/* Description */}
          <div className="relative">
            <input
              id="description"
              type="text"
              placeholder=" "
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="peer w-full rounded-lg border border-gray-300 px-4 pt-5 pb-2 text-gray-900 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Description (Optional)
            </label>
          </div>

          {/* Grade */}
          <div className="relative">
            <label
              htmlFor="grade"
              className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
            >
              Grade
            </label>
            <select
              id="grade"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <option value="">Select Grade</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="relative">
            <label
              htmlFor="section"
              className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
            >
              Section
            </label>
            <select
              id="section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div className="relative">
            <label
              htmlFor="academicYear"
              className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
            >
              Academic Year
            </label>
            <select
              id="academicYear"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div className="relative">
            <label
              htmlFor="teacherId"
              className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
            >
              Teacher
            </label>
            <select
              id="teacherId"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addClass}
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg px-6 py-3 shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          ➕ Add Class
        </button>
      </div>

      {/* Class List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading classes...</p>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>No classes found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-gray-700 font-medium">ID</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Name</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Grade</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Section</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Academic Year</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Teacher</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900">{c.id}</td>
                    <td className="py-3 px-4 text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 text-gray-900">{c.grade}</td>
                    <td className="py-3 px-4 text-gray-900">{c.section}</td>
                    <td className="py-3 px-4 text-gray-900">{c.academicYear}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {c.isActive ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



