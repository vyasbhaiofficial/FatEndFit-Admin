import axios from "axios";

export const API_BASE = "http://localhost:3002/api/v1";
// export const API_BASE = "https://fatendfit.codestoreapp.com/api/v1";
// Host base used to resolve file URLs coming from multer (e.g., uploads/..)
export const API_HOST = API_BASE.replace(/\/?api\/?v1\/?$/, "").replace(
  /\/$/,
  ""
);

// Get auth headers from localStorage token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/admin/login`, {
      email,
      password,
    });
    return response.data.data;
  } catch (err) {
    console.log("Login error:", err.response?.data || err.message);
    throw err;
  }
};

// Validate token
// export const validateToken = async () => {
//   try {
//     const response = await axios.get(`${API_BASE}/auth/validate`, {
//       headers: getAuthHeaders(),
//     });
//     return response.data;
//   } catch (err) {
//     console.log("Token validation error:", err.response?.data || err.message);
//     throw err;
//   }
// };

export const generateUrl = async (formData) => {
  const response = await axios.post(
    `${API_BASE}/admin/other/generateUrl`,
    formData,
    { headers: getAuthHeaders() }
  );

  let fileUrl = response.data;

  return fileUrl;
};

/* -------------------- COMMAND APIs -------------------- */
export const getCommands = async () => {
  const res = await axios.get(`${API_BASE}/admin/command/get-command`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createCommand = async (formData) => {
  const data = new FormData();
  data.append("type", formData.type);
  data.append("title", formData.title);

  if (formData.type === "text") {
    data.append("description", formData.description);
  }
  if (formData.type === "audio" && formData.audio) {
    data.append("audio", formData.audio);
  }

  const res = await axios.post(
    `${API_BASE}/admin/command/create-command`,
    data,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.data;
};

export const deleteCommand = async (id) => {
  const res = await axios.delete(
    `${API_BASE}/admin/command/delete-command/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
};

export const updateCommand = async (id, formData) => {
  const data = new FormData();
  if (formData.type) data.append("type", formData.type);
  if (formData.title) data.append("title", formData.title);
  if (formData.description) data.append("description", formData.description);
  if (formData.audio) data.append("audio", formData.audio);

  const res = await axios.put(
    `${API_BASE}/admin/command/update-command/${id}`,
    data,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }
  );

  return res.data.data;
};

/* -------------------- SUB ADMIN APIs -------------------- */
export const listSubAdmins = async () => {
  const res = await axios.get(`${API_BASE}/admin/sub-admin`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createSubAdminApi = async (payload) => {
  const data = new FormData();
  data.append("username", payload.username);
  data.append("email", payload.email);
  data.append("password", payload.password);
  if (Array.isArray(payload.branch)) {
    payload.branch.forEach((b) => data.append("branch", b));
  }
  if (payload.image) {
    data.append("image", payload.image);
  }

  const res = await axios.post(`${API_BASE}/admin/sub-admin`, data, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateSubAdminById = async (id, payload) => {
  const data = new FormData();
  if (payload.username) data.append("username", payload.username);
  if (payload.email) data.append("email", payload.email);
  if (payload.password) data.append("password", payload.password);
  if (Array.isArray(payload.branch)) {
    payload.branch.forEach((b) => data.append("branch", b));
  }
  if (typeof payload.isDeleted !== "undefined") {
    data.append("isDeleted", String(Boolean(payload.isDeleted)));
  }
  if (payload.image) data.append("image", payload.image);

  const res = await axios.put(`${API_BASE}/admin/sub-admin/${id}`, data, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

/* -------------------- BRANCH APIs -------------------- */
export const getAllBranches = async () => {
  const res = await axios.get(`${API_BASE}/admin/branch/all`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createBranchApi = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/admin/branch/create`,
    {
      name: payload.name,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      email: payload.email,
      latitude: payload.latitude,
      longitude: payload.longitude,
      mobilePrefix: payload.mobilePrefix,
      mobileNumber: payload.mobileNumber,
    },
    { headers: getAuthHeaders() }
  );
  return res.data.data;
};

export const updateBranchById = async (id, payload) => {
  const body = {};
  const keys = [
    "name",
    "address",
    "city",
    "state",
    "pincode",
    "email",
    "latitude",
    "longitude",
    "mobilePrefix",
    "mobileNumber",
  ];
  keys.forEach((k) => {
    if (typeof payload[k] !== "undefined") body[k] = payload[k];
  });
  const res = await axios.put(`${API_BASE}/admin/branch/update/${id}`, body, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const deleteBranchById = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/branch/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* -------------------- USER APIs -------------------- */
export const getAllUsers = async () => {
  const res = await axios.get(`${API_BASE}/admin/user/get`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const getUsersByBranch = async (branchId) => {
  const res = await axios.get(`${API_BASE}/admin/branch/${branchId}`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createUserApi = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/admin/user/add`,
    {
      name: payload.name,
      mobilePrefix: payload.mobilePrefix,
      mobileNumber: payload.mobileNumber,
      branchId: payload.branchId,
      planId: payload.planId,
    },
    { headers: getAuthHeaders() }
  );
  return res.data.data;
};

export const updateUserById = async (id, payload) => {
  // Build only defined fields to avoid sending undefined values
  const body = {};
  if (typeof payload.name !== "undefined") body.name = payload.name;
  if (typeof payload.mobilePrefix !== "undefined")
    body.mobilePrefix = payload.mobilePrefix;
  if (typeof payload.mobileNumber !== "undefined")
    body.mobileNumber = payload.mobileNumber;
  if (typeof payload.branchId !== "undefined") body.branchId = payload.branchId;
  if (typeof payload.planId !== "undefined") body.planId = payload.planId;
  if (typeof payload.isDeleted !== "undefined")
    body.isDeleted = payload.isDeleted;

  const res = await axios.put(`${API_BASE}/admin/user/update/${id}`, body, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const getAllPlans = async () => {
  const res = await axios.get(`${API_BASE}/admin/plan/all`, {
    headers: getAuthHeaders(),
  });
  return res.data.data; // array of plans
};

export const createPlanApi = async (payload) => {
  const body = {
    name: payload.name,
    description: payload.description,
    days: Number(payload.days),
  };
  const res = await axios.post(`${API_BASE}/admin/plan/create`, body, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const updatePlanById = async (id, payload) => {
  const body = {};
  if (typeof payload.name !== "undefined") body.name = payload.name;
  if (typeof payload.description !== "undefined")
    body.description = payload.description;
  if (typeof payload.days !== "undefined") body.days = Number(payload.days);
  const res = await axios.put(`${API_BASE}/admin/plan/update/${id}`, body, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const deletePlanById = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/plan/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* -------------------- AUTH: FORGOT/RESET PASSWORD -------------------- */
export const forgotPassword = async (email) => {
  const res = await axios.post(`${API_BASE}/auth/admin/forgot-password`, {
    email,
  });
  return res.data;
};

export const resetPassword = async ({ token, email, password }) => {
  const res = await axios.post(`${API_BASE}/auth/admin/reset-password`, {
    token,
    email,
    password,
  });
  return res.data;
};

/* -------------------- PROFILE APIs -------------------- */
export const getAdminAndSubadminProfile = async () => {
  const res = await axios.get(`${API_BASE}/admin/get-profile`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const updateAdminProfile = async (payload) => {
  const res = await axios.put(`${API_BASE}/admin/update`, payload, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const getUserOverview = async (userId) => {
  const res = await axios.get(`${API_BASE}/admin/user-overview/${userId}`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

/* -------------------- VIDEO APIs -------------------- */
export const listVideos = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/admin/video/all`, {
    params,
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createVideoApi = async (payload) => {
  console.log("------------------payload----------------", payload.videoSecond);

  const data = new FormData();
  if (payload.title) data.append("title", payload.title);
  if (typeof payload.videoType !== "undefined")
    data.append("videoType", String(payload.videoType));
  if (payload.videoType === 1 && payload.videoFile)
    data.append("video", payload.videoFile);
  if (payload.videoType === 2 && payload.videoUrl)
    data.append("video", payload.videoUrl);
  if (typeof payload.videoSecond !== "undefined")
    data.append("videoSecond", String(payload.videoSecond));
  if (typeof payload.thumbnailType !== "undefined")
    data.append("thumbnailType", String(payload.thumbnailType));
  if (payload.thumbnailType === 1 && payload.thumbnailFile)
    data.append("thumbnail", payload.thumbnailFile);
  if (payload.thumbnailType === 2 && payload.thumbnailUrl)
    data.append("thumbnail", payload.thumbnailUrl);
  if (payload.description) data.append("description", payload.description);
  if (typeof payload.type !== "undefined")
    data.append("type", String(payload.type));
  if (payload.type === 1 && typeof payload.day !== "undefined")
    data.append("day", String(payload.day));
  if (payload.type === 4) {
    if (Array.isArray(payload.category)) {
      payload.category.forEach((c) => data.append("category", c));
    } else if (payload.category) {
      data.append("category", payload.category);
    }
  }

  const res = await axios.post(`${API_BASE}/admin/video/create`, data, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateVideoById = async (id, payload) => {
  const data = new FormData();
  if (typeof payload.title !== "undefined") data.append("title", payload.title);
  if (typeof payload.videoType !== "undefined")
    data.append("videoType", String(payload.videoType));
  if (payload.videoType === 1 && payload.videoFile)
    data.append("video", payload.videoFile);
  if (payload.videoType === 2 && payload.videoUrl)
    data.append("video", payload.videoUrl);
  if (typeof payload.videoSecond !== "undefined")
    data.append("videoSecond", String(payload.videoSecond));
  if (typeof payload.thumbnailType !== "undefined")
    data.append("thumbnailType", String(payload.thumbnailType));
  if (payload.thumbnailType === 1 && payload.thumbnailFile)
    data.append("thumbnail", payload.thumbnailFile);
  if (payload.thumbnailType === 2 && payload.thumbnailUrl)
    data.append("thumbnail", payload.thumbnailUrl);
  if (typeof payload.description !== "undefined")
    data.append("description", payload.description);
  if (typeof payload.type !== "undefined")
    data.append("type", String(payload.type));
  if (payload.type === 1 && typeof payload.day !== "undefined")
    data.append("day", String(payload.day));
  if (payload.type === 4) {
    if (Array.isArray(payload.category)) {
      payload.category.forEach((c) => data.append("category", c));
    } else if (payload.category) {
      data.append("category", payload.category);
    }
  }

  const res = await axios.put(`${API_BASE}/admin/video/update/${id}`, data, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteVideoById = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/video/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* -------------------- CATEGORY APIs -------------------- */
export const getAllCategoriesApi = async () => {
  const res = await axios.get(`${API_BASE}/admin/category/`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const createCategoryApi = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/admin/category/create`,
    { categoryTitle: payload.categoryTitle },
    { headers: getAuthHeaders() }
  );
  return res.data.data;
};

export const updateCategoryById = async (id, payload) => {
  const res = await axios.put(
    `${API_BASE}/admin/category/update/${id}`,
    { categoryTitle: payload.categoryTitle },
    { headers: getAuthHeaders() }
  );
  return res.data.data;
};

export const deleteCategoryById = async (id) => {
  const res = await axios.delete(`${API_BASE}/admin/category/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
