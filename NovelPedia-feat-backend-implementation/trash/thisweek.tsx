import React from "react";
import Image from "next/image";

type TrendType = {
  title: string;
  rating: string;
  numPeeps: number;
  badge?: string;
  image?: React.ReactNode; // Function to render icon
};

type Props = {
  carous: TrendType[];
};


export default function ThisWeek({ ThisWeek }: Props) {
    return (
        <></>
    );
}