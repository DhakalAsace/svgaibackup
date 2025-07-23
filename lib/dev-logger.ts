// Development-only logger
const isDev = process.env.NODE_ENV === 'development';
export const devLog = (...args: any[]) => {
  if (isDev) {
  }
};
export const devError = (...args: any[]) => {
  if (isDev) {
  }
};
export const devWarn = (...args: any[]) => {
  if (isDev) {
  }
};
