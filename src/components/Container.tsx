import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className=" scrollbar-hide relative z-50  w-full max-w-[800px] overflow-hidden rounded-3xl bg-primary px-4 py-4 shadow-md md:px-12">
      {children}
    </div>
  );
};

export default Container;
