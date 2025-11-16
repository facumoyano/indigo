import { Images } from '@/app/images';
import Image from 'next/image';
import React from 'react';

const insigniaMap = {
  blue: Images.mobile.sectionThree.insigniaBlue,
  green: Images.mobile.sectionThree.insigniaGreen,
  orange: Images.mobile.sectionThree.insigniaOrange,
  purple: Images.mobile.sectionThree.insigniaPurple,
} as const;

const colorHexMap = {
  blue: '#606eb2',
  green: '#a7e6d7',
  orange: '#ffa38b',
  purple: '#c1a7e2',
} as const;

interface CardInsigniaProps {
  title: string;
  description: string;
  color: keyof typeof insigniaMap;
}

const CardInsignia = ({ title, description, color }: CardInsigniaProps) => {
  const insigniaSrc = insigniaMap[color];
  const colorHex = colorHexMap[color];

  // Convertimos HEX a RGBA con opacidad 0.1
  const hexToRgba = (hex: string, opacity: number) => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const bgColor = hexToRgba(colorHex, 0.1);

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full p-4 rounded-2xl space-y-4 relative"
      style={{
        backgroundColor: bgColor,
        color: colorHex, // Aplica color al texto
      }}
    >
      {insigniaSrc && (
        <Image
          src={insigniaSrc}
          alt={`${color} insignia`}
          width={30}
          height={30}
          className="absolute -top-3 right-0"
        />
      )}
      <span className="font-bold text-sm md:text-left md:w-full  md:text-lg md:leading-5">{title}</span>
      <p className="text-sm md:text-left md:w-full md:text-lg md:leading-5">{description}</p>
    </div>
  );
};

export default CardInsignia;
