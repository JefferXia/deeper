import DigInput from '@/components/DigInput';
import { Metadata } from 'next';
import { Suspense } from 'react';

// export const metadata: Metadata = {
//   title: 'TopMind for video',
//   description: 'Chat with the internet, chat with Digany.',
// };

const Home = () => {
  return (
    <div>
      {/* <Suspense> */}
        <DigInput />
      {/* </Suspense> */}
    </div>
  );
};

export default Home;
