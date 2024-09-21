import VideoWindow from '@/components/VideoWindow';

const Page = ({ 
  params,
  searchParams 
}: { 
  params: { videoId: string }
  searchParams: { first?: string }
}) => {
  return <VideoWindow isFirst={!!searchParams.first} id={params.videoId} />;
};

export default Page;
