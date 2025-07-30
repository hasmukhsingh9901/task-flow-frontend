import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateUserRole(userId);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const fetchUserLogs = createAsyncThunk(
  'users/fetchUserLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getUserLogs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user logs');
    }
  }
);

export const deleteUserLog = createAsyncThunk(
  'users/deleteUserLog',
  async (logId, { rejectWithValue }) => {
    try {
      await authAPI.deleteUserLog(logId);
      return logId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user log');
    }
  }
);

const initialState = {
  users: [],
  logs: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        state.error = null;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Logs
      .addCase(fetchUserLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User Log
      .addCase(deleteUserLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = state.logs.filter((log) => log._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUserLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading } = userSlice.actions;
export default userSlice.reducer; 