const SrtBoxLoading = () => {
  return (
    <div className="flex flex-col space-y-7 mt-2 w-full lg:w-9/12 animate-pulse">
      <div className="h-3 rounded-full w-full bg-light-secondary dark:bg-dark-secondary" />
      <div className="h-3 rounded-full w-9/12 bg-light-secondary dark:bg-dark-secondary" />
      <div className="h-3 rounded-full w-10/12 bg-light-secondary dark:bg-dark-secondary" />
      <div className="h-3 rounded-full w-9/12 bg-light-secondary dark:bg-dark-secondary" />
      <div className="h-3 rounded-full w-10/12 bg-light-secondary dark:bg-dark-secondary" />
    </div>
  );
};

export default SrtBoxLoading;
