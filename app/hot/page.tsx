'use client';

import { Flame } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Download, Star } from 'lucide-react'

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  extractor: string;
  metadata: string;
  metadataObj: any;
  createdAt: number;
}
// declare global {
//   interface window {
//     location: Location;
//   }
// }
// const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https';
const Page = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const formatNumber = (num:number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + '千';
    } else {
      return num.toString();
    }
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      const newData = data.videos.map((item:any) => ({
        metadataObj: JSON.parse(item.metadata),
        ...item
      }));

      setVideos(newData);
      setLoading(false);
    };

    fetchVideos();

    document.body.click();
  }, []);

  const downloadVideo = (url:string) => {
    const a = document.createElement('a');
    a.href = '//'+url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return loading ? (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <div>
      <div className="fixed z-40 top-0 left-0 right-0 lg:pl-[104px] lg:pr-6 lg:px-8 px-4 py-4 lg:py-6 border-b border-light-200 dark:border-dark-200 bg-light-primary dark:bg-dark-primary">
        <div className="hidden lg:flex flex-row items-center space-x-2 max-w-screen-lg lg:mx-auto">
          <Flame />
          <h2 className="text-black dark:text-white lg:text-3xl lg:font-medium">
            爆款广场
          </h2>
        </div>
      </div>
      {videos.length === 0 && (
        <div className="flex flex-row items-center justify-center min-h-screen">
          <p className="text-black/70 dark:text-white/70 text-sm">
            没有热门视频
          </p>
        </div>
      )}
      {videos.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 pb-28 lg:pt-24 lg:pb-6">
          {videos.map((video, i) => (
            <div
              className="flex flex-col justify-between p-3 pb-2 bg-card rounded-lg"
              key={i}
            >
              <div className='flex flex-1 justify-center items-center bg-black'>
                <video
                  className='w-full'
                  ref={(el:any) => (videoRefs.current[i] = el)}
                  src={`https://${video.url}`}
                  onMouseEnter={() => {
                    videoRefs.current[i] && videoRefs.current[i].play()
                  }}
                  onMouseLeave={() => {
                    videoRefs.current[i] && videoRefs.current[i].pause()
                  }}
                ></video>
              </div>
              <div className=''>
                {/* <p className="text-sm line-clamp-1">
                  {video.title}
                </p> */}
                <div className='flex justify-around py-4'>
                  <div className='text-center'>
                    <p className='text-lg font-medium'>{formatNumber(video.metadataObj?.like_count)}</p>
                    <p className="text-sm text-gray-500">点赞</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-medium'>{formatNumber(video.metadataObj?.comment_count)}</p>
                    <p className="text-sm text-gray-500">评论</p>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <Link
                    className="block w-2/3"
                    href={`/video-analysis/${video.id}`}
                  >
                    <Button variant="outline" className="w-full h-[33px] hover:bg-opacity-85 bg-[linear-gradient(225deg,_rgb(255,_58,_212)_0%,_rgb(151,_107,_255)_33%,_rgb(67,_102,_255)_66%,_rgb(89,_187,_252)_100%)]">分析视频</Button>
                  </Link>
                  <div className='flex space-x-2'>
                    <Download className='cursor-pointer' size={20} onClick={() => downloadVideo(video.url)} />
                    <Star className='cursor-pointer' size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
