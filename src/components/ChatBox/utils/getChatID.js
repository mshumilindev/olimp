export const getChatID = (location) => {
  if (location.pathname.includes("/chat/")) {
    return location.pathname.replace("/chat/", "");
  }
  return null;
};
