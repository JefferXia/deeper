'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "@/components/ui/button"
import { downloadUrl } from '@/lib/actions'
import { ArrowRight, CloudUpload, LoaderCircle } from 'lucide-react'

const DigInput = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDownload = async(theUrl:string) => {
    setLoading(true)
    try {
      const response = await downloadUrl(theUrl)
      if(response?.id) {
        router.push(`/video-analysis/${response.id}?first=yes`);
      } else {
        toast.error(
          response?.message || '提取失败',
        );
        setLoading(false)  
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
      toast.error(
        '提取时发生错误',
      );
    } finally {    
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi;
    const matchUrl = url.match(regex);
    // console.log(matchUrl)
    // const testUrl = new URL(url);
    if (matchUrl) {
      const theUrl = matchUrl[0];
      handleDownload(theUrl)
    } else {
      toast.error(
        '请输入正确的URL',
      );
    }
  }

  const handleFileChange = async(event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setLoading(true)
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json()
        if (response.status === 200) {
          if(result?.id) {
            router.push(`/video-analysis/${result.id}?first=yes`);
          }
        } else if(response.status === 400) {
          toast.error(result.message);
          setLoading(false)
        }
      } catch (error) {
        toast.error("上传文件失败，请稍后再试");
        setLoading(false)
      }
    } else {
      toast.error("请上传一个有效的视频文件");
    }
  }

  return (
    <div className="mx-auto md:w-1/2 w-4/5 h-screen flex flex-col items-center justify-center space-y-5">
      <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium">
        爆款视频AI解析
      </h2>
      <h3 className="text-black/70 dark:text-white/70 text-base font-medium">
        Dig anything here.
      </h3>
      <form 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
        className="w-full"
      >
        <div className="flex flex-col bg-light-secondary dark:bg-dark-secondary px-5 pt-5 pb-2 rounded-lg w-full border border-light-200 dark:border-dark-200">
          <TextareaAutosize
            ref={inputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            minRows={2}
            className="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-sm text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
            placeholder="输入你要解析的URL"
          />
          <div className="flex flex-row items-end justify-between mt-4">
            <div className="flex flex-row space-x-3">
              <img src="/images/tiktok.ico" width="16" height="16" alt="" />
              <img src="/images/youtube.ico" width="16" height="16" alt="" />
              <img src="/images/douyin.ico" width="16" height="16" alt="" />
              <img src="/images/bilibili.ico" width="16" height="16" alt="" />
            </div>
            <div className="flex flex-row items-center space-x-4 -mx-2">
              <Button 
                type="submit"
                disabled={url.trim().length === 0 || loading}
                className="w-[40px] h-[40px] bg-[#24A0ED] text-white disabled:text-black/50 dark:disabled:text-white/50 disabled:bg-[#e0e0dc] dark:disabled:bg-[#ececec21] hover:bg-opacity-85 transition duration-100 rounded-full p-2"
              >
                <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        </div>
      </form>
      {loading && (
        <div className="w-full flex items-center justify-center text-black/70 dark:text-white/70">
          {/* <LoaderCircle className="animate-spin" /> */}
          <div className='relative w-full h-[6px] bg-[#cccccc] rounded-[6px]'>
            <div className='absolute top-0 h-full animate-linespin bg-[#24A0ED] rounded-[6px]'></div>
          </div>
        </div>
      )}
      <div className='relative w-full h-[230px] flex flex-col items-center justify-center bg-light-secondary dark:bg-dark-secondary text-card-foreground/70 border border-dashed border-primary/70 rounded-lg'>
        <CloudUpload size={40} />
        <p className='text-sm'>上传文件</p>
        <input type="file" className='opacity-0 absolute top-0 left-0 right-0 bottom-0' accept="video/*" onChange={handleFileChange} />
      </div>
    </div>
  )
};

export default DigInput;
