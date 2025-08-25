"use client"
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('topic') || '';

  const [ searchQuery, setSearchQuery ] = useState('');
useEffect(() => {

  const delayDebounceFn = setTimeout(() => {
    if (searchQuery){
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'topic',
      value: searchQuery,

    });
    router.push(newUrl, {scroll: false});
  } else{
    if ( pathname === '/companions') {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['topic']
      });
      router.push(newUrl, {scroll: false});
    }
  }

  }, 600);
  
}, [searchQuery, router, searchParams, pathname]);


  return (
    <div className='relative border border-balck rounded-lg 
    items-center flex gap-2 px-2 py-1 h-fit'>
      <Image src="/icons/search.svg" alt="search" 
      width={16} 
      height={16}/>
      <input
      placeholder='search companions...'
      className='outline-none'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
  )
}

export default SearchInput