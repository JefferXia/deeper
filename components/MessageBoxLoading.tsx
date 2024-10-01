const MessageBoxLoading = () => {
  return (
    <div className="flex flex-col space-y-2 w-full lg:w-9/12 animate-pulse rounded-lg py-3">
      <div className="h-2 rounded-full w-full bg-light-secondary dark:bg-white/10" />
      <div className="h-2 rounded-full w-9/12 bg-light-secondary dark:bg-white/10" />
      <div className="h-2 rounded-full w-10/12 bg-light-secondary dark:bg-white/10" />
    </div>
  );
};

export default MessageBoxLoading;
