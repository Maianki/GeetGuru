import Container from '../components/Container.tsx';
import SongSearchForm from '../components/SongSearchForm.tsx';
import Bg from '../images/bg.svg';
import Girl from '../images/girl.png';
import Dome from '../images/dome.svg';

const Home = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-end">
      <div className=" relative z-20 -mb-2 block">
        <img src={Dome} alt="Dome" />
        <img
          src={Girl}
          className=" z-100 absolute bottom-0 left-[50%] w-full max-w-[300px] -translate-x-1/2 "
          alt="Girl"
        />
      </div>

      <Container>
        <h2 className="text-tertiary my-6 text-center text-5xl font-bold tracking-tight">
          Geet Guru
        </h2>
        <SongSearchForm />
      </Container>
      <div
        className="absolute bottom-0 left-0 z-10 h-96 w-full "
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundRepeat: 'repeat-x',
        }}
      ></div>
    </div>
  );
};

export default Home;
