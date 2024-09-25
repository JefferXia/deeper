'use client';

import React, { useEffect, useRef, useState } from 'react';
import Error from 'next/error';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// import { useSearchParams } from 'next/navigation';
import { Copy, Download, ClipboardPenLine, Layers2 } from 'lucide-react'
import { getSummary } from '@/lib/actions';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import VideoInfoBox from '@/components/VideoInfoBox'
import VideoMarkmapBox from '@/components/VideoMarkmapBox'
import VideoSceneBox from '@/components/VideoSceneBox'
import VideoChatWindow from '@/components/VideoChatWindow'

export interface Scene {
  startTime: number
  endTime: number
  url: string
  relatedSubtitles?: Subtitle[]
}
export interface Subtitle {
  text: string
  startMs: number
  endMs: number
  speechSpeed?: number
  wordsNum?: number
  startTime: string
  endTime: string
}
export interface Subtitles {
  result: string
  resultDetail: Subtitle[]
}

export interface VideoInfo {
  id: string
  url: string
  videoId?: string
  title?: string
  extractor?: string
  chatId?: string
  fulltitle?: string
  description?: string
  original_url?: string
  tags?: string
  categories?: string
  view_count?: number
  like_count?: number
  comment_count?: number
  channel?: string
  channel_follower_count?: string
  uploader?: string
  uploader_id?: string
  uploader_url?: string
  duration?: number
  aspect_ratio?: number
  subtitles?: string
  summary?: string
  createdAt: number 
}
declare global {
  interface window {
    location: any;
  }
}
const protocol: string | undefined = window?.location?.protocol;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const VideoWindow = ({ 
  id,
  isFirst
}: { 
  id: string
  isFirst?: boolean
}) => {
  const [isReady, setIsReady] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo>();
  const [subtitles, setSubtitles] = useState<Subtitles>();
  const [scene, setScene] = useState<Scene[]>();
  const [newScene, setNewScene] = useState<Scene[]>();
  const [videoChatId, setVideoChatId] = useState('');
  const [intialInput, setIntialInput] = useState('');
  const [markmapData, setMarkmapData] = useState('');
  const [retry, setRetry] = useState(0); // 轮询次数
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const searchParams = useSearchParams();
  const router = useRouter();

  const loadVideoData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      const data = await res.json();
      if (data.video) {
        const videoData = {
          ...data.video,
          ...JSON.parse(data.video.metadata),
        };

        setVideoInfo(videoData);

        if (data.video.scene) {
          setScene(JSON.parse(data.video.scene)?.frames)
        }

        if (data.video.subtitles) {
          setSubtitles(JSON.parse(data.video.subtitles))
        }

        if (data.video.subtitles && data.video.scene) {
          setRetry(0)
          router.replace(`/video-analysis/${id}`);
        } else {
          isFirst && setRetry(retry+1)
        }
      }
    } catch (error) {
      setNotFound(true);
      console.error('loadVideoData catch error');
    }
  };

  useEffect(() => {    
    if (retry > 0 && retry < 11) {
      (async() => {
        console.log(retry);
        await sleep(5000 * retry);
        await loadVideoData();
      })()    
    }
  }, [retry]);

  const streamOutput = (text: string) => {
    const lines = text.split('\n');
    let accumulatedText = '';

    lines.map((line, index) => {
      setTimeout(() => {
        accumulatedText += line + '\n';
        setMarkmapData(accumulatedText);
      }, index * 100); // 每隔500毫秒输出一行，可以根据需要调整时间间隔
    });
  }

  useEffect(() => {
    (async() => {
      await loadVideoData()
      setIsReady(true)
    })()    
  }, []);

  useEffect(() => {
    if (subtitles?.result) {
      if(videoInfo?.chatId) {
        setVideoChatId(videoInfo.chatId)
      } else {
        const prompt = `你是一个短视频文案专家，根据给出的一段视频文案改写出一段新的短视频文案，
        要求：结合语境需要有多个分镜，每个分镜对应的文案，以列表方式排列，如果能输出表格的形式更好。
        以下是参考文案：“${subtitles.result}”
        输出答案注意区分中英文语言，与参考文案的语言保持一致。
        `;
        setIntialInput(prompt)
      }

      if(markmapData) {
        return
      }
      
      if (videoInfo?.summary) {
        setMarkmapData(videoInfo?.summary)
      } else {
        (async() => {
          const summary = await getSummary(id, subtitles.result, []);
          summary && streamOutput(summary)
        })()
      }     
    }
  }, [subtitles]);

  useEffect(() => {
    if(scene) {
      const newSceneData = scene.map((s, index) => {
        if(subtitles?.resultDetail && subtitles?.resultDetail.length > 0) {
          // 找出当前 scene 包含的 subtitles
          const relatedSubtitles = subtitles.resultDetail.filter((sub) =>
            index === scene.length - 1
              ? sub.endMs >= s.startTime
              : ((sub.startMs >= s.startTime && sub.endMs <= s.endTime) ||
                (sub.startMs <= s.startTime && sub.endMs >= s.startTime))
          );

          // 返回新的 scene 对象，添加 relatedSubtitles 属性
          return {
            ...s,
            relatedSubtitles
          };
        } else {
          return {
            ...s,
            relatedSubtitles: []
          };
        }
      });

      setNewScene(newSceneData);
    }
  }, [scene, subtitles]);

  const copyText = () => {
    if (subtitles?.result) {
      navigator.clipboard.writeText(subtitles?.result);
      toast.success('文案已复制');
    } else {
      toast.error('该视频还没有字幕');
    }
  }

  const downloadVideo = () => {
    if (!videoInfo?.url) {
      return
    }
    const a = document.createElement('a');
    a.href = protocol + '//' + videoInfo?.url;
    a.download = videoInfo?.title || ('video-' + Date.now()); // 设置下载后文件的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return isReady ? (
    notFound ? (
      <Error statusCode={404} />
    ) : (
      <>
        <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-center w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-secondary dark:bg-dark-secondary border-light-100 dark:border-dark-200">
          <p className="max-w-full lg:max-w-3xl line-clamp-1">{videoInfo?.title}</p>
        </div>
        <div className="w-full flex py-20 space-x-5">
          <div className="w-[270px]">
            <div className="sticky top-[53px]">
              <div className="flex w-[270px] h-[480px] justify-center items-center bg-black">
                <video 
                  controls
                  controlsList='nodownload nofullscreen'
                  ref={videoRef}
                  src={`${protocol}//${videoInfo?.url}`}
                  width="270"
                  // onMouseEnter={() => {
                  //   videoRef.current && videoRef.current.play()
                  // }}
                  // onMouseLeave={() => {
                  //   videoRef.current && videoRef.current.pause()
                  // }}
                ></video>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button variant="secondary" onClick={copyText}>
                  <Copy className="mr-2 h-4 w-4" />复制文案
                </Button>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="secondary">
                      <ClipboardPenLine className="mr-2 h-4 w-4" />一键改写
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="flex flex-col mx-auto w-full max-w-screen-lg h-screen-200">
                      <DrawerHeader>
                        <DrawerTitle>问一问 AI</DrawerTitle>
                        <DrawerDescription>可以继续描述你的改写需求</DrawerDescription>
                      </DrawerHeader>
                      <div className="flex-1 overflow-y-auto">
                        <VideoChatWindow id={videoChatId} intialInput={intialInput} sendChatId={setVideoChatId} />
                      </div>
                      <DrawerClose asChild>
                        <Button className='absolute top-5 right-5' variant="outline">关闭对话</Button>
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>

                <Button variant="secondary" onClick={downloadVideo}>
                  <Download className="mr-2 h-4 w-4" />下载视频
                </Button>

                <Button variant="secondary">
                  <Layers2 className="mr-2 h-5 w-4" />模仿创作
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-5">
            <VideoInfoBox videoInfo={videoInfo} />

            <VideoMarkmapBox markmapData={markmapData} />

            <VideoSceneBox sceneData={newScene} />
          </div>
        </div>
      </>
    )
  ) : (
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
  );
};

export default VideoWindow;