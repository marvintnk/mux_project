<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { swapBoxService } from '../../lib/api/swapbox.service';
 
    let chats = $state([]);
    let loading = $state(true);
    let error = $state(null);
      
   let  { data } = $props();
    let user = data.user;
    let userId = user.id;
    
    onMount(async () => {
        try {
            loading = true;
            error = null;
            chats = await swapBoxService.getChats(userId);
        } catch (err) {
            error = err.message || 'Failed to load chats';
            console.error('Error fetching chats:', err);
        } finally {
            loading = false;
        }
    });
    
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('de-DE');
    }
    
    function getDisplayName(chat) {
        return chat.otherUser?.name || 'Unknown User';
    }
    
    function getChatTitle(chat) {
        return chat.offers?.title || 'Chat';
    }
    
    function getAvatarLetter(title) {
        return title?.charAt(0)?.toUpperCase() || '?';
    }
</script>

<p class="mt-2 text-2xl text-center mb-4">Chats</p>

{#if loading}
    <div class="flex justify-center items-center py-8">
        <div class="loading loading-spinner loading-lg"></div>
    </div>
{:else if error}
    <div class="alert alert-error mx-2 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading chats: {error}</span>
    </div>
{:else if chats.length === 0}
    <div class="flex flex-col items-center justify-center py-12 px-4">
        <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Keine Chats vorhanden</h3>
            <p class="text-gray-500 mb-4">Du hast noch keine Unterhaltungen gestartet.</p>
            <p class="text-sm text-gray-400">Starte eine neue Unterhaltung, indem du auf ein Angebot antwortest.</p>
        </div>
    </div>
{:else}
    {#each chats as chat}
        <a class="rounded-box shadow-sm flex mx-2 mt-2 hover:shadow-md transition-shadow" href="/chat/{chat.id}">
            {#if chat.image === null}
                <div class="skeleton min-h-16 min-w-16 m-2"></div>
            {:else if chat.image === undefined || !chat.image}
                <div class="avatar avatar-placeholder m-2">
                    <div class="bg-neutral text-neutral-content w-16 rounded-box">
                        <span class="text-2xl">{getAvatarLetter(getChatTitle(chat))}</span>
                    </div>
                </div>
            {:else}
                <img class="min-h-16 min-w-16 rounded-box m-2" width="16" height="16" src="{chat.image}" alt="Chat Image">
            {/if}
            <div class="w-full">
                <div class="mt-2 flex">
                    <p class="mx-2">{getDisplayName(chat)}</p>
                    <p class="mx-2" style="margin-left: auto !important;">{formatDate(chat.created_at)}</p>
                </div>
                <div class="w-full flex items-center">
                    <p class="mx-2 text-xl">{getChatTitle(chat)}</p>
                    {#if chat.unreadCount > 0}
                        <span class="badge badge-primary badge-sm ml-2">{chat.unreadCount}</span>
                    {/if}
                </div>
                {#if chat.lastMessage}
                    <div class="w-full flex">
                        <p class="mx-2 text-sm text-gray-500 truncate">{chat.lastMessage.content}</p>
                    </div>
                {/if}
            </div>
        </a>
    {/each}
{/if}