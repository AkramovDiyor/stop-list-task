import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { stopListApi } from './api/stopList.api';
import { StopDishForm } from './components/StopDishForm';
import { ActiveStopList } from './components/ActiveStopList';

function App() {
  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ['dishes'],
    queryFn: stopListApi.getDishes,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-error/20 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-text font-bold text-lg mb-2">Не удалось загрузить данные</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-accent font-semibold hover:underline transition-all"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Стоп-лист смены
          </h1>
          <p className="text-text/60 mt-2 text-lg">Управление временной недоступностью блюд на кухне и в баре</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-8">
            <StopDishForm />
            <ActiveStopList />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-text/5 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text">Справочник блюд</h2>
                <span className="text-sm text-text/50 bg-bg px-3 py-1 rounded-full font-medium">
                  {dishes?.length || 0} позиций
                </span>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 bg-bg rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dishes?.map((dish) => (
                    <div 
                      key={dish.id} 
                      className="group p-4 border border-text/5 rounded-xl flex justify-between items-center transition-all duration-200 hover:border-accent/30 hover:bg-bg/50 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-text truncate group-hover:text-accent transition-colors">
                          {dish.name}
                        </div>
                        <div className="text-xs text-text/50 mt-1 font-medium uppercase tracking-wide">
                          {dish.category}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3 text-right">
                        <div className="font-bold text-text">{dish.price} ₽</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;