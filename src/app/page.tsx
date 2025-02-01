'use client'

import { config } from "@/config";
import PlayArea from "./playarea/playArea";
import React from "react";

export default function Home() {
  const sudokuNumber = Math.floor(Math.random() * 50)
  return (
    <div data-sn={sudokuNumber} id='sudoku-number' >
      <PlayArea config={config} sudokuNumber={sudokuNumber} />
    </div>
  )
}
