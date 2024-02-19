interface PillsProps {
  handleSubmit : ()=> void,
  text: string,
  handleClick: (searchTerm: string) => void;
}

const Pills : React.FC<PillsProps> = ({ text, handleClick , handleSubmit}) => {

  const handlePills = ()=>{
    handleClick(text);
    handleSubmit();
  }

  return (
    <button onClick={handlePills} className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-sm font-light text-neutral/50 shadow-sm hover:text-neutral hover:shadow-md md:text-lg">
      {text}
    </button>
  );
};

export default Pills;
