import httpClient from '@/shared/services/httpClient';

export const fetchCommunitiesStatus = async (search = '') => {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  return await httpClient.get(`/community/status?${query.toString()}`);
};

export const fetchTopRatedCommunities = async () => {
  return await httpClient.get(`/community/top-rated`);
};

export const createCommunity = async (formData) => {
  return await httpClient.post('/community/create-club', formData);
};

export const updateCommunity = async (clubId, payload) => {
  return await httpClient.patch(`/community/clubs/${clubId}`, payload);
};

export const deleteCommunity = async (clubId) => {
  return await httpClient.delete(`/community/clubs/${clubId}`);
};

export const fetchClubDetails = async (clubId) => {
  return await httpClient.get(`/community/${clubId}`);
};

export const fetchPinnedPosts = async (clubId) => {
  return await httpClient.get(`/community/club/${clubId}/pinned-posts`);
};

export const fetchClubPosts = async (clubId) => {
  return await httpClient.get(`/community/club/${clubId}/posts`);
};

export const createClubPost = async (clubId, formData) => {
  return await httpClient.post(`/community/clubs/${clubId}/post`, formData);
};

export const deleteClubPost = async (postId) => {
  return await httpClient.delete(`/community/post/${postId}`);
};

export const toggleLikePost = async (postId) => {
  return await httpClient.post(`/community/post/${postId}/like`);
};

export const updateClubPost = async (postId, payload) => {
  return await httpClient.patch(`/community/post/${postId}`, payload);
};

export const getPostComments = async (postId) => {
  return await httpClient.get(`/community/posts/${postId}/comments`);
};

export const addCommentToPost = async (postId, content) => {
  return await httpClient.post(`/community/posts/${postId}/comments`, { content });
};

export const deleteCommentFromPost = async (postId, commentId) => {
  return await httpClient.delete(`/community/comments/${commentId}`);
};

export const pinClubPost = async (postId) => {
  return await httpClient.patch(`/community/post/${postId}/pin`);
};

export const unpinClubPost = async (postId) => {
  return await httpClient.patch(`/community/post/${postId}/unpin`);
};

export const joinCommunity = async (clubId) => {
  return await httpClient.post(`/community/clubs/${clubId}/join`);
};

export const leaveCommunity = async (clubId) => {
  return await httpClient.get(`/community/clubs/${clubId}/leave`);
};

export const rateCommunity = async (clubId, payload) => {
  return await httpClient.post(`/community/${clubId}/rate`, payload);
};
