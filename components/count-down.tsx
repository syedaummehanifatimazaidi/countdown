"use client";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const numericValue = Number(value);
    setDuration(value === "" ? "" : numericValue > 0 ? numericValue : "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Countdown Timer</h1>
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <Input
          type="number"
          placeholder="Enter duration (seconds)"
          value={duration}
          onChange={handleDurationChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button
          onClick={handleSetDuration}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Set Duration
        </Button>
        <div className="text-4xl font-mono text-gray-700 mt-4">{formatTime(timeLeft)}</div>
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleStart}
            disabled={isActive || timeLeft === 0}
            className={`w-full py-2 rounded-md font-semibold ${
              isActive || timeLeft === 0
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            } transition`}
          >
            Start
          </Button>
          <Button
            onClick={handlePause}
            disabled={!isActive || isPaused}
            className={`w-full py-2 rounded-md font-semibold ${
              !isActive || isPaused
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            } transition`}
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
