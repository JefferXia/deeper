'use client'
import React, { useEffect, useRef, useState } from 'react'
import MarkmapHooks from '@/components/markmap/markmap-hooks'
import { getSummary, getSuggestions } from '@/lib/actions'
import SrtBoxLoading from '@/components/SrtBoxLoading'
import { Maximize } from 'lucide-react';
import Image from 'next/image'

// import { FFmpeg } from '@ffmpeg/ffmpeg'
// import { fetchFile, toBlobURL } from '@ffmpeg/util'

interface SubtitleItem {
  FinalSentence: string
  StartMs: number
  EndMs: number
  SpeechSpeed: number
  WordsNum: number
  StartTime: string
  EndTime: string
}

const Page = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [markmapData, setMarkmapData] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleObj, setSubtitleObj] = useState<SubtitleItem[]>([]);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // const ffmpegRef = useRef(new FFmpeg());

  // useEffect(() => {
  //   (async () => {
  //     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  //     const ffmpeg = ffmpegRef.current;
  //     ffmpeg.on("log", ({ message }:any) => {
  //       console.log(message)
  //     });
  //     // toBlobURL is used to bypass CORS issue, urls with the same
  //     // domain can be used directly.
  //     await ffmpeg.load({
  //       coreURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.js`,
  //         "text/javascript"
  //       ),
  //       wasmURL: await toBlobURL(
  //         `${baseURL}/ffmpeg-core.wasm`,
  //         "application/wasm"
  //       ),
  //     });
  //   })();
  // }, []);

  // const transcode = async () => {
  //   const ffmpeg = ffmpegRef.current;
  //   // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
  //   await ffmpeg.writeFile("input.mp4", await fetchFile(previewUrl));
  //   await ffmpeg.exec(["-i", "input.mp4", "-vn", "output.mp3"]);
  //   const data = (await ffmpeg.readFile("output.mp3")) as any;
  //   const buffer = Buffer.from(data)
  //   const base64Str = buffer.toString('base64')
  //   // console.log(base64Str);
  //   await fetch("/api/formatAudio", {
  //     method: "POST",
  //     body: JSON.stringify({buffer: base64Str})
  //   });
  //   // if (videoRef.current)
  //   // videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
  // };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("请上传一个有效的视频文件");
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("请先选择一个视频文件");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json()
      if(result.status === 200) {
        setSubtitle(result.audioText)
        setSubtitleObj(result.audioDetail)
        await fetchSummary(result.audioText)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
      setScore(90)
    }
  };

  const fetchSummary = async(str: string) => {
    // const summary = await getSummary(str, []);
    // setMarkmapData(summary)
    // await getSuggestions([{
    //   messageId: '111',
    //   chatId: 'test',
    //   createdAt: new Date(),
    //   content: str,
    //   role: 'user',
    // }]);
  }

  useEffect(() => {
    // fetchSummary()
  }, [])

  return (
    <div className="w-full flex py-7">
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-7">
        <div className="flex flex-col">
          <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </div>
          {previewUrl && (
          <>
            <div>
              <video ref={videoRef} src={previewUrl} className="w-full aspect-video object-contain" controls></video>
            </div>
          
            <div className='mt-3 pb-[20px] grid grid-cols-2 gap-4'>
              <button
                className="px-3 h-7 bg-black hover:bg-black/70 rounded-md text-white"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "分析中..." : "分析视频"}
              </button>
              <button
                className="px-3 h-7 bg-black hover:bg-black/70 rounded-md text-white"
                onClick={handleUpload}
              >
                复制文案
              </button>
              <button
                className="px-3 h-7 bg-black hover:bg-black/70 rounded-md text-white"
                onClick={handleUpload}
              >
                一键改写
              </button>
              <button
                className="px-3 h-7 bg-black hover:bg-black/70 rounded-md text-white"
                onClick={handleUpload}
              >
                生成分镜表格
              </button>
              <button
                className="px-3 h-7 bg-black hover:bg-black/70 rounded-md text-white"
                onClick={handleUpload}
              >
                估算收益
              </button>
            </div>
          </>
          )}
        </div>
        <div className="relative flex justify-center items-center">
          {uploading && !markmapData && (
            <div className="flex justify-center items-center shrink basis-[100%] h-full bg-history-active dark:bg-markmap-dark-box">
              <Image
                src="https://img.alicdn.com/imgextra/i2/O1CN01OJlIbA28RzlMvzPxg_!!6000000007930-55-tps-458-180.svg"
                alt="no data"
                width={343.5}
                height={135}
                className="block dark:hidden"
              />
              <Image
                src="https://img.alicdn.com/imgextra/i4/O1CN016B6IKZ1TYxXbshd9N_!!6000000002395-55-tps-458-180.svg"
                alt="no data"
                width={343.5}
                height={135}
                className="hidden dark:block"
              />
            </div>
          )} 
          { markmapData && (
          <>
            <MarkmapHooks data={markmapData} />
            <div className="absolute bottom-1 right-1">
              
            </div>
          </>
          )}
        </div>
        
        {uploading && !subtitle && (
          <div className=""> 
            <SrtBoxLoading />
          </div>
        )}     
        {subtitleObj.length>0 && (
          <div className="h-[490px] overflow-y-auto rounded-xl shadow-lg bg-[#F5F5F5]"> 
            { subtitleObj.map((item, index) => (
            <div key={index} className='flex p-3 mb-4 text-sm'>
              <span className='mr-7'>{item.StartTime}</span>
              <span>{item.FinalSentence}</span>
            </div>
            ))}
          </div>
          )
        }
    </div>
  </div>
  );
}
export default Page;
