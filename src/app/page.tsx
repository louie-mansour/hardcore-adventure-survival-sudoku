'use client'

import { config } from "@/config";
import PlayArea from "./playarea/playArea";
import React from "react";

export default function Home() {
  
  return <PlayArea config={config}/>
}
