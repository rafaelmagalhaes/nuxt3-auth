const useTitle = () => {
  const title = ref('My Title');

  const setTitle = (newTitle: string) => (title.value = newTitle);

  return {
    setTitle,
    title,
  };
};

export default useTitle;
