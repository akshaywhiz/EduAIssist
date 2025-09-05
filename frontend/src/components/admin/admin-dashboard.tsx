"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { usersAPI, classesAPI } from "@/lib/api";
import { Logo } from "@/components/ui/logo";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";


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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50 to-gray-100">
      {/* Decorative orbs for brand consistency */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-300 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200 to-purple-300 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-purple-200 to-pink-300 blur-3xl" />
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl shadow-xl ring-1 ring-blue-100 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-blue-100/50">
            <div className="flex items-center gap-3">
              <Logo size="md" className="h-8 w-8" />
              <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                EduAIssist
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={async () => {
                  const newTab = item.href.replace("#", "") || "dashboard";
                  if (newTab !== activeTab) {
                    setIsTransitioning(true);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setActiveTab(newTab);
                    setIsTransitioning(false);
                  }
                  // Close mobile menu on navigation
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group transform hover:scale-[1.02]
                  ${
                    activeTab === (item.href.replace("#", "") || "dashboard")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white/80 hover:shadow-lg"
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
          <div className="px-4 py-5 border-t border-blue-100/50 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-semibold text-white">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="text-xs text-gray-500">
                  Admin
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 text-gray-500 hover:text-red-600 transition-colors duration-300" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-100/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <Logo size="sm" className="h-6 w-6" />
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              EduAIssist
            </h1>
          </div>
          <div></div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        <main className="pt-20 lg:pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {activeTab === "dashboard" && <DashboardContent />}
            {activeTab === "teachers" && <TeachersContent />}
            {activeTab === "classes" && <ClassesContent />}
            </div>
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
        const teachersResponse = await usersAPI.getTeachers();
        const teachers = teachersResponse.data;
        const tCount = Array.isArray(teachers) ? teachers.length : (teachers?.total ?? 0);
        setTeacherCount(tCount);

        // Classes: expected to return { total }
        const classCountResponse = await classesAPI.count();
        const classCount = classCountResponse.data;
        setClassesCount(classCount?.total ?? (typeof classCount === 'number' ? classCount : 0));
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    }
    loadCounts();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <ChartBarIcon className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-600" />
          <span className="text-gray-700">Admin Control Center</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Monitor your institution's performance and manage educational resources.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 mb-8 lg:mb-10">
        {/* Teachers Count */}
        <div className="group p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 mb-2 sm:mb-0 sm:mr-3 lg:mb-3 lg:mr-0 xl:mb-0 xl:mr-4">
            <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center sm:text-left lg:text-center xl:text-left">
            <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Total Teachers</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {teacherCount ?? "..."}
            </p>
          </div>
        </div>

        {/* Classes Count */}
        <div className="group p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-green-100 group-hover:bg-green-200 transition-colors duration-300 mb-2 sm:mb-0 sm:mr-3 lg:mb-3 lg:mr-0 xl:mb-0 xl:mr-4">
            <AcademicCapIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center sm:text-left lg:text-center xl:text-left">
            <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Active Classes</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {classesCount ?? "..."}
            </p>
          </div>
        </div>

        {/* Exams Count */}
        <div className="group p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center hover:shadow-2xl hover:shadow-yellow-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300 mb-2 sm:mb-0 sm:mr-3 lg:mb-3 lg:mr-0 xl:mb-0 xl:mr-4">
            <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center sm:text-left lg:text-center xl:text-left">
            <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Exams This Month</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">8</p>
          </div>
        </div>

        {/* System Status */}
        <div className="group p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300 mb-2 sm:mb-0 sm:mr-3 lg:mb-3 lg:mr-0 xl:mb-0 xl:mr-4">
            <CogIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="text-center sm:text-left lg:text-center xl:text-left">
            <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">System Status</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Active</p>
          </div>
        </div>
      </div>

      {/* Notice Board */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 lg:mb-6">
          <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl lg:rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100">
            <BellAlertIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Notice Board</h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="group border-l-4 border-blue-500 pl-3 sm:pl-4 lg:pl-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-r-xl lg:rounded-r-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Important Update</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-blue-800 group-hover:text-blue-900 transition-colors duration-300">
              System maintenance scheduled for 2025-09-15 at 3:00 AM PST.
            </p>
          </div>
          <div className="group border-l-4 border-green-500 pl-3 sm:pl-4 lg:pl-6 py-3 sm:py-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-r-xl lg:rounded-r-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Feature Release</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-green-800 group-hover:text-green-900 transition-colors duration-300">
              Subject management will be available soon!
            </p>
          </div>
          <div className="group border-l-4 border-yellow-500 pl-3 sm:pl-4 lg:pl-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-50 to-yellow-50/50 rounded-r-xl lg:rounded-r-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Reminder</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-yellow-800 group-hover:text-yellow-900 transition-colors duration-300">
              Teacher training session on 2025-09-01 at 10:00 AM.
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
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "teacher",
  });
  const [updating, setUpdating] = useState(false);

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

  // Filter teachers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        const email = teacher.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return fullName.includes(query) || email.includes(query);
      });
      setFilteredTeachers(filtered);
    }
  }, [teachers, searchQuery]);

  async function loadTeachers() {
    try {
      setLoading(true);
      const response = await usersAPI.getTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(teacher: any) {
    setTeacherToDelete(teacher);
    setDeleteModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!teacherToDelete) return;
    
    try {
      setDeleting(true);
      await usersAPI.delete(teacherToDelete.id);
      await loadTeachers();
      setDeleteModalOpen(false);
      setTeacherToDelete(null);
      toast.success(`Teacher ${teacherToDelete.firstName} ${teacherToDelete.lastName} deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete teacher:', err);
      toast.error('Failed to delete teacher. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModalOpen(false);
    setTeacherToDelete(null);
  }

  function handleEditClick(teacher: any) {
    setTeacherToEdit(teacher);
    setEditForm({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      role: teacher.role,
    });
    setEditModalOpen(true);
  }

  async function handleEditConfirm() {
    if (!teacherToEdit) return;
    
    try {
      setUpdating(true);
      await usersAPI.update(teacherToEdit.id, editForm);
      await loadTeachers();
      setEditModalOpen(false);
      setTeacherToEdit(null);
      setEditForm({ firstName: "", lastName: "", email: "", role: "teacher" });
      toast.success(`Teacher ${editForm.firstName} ${editForm.lastName} updated successfully!`);
    } catch (err) {
      console.error('Failed to update teacher:', err);
      toast.error('Failed to update teacher. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  function handleEditCancel() {
    setEditModalOpen(false);
    setTeacherToEdit(null);
    setEditForm({ firstName: "", lastName: "", email: "", role: "teacher" });
  }

  async function addTeacher() {
    try {
      setSubmitting(true);
      await usersAPI.create(form);
      setForm({ firstName: "", lastName: "", email: "", role: "teacher" });
      loadTeachers();
      toast.success('Teacher added successfully!');
    } catch (err) {
      console.error('Failed to add teacher:', err);
      toast.error('Failed to add teacher. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <UserGroupIcon className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-600" />
          <span className="text-gray-700">Teacher Management</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Teachers
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Manage teaching staff and monitor their activities across the platform.
        </p>
      </div>

      {/* Add Teacher Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl ring-1 ring-blue-100 p-4 sm:p-6 lg:p-8 w-full max-w-6xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Add New Teacher
        </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="relative">
              <label
                htmlFor="firstName"
                className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
              >
                First Name *
              </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                required
              />
          </div>

          {/* Last Name */}
          <div className="relative">
              <label
                htmlFor="lastName"
                className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
              >
                Last Name *
              </label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                required
              />
            </div>

          </div>

            {/* Email - Full width */}
            <div className="relative">
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
              >
                Email Address *
              </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                required
              />
        </div>

        <button
          onClick={addTeacher}
              disabled={!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || submitting}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
              {submitting ? 'Adding Teacher...' : 'Add Teacher'}
        </button>
          </div>

          {/* Illustration Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm opacity-80">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                <defs>
                  <linearGradient id="teacherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                
                {/* Background elements */}
                <circle cx="320" cy="80" r="4" fill="#E0E7FF" opacity="0.6" />
                <circle cx="300" cy="120" r="3" fill="#DBEAFE" opacity="0.8" />
                <circle cx="340" cy="140" r="2" fill="#C7D2FE" opacity="0.7" />
                
                {/* Blackboard */}
                <rect x="250" y="60" width="120" height="80" rx="8" fill="#1F2937" />
                <rect x="255" y="65" width="110" height="70" rx="4" fill="#374151" />
                
                {/* Math formulas on blackboard */}
                <text x="265" y="85" fill="#F3F4F6" fontSize="8" fontFamily="serif">E = mc²</text>
                <text x="265" y="100" fill="#F3F4F6" fontSize="8" fontFamily="serif">√(a² + b²)</text>
                <text x="265" y="115" fill="#F3F4F6" fontSize="8" fontFamily="serif">∫ f(x)dx</text>
                <text x="265" y="130" fill="#F3F4F6" fontSize="8" fontFamily="serif">π = 3.14159</text>
                
                {/* Teacher figure */}
                <g transform="translate(50, 60)">
                  {/* Body */}
                  <ellipse cx="80" cy="180" rx="45" ry="60" fill="url(#teacherGradient)" />
                  
                  {/* Head */}
                  <circle cx="80" cy="80" r="35" fill="#FBBF24" />
                  
                  {/* Hair */}
                  <path d="M45 70 Q80 45 115 70 Q110 60 105 55 Q95 50 80 50 Q65 50 55 55 Q50 60 45 70 Z" fill="#8B5CF6" />
                  
                  {/* Face features */}
                  <circle cx="70" cy="75" r="2" fill="#374151" />
                  <circle cx="90" cy="75" r="2" fill="#374151" />
                  <path d="M75 85 Q80 90 85 85" stroke="#374151" strokeWidth="1.5" fill="none" />
                  
                  {/* Glasses */}
                  <circle cx="70" cy="75" r="8" fill="none" stroke="#374151" strokeWidth="2" />
                  <circle cx="90" cy="75" r="8" fill="none" stroke="#374151" strokeWidth="2" />
                  <line x1="78" y1="75" x2="82" y2="75" stroke="#374151" strokeWidth="2" />
                  
                  {/* Arms */}
                  <ellipse cx="35" cy="140" rx="15" ry="35" fill="#FBBF24" transform="rotate(-20 35 140)" />
                  <ellipse cx="125" cy="140" rx="15" ry="35" fill="#FBBF24" transform="rotate(20 125 140)" />
                  
                  {/* Pointer stick */}
                  <line x1="140" y1="120" x2="200" y2="90" stroke="#8B4513" strokeWidth="3" />
                  <circle cx="200" cy="90" r="2" fill="#8B4513" />
                </g>
                
                {/* Floating educational icons */}
                <g opacity="0.4">
                  <circle cx="60" cy="50" r="12" fill="#E0E7FF" />
                  <text x="55" y="55" fill="#3B82F6" fontSize="10">📚</text>
                  
                  <circle cx="350" cy="200" r="12" fill="#DBEAFE" />
                  <text x="345" y="205" fill="#1E40AF" fontSize="10">🎓</text>
                  
                  <circle cx="80" cy="250" r="12" fill="#F3E8FF" />
                  <text x="75" y="255" fill="#7C3AED" fontSize="10">✏️</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-blue-100 p-8 hover:shadow-2xl transition-all duration-300">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading teachers...</p>
        ) : filteredTeachers?.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>{searchQuery ? 'No teachers found matching your search.' : 'No teachers found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-gray-700 font-medium">S. No.</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Name</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Email</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers?.map((t, index) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">{index + 1}</td>
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(t)}
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                          title="Edit teacher"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(t)}
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
                          title="Delete teacher"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleDeleteCancel}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Teacher
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete teacher <span className="font-semibold text-gray-700">{teacherToDelete?.firstName} {teacherToDelete?.lastName}</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleEditCancel}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PencilIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Edit Teacher
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleEditConfirm}
                  disabled={updating || !editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()}
                >
                  {updating ? 'Updating...' : 'Update Teacher'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={handleEditCancel}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// classes section starts

function ClassesContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    grade: "",
    section: "",
    academicYear: "",
    teacherId: "",
  });
  const [updating, setUpdating] = useState(false);
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

  // Filter classes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(classItem => {
        const className = classItem.name?.toLowerCase() || '';
        const grade = classItem.grade?.toLowerCase() || '';
        const section = classItem.section?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return className.includes(query) || grade.includes(query) || section.includes(query);
      });
      setFilteredClasses(filtered);
    }
  }, [classes, searchQuery]);

  async function loadClasses() {
    try {
      setLoading(true);
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(classItem: any) {
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!classToDelete) return;
    
    try {
      setDeleting(true);
      await classesAPI.delete(classToDelete.id);
      await loadClasses();
      setDeleteModalOpen(false);
      setClassToDelete(null);
      toast.success(`Class ${classToDelete.name} deleted successfully!`);
    } catch (err) {
      console.error('Failed to delete class:', err);
      toast.error('Failed to delete class. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModalOpen(false);
    setClassToDelete(null);
  }

  function handleEditClick(classItem: any) {
    setClassToEdit(classItem);
    setEditForm({
      name: classItem.name,
      description: classItem.description || "",
      grade: classItem.grade,
      section: classItem.section,
      academicYear: classItem.academicYear,
      teacherId: classItem.teacherId || "",
    });
    setEditModalOpen(true);
  }

  async function handleEditConfirm() {
    if (!classToEdit) return;
    
    try {
      setUpdating(true);
      await classesAPI.update(classToEdit.id, editForm);
      await loadClasses();
      setEditModalOpen(false);
      setClassToEdit(null);
      setEditForm({
        name: "",
        description: "",
        grade: "",
        section: "",
        academicYear: "",
        teacherId: "",
      });
      toast.success(`Class ${editForm.name} updated successfully!`);
    } catch (err) {
      console.error('Failed to update class:', err);
      toast.error('Failed to update class. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  function handleEditCancel() {
    setEditModalOpen(false);
    setClassToEdit(null);
    setEditForm({
      name: "",
      description: "",
      grade: "",
      section: "",
      academicYear: "",
      teacherId: "",
    });
  }

  async function loadTeachersForDropdown() {
    try {
      const response = await usersAPI.getTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Failed to fetch teachers for dropdown:", err);
    }
  }

  async function addClass() {
    try {
      setSubmitting(true);
      await classesAPI.create(form);
      setForm({
        name: "",
        description: "",
        grade: "",
        section: "",
        academicYear: "",
        teacherId: "",
      });
      loadClasses();
      toast.success('Class added successfully!');
    } catch (err) {
      console.error('Failed to add class:', err);
      toast.error('Failed to add class. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
          <span className="text-gray-700">Class Management</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Classes
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Organize classes, assign teachers, and manage academic schedules.
        </p>
      </div>

      {/* Add Class Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-blue-100 p-8 w-full max-w-6xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100">
            <AcademicCapIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Class
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Class Name */}
          <div className="relative">
                <label
                  htmlFor="name"
                  className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
                >
                  Class Name *
                </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  required
                />
          </div>

          {/* Description */}
          <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
                >
                  Description (Optional)
                </label>
            <input
              id="description"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                />
          </div>

          {/* Grade */}
          <div className="relative">
            <label
              htmlFor="grade"
              className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 z-10"
            >
                  Grade *
            </label>
            <select
              id="grade"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  required
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
                  Section *
            </label>
            <select
              id="section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  required
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
                  Academic Year *
            </label>
            <select
              id="academicYear"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  required
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
                  Teacher *
            </label>
            <select
              id="teacherId"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full mt-5 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  required
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
              disabled={!form.name.trim() || !form.grade || !form.section || !form.academicYear || !form.teacherId || submitting}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
              {submitting ? 'Adding Class...' : 'Add Class'}
        </button>
          </div>

          {/* Illustration Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm opacity-80">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                <defs>
                  <linearGradient id="classGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                
                {/* Background elements */}
                <circle cx="50" cy="50" r="3" fill="#E0E7FF" opacity="0.6" />
                <circle cx="350" cy="80" r="4" fill="#DBEAFE" opacity="0.8" />
                <circle cx="370" cy="120" r="2" fill="#C7D2FE" opacity="0.7" />
                
                {/* Books stack */}
                <g transform="translate(80, 120)">
                  <rect x="0" y="20" width="60" height="8" rx="2" fill="#EF4444" />
                  <rect x="5" y="12" width="60" height="8" rx="2" fill="#3B82F6" />
                  <rect x="-5" y="4" width="60" height="8" rx="2" fill="#10B981" />
                  <rect x="2" y="-4" width="60" height="8" rx="2" fill="#F59E0B" />
                </g>
                
                {/* Graduation cap */}
                <g transform="translate(200, 60)">
                  <ellipse cx="0" cy="15" rx="40" ry="8" fill="#1F2937" />
                  <rect x="-35" y="10" width="70" height="10" rx="2" fill="#374151" />
                  <circle cx="35" cy="15" r="2" fill="#F59E0B" />
                  <line x1="35" y1="15" x2="55" y2="5" stroke="#8B4513" strokeWidth="1" />
                </g>
                
                {/* School building */}
                <g transform="translate(250, 140)">
                  <rect x="0" y="0" width="100" height="80" fill="url(#classGradient)" />
                  <rect x="10" y="10" width="15" height="20" fill="#F3F4F6" />
                  <rect x="30" y="10" width="15" height="20" fill="#F3F4F6" />
                  <rect x="50" y="10" width="15" height="20" fill="#F3F4F6" />
                  <rect x="70" y="10" width="15" height="20" fill="#F3F4F6" />
                  <rect x="35" y="50" width="20" height="30" fill="#8B4513" />
                  <circle cx="45" cy="65" r="1" fill="#374151" />
                  <polygon points="0,0 50,0 100,0 50,-20" fill="#DC2626" />
                </g>
                
                {/* Students icons */}
                <g opacity="0.4">
                  <circle cx="60" cy="220" r="15" fill="#E0E7FF" />
                  <text x="53" y="227" fill="#3B82F6" fontSize="12">👨‍🎓</text>
                  
                  <circle cx="120" cy="240" r="15" fill="#DBEAFE" />
                  <text x="113" y="247" fill="#1E40AF" fontSize="12">👩‍🎓</text>
                  
                  <circle cx="180" cy="260" r="15" fill="#F3E8FF" />
                  <text x="173" y="267" fill="#7C3AED" fontSize="12">📖</text>
                </g>
                
                {/* Academic elements */}
                <g opacity="0.3">
                  <circle cx="300" cy="200" r="12" fill="#FEF3C7" />
                  <text x="295" y="205" fill="#D97706" fontSize="10">🏆</text>
                  
                  <circle cx="50" cy="180" r="12" fill="#ECFDF5" />
                  <text x="45" y="185" fill="#059669" fontSize="10">📊</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Class List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-blue-100 p-8 hover:shadow-2xl transition-all duration-300">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search classes by name, grade, or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading classes...</p>
        ) : filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>{searchQuery ? 'No classes found matching your search.' : 'No classes found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-gray-700 font-medium">S. No.</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Name</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Grade</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Section</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Academic Year</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Teacher</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((c, index) => (
                  <tr key={c.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900">{index + 1}</td>
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
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                          title="Edit class"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(c)}
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
                          title="Delete class"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleDeleteCancel}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Class
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete class <span className="font-semibold text-gray-700">{classToDelete?.name} (Grade {classToDelete?.grade} - {classToDelete?.section})</span>? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleEditCancel}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PencilIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Edit Class
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Class Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade
                        </label>
                        <select
                          value={editForm.grade}
                          onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Grade</option>
                          {grades.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section
                        </label>
                        <select
                          value={editForm.section}
                          onChange={(e) => setEditForm({...editForm, section: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Section</option>
                          {sections.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Academic Year
                        </label>
                        <select
                          value={editForm.academicYear}
                          onChange={(e) => setEditForm({...editForm, academicYear: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teacher
                        </label>
                        <select
                          value={editForm.teacherId}
                          onChange={(e) => setEditForm({...editForm, teacherId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleEditConfirm}
                  disabled={updating || !editForm.name.trim() || !editForm.grade || !editForm.section || !editForm.academicYear || !editForm.teacherId}
                >
                  {updating ? 'Updating...' : 'Update Class'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={handleEditCancel}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



