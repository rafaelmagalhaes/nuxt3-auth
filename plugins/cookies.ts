import Cookie from 'cookie-universal';

export default defineNuxtPlugin(() => {
  const cookies = Cookie();
  return {
    provide: {
      cookies,
    },
  };
});
