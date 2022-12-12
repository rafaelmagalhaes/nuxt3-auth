interface AuthInterface {
  authenticated: boolean;
}

export const useAuth = () => {
  const { $cookies } = useNuxtApp();
  return useState<AuthInterface>('auth', () => {
    return {
      authenticated: !!$cookies.get('token'),
    };
  });
};
