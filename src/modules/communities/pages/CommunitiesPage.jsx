import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Modal, ConfirmModal } from '@/shared/ui';
import {
  Search, Plus, Hash, Users, Star, Trash2, Eye,
  Upload, Bell, ChevronDown, X, GraduationCap, Check, Activity, Pin, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCommunitiesStatus, createCommunity, updateCommunity, deleteCommunity } from '../services/communitiesService';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: 'CyberCrew',
    description: 'The university\'s premier cybersecurity club. We host weekly CTFs, workshops, and guest lectures.',
    tags: ['#Security', '#Hacking'],
    level: 'Advanced',
    tracks: 3,
    members: 240,
    category: 'Coding',
    color: 'from-purple-600 to-indigo-600',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Robotics Club',
    description: 'Building autonomous drones and fighting robots. Learn Arduino, soldering, and mechanical engineering.',
    tags: ['#Hardware', '#Arduino'],
    level: 'Intermediate',
    tracks: 2,
    members: 95,
    category: 'Engineering',
    color: 'from-orange-500 to-amber-500',
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Finance Society',
    description: 'Investment banking, stock market analysis, and networking with alumni in fintech companies.',
    tags: ['#Investing', '#Stocks'],
    level: 'Beginner',
    tracks: 1,
    members: 310,
    category: 'Business',
    color: 'from-emerald-500 to-teal-500',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'CyberCrew',
    description: 'The university\'s premier cybersecurity club. We host weekly CTFs, workshops, and guest lectures.',
    tags: ['#Security', '#Hacking'],
    level: 'Advanced',
    tracks: 3,
    members: 240,
    category: 'Coding',
    color: 'from-blue-600 to-cyan-500',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'AI Research Lab',
    description: 'Exploring machine learning, neural networks, and applied AI projects with real-world datasets.',
    tags: ['#AI', '#MachineLearning'],
    level: 'Advanced',
    tracks: 4,
    members: 180,
    category: 'Coding',
    color: 'from-pink-500 to-rose-500',
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Design Guild',
    description: 'UX/UI design, prototyping in Figma, and brand identity for student-run startups.',
    tags: ['#UX', '#Figma'],
    level: 'Beginner',
    tracks: 2,
    members: 145,
    category: 'Design',
    color: 'from-violet-500 to-purple-600',
    rating: 4.7,
  },
];

// Categories and Levels removed as requested

const CLUB_TAGS = [
  { value: '#UI', label: 'UI', color: 'text-blue-600 bg-blue-50', from: 'from-blue-500', to: 'to-blue-600' },
  { value: '#CYBERSECURITY', label: 'Cybersecurity', color: 'text-purple-600 bg-purple-50', from: 'from-purple-500', to: 'to-purple-600' },
  { value: '#BACKEND', label: 'Backend', color: 'text-green-600 bg-green-50', from: 'from-green-500', to: 'to-green-600' },
  { value: '#FRONTEND', label: 'Frontend', color: 'text-orange-600 bg-orange-50', from: 'from-orange-500', to: 'to-orange-600' },
  { value: '#MOBILE', label: 'Mobile', color: 'text-teal-600 bg-teal-50', from: 'from-teal-500', to: 'to-teal-600' },
  { value: '#AI', label: 'AI', color: 'text-pink-600 bg-pink-50', from: 'from-pink-500', to: 'to-pink-600' },
  { value: '#DATA_ANALYSIS', label: 'Data Analysis', color: 'text-yellow-600 bg-yellow-50', from: 'from-yellow-500', to: 'to-yellow-600' },
  { value: '#NETWORK', label: 'Network', color: 'text-indigo-600 bg-indigo-50', from: 'from-indigo-500', to: 'to-indigo-600' },
  { value: '#DATABASE', label: 'Database', color: 'text-cyan-600 bg-cyan-50', from: 'from-cyan-500', to: 'to-cyan-600' },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${checked ? 'bg-[#0D9488]' : 'bg-gray-200'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Community Card ───────────────────────────────────────────────────────────
const CommunityCard = ({ community, onDelete, onEdit, onView }) => {
  const tags = community.tags || [];
  let bgGradient = 'bg-gray-400';
  
  if (tags.length === 1) {
    const tag1 = CLUB_TAGS.find(t => t.value === tags[0]);
    if (tag1) bgGradient = `bg-gradient-to-br ${tag1.from} ${tag1.to}`;
  } else if (tags.length > 1) {
    const tag1 = CLUB_TAGS.find(t => t.value === tags[0]);
    const tag2 = CLUB_TAGS.find(t => t.value === tags[1]);
    if (tag1 && tag2) bgGradient = `bg-gradient-to-br ${tag1.from} ${tag2.to}`;
    else if (tag1) bgGradient = `bg-gradient-to-br ${tag1.from} ${tag1.to}`;
  } else if (community.color) {
    bgGradient = `bg-gradient-to-br ${community.color}`;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Card Banner */}
      <div className={`h-28 ${bgGradient} relative`}>
        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 rounded-lg px-2.5 py-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-bold">{community.rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 pt-0 relative flex-1 flex flex-col">
        {/* Icon floating */}
        <div className="absolute -top-8 left-5">
          <div className={`w-16 h-16 rounded-2xl ${bgGradient} flex items-center justify-center border-4 border-white shadow-sm`}>
            <Users size={28} className="text-white" />
          </div>
        </div>

      <div className="mt-12">
        <h3 className="font-extrabold text-dark-blue text-xl mb-2">{community.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4" title={community.description}>{community.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {community.tags?.map(tag => {
          const matchedTag = CLUB_TAGS.find(t => t.value === tag);
          return (
            <span key={tag} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${matchedTag ? matchedTag.color : 'text-gray-600 bg-gray-100'}`}>
              {matchedTag ? matchedTag.label : tag}
            </span>
          );
        })}
      </div>

      <div className="mt-auto">
        <hr className="border-t border-dashed border-gray-200 mb-4" />
        
        {/* Meta */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5"><Users size={14} /> {community.membersCount || 0} Members</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(community)}
            className="flex-1 h-10 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(community)}
            className="flex-1 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            Delete
          </button>
          <button
            onClick={() => onView(community)}
            className="flex-1 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            View
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

// ─── Community Modal ──────────────────────────────────────────────────────────
const CommunityModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState({
    private: true,
    pinPost: true,
    greatPost: true,
  });
  const [dragOver, setDragOver] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDescription(initialData.description || '');
        if (initialData.tags) {
          const mappedTags = initialData.tags.map(t => CLUB_TAGS.find(ct => ct.value === t)).filter(Boolean);
          setSelectedTags(mappedTags);
        } else {
          setSelectedTags([]);
        }
      } else {
        setName('');
        setDescription('');
        setSelectedTags([]);
      }
      setFile(null);
      setIsTagsDropdownOpen(false);
    }
  }, [isOpen, initialData]);

  const toggleTag = (tag) => {
    if (selectedTags.find(t => t.value === tag.value)) {
      setSelectedTags(selectedTags.filter(t => t.value !== tag.value));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const removeTag = (tagValue, e) => {
    e.stopPropagation();
    setSelectedTags(selectedTags.filter(t => t.value !== tagValue));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData) {
        // Update
        const payload = {
          name,
          description,
          tags: selectedTags.map(t => t.value)
        };
        await updateCommunity(initialData._id, payload);
        toast.success('Community updated successfully!');
      } else {
        // Create
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        selectedTags.forEach((t, i) => formData.append(`tags[${i}]`, t.value));
        if (file) {
          formData.append('file', file);
        }
        await createCommunity(formData);
        toast.success('Community created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Operation failed', error);
      let errorMsg = 'Operation failed.';
      if (error && error.message) {
        if (Array.isArray(error.message)) {
          errorMsg = error.message.join('\n');
        } else {
          errorMsg = error.message;
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Community" : "Create New Community"} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-dark-blue mb-1.5">
            Community Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Physics Department"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark-blue mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What is this community about?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] transition-colors resize-none"
          />
        </div>
        <div className="relative">
          <label className="block text-xs font-bold text-dark-blue mb-1.5">
            Tags (Max 3)
          </label>
          <div 
            onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
            className={`min-h-[44px] w-full px-3 py-2 rounded-xl border text-sm transition-colors cursor-pointer flex flex-wrap items-center gap-2
              ${isTagsDropdownOpen ? 'border-[#0D9488]' : 'border-gray-200'} bg-white`}
          >
            {selectedTags.length === 0 && (
              <span className="text-gray-400">Select up to 3 tags...</span>
            )}
            {selectedTags.map(tag => (
              <span 
                key={tag.value} 
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${tag.color}`}
              >
                {tag.value}
                <button 
                  type="button" 
                  onClick={(e) => removeTag(tag.value, e)}
                  className="hover:opacity-70 ml-0.5 focus:outline-none cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <div className="ml-auto shrink-0">
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {isTagsDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              <div className="p-2 flex flex-col gap-1">
                {CLUB_TAGS.map(tag => {
                  const isSelected = selectedTags.find(t => t.value === tag.value);
                  const isDisabled = !isSelected && selectedTags.length >= 3;
                  return (
                    <button
                      key={tag.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors
                        ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${tag.color}`}>
                        {tag.value}
                      </span>
                      {isSelected && <Check size={14} className="text-[#0D9488]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors relative
            ${dragOver ? 'border-[#0D9488] bg-[#f0fdfa]' : 'border-[#0D9488]/40 bg-white hover:bg-gray-50'}`}
        >
          <input 
            type="file" 
            onChange={handleFileSelect} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
          />
          <Upload size={28} className="text-[#0D9488]" />
          <p className="text-xs text-gray-500 text-center">
            <span className="text-[#0D9488] font-bold hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-[10px] text-gray-400">SVG, PNG, JPG or GIF (max, 800x400px)</p>
          {file && (
            <p className="mt-2 text-xs font-bold text-dark-blue break-all bg-blue-50 px-2 py-1 rounded">Selected: {file.name}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-gray-500" />
            <span className="text-sm font-bold text-dark-blue">Permeation</span>
          </div>
          {[
            { key: 'private', label: 'private community', desc: 'cannot Allow Any person Acess Community' },
            { key: 'pinPost', label: 'pin post', desc: 'can any person pin post in community' },
            { key: 'greatPost', label: 'Great post', desc: 'Cannot any person Great post Before Ask Admin' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-dark-blue">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <Toggle
                checked={permissions[item.key]}
                onChange={(val) => setPermissions(prev => ({ ...prev, [item.key]: val }))}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center
              ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Community')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CommunitiesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, pinnedPosts: 0, totalMembers: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchCommunitiesStatus(search);
      const data = res?.data || res;
      setCommunities(Array.isArray(data) ? data : (data?.communities?.lists || []));
      setStats({
        count: Array.isArray(data) ? data.length : (data?.communities?.count || 0),
        totalPosts: data?.totalPosts?.count || 0,
        pinnedPosts: data?.pinnedPosts?.count || 0,
        totalMembers: data?.totalMembers?.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch communities status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = (community) => {
    setDeleteTarget(community);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCommunity(deleteTarget._id);
      setCommunities(prev => prev.filter(c => c._id !== deleteTarget._id));
      toast.success('Community deleted successfully!');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete:', error);
      let errorMsg = 'Failed to delete community';
      if (error && error.message) {
        if (Array.isArray(error.message)) {
          errorMsg = error.message.join('\n');
        } else {
          errorMsg = error.message;
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setEditingCommunity(null);
    setIsModalOpen(true);
  };

  const openEdit = (community) => {
    setEditingCommunity(community);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-blue">Community Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage communities, posts, and member activity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="h-10 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-[0_4px_12px_rgba(13,148,136,0.25)]"
          >
            <Plus size={16} /> New Community
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f0fdfa] flex items-center justify-center">
            <Users size={22} className="text-[#0D9488]" />
          </div>
          <div>
            <p className="text-3xl font-black text-dark-blue">{stats.count}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Communities</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-dark-blue">{stats.totalMembers}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Total Members</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Activity size={22} className="text-purple-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-dark-blue">{stats.totalPosts}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Total Posts</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <Pin size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-dark-blue">{stats.pinnedPosts}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Pinned Posts</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative w-full sm:w-[400px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for clubs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] transition-colors bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-semibold">Loading communities...</p>
        </div>
      ) : communities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users size={48} className="mb-3 opacity-30" />
          <p className="font-semibold">No communities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {communities.map((community) => (
            <CommunityCard 
              key={community._id} 
              community={community} 
              onDelete={handleDelete} 
              onEdit={openEdit}
              onView={(c) => navigate(`/communities/${c._id}`)}
            />
          ))}
        </div>
      )}

      <CommunityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCommunity}
        onSuccess={loadData}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Community"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </DashboardLayout>
  );
};

export default CommunitiesPage;
