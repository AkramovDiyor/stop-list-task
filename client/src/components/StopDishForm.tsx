import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stopListApi } from '../api/stopList.api';
import { useStopList } from '../hooks/useStopList';
import { createStopEntrySchema, type CreateStopEntryInput } from '../api/validation';

export function StopDishForm() {
  const { data: dishes } = useQuery({ queryKey: ['dishes'], queryFn: stopListApi.getDishes });
  const { activeEntries, createStopEntry, isCreating } = useStopList();

  const [dishId, setDishId] = useState('');
  const [reason, setReason] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  
  const [errors, setErrors] = useState<{ reason?: string; duration?: string; server?: string }>({});
  const activeDishIds = new Set(activeEntries?.map(e => e.dishId) || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createStopEntrySchema.safeParse({
      dishId,
      reason,
      durationMinutes,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        reason: fieldErrors.reason?.[0],
        duration: fieldErrors.durationMinutes?.[0],
        server: undefined,
      });
      return;
    }

    const validatedData = result.data;

    createStopEntry(
      validatedData,
      {
        onSuccess: () => {
          setDishId('');
          setReason('');
          setDurationMinutes('30');
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { error?: { message?: string } } } };
          setErrors({ server: error?.response?.data?.error?.message || 'Ошибка сервера' });
        }
      }
    );
  };

  const inputBaseClass = "w-full p-3 bg-bg border rounded-lg text-text placeholder:text-text/40 focus:outline-none focus:ring-2 transition-all duration-200";
  const inputNormalClass = "border-text/10 focus:ring-accent/20 focus:border-accent";
  const inputErrorClass = "border-error focus:ring-error/20 focus:border-error";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 border border-text/5">
      <h2 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent rounded-full"></span>
        Поставить блюдо в стоп
      </h2>
      
      {errors.server && (
        <div className="mb-5 p-3 bg-error/5 text-error text-sm rounded-lg border border-error/20 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors.server}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-text/80 mb-1.5">Блюдо</label>
          <div className="relative">
            <select
              value={dishId}
              onChange={(e) => setDishId(e.target.value)}
              required
              className={`${inputBaseClass} ${inputNormalClass} appearance-none cursor-pointer pr-10`}
            >
              <option value="">Выберите блюдо из меню...</option>
              {dishes?.map((dish) => (
                <option key={dish.id} value={dish.id} disabled={activeDishIds.has(dish.id)}>
                  {dish.name} {activeDishIds.has(dish.id) ? '— уже в стопе' : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text/80 mb-1.5">Причина</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`${inputBaseClass} ${errors.reason ? inputErrorClass : inputNormalClass}`}
            placeholder="Например: закончились ингредиенты"
          />
          {errors.reason && (
            <p className="mt-1.5 text-sm text-error font-medium flex items-center gap-1">
              <span className="w-1 h-1 bg-error rounded-full"></span> {errors.reason}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text/80 mb-1.5">Длительность (минуты)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className={`${inputBaseClass} ${errors.duration ? inputErrorClass : inputNormalClass}`}
            min="15"
            max="720"
            placeholder="30"
          />
          {errors.duration && (
            <p className="mt-1.5 text-sm text-error font-medium flex items-center gap-1">
              <span className="w-1 h-1 bg-error rounded-full"></span> {errors.duration}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isCreating || !dishId}
          className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-accent/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Добавляем...
            </>
          ) : (
            'Добавить в стоп-лист'
          )}
        </button>
      </div>
    </form>
  );
}