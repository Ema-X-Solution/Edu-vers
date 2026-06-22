import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Search, Flame, GraduationCap, Users, Star, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCommunitiesStatus, joinCommunity, leaveCommunity } from '../services/communitiesService';

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
    category: 'Cyber Security',
    color: 'from-purple-600 to-indigo-600',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Design Guild',
    description: 'A community for UI/UX designers, illustrators, and creatives. Master Figma and build your portfolio.',
    tags: ['#UI/UX', '#Figma'],
    level: 'All Levels',
    tracks: 5,
    members: 185,
    category: 'UI/UX',
    color: 'from-pink-500 to-rose-500',
    rating: 4.9,
  },
  {
    id: 3,
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
    id: 4,
    name: 'Finance Society',
    description: 'Investment banking 101, stock market simulations, and networking with alumni in fintech.',
    tags: ['#Investing', '#Stocks'],
    level: 'Beginner',
    tracks: 1,
    members: 310,
    category: 'Business',
    color: 'from-emerald-500 to-teal-500',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'CyberCrew',
    description: 'The university\'s premier cybersecurity club. We host weekly CTFs, workshops, and guest lectures.',
    tags: ['#Security', '#Hacking'],
    level: 'Advanced',
    tracks: 3,
    members: 240,
    category: 'Cyber Security',
    color: 'from-blue-600 to-cyan-500',
    rating: 4.9,
  },
  {
    id: 6,
    name: 'CyberCrew',
    description: 'The university\'s premier cybersecurity club. We host weekly CTFs, workshops, and guest lectures.',
    tags: ['#Security', '#Hacking'],
    level: 'Advanced',
    tracks: 3,
    members: 240,
    category: 'Cyber Security',
    color: 'from-indigo-500 to-purple-500',
    rating: 4.9,
  },
];
// Categories and mock data removed as requested

const FEATURED_TRACKS = [
  {
    id: 1,
    title: 'CyberCrew Security Week',
    description: 'Join the most popular track this semester. Learn penetration testing basics, network defense, and ethical hacking in a 4-week intensive sprint.',
    color: 'from-teal-500 to-teal-400/80',
    bgLight: 'from-teal-50/50',
    tagColor: 'text-teal-600',
    btnColor: 'bg-[#0D9488] hover:bg-[#0F766E]'
  },
  {
    id: 2,
    title: 'UI/UX Masterclass',
    description: 'Elevate your design skills. Master advanced Figma prototyping, user research, and wireframing techniques in this 3-week bootcamp.',
    color: 'from-pink-500 to-rose-400/80',
    bgLight: 'from-pink-50/50',
    tagColor: 'text-pink-600',
    btnColor: 'bg-pink-500 hover:bg-pink-600'
  },
  {
    id: 3,
    title: 'Full-Stack Spring Boot',
    description: 'Build enterprise-grade applications. Learn Java Spring Boot, REST APIs, and microservices architecture over 5 weeks.',
    color: 'from-indigo-500 to-blue-400/80',
    bgLight: 'from-indigo-50/50',
    tagColor: 'text-indigo-600',
    btnColor: 'bg-indigo-500 hover:bg-indigo-600'
  }
];

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

// ─── Student Community Card ───────────────────────────────────────────────────
const StudentCommunityCard = ({ community }) => {
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(community.isJoined || false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleJoinToggle = async () => {
    if (isActionLoading) return;
    setIsActionLoading(true);
    try {
      if (isJoined) {
        await leaveCommunity(community._id);
        setIsJoined(false);
        toast.success(`Left ${community.name}`);
      } else {
        await joinCommunity(community._id);
        setIsJoined(true);
        toast.success(`Joined ${community.name}`);
      }
    } catch (err) {
      console.error('Failed to toggle join status:', err);
      toast.error('Failed to update membership');
    } finally {
      setIsActionLoading(false);
    }
  };

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
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4" title={community.description}>
          {community.description}
        </p>
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
        <div className="flex items-center gap-5 text-sm text-gray-500 font-semibold mb-5">
          <span className="flex items-center gap-2">
            <Users size={18} /> {community.membersCount || 0} Members
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/student-communities/${community._id}`)}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-dark-blue hover:bg-gray-50 text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            Details
          </button>
          <button 
            onClick={handleJoinToggle}
            disabled={isActionLoading}
            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2
              ${isJoined 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
              ${isActionLoading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isActionLoading && <Loader2 size={14} className="animate-spin" />}
            {isJoined ? 'Leave' : 'Join'}
          </button>
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
  const [isLoading, setIsLoading] = useState(true);

  // Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % FEATURED_TRACKS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch API Logic
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchCommunitiesStatus(search);
        const data = res?.data || res;
        setCommunities(Array.isArray(data) ? data : (data?.communities?.lists || []));
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeout = setTimeout(loadData, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const slide = FEATURED_TRACKS[currentSlide];

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
      <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8 flex flex-col md:flex-row min-h-[260px] relative">
        {/* Left Side - Graphic */}
        <div className={`md:w-1/3 bg-gradient-to-r ${slide.color} p-8 relative overflow-hidden flex items-start transition-colors duration-500`}>
          <span className="text-white text-xs font-black tracking-widest relative z-10 opacity-90 uppercase">
            Trending Now
          </span>
          {/* Abstract Shape Overlay */}
          <div className="absolute -bottom-10 -left-10 w-48 h-64 border border-white/30 rounded-full opacity-50 transform -rotate-12"></div>
        </div>

        {/* Right Side - Content */}
        <div className={`md:w-2/3 p-8 flex flex-col justify-center bg-gradient-to-r ${slide.bgLight} to-white transition-colors duration-500`}>
          <div className={`flex items-center gap-2 ${slide.tagColor} font-bold text-xs uppercase tracking-wider mb-3`}>
            <CheckCircle2 size={16} />
            Featured Track
          </div>
          <h2 className="text-3xl font-black text-dark-blue mb-3">{slide.title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl min-h-[40px]">
            {slide.description}
          </p>
          <div className="flex items-center gap-3">
            <button className={`px-6 py-2.5 ${slide.btnColor} text-white text-sm font-bold rounded-xl transition-colors shadow-sm`}>
              View Track Details
            </button>
          </div>
          
          {/* Slider Dots */}
          <div className="absolute bottom-5 right-8 flex gap-2">
            {FEATURED_TRACKS.map((_, idx) => (
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
          <div className="w-8 h-8 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mb-3"></div>
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
            <StudentCommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default StudentCommunitiesPage;
