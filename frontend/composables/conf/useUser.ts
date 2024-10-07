interface UserData {
  user_id: string;
  username: string;
  email: string;
}

export function useUser() {
  const user = useState<UserData | null>("user", () => null);

  const setUser = (userData: UserData): void => {
    user.value = userData;
  };

  const clearUser = (): void => {
    user.value = null;
  };

  return {
    user,
    setUser,
    clearUser,
  };
}
