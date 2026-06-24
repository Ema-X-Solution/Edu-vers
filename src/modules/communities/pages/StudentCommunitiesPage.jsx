import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Modal } from '@/shared/ui';
import { Search, Flame, GraduationCap, Users, Star, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCommunitiesStatus, joinCommunity, leaveCommunity, fetchTopRatedCommunities, rateCommunity } from '../services/communitiesService';

// ─── Tag definitions ──────────────────────────────────────────────────────────
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

// ─── Gradient helper ──────────────────────────────────────────────────────────
const getGradient = (tags, color) => {
  const tagArr = tags || [];
  if (tagArr.length === 1) {
    const t = CLUB_TAGS.find(t => t.value === tagArr[0]);
    if (t) return `bg-gradient-to-br ${t.from} ${t.to}`;
  } else if (tagArr.length > 1) {
    const t1 = CLUB_TAGS.find(t => t.value === tagArr[0]);
    const t2 = CLUB_TAGS.find(t => t.value === tagArr[1]);
    if (t1 && t2) return `bg-gradient-to-br ${t1.from} ${t2.to}`;
    if (t1) return `bg-gradient-to-br ${t1.from} ${t1.to}`;
  }
  if (color) return `bg-gradient-to-br ${color}`;
  return 'bg-gradient-to-br from-teal-500 to-teal-700';
};

// ─── Rating Modal ─────────────────────────────────────────────────────────────
const RatingModal = ({ isOpen, onClose, community }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) { setHoveredStar(0); setSelectedStar(0); }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedStar) { toast.error('Please select a rating first.'); return; }
    setIsLoading(true);
    try {
      await rateCommunity(community._id, { score: selectedStar });
      toast.success('Rating submitted successfully!');
      onClose();
    } catch (error) {
      let errorMsg = 'Failed to submit rating.';
      if (error?.message) errorMsg = Array.isArray(error.message) ? error.message.join('\n') : error.message;
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Community" size="sm">
      <div className="flex flex-col items-center gap-5 py-2">
        <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center">
          <Star size={32} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-extrabold text-dark-blue mb-1">{community?.name}</h3>
          <p className="text-sm text-gray-500">How would you rate this community?</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedStar(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110 cursor-pointer focus:outline-none"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  star <= (hoveredStar || selectedStar)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200 fill-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="h-6">
          {(hoveredStar || selectedStar) > 0 && (
            <span className="text-sm font-bold text-yellow-500">{ratingLabels[hoveredStar || selectedStar]}</span>
          )}
        </div>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose} className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedStar}
            className={`flex-1 h-10 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${isLoading || !selectedStar ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Star size={16} className="fill-white" />
            {isLoading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Student Community Card ───────────────────────────────────────────────────
const StudentCommunityCard = ({ community, onRate, onLeaveClick, onJoinSuccess }) => {
  const navigate = useNavigate();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleJoin = async () => {
    if (isActionLoading) return;
    setIsActionLoading(true);
    try {
      await joinCommunity(community._id);
      toast.success(`Joined ${community.name}`);
      if (onJoinSuccess) onJoinSuccess();
    } catch (err) {
      console.error('Failed to join:', err);
      toast.error('Failed to join community');
    } finally {
      setIsActionLoading(false);
    }
  };

  const bgGradient = getGradient(community.tags, community.color);
  const hasImage = !!community.imageUrl;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Card Banner — image if available, gradient fallback */}
      <div className={`h-28 relative ${!hasImage ? bgGradient : ''}`}>
        {hasImage && (
          <img src={community.imageUrl} alt={community.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 rounded-lg px-2.5 py-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-bold">{community.rating ?? 0}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 pt-0 relative flex-1 flex flex-col">
        {/* Icon floating */}
        <div className="absolute -top-8 left-5">
          <div className={`w-16 h-16 rounded-2xl ${bgGradient} flex items-center justify-center border-4 border-white shadow-sm`}>
            {hasImage ? (
              <img src={community.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Users size={28} className="text-white" />
            )}
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-extrabold text-dark-blue text-xl mb-2">{community.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4" title={community.description}>
            {community.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(community.tags || []).map(tag => {
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
          <div className="flex items-center gap-5 text-sm text-gray-500 font-semibold mb-5">
            <span className="flex items-center gap-2">
              <Users size={18} /> {community.membersCount || 0} Members
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {community.isMember ? (
              <>
                <button
                  onClick={() => onRate(community)}
                  className="h-10 px-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-600 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  Rate
                </button>
                <button
                  onClick={() => navigate(`/student-communities/${community._id}`)}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-dark-blue hover:bg-gray-50 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  View
                </button>
                <button
                  onClick={() => onLeaveClick(community)}
                  className="flex-1 h-10 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
                >
                  Leave
                </button>
              </>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isActionLoading}
                className={`flex-1 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${isActionLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isActionLoading && <Loader2 size={14} className="animate-spin" />}
                Join Community
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const StudentCommunitiesPage = () => {
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [topCommunities, setTopCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sliderActionLoading, setSliderActionLoading] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [leaveTarget, setLeaveTarget] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-advance slider
  useEffect(() => {
    if (topCommunities.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % topCommunities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [topCommunities]);

  // Fetch data with debounce
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statusRes, topRes] = await Promise.all([
          fetchCommunitiesStatus(search),
          fetchTopRatedCommunities(),
        ]);
        const data = statusRes?.data || statusRes;
        setCommunities(Array.isArray(data) ? data : (data?.communities?.lists || []));

        const topData = topRes?.data || topRes;
        setTopCommunities(Array.isArray(topData) ? topData : (topData?.communities || topData?.data || []));
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(loadData, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleConfirmLeave = async () => {
    if (!leaveTarget) return;
    setIsLeaving(true);
    try {
      await leaveCommunity(leaveTarget._id);
      toast.success(`Left ${leaveTarget.name}`);
      setCommunities(prev => prev.map(c => c._id === leaveTarget._id ? { ...c, isMember: false } : c));
      setTopCommunities(prev => prev.map(c => c._id === leaveTarget._id ? { ...c, isMember: false } : c));
      setLeaveTarget(null);
    } catch (err) {
      console.error('Failed to leave:', err);
      toast.error('Failed to leave community');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleSliderJoinToggle = async (community) => {
    if (sliderActionLoading) return;
    setSliderActionLoading(true);
    try {
      if (community.isMember) {
        await leaveCommunity(community._id);
        toast.success(`Left ${community.name}`);
        setTopCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: false } : c));
        setCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: false } : c));
      } else {
        await joinCommunity(community._id);
        toast.success(`Joined ${community.name}`);
        setTopCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: true } : c));
        setCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: true } : c));
      }
    } catch (err) {
      console.error('Failed to toggle join status:', err);
      toast.error('Failed to update membership');
    } finally {
      setSliderActionLoading(false);
    }
  };

  const slide = topCommunities.length > 0 ? topCommunities[currentSlide] : null;

  const SLIDER_COLORS = [
    { color: 'from-teal-500 to-teal-400/80', bgLight: 'from-teal-50/50', tagColor: 'text-teal-600', btnColor: 'bg-[#0D9488] hover:bg-[#0F766E]' },
    { color: 'from-pink-500 to-rose-400/80', bgLight: 'from-pink-50/50', tagColor: 'text-pink-600', btnColor: 'bg-pink-500 hover:bg-pink-600' },
    { color: 'from-indigo-500 to-blue-400/80', bgLight: 'from-indigo-50/50', tagColor: 'text-indigo-600', btnColor: 'bg-indigo-500 hover:bg-indigo-600' },
    { color: 'from-purple-500 to-fuchsia-400/80', bgLight: 'from-purple-50/50', tagColor: 'text-purple-600', btnColor: 'bg-purple-500 hover:bg-purple-600' },
    { color: 'from-orange-500 to-amber-400/80', bgLight: 'from-orange-50/50', tagColor: 'text-orange-600', btnColor: 'bg-orange-500 hover:bg-orange-600' },
  ];

  const slideColor = SLIDER_COLORS[currentSlide % SLIDER_COLORS.length];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-dark-blue tracking-tight">Explore Learning Communities</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Find clubs, join tracks, and level up your skills with peers.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Flame size={20} className="text-green-500 fill-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-gray-400 tracking-wider">STREAK</span>
              <span className="text-sm font-bold text-dark-blue">12 Days</span>
            </div>
          </div>
          {/* Joined Badge */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <GraduationCap size={20} className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-gray-400 tracking-wider">JOINED</span>
              <span className="text-sm font-bold text-dark-blue">4 Clubs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner (Slider) */}
      {slide && (
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8 flex flex-col md:flex-row min-h-[260px] relative">
          {/* Left Side — image if available, gradient fallback */}
          <div className={`md:w-1/3 relative overflow-hidden flex items-start transition-colors duration-500 ${!slide.imageUrl ? `bg-gradient-to-r ${slideColor.color} p-8` : ''}`}>
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <span className="text-white text-xs font-black tracking-widest relative z-10 opacity-90 uppercase">
                  Trending Now
                </span>
                <div className="absolute -bottom-10 -left-10 w-48 h-64 border border-white/30 rounded-full opacity-50 transform -rotate-12" />
              </>
            )}
            {slide.imageUrl && (
              <span className="relative z-10 m-4 text-white text-xs font-black tracking-widest opacity-90 uppercase bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                Trending Now
              </span>
            )}
          </div>

          {/* Right Side — Content */}
          <div className={`md:w-2/3 p-8 flex flex-col justify-center bg-gradient-to-r ${slideColor.bgLight} to-white transition-colors duration-500`}>
            <div key={currentSlide} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className={`flex items-center gap-2 ${slideColor.tagColor} font-bold text-xs uppercase tracking-wider mb-3`}>
                <CheckCircle2 size={16} />
                Top Rated Community
              </div>
              <h2 className="text-3xl font-black text-dark-blue mb-3">{slide.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl min-h-[40px] line-clamp-3">
                {slide.description}
              </p>
              <div className="flex items-center gap-3">
                {slide.isMember ? (
                  <>
                    <button
                      onClick={() => navigate(`/student-communities/${slide._id}`)}
                      className="px-6 py-2.5 text-dark-blue bg-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center hover:bg-gray-50"
                    >
                      View Community
                    </button>
                    <button
                      onClick={() => setLeaveTarget(slide)}
                      className="px-6 py-2.5 text-white bg-gray-400 hover:bg-gray-500 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      Leave Community
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSliderJoinToggle(slide)}
                    disabled={sliderActionLoading}
                    className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2
                      ${slideColor.btnColor}
                      ${sliderActionLoading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {sliderActionLoading && <Loader2 size={14} className="animate-spin" />}
                    Join this community
                  </button>
                )}
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-5 right-8 flex gap-2">
              {topCommunities.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-dark-blue' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for clubs, tracks, or topics (e.g. Python, Finance)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] transition-colors bg-white shadow-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-semibold">Loading communities...</p>
        </div>
      ) : communities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users size={48} className="mb-3 opacity-30" />
          <p className="font-semibold">No communities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {communities.map((community) => (
            <StudentCommunityCard
              key={community._id}
              community={community}
              onRate={(c) => setRatingTarget(c)}
              onLeaveClick={(c) => setLeaveTarget(c)}
              onJoinSuccess={() => {
                setCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: true } : c));
                setTopCommunities(prev => prev.map(c => c._id === community._id ? { ...c, isMember: true } : c));
              }}
            />
          ))}
        </div>
      )}

      <RatingModal
        isOpen={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        community={ratingTarget}
      />

      <Modal isOpen={!!leaveTarget} onClose={() => setLeaveTarget(null)} title="Leave Community" size="sm">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
            <Users size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-dark-blue">Are you sure?</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Do you really want to leave <strong>{leaveTarget?.name}</strong>? You will lose access to its resources and discussions.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => setLeaveTarget(null)}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLeave}
              disabled={isLeaving}
              className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLeaving && <Loader2 size={16} className="animate-spin" />}
              Confirm Leave
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentCommunitiesPage;
