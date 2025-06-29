import pb from "@/shared/pocketbase";
import type { User } from "../model/user";

export const getUserAvatar = async (user: User): Promise<string> => {
  const picUrl = pb.files.getURL(user, user.avatar, { token: pb.authStore.token });
  return picUrl
}

export async function getUserByID(params: { id: string }): Promise<User> {
  try {
    const record = await pb.collection("users").getOne(params.id, {
      expand: "relField1,relField2.subRelField",
    });
    return record as User;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch user by ID");
  }
}

export const authWithPassword = async (params: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(params.email, params.password);
    return authData.record as User;
  } catch (error: any) {
    // You can customize the error handling as needed
    throw new Error(error?.message || "Authentication failed");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const record = pb.authStore.record;
  if (record && record.id) {
    return await getUserByID({ id: record.id });
  }
  return null;
};

export interface UserFilters {
  search?: string;
  verified?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  username?: string;
}

export const getUsersByFilters = async (
  filters: UserFilters = {},
): Promise<{
  items: User[];
  totalItems: number;
  totalPages: number;
  page: number;
}> => {
  try {
    const {
      search,
      verified,
      limit = 20,
      page = 1,
      sort = "-created",
    } = filters;

    // Build filter string for PocketBase
    let filter = "";
    const filterParts: string[] = [];

    if (search) {
      filterParts.push(`(name ~ "${search}" || email ~ "${search}") || username ~ "${search}`);
    }

    if (verified !== undefined) {
      filterParts.push(`verified = ${verified}`);
    }

    if (filterParts.length > 0) {
      filter = filterParts.join(" && ");
    }

    const result = await pb.collection("users").getList(page, limit, {
      filter,
      sort,
    });

    return {
      items: result.items as User[],
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
    };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to fetch users");
  }
};

export const updateUser = async (userId: string, name: string): Promise<User> => {
  const data = {
    "name": name,
  };

  const record = await pb.collection('users').update(userId, data);
  return record as User;
}

export const isAuthenticated = (): boolean => {
  return pb.authStore.isValid;
};

export const getAuthStoreUser = (): User | null => {
  return pb.authStore.record as User;
};

export const pbLogout = () => {
  pb.authStore.clear();
};

