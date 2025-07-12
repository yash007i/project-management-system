import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Integrations from '@/components/Integrations';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Integrations />
    </div>
  );
};

export default Home;