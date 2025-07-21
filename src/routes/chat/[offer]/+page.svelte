<script>
// @ts-nocheck

    import { ChevronLeft, Ellipsis, Camera, SendHorizontal, Trash2 } from "@lucide/svelte";
    import InvalidImageModal from "../../../lib/components/ui/InvalidImageModal.svelte";
    import { onMount, onDestroy } from 'svelte';
    import { swapBoxService } from "../../../lib/api/swapbox.service";
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    // Get chat ID from URL params
    const chatId = page.params.offer;
    
    let  { data } = $props();
    let user = data.user;
    const currentUserId = user.id; 

    let currentChatAttachment = $state([]);
    let chat = $state(null);
    let messages = $state([]);
    let loading = $state(true);
    let error = $state(null);
    let subscription = $state(null);

    let senderAName = $state("User A");
    let senderBName = $state("User B");
    let senderAProfile = $state(null);
    let senderBProfile = $state(null);

    let inReview = $state(false);
    let canReview = $state(true);
    let title = $state("Chat");
    

onMount(async () => {
    try {
        loading = true;
        error = null;
        
        // Load chat data
        chat = await swapBoxService.getChatById(chatId);
        
        // Set up chat info
        title = chat.offers?.title || "Chat";
        
        // Determine other user
        const otherUser = chat.user1_id === currentUserId ? chat.user2 : chat.user1;
        const currentUser = chat.user1_id === currentUserId ? chat.user1 : chat.user2;
        
        senderAName = otherUser?.name || "Other User";
        senderBName = currentUser?.name || "You";
        
        // Load messages
        messages = await swapBoxService.getMessages(chatId);
        
        // Mark messages as read
        await swapBoxService.markChatMessagesAsRead(chatId, currentUserId);
        
        // Subscribe to real-time messages
        console.log('Setting up subscription for chat:', chatId);
        subscription = swapBoxService.subscribeToMessages(chatId, (newMessage) => {
            console.log('Message received in component:', newMessage);
            
            // Check if this message already exists (avoid duplicates)
            const existingMessage = messages.find(msg => msg.id === newMessage.id);
            if (!existingMessage) {
                // Remove any temporary message if this is from current user
                if (newMessage.sender_id === currentUserId) {
                    messages = messages.filter(msg => !msg.id.toString().startsWith('temp-'));
                }
                
                messages = [...messages, newMessage];
                
                // Mark as read if it's not from current user
                if (newMessage.sender_id !== currentUserId) {
                    swapBoxService.markMessageAsRead(newMessage.id);
                }
            }
        });
        
    } catch (err) {
        error = err.message || 'Failed to load chat';
        console.error('Error loading chat:', err);
    } finally {
        loading = false;
    }
});
            // Make sure to properly cleanup
            onDestroy(() => {
                console.log('Cleaning up subscription');
                if (subscription) {
                    swapBoxService.unsubscribe(subscription);
                }
            });

    const openReview = () => {
        if(!canReview) return;
        inReview = true;
    }

    const getNewProfilePicture = async () => {
        const element = document.getElementById("fileInput");
        const files = element.files;

        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                // Upload image to get URL
                const imageUpload = await swapBoxService.uploadMessageImage(file, currentUserId, chatId);
                currentChatAttachment.push(imageUpload.public_url);
            } catch (err) {
                console.error('Error uploading image:', err);
                document.getElementById("modal_invalid_datatype").showModal();
                currentChatAttachment = [];
            }
        }
    }

  const sendMessage = async () => {
    const text = document.getElementById("chatInput").value;
    if((!text || text.length === 0) && currentChatAttachment.length <= 0) return;

    try {
        const messageData = {
            chat_id: chatId,
            sender_id: currentUserId,
            content: text || ''
        };

        // Create optimistic message for immediate UI update
        const optimisticMessage = {
            id: `temp-${Date.now()}`, // Temporary ID
            chat_id: chatId,
            sender_id: currentUserId,
            content: text || '',
            sent_at: new Date().toISOString(),
            read: false,
            image_url: currentChatAttachment.length > 0 ? currentChatAttachment[0] : null,
            image_public_url: currentChatAttachment.length > 0 ? currentChatAttachment[0] : null,
            sending: true // Flag to indicate this is being sent
        };

        // Add message to UI immediately for current user
        messages = [...messages, optimisticMessage];

        // Clear input and attachments immediately
        const attachments = [...currentChatAttachment];
        currentChatAttachment = [];
        document.getElementById("chatInput").value = "";

        let newMessage;
        
        if (attachments.length > 0) {
            // Send message with image
            newMessage = await swapBoxService.sendMessage({
                ...messageData,
                image_url: attachments[0] // For now, just use first attachment
            });
        } else {
            // Send text message
            newMessage = await swapBoxService.sendMessage(messageData);
        }

        console.log('Message sent successfully:', newMessage);

        // The real-time subscription should handle adding the real message
        // and removing the temporary one
        
    } catch (err) {
        console.error('Error sending message:', err);
        error = 'Failed to send message';
        
        // Remove the optimistic message on error
        messages = messages.filter(msg => !msg.id.toString().startsWith('temp-'));
        
        // Restore input values
        document.getElementById("chatInput").value = text;
        if (currentChatAttachment.length === 0 && attachments.length > 0) {
            currentChatAttachment = attachments;
        }
    }
}

    const finishReview = async () => {
        if(!canReview) {
            inReview = false;
            return;
        }

        try {
            const ratingInput = document.querySelector('input[name="rating-11"]:checked');
            if (!ratingInput) {
                alert('Please select a rating');
                return;
            }
            
            const rating = parseFloat(ratingInput.value);
            
            const otherUserId = chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;
            
            await swapBoxService.createRating({
                offer_id: chat.offer_id,
                from_user_id: currentUserId,
                to_user_id: otherUserId,
                rating_value: rating,
            });
            
            inReview = false;
            canReview = false; // Disable further reviews
            
        } catch (err) {
            console.error('Error submitting rating:', err);
            alert('Failed to submit rating');
        }
    }

    const goBack = () => {
        goto('/chat');
    }

    // Helper functions for message display
    const isCurrentUser = (senderId) => senderId === currentUserId;
    const getSenderName = (senderId) => isCurrentUser(senderId) ? senderBName : senderAName;
    const getSenderProfile = (senderId) => isCurrentUser(senderId) ? senderBProfile : senderAProfile;
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('de-DE');
    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <div class="loading loading-spinner loading-lg"></div>
    </div>
{:else if error}
    <div class="flex flex-col justify-center items-center h-screen px-4">
        <div class="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error: {error}</span>
        </div>
        <button class="btn btn-primary mt-4" onclick={goBack}>Zurück zu Chats</button>
    </div>
{:else}
    <div class="flex-container {inReview ? 'blur-xs' : ''}">
        <div class="sticky-header flex w-full mt-2 border-b border-base-400 pb-2">
            <div class="flex ml-2" style="width: 33% !important;">
                <button onclick={goBack}>
                    <ChevronLeft size={24} class="my-auto"/>
                </button>
            </div>
            <p class="text-lg my-auto font-bold"><nobr>{title}</nobr></p>
            <div class="flex justify-end mr-2" style="width: 33% !important;">
                {#if canReview}
                    <button onclick={() => openReview()}>
                        <Ellipsis size={24} class="my-auto" />
                    </button>
                {/if}
            </div>
        </div>

        <div class="content mx-2 mt-2">
            {#each messages as message, i}
                {#if i === 0 || formatDate(messages[i].sent_at) !== formatDate(messages[i - 1].sent_at)}
                    <div class="divider">
                        {formatDate(messages[i].sent_at)}
                    </div>
                {/if}

                {#if !isCurrentUser(message.sender_id)}
                    <div class="chat chat-start">
                        <div class="chat-image">
                            <div class="chat-image">
                                {#if getSenderProfile(message.sender_id) === null}
                                    <div class="avatar avatar-placeholder">
                                        <div class="bg-neutral text-neutral-content w-10 rounded-full">
                                            <span class="text-2xl">{getSenderName(message.sender_id)[0]}</span>
                                        </div>
                                    </div>
                                {:else}
                                    <div class="avatar">
                                        <div class="w-10 rounded-full ring-2">
                                            <img src={getSenderProfile(message.sender_id)} />
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        <div class="chat-header">
                            {getSenderName(message.sender_id)}
                            <time class="text-xs opacity-50">{formatTime(message.sent_at)}</time>
                        </div>
                        <div class="chat-bubble">
                            {message.content}
                            {#if message.image_public_url}
                                <div class="mt-2">
                                    <img
                                        src={message.image_public_url}
                                        class="w-full rounded-lg max-w-xs"
                                        alt="Message attachment"
                                    />
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="chat chat-end">
                        <div class="chat-image">
                            {#if getSenderProfile(message.sender_id) === null}
                                <div class="avatar avatar-placeholder">
                                    <div class="bg-neutral text-neutral-content w-10 rounded-full">
                                        <span class="text-2xl">{getSenderName(message.sender_id)[0]}</span>
                                    </div>
                                </div>
                            {:else}
                                <div class="avatar">
                                    <div class="w-10 rounded-full ring-2">
                                        <img src={getSenderProfile(message.sender_id)} />
                                    </div>
                                </div>
                            {/if}
                        </div>
                        <div class="chat-header">
                            {getSenderName(message.sender_id)}
                            <time class="text-xs opacity-50">{formatTime(message.sent_at)}</time>
                        </div>
                        <div class="chat-bubble">
                            {message.content}
                            {#if message.image_public_url}
                                <div class="mt-2">
                                    <img
                                        src={message.image_public_url}
                                        class="w-full rounded-lg max-w-xs"
                                        alt="Message attachment"
                                    />
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>

        <div class="sticky-footer w-full border-t border-base-400 mb-13">
            <div class="flex mt-2">
                {#if currentChatAttachment.length > 0}
                    <div class="indicator" onclick={() => currentChatAttachment = []}>
                        <span class="indicator-item bg-transparent border-transparent text-xs">
                            {currentChatAttachment.length}
                        </span>
                        <Trash2 class="my-auto ml-2" />
                    </div>
                {:else}
                    <div class="my-auto" onclick={() => document.getElementById("fileInput").click()}>
                        <Camera class="ml-2" />
                    </div>
                {/if}

                <div class="m-auto input w-3/4">
                    <input type="text" id="chatInput" placeholder="Nachricht schreiben..." />
                </div>

                <div class="flex my-auto" onclick={() => sendMessage()}>
                    <SendHorizontal class="mr-2"  />
                </div>

                <input id="fileInput" type="file" style="display:none;" accept="image/png, image/jpeg, image/webp, image/heic" oninput={() => getNewProfilePicture()} />
            </div>

            {#if canReview}
                <div class="flex mx-2">
                    <button class="btn btn-accent mt-4 w-full" onclick={() => openReview()}>Nutzer bewerten</button>
                </div>
            {:else}
                <div class="flex mx-2">
                    <button class="btn btn-accent mt-4 w-full" onclick={goBack}>Zurück zu meinen Chats</button>
                </div>
            {/if}
        </div>
    </div>

    {#if inReview}
        <div class="toast toast-center mb-15 bg-base-100 min-w-full min-h-1/3 rounded-box" style="margin-bottom: -15px !important;">
            <p class="text-xl text-center mt-2">Wie war deine Erfahrung mit {senderAName}?</p>
            <div class="flex justify-center mt-2">
                <div class="rating rating-lg rating-half">
                    <input type="radio" name="rating-11" class="rating-hidden" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="0.5 star" value="0.5" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="1 star" value="1.0" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="1.5 star" value="1.5" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="2 star" value="2.0" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="2.5 star" value="2.5" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="3 star" value="3.0" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="3.5 star" value="3.5" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="4 star" value="4.0" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="4.5 star" value="4.5" />
                    <input type="radio" name="rating-11" class="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="5 star" value="5.0" />
                </div>
            </div>
            <button class="btn btn-accent w-1/2 mx-auto mt-8" onclick={() => finishReview()}>Bewertung senden</button>
            <button class="btn w-1/2 mx-auto mt-2" onclick={() => inReview = false}>Später</button>
        </div>
    {/if}
{/if}

<InvalidImageModal/>

<style>
    .flex-container {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
        max-height: 100vh;
    }

    .sticky-header {
        height: 4rem;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }

    .sticky-footer {
        height: 4rem;
    }

    body {
        height: 100%;
        overflow-y: hidden;
    }
</style>