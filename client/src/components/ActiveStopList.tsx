import React, { useState, useEffect } from 'react';
import type { StopListEntryView } from '../api/stopList.api';
import { useStopList } from '../hooks/useStopList';

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('0');
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}

function StopListItem({ 
  entry, 
  returnDish, 
  isReturning 
}: { 
  entry: StopListEntryView; 
  returnDish: (id: string) => void; 
  isReturning: boolean; 
}) {
  const timeLeft = useCountdown(entry.expiresAt);
  const isExpired = timeLeft === '0' || parseInt(timeLeft.split(':')[0]) < 0;

  return (
    <div className="group p-4 bg-bg/50 hover:bg-bg border border-text/5 hover:border-accent/20 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-text truncate">{entry.dish.name}</h3>
          {isExpired && (
            <span className="flex-shrink-0 text-[10px] uppercase tracking-wider font-bold bg-error/10 text-error px-2 py-0.5 rounded-full">
              Истекло
            </span>
          )}
        </div>
        <p className="text-sm text-text/60 truncate italic">«{entry.reason}»</p>
        <div className="flex items-center gap-2 mt-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-sm font-mono font-bold ${isExpired ? 'text-error' : 'text-accent'}`}>
            {isExpired ? 'Время вышло' : `Осталось: ${timeLeft}`}
          </span>
        </div>
      </div>

      <button
        onClick={() => returnDish(entry.id)}
        disabled={isReturning || isExpired}
        className="flex-shrink-0 px-4 py-2.5 bg-white border border-text/10 text-text text-sm font-semibold rounded-lg hover:bg-text hover:text-bg hover:border-text disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        {isReturning ? 'Возврат...' : 'Вернуть'}
      </button>
    </div>
  );
}

export function ActiveStopList() {
  const { activeEntries, isLoadingActive, returnDish, isReturning } = useStopList();

  if (isLoadingActive) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-text/5 text-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-4 bg-text/10 rounded w-3/4"></div>
          <div className="h-4 bg-text/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!activeEntries || activeEntries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-text/5 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text">Все блюда в продаже</h3>
        <p className="text-text/50 text-sm mt-1">Активных ограничений нет</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-text/5">
      <h2 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full"></span>
        Активный стоп-лист 
        <span className="ml-auto text-xs font-normal text-text/50 bg-bg px-2 py-1 rounded-md">
          {activeEntries.length}
        </span>
      </h2>
      <div className="space-y-3">
        {activeEntries.map((entry) => (
          <StopListItem
            key={entry.id}
            entry={entry}
            returnDish={returnDish}
            isReturning={isReturning}
          />
        ))}
      </div>
    </div>
  );
}