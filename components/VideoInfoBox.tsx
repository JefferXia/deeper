import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoInfo } from '@/components/VideoWindow'
// import CircularProgress from '@mui/joy/CircularProgress'
// import { useCountUp } from 'use-count-up'

const VideoInfoBox = ({ videoInfo }: { videoInfo?: VideoInfo }) => {
  // const [score, setScore] = useState(0);

  // const { value: score, reset } = useCountUp({
  //   isCounting: true,
  //   duration: 1,
  //   start: 0,
  //   end: 90,
  //   // onComplete: () => {
      
  //   // },
  // });
  
  useEffect(() => {    
    if (videoInfo) {
      // reset()     
    }
  }, [videoInfo]);

  return (
    <div className="grid grid-cols-3 gap-5 text-card-foreground">
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">创作者</div>
        {videoInfo?.uploader_url ? (
          <Link href={videoInfo?.uploader_url} target='_blank' className='text-[#24A0ED] hover:underline'>
            {videoInfo?.uploader}
          </Link>
        ) : (
          <div className='text-foreground'>
            {videoInfo?.uploader}
          </div>
        )}
      </div>
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">粉丝数</div>
        <div className='text-foreground'>{videoInfo?.channel_follower_count || '--'}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">平台</div>
        <div className='text-foreground'>{videoInfo?.extractor === 'douyin' ? '抖音' : videoInfo?.extractor}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">点赞数</div>
        <div className='text-foreground'>{videoInfo?.like_count}</div>
      </div>
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">评论数</div>
        <div className='text-foreground'>{videoInfo?.comment_count}</div>
      </div>
      {videoInfo?.extractor === 'douyin' ? (
        <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
          <div className="mb-1">收藏数</div>
          <div className='text-foreground'>{videoInfo?.view_count}</div>
        </div>
      ) : (
        <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
          <div className="mb-1">观看数</div>
          <div className='text-foreground'>{videoInfo?.view_count}</div>
        </div>
      )}
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">时长</div>
        <div className='text-foreground'>{videoInfo?.duration}秒</div>
      </div>
      <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">预估收益</div>
        <div className='text-foreground'>
          {videoInfo?.like_count ? `${Number(videoInfo?.like_count * 0.03).toFixed(2)} - ${Number(videoInfo?.like_count * 0.05).toFixed(2)} 元` : '--'}
        </div>
      </div>
      {/* <div className='shadow-sm rounded-lg bg-card px-6 py-4'>
        <div className="mb-1">视频打分</div>
        <div className='w-[90px] mx-auto'>
          <CircularProgress size="md" variant="solid" determinate={score === 0 ? false : true} value={score as number} sx={{
              "--CircularProgress-size": "80px"
            }}>
              <p>{score === 0 ? '...' : `${score}分`}</p>
          </CircularProgress>
        </div>
      </div> */}
    </div>
  );
};

export default VideoInfoBox;
