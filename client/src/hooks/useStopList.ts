import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stopListApi, CreateStopEntryInput } from '../api/stopList.api';

export function useStopList() {
  const queryClient = useQueryClient();

  const { data: activeEntries, isLoading: isLoadingActive } = useQuery({
    queryKey: ['stopList', 'active'],
    queryFn: () => stopListApi.getActiveStopList(),
    refetchInterval: 30000, 
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateStopEntryInput) => stopListApi.createStopEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stopList', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => stopListApi.returnDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stopList', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  return {
    activeEntries,
    isLoadingActive,
    createStopEntry: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    returnDish: returnMutation.mutate,
    isReturning: returnMutation.isPending,
    returnError: returnMutation.error,
  };
}