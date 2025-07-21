<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { swapBoxService } from '$lib/api/swapbox.service.js';

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


<div class="flex">
    <p class="text-2xl font-bold mx-auto mt-12 mb-10">Chats</p>
</div>



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
            <h3 class="text-lg font-medium text-gray-400 mb-2">Keine Chats vorhanden</h3>
            <p class="text-gray-400 mb-4">Du hast noch keine Unterhaltungen gestartet.</p>
            <p class="text-sm text-gray-400">Starte eine neue Unterhaltung, indem du auf ein Angebot antwortest.</p>
        </div>
    </div>
{:else}
    {#each chats as chat}
        <a class="rounded-box shadow-sm chat-card-layout mx-2 mt-2 hover:shadow-md transition-shadow p-2 bg-base-200" href="/chat/{chat.id}">
            <div class="image-wrapper flex-shrink-0 mx-auto mb-2">
                {#if chat.image === null}
                    <div class="skeleton min-h-16 min-w-16 rounded-box"></div>
                {:else if chat.image === undefined || !chat.image}
                    <div class="avatar avatar-placeholder">
                        <div class="bg-neutral text-neutral-content w-16 h-16 rounded-box flex items-center justify-center">
                            <span class="text-2xl">{getAvatarLetter(getChatTitle(chat))}</span>
                        </div>
                    </div>
                {:else}
                    <img class="w-16 h-16 object-cover rounded-box" src="{chat.image}" alt="Chat Image">
                {/if}
            </div>

            <div class="text-content flex-grow flex flex-col min-w-0">
                <div class="flex justify-between items-start">
                    <p class="text-base font-semibold text-gray-400 flex-grow truncate mr-2">{getDisplayName(chat)}</p>
                    <p class="text-xs text-gray-400 flex-shrink-0">{formatDate(chat.created_at)}</p>
                </div>

                <div class="flex items-center mt-1">
                    <p class="text-xl font-bold truncate flex-grow mr-2">{getChatTitle(chat)}</p>
                    {#if chat.unreadCount > 0}
                        <span class="badge badge-primary badge-sm flex-shrink-0">{chat.unreadCount}</span>
                    {/if}
                </div>

                {#if chat.lastMessage}
                    <div class="flex mt-1">
                        <p class="text-sm text-gray-400 truncate flex-grow">{chat.lastMessage.content}</p>
                    </div>
                {/if}
            </div>
        </a>
    {/each}
{/if}

<style>
    .chat-card-layout {
        display: flex;
        flex-direction: column;
    }

    .image-wrapper {
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 0.5rem;
    }

    .text-content {
        margin-left: 0;
    }

    @media (min-width: 256px) {
        .chat-card-layout {
            flex-direction: row;
        }

        .image-wrapper {
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 0;
        }

        .text-content {
            margin-left: 0.5rem;
        }
    }
</style>
