import { writable } from 'svelte/store';
import { swapBoxService } from '$lib/api/swapbox.service.js';
import { browser } from '$app/environment';

export const unreadMessagesCount = writable(0);

let updateInterval;
let currentUserId = null;

export const messagesStore = {
  // Initialisiere den Store mit einer User-ID
  async init(userId) {
    if (!browser || !userId) return;
    
    currentUserId = userId;
    
    // Sofort laden
    await this.updateUnreadCount();
    
    // Alle 30 Sekunden aktualisieren
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
      this.updateUnreadCount();
    }, 30000);
  },

  // Aktualisiere die Anzahl ungelesener Nachrichten
  async updateUnreadCount() {
    if (!currentUserId) return;
    
    try {
      const count = await swapBoxService.getMessagesUnreadCountByUserId(currentUserId);
      unreadMessagesCount.set(typeof count === 'object' ? count.total_unread : count);
    } catch (error) {
      console.error('Fehler beim Laden ungelesener Nachrichten:', error);
    }
  },

  // Store zerstören (cleanup)
  destroy() {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    currentUserId = null;
    unreadMessagesCount.set(0);
  }
};
