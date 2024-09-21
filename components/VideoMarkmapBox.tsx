import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { createPortal } from 'react-dom'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageDown, Maximize, Minimize } from 'lucide-react'
import MarkmapHooks from '@/components/markmap/markmap-hooks'

const VideoMarkmapBox = ({ markmapData }: { markmapData?: string }) => {

  return (
    <div className="relative h-80 shadow-sm rounded-lg bg-card">
      {!markmapData ? (
        <div className="flex justify-center items-center shrink basis-[100%] h-full">
          <Image
            src={"/images/markmap-loading.svg"}
            alt="no data"
            width={343.5}
            height={135}
            className="block dark:hidden"
          />
          <Image
            src={"/images/markmap-loading-dark.svg"}
            alt="no data"
            width={343.5}
            height={135}
            className="hidden dark:block"
          />
        </div>
      ) : (
        <>
          <MarkmapHooks data={markmapData} />
          <div className='absolute right-4 bottom-4 space-x-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ImageDown size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs'>
                  <p>下载图片</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Maximize size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full h-full">
                <DialogTitle className='hidden'></DialogTitle>
                <MarkmapHooks data={markmapData} />
              </DialogContent>
            </Dialog>
            
          </div>
        </>
      )} 
    </div>
  );
};

export default VideoMarkmapBox;
