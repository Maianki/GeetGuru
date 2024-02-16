const Container = ({ children }) => {
  return (
    <div className="scrollbar-hide relative z-50 h-[calc(100vh-300px)] w-full max-w-[800px] overflow-y-scroll rounded-t-3xl bg-primary px-4 py-4 shadow-md md:px-12 ">
      {children}
    </div>
  );
};

export default Container;
