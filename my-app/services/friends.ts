import { supabase } from './supabaseConfig';
import type { FriendRequest, FriendRequestCreateInput, Friend, FriendWithProfile } from '@/types/friends';
import { generateUserCode } from '@/utils/userCode';

/**
 * Service para gerenciar pedidos de amizade e amigos
 */
export class FriendService {
  
  // ==================== FRIEND REQUESTS ====================
  
  /**
   * Envia um pedido de amizade
   */
  static async sendFriendRequest(data: FriendRequestCreateInput): Promise<FriendRequest> {
    // Verifica se já existe um pedido pendente
    const { data: existing } = await supabase
      .from('friend_requests')
      .select('id, status')
      .eq('sender_id', data.sender_id)
      .eq('receiver_id', data.receiver_id)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'pending') {
        throw new Error('Você já enviou um pedido de amizade para este usuário.');
      }
      if (existing.status === 'accepted') {
        throw new Error('Vocês já são amigos.');
      }
    }

    // Verifica se já são amigos
    const areFriends = await this.checkIfFriends(data.sender_id, data.receiver_id);
    if (areFriends) {
      throw new Error('Vocês já são amigos.');
    }

    const { data: request, error } = await supabase
      .from('friend_requests')
      .insert([{
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        message: data.message || null,
        status: 'pending',
      }])
      .select(`
        *,
        sender:profiles!sender_id(id, name, username, avatar_url),
        receiver:profiles!receiver_id(id, name, username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return request;
  }

  /**
   * Busca pedidos recebidos (para o usuário logado)
   */
  static async getReceivedRequests(userId: string): Promise<FriendRequest[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        sender:profiles!sender_id(id, name, username, avatar_url)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca pedidos enviados (pelo usuário logado)
   */
  static async getSentRequests(userId: string): Promise<FriendRequest[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        receiver:profiles!receiver_id(id, name, username, avatar_url)
      `)
      .eq('sender_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Aceita um pedido de amizade
   */
  static async acceptFriendRequest(requestId: string, receiverId: string): Promise<void> {
    // Busca o pedido
    const { data: request, error: fetchError } = await supabase
      .from('friend_requests')
      .select('sender_id, receiver_id, status')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;
    if (!request) throw new Error('Pedido de amizade não encontrado.');
    if (request.receiver_id !== receiverId) {
      throw new Error('Você não tem permissão para aceitar este pedido.');
    }
    if (request.status !== 'pending') {
      throw new Error('Este pedido já foi processado.');
    }

    // Atualiza o status do pedido
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Cria a relação de amizade bidirecional
    const { error: friendsError } = await supabase
      .from('friends')
      .insert([
        { user_id: request.sender_id, friend_id: request.receiver_id },
        { user_id: request.receiver_id, friend_id: request.sender_id },
      ]);

    if (friendsError) throw friendsError;
  }

  /**
   * Rejeita um pedido de amizade
   */
  static async rejectFriendRequest(requestId: string, receiverId: string): Promise<void> {
    // Verifica se o usuário tem permissão
    const { data: request, error: fetchError } = await supabase
      .from('friend_requests')
      .select('receiver_id, status')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;
    if (!request) throw new Error('Pedido de amizade não encontrado.');
    if (request.receiver_id !== receiverId) {
      throw new Error('Você não tem permissão para rejeitar este pedido.');
    }

    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;
  }

  /**
   * Cancela um pedido enviado (antes de ser aceito/rejeitado)
   */
  static async cancelFriendRequest(requestId: string, senderId: string): Promise<void> {
    // Verifica se o usuário é o remetente
    const { data: request, error: fetchError } = await supabase
      .from('friend_requests')
      .select('sender_id, status')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;
    if (!request) throw new Error('Pedido de amizade não encontrado.');
    if (request.sender_id !== senderId) {
      throw new Error('Você não tem permissão para cancelar este pedido.');
    }

    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
  }

  // ==================== FRIENDS ====================

  /**
   * Busca todos os amigos de um usuário
   */
  static async getFriends(userId: string): Promise<FriendWithProfile[]> {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        created_at,
        friend:profiles!friend_id(id, name, username, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Mapeia para o formato FriendWithProfile
    return (data || []).map((item: any) => ({
      id: item.friend.id,
      name: item.friend.name,
      username: item.friend.username,
      avatar_url: item.friend.avatar_url,
      friendshipDate: item.created_at,
    }));
  }

  /**
   * Remove um amigo (remove ambas as direções da amizade)
   */
  static async removeFriend(userId: string, friendId: string): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (error) throw error;
  }

  /**
   * Verifica se dois usuários são amigos
   */
  static async checkIfFriends(userId1: string, userId2: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', userId1)
      .eq('friend_id', userId2)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  /**
   * Busca usuário por código único (user code)
   * Gera o código a partir do ID e compara
   */
  static async searchUserByCode(code: string, currentUserId: string): Promise<any | null> {
    if (!code || code.length < 7) return null;
    
    // Remove o # se presente
    const cleanCode = code.replace('#', '').toUpperCase();
    
    // Busca todos os usuários exceto o atual
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, username, avatar_url')
      .neq('id', currentUserId);

    if (error) throw error;
    if (!data) return null;
    
    // Procura o usuário cujo código gerado corresponde ao código buscado
    for (const user of data) {
      const userCode = generateUserCode(user.id).replace('#', '').toUpperCase();
      if (userCode === cleanCode) {
        return user;
      }
    }
    
    return null;
  }

  /**
   * Busca usuários por username (para adicionar amigos)
   */
  static async searchUsersByUsername(query: string, currentUserId: string): Promise<any[]> {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, username, avatar_url')
      .ilike('username', `%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  /**
   * Conta pedidos pendentes recebidos
   */
  static async countPendingRequests(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('friend_requests')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  }
}

export default FriendService;
