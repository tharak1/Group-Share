import React from 'react'
import { GroupContent } from '../models/AllModel'
import FileCard from './FileCard';

interface TempCompProps{
    gru:GroupContent[];
}

const TempComp:React.FC<TempCompProps> = ({gru}) => {
  return (
    <div>
        {gru?.map((obj:GroupContent, index:number) => (
            <div className='h-fit w-full flex flex-row justify-end items-end p-4' key={index}>
                <FileCard chat={obj} />
            </div>
        ))}
    </div>
  )
}

export default TempComp
