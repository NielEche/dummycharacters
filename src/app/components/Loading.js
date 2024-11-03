import React from 'react';
import Image from 'next/image';
import code from '../../assets/code.GIF';

const Loading = () => {
    return (
        <div className="mainSec flex items-center justify-center bg-black fixed inset-0 z-50">
            <Image
                src={code}
                alt="Background image"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                priority
            />
        </div>
    );
};

export default Loading;
