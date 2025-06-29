import { makeAutoObservable, runInAction } from "mobx";
import type { User } from "./user";
import {
  getCurrentUser,
  getUserByID,
  authWithPassword,
  getUsersByFilters,
  type UserFilters,
  isAuthenticated,
  pbLogout,
  getAuthStoreUser,
} from "../api/user";


interface UsersListState {
  items: User[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string;
}

class UserStore {
  // Current authenticated user
  currentUser: User | null = null;
  currentUserLoading: boolean = false;
  currentUserError: string = "";
  initialized: boolean = false;

  // Individual user by ID cache
  usersById: Map<string, User> = new Map();
  userByIdLoading: Map<string, boolean> = new Map();
  userByIdError: string = "";

  // Users list with filters
  usersList: UsersListState = {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: "",
  };

  // Current applied filters
  currentFilters: UserFilters = {};

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }
  initializeAuth = async () => {
    try {
      const authStoreUser = getAuthStoreUser();

      if (authStoreUser) {
        runInAction(() => {
          this.currentUser = authStoreUser;
          this.initialized = true;
        });
      }
      if (isAuthenticated()) {
        await this.getCurrentUser();
      }
      runInAction(() => {
        this.initialized = true;
      });
    } catch (error) {
      console.warn("Failed to initialize auth:", error);
      runInAction(() => {
        this.initialized = true;
      });
    }
  };

  logout = () => {
    runInAction(() => {
      this.currentUser = null;
      this.currentUserError = "";
      pbLogout();
      this.usersById.clear();
      this.userByIdLoading.clear();
      this.clearUsersList();
    });
  };

  // 1. Authentication and getting current user
  authenticateUser = async (email: string, password: string) => {
    try {
      this.currentUserLoading = true;
      this.currentUserError = "";

      const user = await authWithPassword({ email, password });

      runInAction(() => {
        this.currentUser = user;
        this.currentUserLoading = false;
        // Cache the authenticated user
        this.usersById.set(user.id, user);
      });

      return user;
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.currentUserLoading = false;
          this.currentUserError = error.message;
        });
      }
      throw error;
    }
  };

  getCurrentUser = async () => {
    try {
      this.currentUserLoading = true;
      this.currentUserError = "";

      const data = await getCurrentUser();

      runInAction(() => {
        this.currentUser = data;
        this.currentUserLoading = false;
        // Cache the current user if exists
        if (data) {
          this.usersById.set(data.id, data);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.currentUserLoading = false;
          this.currentUserError = error.message;
        });
      }
    }
  };

  // 2. Getting user by ID with caching
  getUserByID = async (
    userId: string,
    forceRefresh: boolean = false,
  ): Promise<User | undefined> => {
    // Return cached user if available and not forcing refresh
    if (!forceRefresh && this.usersById.has(userId)) {
      return this.usersById.get(userId);
    }

    try {
      // Set loading state for this specific user
      runInAction(() => {
        this.userByIdLoading.set(userId, true);
        this.userByIdError = "";
      });

      const data = await getUserByID({ id: userId });

      if (data) {
        runInAction(() => {
          this.usersById.set(userId, data);
          this.userByIdLoading.set(userId, false);
        });
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.userByIdLoading.set(userId, false);
          this.userByIdError = error.message;
        });
      }
    }
  };

  // 3. Getting users list by filters
  getUsersByFilters = async (
    filters: UserFilters = {},
    append: boolean = false,
  ) => {
    try {
      runInAction(() => {
        this.usersList.loading = true;
        this.usersList.error = "";
        if (!append) {
          this.currentFilters = filters;
        }
      });

      const result = await getUsersByFilters(filters);

      runInAction(() => {
        if (append) {
          // Append to existing list (pagination)
          this.usersList.items = [...this.usersList.items, ...result.items];
        } else {
          // Replace list (new search/filter)
          this.usersList.items = result.items;
        }

        this.usersList.totalItems = result.totalItems;
        this.usersList.totalPages = result.totalPages;
        this.usersList.currentPage = result.page;
        this.usersList.loading = false;

        // Cache all fetched users
        result.items.forEach((user) => {
          this.usersById.set(user.id, user);
        });
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.usersList.loading = false;
          this.usersList.error = error.message;
        });
      }
      throw error;
    }
  };

  // Helper methods
  loadMoreUsers = async () => {
    if (
      this.usersList.currentPage < this.usersList.totalPages &&
      !this.usersList.loading
    ) {
      const nextPageFilters = {
        ...this.currentFilters,
        page: this.usersList.currentPage + 1,
      };
      await this.getUsersByFilters(nextPageFilters, true);
    }
  };

  refreshUsersList = async () => {
    await this.getUsersByFilters(this.currentFilters, false);
  };

  clearUsersList = () => {
    runInAction(() => {
      this.usersList = {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        error: "",
      };
      this.currentFilters = {};
    });
  };

  // Computed getters
  get isAuthenticated() {
    return this.currentUser !== null;
  }

  get hasMoreUsers() {
    return this.usersList.currentPage < this.usersList.totalPages;
  }

  isUserLoading = (userId: string) => {
    return this.userByIdLoading.get(userId) || false;
  };

  getCachedUser = (userId: string) => {
    return this.usersById.get(userId);
  };
}

export const userStore = new UserStore();

export const getUser = (): User | null => {
  return getAuthStoreUser()
}

export const authenticated = (): boolean => {
  return isAuthenticated();
};

export const getUsersByUsername = async (username: string): Promise<User[]> => {
  try {
    if (!username.trim()) {
      return [];
    }

    const result = await getUsersByFilters({ username: username });
    return result.items as User[];
  } catch (error) {
    console.error('Failed to get users by username:', error);
    return [];
  }
}