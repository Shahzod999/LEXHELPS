const globalLocale = "en-US";

export const formatDate = (date: string, locale: string = globalLocale) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDayMonthYear = (date: string | Date, locale: string = globalLocale) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "только что";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}мин`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}ч`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}д`;
  return commentDate.toLocaleDateString("ru-RU");
};


export const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}К`;
  return num?.toString();
};