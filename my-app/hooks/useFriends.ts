import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import FriendService from '@/services/friends';
import type { FriendRequest, FriendWithProfile } from '@/types/friends';

/**
 * Hook customizado para gerenciar amigos e pedidos de amizade
 */
export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os dados de amigos
   */
  const loadFriendsData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const [friendsData, receivedData, sentData, count] = await Promise.all([
        FriendService.getFriends(user.id),
        FriendService.getReceivedRequests(user.id),
        FriendService.getSentRequests(user.id),
        FriendService.countPendingRequests(user.id),
      ]);

      setFriends(friendsData);
      setReceivedRequests(receivedData);
      setSentRequests(sentData);
      setPendingCount(count);
    } catch (err: any) {
      console.error('Erro ao carregar dados de amigos:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Carrega apenas pedidos recebidos
   */
  const loadReceivedRequests = useCallback(async () => {
    if (!user?.id) return;

    try {
      const data = await FriendService.getReceivedRequests(user.id);
      setReceivedRequests(data);
      const count = await FriendService.countPendingRequests(user.id);
      setPendingCount(count);
    } catch (err: any) {
      console.error('Erro ao carregar pedidos recebidos:', err);
    }
  }, [user?.id]);

  /**
   * Envia um pedido de amizade
   */
  const sendFriendRequest = useCallback(async (receiverId: string, message?: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const request = await FriendService.sendFriendRequest({
      sender_id: user.id,
      receiver_id: receiverId,
      message,
    });

    // Atualiza lista de pedidos enviados
    setSentRequests(prev => [request, ...prev]);

    return request;
  }, [user?.id]);

  /**
   * Aceita um pedido de amizade
   */
  const acceptFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    await FriendService.acceptFriendRequest(requestId, user.id);

    // Remove da lista de pedidos recebidos
    setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
    setPendingCount(prev => Math.max(0, prev - 1));

    // Recarrega lista de amigos
    const friendsData = await FriendService.getFriends(user.id);
    setFriends(friendsData);
  }, [user?.id]);

  /**
   * Rejeita um pedido de amizade
   */
  const rejectFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    await FriendService.rejectFriendRequest(requestId, user.id);

    // Remove da lista de pedidos recebidos
    setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
    setPendingCount(prev => Math.max(0, prev - 1));
  }, [user?.id]);

  /**
   * Cancela um pedido enviado
   */
  const cancelFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    await FriendService.cancelFriendRequest(requestId, user.id);

    // Remove da lista de pedidos enviados
    setSentRequests(prev => prev.filter(req => req.id !== requestId));
  }, [user?.id]);

  /**
   * Remove um amigo
   */
  const removeFriend = useCallback(async (friendId: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    await FriendService.removeFriend(user.id, friendId);

    // Remove da lista de amigos
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
  }, [user?.id]);

  /**
   * Busca usuários por username
   */
  const searchUsers = useCallback(async (query: string) => {
    if (!user?.id) return [];
    return await FriendService.searchUsersByUsername(query, user.id);
  }, [user?.id]);

  /**
   * Verifica se é amigo de alguém
   */
  const checkIfFriends = useCallback(async (friendId: string) => {
    if (!user?.id) return false;
    return await FriendService.checkIfFriends(user.id, friendId);
  }, [user?.id]);

  // Carrega dados ao montar
  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  return {
    // Estado
    friends,
    receivedRequests,
    sentRequests,
    pendingCount,
    loading,
    error,
    
    // Ações
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend,
    searchUsers,
    checkIfFriends,
    
    // Recarregar
    refresh: loadFriendsData,
    refreshRequests: loadReceivedRequests,
  };
}
