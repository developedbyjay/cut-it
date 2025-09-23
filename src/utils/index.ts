export const generateTTL = (tokenExp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const secondsToExpire = tokenExp - currentTime;
  return secondsToExpire > 0 ? secondsToExpire : 0;
};

export const generateRedisUserKey = (userId: string) => {
  return "user-" + userId;
};

export const generateRedisTokenKey = (email: string) => {
  return "token-" + email;
};
