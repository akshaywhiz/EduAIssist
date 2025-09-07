"use client";

import { useState, useEffect } from "react";
import { subjectsAPI } from "@/lib/api";
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export function SubjectsContent() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    code: "",
  });
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    code: "",
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  // Filter subjects based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubjects(subjects);
    } else {
      const filtered = subjects.filter(subject => {
        const name = subject.name?.toLowerCase() || '';
        const description = subject.description?.toLowerCase() || '';
        const code = subject.code?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        
        return name.includes(query) || description.includes(query) || code.includes(query);
      });
      setFilteredSubjects(filtered);
    }
  }, [subjects, searchQuery]);

  async function loadSubjects() {
    try {
      setLoading(true);
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      toast.error('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  function handleDeleteClick(subject: any) {
    setSubjectToDelete(subject);
    setDeleteModalOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!subjectToDelete) return;
    
    try {
      setDeleting(true);
      await subjectsAPI.delete(subjectToDelete.id);
      await loadSubjects();
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
      toast.success(`Subject ${subjectToDelete.name} deleted successfully!`);
    } catch (err) {
      toast.error('Failed to delete subject. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteModalOpen(false);
    setSubjectToDelete(null);
  }

  function handleEditClick(subject: any) {
    setSubjectToEdit(subject);
    setEditForm({
      name: subject.name,
      description: subject.description || "",
      code: subject.code || "",
    });
    setEditModalOpen(true);
  }

  async function handleEditConfirm() {
    if (!subjectToEdit) return;
    
    try {
      setUpdating(true);
      await subjectsAPI.update(subjectToEdit.id, editForm);
      await loadSubjects();
      setEditModalOpen(false);
      setSubjectToEdit(null);
      setEditForm({ name: "", description: "", code: "" });
      toast.success(`Subject ${editForm.name} updated successfully!`);
    } catch (err) {
      toast.error('Failed to update subject. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  function handleEditCancel() {
    setEditModalOpen(false);
    setSubjectToEdit(null);
    setEditForm({ name: "", description: "", code: "" });
  }

  async function addSubject() {
    try {
      setSubmitting(true);
      await subjectsAPI.create(form);
      setForm({ name: "", description: "", code: "" });
      loadSubjects();
      toast.success('Subject added successfully!');
    } catch (err) {
      toast.error('Failed to add subject. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 px-3 lg:px-4 py-2 text-xs lg:text-sm shadow-sm ring-1 ring-blue-100 backdrop-blur">
          <BookOpenIcon className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-600" />
          <span className="text-gray-700">Subject Management</span>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl lg:text-4xl font-bold tracking-tight text-transparent">
          Subjects
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-600">
          Manage general academic subjects available across all classes in your institution.
        </p>
      </div>

      {/* Add Subject Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl ring-1 ring-blue-100 p-4 sm:p-6 lg:p-8 w-full max-w-6xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100">
            <BookOpenIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Subject
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  id="subjectName"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  placeholder="Enter subject name"
                  required
                />
              </div>

              {/* Subject Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code (Optional)
                </label>
                <input
                  id="subjectCode"
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                  placeholder="Enter subject code (e.g., MATH, SCI)"
                />
              </div>
            </div>

            {/* Description - Full width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="subjectDescription"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
                placeholder="Enter subject description"
              />
            </div>

            <button
              onClick={addSubject}
              disabled={!form.name.trim() || submitting}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-8 py-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding Subject...' : 'Add Subject'}
            </button>
          </div>

          {/* Illustration Section */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm opacity-80">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                <defs>
                  <linearGradient id="subjectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                
                {/* Background elements */}
                <circle cx="50" cy="50" r="3" fill="#E0E7FF" opacity="0.6" />
                <circle cx="350" cy="80" r="4" fill="#DBEAFE" opacity="0.8" />
                <circle cx="370" cy="120" r="2" fill="#C7D2FE" opacity="0.7" />
                
                {/* Books stack */}
                <g transform="translate(150, 120)">
                  <rect x="0" y="20" width="80" height="12" rx="2" fill="#EF4444" />
                  <rect x="5" y="8" width="80" height="12" rx="2" fill="#3B82F6" />
                  <rect x="-5" y="-4" width="80" height="12" rx="2" fill="#10B981" />
                  <rect x="2" y="-16" width="80" height="12" rx="2" fill="#F59E0B" />
                  
                  {/* Book labels */}
                  <text x="40" y="26" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Math</text>
                  <text x="45" y="14" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">Science</text>
                  <text x="35" y="2" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">English</text>
                  <text x="42" y="-10" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">History</text>
                </g>
                
                {/* Academic elements */}
                <g opacity="0.4">
                  <circle cx="60" cy="220" r="15" fill="#E0E7FF" />
                  <text x="53" y="227" fill="#3B82F6" fontSize="12">📚</text>
                  
                  <circle cx="320" cy="240" r="15" fill="#DBEAFE" />
                  <text x="313" y="247" fill="#1E40AF" fontSize="12">🔬</text>
                  
                  <circle cx="80" cy="180" r="15" fill="#F3E8FF" />
                  <text x="73" y="187" fill="#7C3AED" fontSize="12">📝</text>
                  
                  <circle cx="300" cy="180" r="15" fill="#FEF3C7" />
                  <text x="293" y="187" fill="#D97706" fontSize="12">🎨</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Subject List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-blue-100 p-8 hover:shadow-2xl transition-all duration-300">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subjects by name, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading subjects...</p>
        ) : filteredSubjects.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-500">
            <span className="text-4xl mb-2">📭</span>
            <p>{searchQuery ? 'No subjects found matching your search.' : 'No subjects found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-gray-700 font-medium">S. No.</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Subject Name</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Code</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Description</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="py-3 px-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((s, index) => (
                  <tr key={s.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{s.name}</td>
                    <td className="py-3 px-4 text-gray-900">{s.code || '-'}</td>
                    <td className="py-3 px-4 text-gray-900 max-w-xs truncate">{s.description || '-'}</td>
                    <td className="py-3 px-4">
                      {s.isActive ? (
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
                          onClick={() => handleEditClick(s)}
                          className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                          title="Edit subject"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(s)}
                          className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
                          title="Delete subject"
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
                    Delete Subject
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete subject <span className="font-semibold text-gray-700">{subjectToDelete?.name}</span>? This action cannot be undone.
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

      {/* Edit Subject Modal */}
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
                    Edit Subject
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Subject Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Code
                        </label>
                        <input
                          type="text"
                          value={editForm.code}
                          onChange={(e) => setEditForm({...editForm, code: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Subject Code"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Subject Description"
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
                  disabled={updating || !editForm.name.trim()}
                >
                  {updating ? 'Updating...' : 'Update Subject'}
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
