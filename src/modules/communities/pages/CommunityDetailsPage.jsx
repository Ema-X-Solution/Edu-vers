import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { Modal, ConfirmModal } from '@/shared/ui';
import {
  ArrowLeft, Star, Users, Tag, Pin, PinOff, BookOpen, Shield,
  MessageSquare, Heart, X, Calendar, User, Hash,
  ChevronRight, AlertCircle, Loader2, Image, Paperclip,
  MoreVertical, Trash2, Edit2, Send, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchClubDetails,
  fetchPinnedPosts,
  fetchClubPosts,
  createClubPost,
  deleteClubPost,
  toggleLikePost,
  updateClubPost,
  addCommentToPost,
  pinClubPost,
  unpinClubPost
} from '../services/communitiesService';

// ─── Shared Tag Config ────────────────────────────────────────────────────────
const CLUB_TAGS = [
  { value: '#UI',            label: 'UI',            color: 'text-blue-600 bg-blue-50',    solid: 'bg-blue-500' },
  { value: '#CYBERSECURITY', label: 'Cybersecurity', color: 'text-purple-600 bg-purple-50', solid: 'bg-purple-500' },
  { value: '#BACKEND',       label: 'Backend',       color: 'text-green-600 bg-green-50',   solid: 'bg-green-500' },
  { value: '#FRONTEND',      label: 'Frontend',      color: 'text-orange-600 bg-orange-50', solid: 'bg-orange-500' },
  { value: '#MOBILE',        label: 'Mobile',        color: 'text-teal-600 bg-teal-50',     solid: 'bg-teal-500' },
  { value: '#AI',            label: 'AI',            color: 'text-pink-600 bg-pink-50',     solid: 'bg-pink-500' },
  { value: '#DATA_ANALYSIS', label: 'Data Analysis', color: 'text-yellow-600 bg-yellow-50', solid: 'bg-yellow-500' },
  { value: '#NETWORK',       label: 'Network',       color: 'text-indigo-600 bg-indigo-50', solid: 'bg-indigo-500' },
  { value: '#DATABASE',      label: 'Database',      color: 'text-cyan-600 bg-cyan-50',     solid: 'bg-cyan-500' },
];

const getTagMeta = (value) => CLUB_TAGS.find(t => t.value === value);

// ─── Generate gradient style from tags ───────────────────────────────────────
const getTagGradientStyle = (tags = []) => {
  const colorMap = {
    '#UI':            ['#3B82F6', '#1D4ED8'],
    '#CYBERSECURITY': ['#A855F7', '#7C3AED'],
    '#BACKEND':       ['#22C55E', '#15803D'],
    '#FRONTEND':      ['#F97316', '#C2410C'],
    '#MOBILE':        ['#14B8A6', '#0F766E'],
    '#AI':            ['#EC4899', '#BE185D'],
    '#DATA_ANALYSIS': ['#EAB308', '#A16207'],
    '#NETWORK':       ['#6366F1', '#4338CA'],
    '#DATABASE':      ['#06B6D4', '#0E7490'],
  };
  const colors = tags.map(t => colorMap[t]?.[0] || '#6B7280').filter(Boolean);
  if (colors.length === 0) return { background: '#6B7280' };
  if (colors.length === 1) return { background: `linear-gradient(135deg, ${colors[0]}, ${colorMap[tags[0]]?.[1] || colors[0]})` };
  return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` };
};

// ─── Static Community Rules ───────────────────────────────────────────────────
const COMMUNITY_RULES = [
  { id: 1, title: 'Be Respectful', desc: 'Treat all members with kindness and respect, regardless of their background.' },
  { id: 2, title: 'No Spam', desc: 'Do not post repetitive, irrelevant, or promotional content without approval.' },
  { id: 3, title: 'Stay On Topic', desc: 'Keep discussions relevant to the community\'s focus and specialization.' },
  { id: 4, title: 'No Hate Speech', desc: 'Any form of discrimination, harassment, or hate speech is strictly prohibited.' },
  { id: 5, title: 'Cite Your Sources', desc: 'When sharing information or research, always provide proper attribution.' },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────
const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={14}
        className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
    <span className="text-xs font-bold text-gray-600 ml-1">{Number(rating).toFixed(1)}</span>
  </div>
);

// ─── Time Ago Formatter ──────────────────────────────────────────────────────
const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
};

// ─── Mock Posts Data ─────────────────────────────────────────────────────────
const MOCK_POSTS = [
  {
    _id: 'post-1',
    content: "Just finished the macroeconomics research paper! If anyone needs resources on contemporary market trends, I've compiled a list of open-access journals. Happy to share! 📊 #Economics #ResearchLife",
    mediaUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    likesCount: 124,
    commentsCount: 18,
    isLiked: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorId: 'user-sarah',
    authorName: 'Sarah Chen',
    authorRole: 'Economics',
    comments: [
      {
        _id: 'c1',
        content: 'This is amazing! Thank you so much for sharing.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        authorName: 'John Doe'
      }
    ]
  },
  {
    _id: 'post-2',
    content: "Does anyone have experience with the new AI integration in the Cloud Computing lab? I'm hitting some latency issues with the API. 💻 #CloudDev #Help",
    likesCount: 42,
    commentsCount: 31,
    isLiked: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    authorId: 'user-james',
    authorName: 'James Doe',
    authorRole: 'Computer Science',
    comments: []
  }
];

// ─── Create Post Card ────────────────────────────────────────────────────────
const CreatePostCard = ({ clubId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({ fullName: '', userRole: '' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) setUserInfo(JSON.parse(stored));
    } catch {}
  }, []);

  const initials = userInfo.fullName
    ? userInfo.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      await createClubPost(clubId, formData);
      setContent('');
      setFile(null);
      toast.success('Post created successfully!');
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error('Failed to create post:', err);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 mb-5">
      <div className="flex items-start gap-4">
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with your classmates..."
            rows={3}
            className="w-full text-sm text-dark-blue placeholder:text-gray-400 border-none outline-none resize-none bg-transparent pt-2"
          />
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="mt-3 ml-14 relative inline-block group border border-gray-100 rounded-xl overflow-hidden bg-gray-50 p-2">
          {file.type?.startsWith('image/') ? (
            <div className="relative">
              <img src={URL.createObjectURL(file)} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 max-w-[200px]">
              <span className="text-xs font-bold text-dark-blue truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) setFile(e.target.files[0]);
        }}
        className="hidden"
      />

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-3 ml-14">
        <div className="flex items-center gap-3">
          {/* Image Icon Trigger */}
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:bg-gray-50 transition-colors cursor-pointer"
            title="Upload Image"
          >
            <Image size={18} />
          </button>
          
          {/* File/Paperclip Icon Trigger */}
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = '*/*';
                fileInputRef.current.click();
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:bg-gray-50 transition-colors cursor-pointer"
            title="Upload File"
          >
            <Paperclip size={18} />
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !file)}
          className={`h-9 px-5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm
            ${(isSubmitting || (!content.trim() && !file)) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Posting...
            </>
          ) : (
            'Post'
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Post Card ───────────────────────────────────────────────────────────────
const PostCard = ({ post, onPostDeleted, onPostUpdated, onPostPinned, onImageClick, isAdmin }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isLiking, setIsLiking] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showMenu]);

  const authorName = post.authorName || post.userId?.name || post.author?.name || 'Unknown Author';
  const authorRole = post.authorRole || post.userId?.role || post.author?.role || (authorName.includes('Admin') ? 'Admin' : 'Member');
  const authorInitials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const isAuthor = currentUser?.userId === post.authorId || currentUser?._id === post.authorId || currentUser?.userId === post.userId?._id || currentUser?.userId === post.userId;
  const canManage = isAuthor || isAdmin || currentUser?.userRole?.toLowerCase() === 'admin';

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const oldIsLiked = isLiked;
    const oldLikesCount = likesCount;

    setIsLiked(!oldIsLiked);
    setLikesCount(oldIsLiked ? oldLikesCount - 1 : oldLikesCount + 1);

    try {
      await toggleLikePost(post._id);
    } catch (err) {
      console.error('Like request failed:', err);
      setIsLiked(oldIsLiked);
      setLikesCount(oldLikesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setShowComments(true);
      setCommentsLoading(true);
      try {
        const res = await getPostComments(post._id);
        const data = res?.data || res || [];
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    } else {
      setShowComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsCommenting(true);
    try {
      const res = await addCommentToPost(post._id, commentContent);
      const newComment = res?.data || res || {
        _id: Math.random().toString(),
        content: commentContent,
        createdAt: new Date().toISOString(),
        userId: { name: currentUser?.fullName || 'Me' }
      };

      setComments(prev => [...prev, newComment]);
      setCommentContent('');
      toast.success('Comment added!');
    } catch (err) {
      console.error('Comment failed:', err);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentFromPost(post._id, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId && c.id !== commentId));
      toast.success('Comment deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 mb-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm">
            {authorInitials}
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-dark-blue">{authorName}</h4>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {authorRole} • {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Dropdown Menu for Edit/Delete */}
        {canManage && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-dark-blue hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onPostUpdated(post);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#0D9488] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 size={13} /> Edit
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (onPostPinned) onPostPinned(post);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {post.isPinned ? (
                      <><PinOff size={13} /> Unpin Post</>
                    ) : (
                      <><Pin size={13} /> Pin Post</>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onPostDeleted(post);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        {(post.mediaUrl || post.image) && (
          <img
            src={post.mediaUrl || post.image}
            alt="Uploaded attachment"
            className="w-full rounded-2xl border border-gray-100 object-cover max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick && onImageClick(post.mediaUrl || post.image)}
          />
        )}
      </div>

      {/* Footer Actions (Like & Comment Only - No Share) */}
      <div className="flex items-center gap-6 border-t border-gray-50 pt-4 mt-4 text-xs font-bold text-gray-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 group transition-colors cursor-pointer ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
        >
          <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-gray-400 group-hover:text-rose-500'} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 group hover:text-blue-500 transition-colors cursor-pointer"
        >
          <MessageSquare size={16} className="text-gray-400 group-hover:text-blue-500" />
          <span>{comments.length > 0 ? comments.length : (post.commentsCount || 0)}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {/* Comments List */}
          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {comments.map((comment, idx) => {
                const commentUser = comment.authorName || comment.userId?.name || comment.author?.name || 'User';
                const commentInitials = commentUser.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                const isCommentAuthor = currentUser?.userId === comment.authorId || currentUser?._id === comment.authorId || currentUser?.userId === comment.userId?._id || currentUser?.userId === comment.userId;
                const canDeleteComment = isCommentAuthor || isAdmin || currentUser?.userRole?.toLowerCase() === 'admin';

                return (
                  <div key={comment._id || idx} className="flex items-start gap-2.5 group/comment">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {commentInitials}
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-3 py-2 flex-1 min-w-0 relative">
                      <p className="text-xs font-bold text-dark-blue truncate pr-6">{commentUser}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{comment.content}</p>
                      
                      {canDeleteComment && (
                        <button
                          onClick={() => handleDeleteComment(comment._id || comment.id)}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-all cursor-pointer bg-white rounded-full shadow-sm"
                          title="Delete Comment"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-gray-400">No comments yet. Be the first!</div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-xs text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488] bg-gray-50/50"
            />
            <button
              type="submit"
              disabled={isCommenting || !commentContent.trim()}
              className="w-8 h-8 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isCommenting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} className="ml-0.5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ─── Edit Post Modal ──────────────────────────────────────────────────────────
const EditPostModal = ({ isOpen, post, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
      setFile(null);
      setFilePreview(post.mediaUrl || post.image || null);
    }
  }, [isOpen, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !filePreview && !file) return;

    setIsSaving(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append('content', content);
        payload.append('file', file);
      } else {
        payload = { content };
      }

      await updateClubPost(post._id, payload);
      toast.success('Post updated!');
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-dark-blue mb-1">Post Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-dark-blue placeholder:text-gray-400 outline-none focus:border-[#0D9488]"
            placeholder="Edit your post content..."
          />
        </div>

        {/* Image Preview / Edit */}
        <div>
           <label className="block text-xs font-bold text-dark-blue mb-2">Image Attachment (Optional)</label>
           {filePreview ? (
             <div className="relative inline-block border border-gray-200 rounded-xl overflow-hidden group">
               <img src={filePreview} alt="Preview" className="h-24 w-auto object-cover" />
               <button
                 type="button"
                 onClick={() => {
                   setFile(null);
                   setFilePreview(null);
                   if (fileInputRef.current) fileInputRef.current.value = '';
                 }}
                 className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
               >
                 <X size={14} />
               </button>
             </div>
           ) : (
             <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors cursor-pointer"
             >
                <Image size={24} className="mb-1" />
                <span className="text-xs font-semibold">Upload Image</span>
             </button>
           )}
           <input
             type="file"
             ref={fileInputRef}
             className="hidden"
             accept="image/*"
             onChange={(e) => {
               const f = e.target.files?.[0];
               if (f) {
                 setFile(f);
                 setFilePreview(URL.createObjectURL(f));
               }
             }}
           />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || (!content.trim() && !filePreview)}
            className="flex-1 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Post Detail Modal ────────────────────────────────────────────────────────
const PostDetailModal = ({ post, onClose }) => {
  if (!post) return null;
  const authorName = post.userId?.name || post.author?.name || 'Unknown Author';
  const authorInitials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const content = post.content || post.text || post.body || '';
  const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : '';

  return (
    <Modal isOpen={!!post} onClose={onClose} title="Pinned Post" size="md">
      <div className="space-y-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {authorInitials}
          </div>
          <div>
            <p className="text-sm font-bold text-dark-blue">{authorName}</p>
            {createdAt && <p className="text-xs text-gray-400">{createdAt}</p>}
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
            <Pin size={11} /> Pinned
          </span>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content || 'No content available.'}
          </p>
        </div>

        {/* Image if any */}
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-xl object-cover max-h-64"
          />
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <Heart size={13} /> {post.likesCount || post.likes || 0} Likes
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <MessageSquare size={13} /> {post.commentsCount || post.comments || 0} Comments
          </span>
        </div>
      </div>
    </Modal>
  );
};

// ─── Pinned Post Card ─────────────────────────────────────────────────────────
const PinnedPostCard = ({ post, onClick }) => {
  const content = post.preview || post.content || '';
  const isImageString = typeof post.hasImage === 'string' && post.hasImage.startsWith('http');
  const imageUrl = isImageString ? post.hasImage : null;

  return (
    <button
      onClick={() => onClick(post)}
      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group cursor-pointer"
    >
      {/* Icon */}
      {imageUrl ? (
        <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 mt-0.5 border border-gray-100">
           <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
          <Pin size={14} />
        </div>
      )}
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed font-semibold">{content}</p>
        {post.pinnedAt && (
           <p className="text-[10px] text-gray-400 mt-1 font-bold">{new Date(post.pinnedAt).toLocaleDateString()}</p>
        )}
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0D9488] mt-2 shrink-0 transition-colors" />
    </button>
  );
};

// ─── Rules Card ───────────────────────────────────────────────────────────────
const RulesCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
        <Shield size={15} className="text-red-500" />
      </div>
      <h3 className="font-bold text-dark-blue text-sm">Community Rules</h3>
    </div>
    <div className="p-4 space-y-3">
      {COMMUNITY_RULES.map(rule => (
        <div key={rule.id} className="flex gap-3">
          <span className="w-5 h-5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
            {rule.id}
          </span>
          <div>
            <p className="text-xs font-bold text-dark-blue">{rule.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{rule.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Club Info Card ───────────────────────────────────────────────────────────
const ClubInfoCard = ({ club, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-center min-h-[180px]">
        <Loader2 size={24} className="animate-spin text-[#0D9488]" />
      </div>
    );
  }
  if (!club) return null;

  const tags = club.tags || [];
  const gradientStyle = getTagGradientStyle(tags);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-20 relative" style={gradientStyle}>
        <div className="absolute inset-0 bg-black/10" />
        {/* Icon box */}
        <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl border-2 border-white shadow-md flex items-center justify-center text-white font-black text-lg"
          style={gradientStyle}
        >
          {club.name?.charAt(0) || '?'}
        </div>
      </div>

      <div className="px-4 pt-8 pb-4 space-y-3">
        {/* Name & Rating */}
        <div>
          <h3 className="font-extrabold text-dark-blue text-base">{club.name}</h3>
          <div className="mt-1">
            <StarRating rating={club.rating || 0} />
          </div>
        </div>

        {/* Description */}
        {club.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{club.description}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => {
              const meta = getTagMeta(tag);
              return (
                <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta ? meta.color : 'text-gray-600 bg-gray-100'}`}>
                  {meta ? meta.label : tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Members */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
          <Users size={13} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-500">{club.membersCount || 0} Members</span>
        </div>
      </div>
    </div>
  );
};

// ─── Pinned Posts Card ────────────────────────────────────────────────────────
const PinnedPostsCard = ({ posts, isLoading, onPostClick }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
        <Pin size={15} className="text-amber-500" />
      </div>
      <h3 className="font-bold text-dark-blue text-sm">Pinned Posts</h3>
      {posts.length > 0 && (
        <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          {posts.length}
        </span>
      )}
    </div>

    <div className="p-2">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-[#0D9488]" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Pin size={24} className="opacity-30 mb-2" />
          <p className="text-xs font-semibold">No pinned posts yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {posts.map((post, i) => (
            <PinnedPostCard key={post._id || i} post={post} onClick={onPostClick} />
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const CommunityDetailsPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  // Main Posts Feed State
  const [clubPosts, setClubPosts] = useState([]);
  const [clubPostsLoading, setClubPostsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [deletePostTarget, setDeletePostTarget] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info');
      if (stored) {
        const u = JSON.parse(stored);
        setIsAdmin(u.userRole?.toLowerCase() === 'admin');
      }
    } catch {}
  }, []);

  const loadClub = async () => {
    setClubLoading(true);
    try {
      const res = await fetchClubDetails(clubId);
      setClub(res?.data || res || null);
    } catch (err) {
      console.error('Failed to load club:', err);
    } finally {
      setClubLoading(false);
    }
  };

  const loadPinned = async () => {
    setPostsLoading(true);
    try {
      const res = await fetchPinnedPosts(clubId);
      const list = res?.data?.posts || res?.data || res || [];
      setPinnedPosts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load pinned posts:', err);
      setPinnedPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadPosts = async () => {
    setClubPostsLoading(true);
    try {
      const res = await fetchClubPosts(clubId);
      const list = res?.data?.posts || res?.data || res || [];
      setClubPosts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load club posts:', err);
      // Fallback to MOCK_POSTS
      setClubPosts(MOCK_POSTS);
    } finally {
      setClubPostsLoading(false);
    }
  };

  useEffect(() => {
    if (!clubId) return;
    loadClub();
    loadPinned();
    loadPosts();
  }, [clubId]);

  const refreshFeed = async () => {
    try {
      const res = await fetchClubPosts(clubId);
      const list = res?.data?.posts || res?.data || res || [];
      setClubPosts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to refresh club posts:', err);
    }
  };

  const confirmDeletePost = async () => {
    if (!deletePostTarget) return;
    setIsDeletingPost(true);
    try {
      await deleteClubPost(deletePostTarget._id);
      setClubPosts(prev => prev.filter(p => p._id !== deletePostTarget._id));
      toast.success('Post deleted successfully!');
      setDeletePostTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post');
    } finally {
      setIsDeletingPost(false);
    }
  };

  const handleDeletePost = (post) => {
    setDeletePostTarget(post);
  };

  const handlePinPost = async (post) => {
    try {
      if (post.isPinned) {
        await unpinClubPost(post._id);
        toast.success('Post unpinned successfully!');
      } else {
        await pinClubPost(post._id);
        toast.success('Post pinned successfully!');
      }
      loadPinned();
      refreshFeed();
    } catch (err) {
      console.error(err);
      toast.error(post.isPinned ? 'Failed to unpin post' : 'Failed to pin post');
    }
  };

  const gradientStyle = getTagGradientStyle(club?.tags || []);
  const clubName = club?.name || 'Community';

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0D9488] transition-colors mb-5 cursor-pointer group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Communities
      </button>

      {/* Hero Banner */}
      <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-6 shadow-md" style={gradientStyle}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-end p-5">
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow">{clubName}</h1>
            {club?.description && (
              <p className="text-white/80 text-sm mt-1 line-clamp-1">{club.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* ─── Left column: Posts feed ─── */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          {/* Create Post Card */}
          <CreatePostCard clubId={clubId} onPostCreated={refreshFeed} />

          {/* Posts List */}
          {clubPostsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader2 size={24} className="animate-spin text-[#0D9488] mb-3" />
              <p className="text-xs font-semibold">Loading posts...</p>
            </div>
          ) : clubPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[200px] text-gray-400">
              <MessageSquare size={32} className="opacity-20 mb-2" />
              <p className="font-bold text-sm">No posts yet</p>
              <p className="text-xs mt-0.5">Be the first to share something with your classmates!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clubPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  isAdmin={isAdmin}
                  onPostDeleted={handleDeletePost}
                  onPostUpdated={(p) => setEditingPost(p)}
                  onPostPinned={handlePinPost}
                  onImageClick={setFullscreenImage}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── Right column: Rules + Club Info + Pinned Posts ─── */}
        <div className="w-full lg:w-72 lg:shrink-0 space-y-4 order-1 lg:order-2">
          <RulesCard />
          <ClubInfoCard club={club} isLoading={clubLoading} />
          <PinnedPostsCard
            posts={pinnedPosts}
            isLoading={postsLoading}
            onPostClick={(pinnedPost) => {
              const fullPost = clubPosts.find(p => p._id === pinnedPost.postId);
              if (fullPost) {
                setSelectedPost(fullPost);
              } else {
                setSelectedPost({
                  _id: pinnedPost.postId,
                  content: pinnedPost.preview,
                  mediaUrl: typeof pinnedPost.hasImage === 'string' ? pinnedPost.hasImage : null,
                  createdAt: pinnedPost.pinnedAt,
                  authorName: 'Pinned Post'
                });
              }
            }}
          />
        </div>
      </div>

      {/* Post Detail Popup */}
      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={refreshFeed}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deletePostTarget}
        onClose={() => setDeletePostTarget(null)}
        onConfirm={confirmDeletePost}
        isLoading={isDeletingPost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Fullscreen Image Modal */}
      <Modal isOpen={!!fullscreenImage} onClose={() => setFullscreenImage(null)} title="Image Preview" size="2xl">
        <div className="flex items-center justify-center p-2">
          <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CommunityDetailsPage;
