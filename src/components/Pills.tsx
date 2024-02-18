const Pills = ({ text }: { text: string }) => {
  return (
    <div className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-sm font-light text-neutral/50 shadow-sm hover:text-neutral hover:shadow-md md:text-lg">
      {text}
    </div>
  );
};

export default Pills;
