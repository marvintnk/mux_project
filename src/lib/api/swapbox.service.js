// lib/services/swapboxService.js
import supabase from "../supabase";


class SwapBoxService {
  // ========== USERS ==========
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // <- Verwenden Sie maybeSingle() statt single()
    
    if (error) throw error;
    return data; // Gibt null zurück wenn kein User gefunden wird
  }


  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        password_hash: userData.password_hash,
        verified: userData.verified || false,
        location: userData.location || null,
        rating: userData.rating || 0,
        role: userData.role || 'student'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }


  // ========== OFFERS ==========
  async getOffers(filters = {}) {
    let query = supabase
      .from('offers')
      .select(`
        *,
        users:user_id(name, rating),
        offer_images(id, image_url, uploaded_at)
      `)
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.excludeCategory) {
      query = query.not('category', 'eq', filters.excludeCategory);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Add public URLs to offer images
    return data.map(offer => ({
      ...offer,
      offer_images: offer.offer_images?.map(image => ({
        ...image,
        public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
      })) || []
    }));
  }

  async getOfferById(id) {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        users:user_id(name, rating),
        offer_images(id, image_url, uploaded_at)
        `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Add public URLs to offer images
    return {
      ...data,
      offer_images: data.offer_images?.map(image => ({
        ...image,
        public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
      })) || []
    };
  }

  async createOffer(offerData) {
    const { data, error } = await supabase
      .from('offers')
      .insert([{
        user_id: offerData.user_id,
        title: offerData.title,
        description: offerData.description,
        category: offerData.category,
        status: offerData.status || 'active',
        type: offerData.type,
        location: offerData.location
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOffer(id, offerData) {
    const { data, error } = await supabase
      .from('offers')
      .update({
        ...offerData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOffer(id) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // ========== OFFER IMAGES ==========
  async getOfferImages(offerId) {
    const { data, error } = await supabase
      .from('offer_images')
      .select('*')
      .eq('offer_id', offerId)
      .order('uploaded_at', { ascending: true });
    
    if (error) throw error;
    
    // Add public URLs to the images
    return data.map(image => ({
      ...image,
      public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
    }));
  }

  async uploadOfferImage(offerId, file, userId) {
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        throw new Error('Datei ist zu groß (max. 5MB)');
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Dateityp nicht unterstützt. Nur JPEG, PNG und WebP erlaubt.');
      }

      // Dateiname zerlegen
      const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // entfernt .png, .jpg etc.
      const fileExtension = file.name.split('.').pop();

      // Neuen Dateinamen bauen
      const fileName = `${offerId}/${userId}_${originalNameWithoutExt}.${fileExtension}`;


      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('offer-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save image record to database
      const { data, error } = await supabase
        .from('offer_images')
        .insert([{
          offer_id: offerId,
          image_url: uploadData.path
        }])
        .select()
        .single();
      
      if (error) {
        // Cleanup uploaded file if database insert fails
        await supabase.storage.from('offer-images').remove([uploadData.path]);
        throw error;
      }

      // Return with public URL
      return {
        ...data,
        public_url: supabase.storage.from('offer-images').getPublicUrl(uploadData.path).data.publicUrl
      };
      
    } catch (error) {
      throw error;
    }
  }

  async addOfferImage(imageData) {
    // Legacy method - kept for backward compatibility
    const { data, error } = await supabase
      .from('offer_images')
      .insert([{
        offer_id: imageData.offer_id,
        image_url: imageData.image_url
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOfferImage(id) {
    // Get image data first to delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('offer_images')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from('offer-images')
      .remove([imageData.image_url]);

    if (storageError) {
      console.warn('Failed to delete image from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error } = await supabase
      .from('offer_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async uploadMultipleOfferImages(offerId, files, userId) {
    const uploadPromises = files.map(file => this.uploadOfferImage(offerId, file, userId));
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      return {
        successful,
        failed,
        total: files.length,
        successCount: successful.length,
        failureCount: failed.length
      };
      
    } catch (error) {
      throw error;
    }
  }

  // ========== FAVORITES ==========
  async getFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        offers(*, users:user_id(name), offer_images(id, image_url, uploaded_at))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add public URLs to offer images
    return data.map(favorite => ({
      ...favorite,
      offers: {
        ...favorite.offers,
        offer_images: favorite.offers?.offer_images?.map(image => ({
          ...image,
          public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
        })) || []
      }
    }));
  }

  async getFavoritesByOffer(offer_id) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *
      `)
      .eq('offer_id', offer_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add public URLs to offer images
    return data.map(favorite => ({
      ...favorite,
      offers: {
        ...favorite.offers,
        offer_images: favorite.offers?.offer_images?.map(image => ({
          ...image,
          public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
        })) || []
      }
    }));
  }

  async addToFavorites(userId, offerId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        offer_id: offerId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async removeFromFavorites(userId, offerId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('offer_id', offerId);
    
    if (error) throw error;
    return true;
  }

  async isFavorite(userId, offerId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('offer_id', offerId)
      .single();
    
    return !error && data;
  }

  // ========== CHATS ==========
   async getChats(userId) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        offers(title, category),
        user1:user1_id(name),
        user2:user2_id(name),
        messages(content, sent_at, read, sender_id)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
    
    // Add last message and unread count to each chat
    return data.map(chat => {
      const messages = chat.messages || [];
      // @ts-ignore
      const lastMessage = messages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))[0];
      const unreadCount = messages.filter(msg => !msg.read && msg.sender_id !== userId).length;
      
      return {
        ...chat,
        lastMessage,
        unreadCount,
        otherUser: chat.user1_id === userId ? chat.user2 : chat.user1
      };
    });
  }
  async getChatById(id) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        offers(title, category, user_id),
        user1:user1_id(name),
        user2:user2_id(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
    return data;
  }

  async createChat(chatData) {
    // Check if chat already exists
    const { data: existingChat } = await supabase
      .from('chats')
      .select('id')
      .eq('offer_id', chatData.offer_id)
      .or(`and(user1_id.eq.${chatData.user1_id},user2_id.eq.${chatData.user2_id}),and(user1_id.eq.${chatData.user2_id},user2_id.eq.${chatData.user1_id})`)
      .single();

    if (existingChat) {
      return existingChat;
    }

    const { data, error } = await supabase
      .from('chats')
      .insert([{
        offer_id: chatData.offer_id,
        user1_id: chatData.user1_id,
        user2_id: chatData.user2_id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ========== MESSAGES ==========
async getMessages(chatId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(name)
      `)
      .eq('chat_id', chatId)
      .order('sent_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    // Add public URLs for message images
    return data.map(message => ({
      ...message,
      image_public_url: message.image_url 
        ? supabase.storage.from('message-images').getPublicUrl(message.image_url).data.publicUrl 
        : null
    }));
  }


   async sendMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        chat_id: messageData.chat_id,
        sender_id: messageData.sender_id,
        content: messageData.content,
        image_url: messageData.image_url || null
      }])
      .select(`
        *,
        sender:sender_id(name)
      `)
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    // Add public URL if image exists
    return {
      ...data,
      image_public_url: data.image_url 
        ? supabase.storage.from('message-images').getPublicUrl(data.image_url).data.publicUrl 
        : null
    };
  }

  async uploadMessageImage(file, userId, chatId) {
    try {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB for messages
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        throw new Error('Bild ist zu groß (max. 10MB)');
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Dateityp nicht unterstützt. Nur JPEG, PNG und WebP erlaubt.');
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${chatId}/${userId}_${Date.now()}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('message-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      return {
        path: uploadData.path,
        public_url: supabase.storage.from('message-images').getPublicUrl(uploadData.path).data.publicUrl
      };
      
    } catch (error) {
      throw error;
    }
  }

  async sendMessageWithImage(messageData, imageFile) {
    try {
      let imagePath = null;
      
      // Upload image if provided
      if (imageFile) {
        const imageUpload = await this.uploadMessageImage(imageFile, messageData.sender_id, messageData.chat_id);
        imagePath = imageUpload.path;
      }

      // Send message with image path
      const message = await this.sendMessage({
        ...messageData,
        image_url: imagePath
      });

      return message;
      
    } catch (error) {
      throw error;
    }
  }

  async markMessageAsRead(messageId) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
    return data;
  }

async markChatMessagesAsRead(chatId, userId) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', userId);
    
    if (error) {
      console.error('Error marking chat messages as read:', error);
      throw error;
    }
    return true;
  }

  // ========== RATINGS ==========
  async getRatings(userId) {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        offers(title),
        from_user:from_user_id(name, profile_picture),
        to_user:to_user_id(name, profile_picture)
      `)
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createRating(ratingData) {
    const { data, error } = await supabase
      .from('ratings')
      .insert([{
        offer_id: ratingData.offer_id,
        from_user_id: ratingData.from_user_id,
        to_user_id: ratingData.to_user_id,
        rating_value: ratingData.rating_value,
      }])
      .select()
      .single();
    
    if (error) throw error;

    // Update user's average rating
    await this.updateUserRating(ratingData.to_user_id);
    
    return data;
  }

  async updateUserRating(userId) {
    const { data: ratings } = await supabase
      .from('ratings')
      .select('rating_value')
      .eq('to_user_id', userId);

    if (ratings && ratings.length > 0) {
      const average = ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length;
      
      await supabase
        .from('users')
        .update({ rating: Math.round(average * 10) / 10 })
        .eq('id', userId);
    }
  }

  // ========== UTILITY METHODS ==========
  async searchOffers(searchTerm, filters = {}) {
    let query = supabase
      .from('offers')
      .select(`
        *,
        users:user_id(name, profile_picture, rating),
        offer_images(id, image_url, uploaded_at)
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('status', 'active');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add public URLs to offer images
    return data.map(offer => ({
      ...offer,
      offer_images: offer.offer_images?.map(image => ({
        ...image,
        public_url: supabase.storage.from('offer-images').getPublicUrl(image.image_url).data.publicUrl
      })) || []
    }));
  }

  async getStatistics(userId) {
    const [offersResult, ratingsResult, favoritesResult, chatsResult] = await Promise.allSettled([
      supabase.from('offers').select('id').eq('user_id', userId),
      supabase.from('ratings').select('rating_value').eq('to_user_id', userId),
      supabase.from('favorites').select('id').eq('user_id', userId),
      supabase.from('chats').select('id').or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    ]);

    return {
      totalOffers: offersResult.status === 'fulfilled' ? offersResult.value.data?.length || 0 : 0,
      averageRating: ratingsResult.status === 'fulfilled' && ratingsResult.value.data?.length > 0
        ? ratingsResult.value.data.reduce((sum, r) => sum + r.rating_value, 0) / ratingsResult.value.data.length
        : 0,
      totalFavorites: favoritesResult.status === 'fulfilled' ? favoritesResult.value.data?.length || 0 : 0,
      totalChats: chatsResult.status === 'fulfilled' ? chatsResult.value.data?.length || 0 : 0
    };
  }

// Real-time subscriptions
 subscribeToMessages(chatId, callback) {
    const channel = supabase
      .channel(`messages-${chatId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, 
        async (payload) => {
          console.log('Real-time message received:', payload);
          
          try {
            // Fetch the complete message with sender info
            const { data: completeMessage, error } = await supabase
              .from('messages')
              .select(`
                *,
                sender:sender_id(name)
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && completeMessage) {
              // Add public URL for image if exists
              const messageWithUrl = {
                ...completeMessage,
                image_public_url: completeMessage.image_url 
                  ? supabase.storage.from('message-images').getPublicUrl(completeMessage.image_url).data.publicUrl 
                  : null
              };
              
              callback(messageWithUrl);
            } else {
              console.error('Error fetching complete message:', error);
              // Fallback to basic payload
              const messageWithUrl = {
                ...payload.new,
                image_public_url: payload.new.image_url 
                  ? supabase.storage.from('message-images').getPublicUrl(payload.new.image_url).data.publicUrl 
                  : null
              };
              callback(messageWithUrl);
            }
          } catch (err) {
            console.error('Error in real-time subscription:', err);
            // Fallback to basic payload
            const messageWithUrl = {
              ...payload.new,
              image_public_url: payload.new.image_url 
                ? supabase.storage.from('message-images').getPublicUrl(payload.new.image_url).data.publicUrl 
                : null
            };
            callback(messageWithUrl);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time messages');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to real-time messages');
        }
      });
    
    return channel;
  }
// Update the unsubscribe method:
 unsubscribe(subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}

export const swapBoxService = new SwapBoxService();