import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { formatTime } from './util';
import { ITimerRefHandles } from '../../type';
import clsx from 'clsx';

const Timer = forwardRef<ITimerRefHandles>((_, timerRef) => {
  const [time, setTime] = useState<number>(0); // 单位：秒
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useImperativeHandle(timerRef, () => ({
    toggleTimePause,
    handleTimeReset,
    toggleTimeRunning,
  }));

  useEffect(() => {
    setIsRunning(true);
  }, []);

  const toggleTimePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleTimeReset = () => {
    setTime(0);
  };

  const toggleTimeRunning = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    let intervalId = null;

    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, isPaused]);

  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="text-lg font-mono text-gray-800">
        {formatTime(time)}
      </span>
      <button
        onClick={toggleTimePause}
        disabled={!isRunning}
        className={clsx(
          'px-2 py-1 bg-sky-400 text-white rounded-md hover:bg-sky-600 transition',
          {
            'opacity-50 cursor-not-allowed': !isRunning,
          }
        )}
      >
        {isPaused ? '继续' : '暂停'}
      </button>
    </div>
  );
});

export default Timer;
