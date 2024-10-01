import { useEffect, useState } from 'react';
import { LayoutList, LayoutGrid } from 'lucide-react'
import { Scene, Subtitle } from '@/components/VideoWindow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SrtBoxLoading from '@/components/SrtBoxLoading'
import { useTranslations } from 'use-intl'

const VideoSceneBox = ({ sceneData }: { sceneData?: Scene[] }) => {
  const t = useTranslations();
  
  useEffect(() => {    
    
  }, []);

  return (
    <div className="p-8 shadow-sm rounded-lg bg-card text-card-foreground">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className='w-full'>
          <TabsTrigger value="list">
            <LayoutList size={25} />
          </TabsTrigger>
          <TabsTrigger value="grid">
            <LayoutGrid size={25} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr className='text-[#A0AEC0] text-left'>
                  <th className='w-[180px] px-6 py-3 border-b border-tbborder'>{t('video_page.scene')}</th>
                  <th className='w-[100px] px-0 py-3 border-b border-tbborder'></th>
                  <th className='px-6 py-3 border-b border-tbborder'>{t('video_page.copywriting')}</th>
                </tr>
              </thead>
              <tbody>
              {sceneData && sceneData.map((s:Scene, sceneIndex:number) => (
                (s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                  s.relatedSubtitles.map((subtitle:Subtitle, subtitleIndex:number) => (
                    <tr key={`${sceneIndex}-${subtitleIndex}`}>
                      {subtitleIndex === 0 && (
                        <td className='px-6 py-3 border-b border-tbborder' rowSpan={s.relatedSubtitles?.length}>
                          <img 
                            // onClick={() => videoRef.current && videoRef.current.seekTo(s.startTime)}
                            src={`//${s.url}`} className='rounded-md' width={180} alt={`Scene ${sceneIndex}`} />
                        </td>
                      )}
                      <td className='px-0 py-3 text-sm border-b border-tbborder'>
                        <p className="">
                          {`${subtitle.startTime} - ${subtitle.endTime}`}
                        </p>
                      </td>
                      <td className='px-6 py-3 border-b border-tbborder'>
                        <p className="">
                          {subtitle.text}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={`${sceneIndex}`}>
                    <td className='px-6 py-3 border-b border-tbborder'>
                      <img src={`//${s.url}`} width={180} className='rounded-md' alt={`Scene ${sceneIndex}`} />
                    </td>
                    <td className='px-6 py-3 border-b border-tbborder'></td>
                    <td className='px-6 py-3 border-b border-tbborder'>{t('video_page.no_subtitles')}</td>
                  </tr>
                )
              ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="grid">
          <div className='grid grid-cols-3 gap-4'>
          {sceneData && sceneData.map((s:Scene, sceneIndex:number) => (
            <div key={`scene-${sceneIndex}`} className='p-3 bg-light-secondary dark:bg-dark-secondary rounded-md'>
              <div className=''>
                <img src={`//${s.url}`} className='w-full rounded-md' alt={`Scene ${sceneIndex}`} />
              </div>

              <div className='px-3 py-2 text-sm'>
              {(s.relatedSubtitles && s.relatedSubtitles.length > 0) ? (
                s.relatedSubtitles.map((subtitle:Subtitle, subtitleIndex:number) => (
                  <p key={`sub-${subtitleIndex}`} className="line-clamp-1">
                    {subtitle.text}
                  </p>
                ))
              ) : (
                <p>{t('video_page.no_subtitles')}</p>
              )}
              </div>
            </div>
          ))}
          </div>
        </TabsContent>
      </Tabs>

      {!sceneData && (
        <SrtBoxLoading />
      )}
    </div>
  );
};

export default VideoSceneBox;
