import React from 'react'
import { TimedGroupContent } from '../models/AllModel';
import FileCard2 from './FileCard2';

interface TempCompProps{
    gru:TimedGroupContent[]
}
const TempComp1:React.FC<TempCompProps> = ({gru}) => {

    return (
        <div>
            {gru?.map((obj:TimedGroupContent, index:number) => (
                <div className='h-fit w-full flex flex-row justify-end items-end p-4' key={index}>
                    <FileCard2 chat={obj} />
                </div>
            ))}
        </div>
      )
}

export default TempComp1
