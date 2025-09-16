// 'use client';
import Image from 'next/image';
import React from 'react';


const Logo = () => {
    return (
        <div className='w-[80px] md:w-[100px] overflow-hidden '>
            <Image
                // style={{
                //     filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
                // }}
                className="object-cover scale-125 w-full"
                src={'/Logo.png'}
                // src={'/logo/logo-regular.png'}
                alt="Logo"
                width={220}
                height={150}
                priority
            />
        </div>
    );
};

export default Logo;
