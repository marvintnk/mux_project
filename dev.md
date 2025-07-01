# SwapBoxService API Reference

Welcome to the developer documentation for the `SwapBoxService` class!  
This guide explains how to call each method, what parameters to pass, and what you can expect in return.  
All methods are asynchronous and return Promises.  
**Handle errors using `try/catch`.**

---

## Table of Contents

- [Users](#users)
- [Offers](#offers)
- [Offer Images](#offer-images)
- [Favorites](#favorites)
- [Events](#events)
- [Chats](#chats)
- [Messages](#messages)

---

## Users

### `getUsers()`
- **Parameters:** _none_
- **Returns:** Array of all users, ordered by creation date.

---

### `getUserById(id)`
- **Parameters:**  
  - `id` (`string | number`): User's unique identifier.
- **Returns:** User object.

---

### `getUserByEmail(email)`
- **Parameters:**  
  - `email` (`string`): User's email address.
- **Returns:** User object.

---

### `createUser(userData)`
- **Parameters:**  
  - `userData` (`object`):  
    - `name` (`string`, required)  
    - `email` (`string`, required)  
    - `password_hash` (`string`, required)  
    - `verified` (`boolean`, optional, default: `false`)  
    - `profile_picture` (`string`, optional)  
    - `location` (`string`, optional)  
    - `rating` (`number`, optional, default: `0`)  
    - `role` (`string`, optional, default: `'student'`)
- **Returns:** Newly created user object.

---

### `updateUser(id, userData)`
- **Parameters:**  
  - `id` (`string | number`): User's unique identifier.  
  - `userData` (`object`): Fields to update.
- **Returns:** Updated user object.

---

### `deleteUser(id)`
- **Parameters:**  
  - `id` (`string | number`): User's unique identifier.
- **Returns:** `true` if deleted successfully.

---

## Offers

### `getOffers(filters = {})`
- **Parameters:**  
  - `filters` (`object`, optional):  
    - `category` (`string`)  
    - `type` (`string`)  
    - `status` (`string`)  
    - `location` (`string`)  
    - `user_id` (`string | number`)
- **Returns:** Array of offers matching filters.

---

### `getOfferById(id)`
- **Parameters:**  
  - `id` (`string | number`): Offer's unique identifier.
- **Returns:** Offer object with user, images, and events.

---

### `createOffer(offerData)`
- **Parameters:**  
  - `offerData` (`object`):  
    - `user_id` (`string | number`, required)  
    - `title` (`string`, required)  
    - `description` (`string`, required)  
    - `category` (`string`, required)  
    - `status` (`string`, optional, default: `'verfügbar'`)  
    - `type` (`string`, required)  
    - `location` (`string`, required)
- **Returns:** Newly created offer object.

---

### `updateOffer(id, offerData)`
- **Parameters:**  
  - `id` (`string | number`): Offer's unique identifier.  
  - `offerData` (`object`): Fields to update.
- **Returns:** Updated offer object.

---

### `deleteOffer(id)`
- **Parameters:**  
  - `id` (`string | number`): Offer's unique identifier.
- **Returns:** `true` if deleted successfully.

---

## Offer Images

### `getOfferImages(offerId)`
- **Parameters:**  
  - `offerId` (`string | number`): Offer's unique identifier.
- **Returns:** Array of images with public URLs.

---

### `uploadOfferImage(offerId, file, userId)`
- **Parameters:**  
  - `offerId` (`string | number`): Offer's unique identifier.  
  - `file` (`File`): Image file (max 5MB, JPEG/PNG/WebP).  
  - `userId` (`string | number`): User's unique identifier.
- **Returns:** Image object with public URL.

---

### `addOfferImage(imageData)`
- **Parameters:**  
  - `imageData` (`object`):  
    - `offer_id` (`string | number`, required)  
    - `image_url` (`string`, required)
- **Returns:** Image object.

---

### `deleteOfferImage(id)`
- **Parameters:**  
  - `id` (`string | number`): Image's unique identifier.
- **Returns:** `true` if deleted successfully.

---

### `uploadMultipleOfferImages(offerId, files, userId)`
- **Parameters:**  
  - `offerId` (`string | number`): Offer's unique identifier.  
  - `files` (`Array<File>`): Image files.  
  - `userId` (`string | number`): User's unique identifier.
- **Returns:** Object with arrays of successful and failed uploads.

---

## Favorites

### `getFavorites(userId)`
- **Parameters:**  
  - `userId` (`string | number`): User's unique identifier.
- **Returns:** Array of favorite offers for the user.

---

### `addToFavorites(userId, offerId)`
- **Parameters:**  
  - `userId` (`string | number`): User's unique identifier.  
  - `offerId` (`string | number`): Offer's unique identifier.
- **Returns:** Favorite object.

---

### `removeFromFavorites(userId, offerId)`
- **Parameters:**  
  - `userId` (`string | number`): User's unique identifier.  
  - `offerId` (`string | number`): Offer's unique identifier.
- **Returns:** `true` if removed successfully.

---

### `isFavorite(userId, offerId)`
- **Parameters:**  
  - `userId` (`string | number`): User's unique identifier.  
  - `offerId` (`string | number`): Offer's unique identifier.
- **Returns:** `true` if the offer is a favorite.

---

## Events

### `getEvents(filters = {})`
- **Parameters:**  
  - `filters` (`object`, optional):  
    - `upcoming` (`boolean`): If true, only future events.
- **Returns:** Array of events.

---

### `getEventById(id)`
- **Parameters:**  
  - `id` (`string | number`): Event's unique identifier.
- **Returns:** Event object.

---

### `createEvent(eventData)`
- **Parameters:**  
  - `eventData` (`object`):  
    - `offer_id` (`string | number`, required)  
    - `event_date` (`string`, required, ISO format)  
    - `event_location` (`string`, required)  
    - `description` (`string`, required)
- **Returns:** Newly created event object.

---

### `updateEvent(id, eventData)`
- **Parameters:**  
  - `id` (`string | number`): Event's unique identifier.  
  - `eventData` (`object`): Fields to update.
- **Returns:** Updated event object.

---

### `deleteEvent(id)`
- **Parameters:**  
  - `id` (`string | number`): Event's unique identifier.
- **Returns:** `true` if deleted successfully.

---

## Chats

### `getChats(userId)`
- **Parameters:**  
  - `userId` (`string | number`): User's unique identifier.
- **Returns:** Array of chats for the user.

---

### `getChatById(id)`
- **Parameters:**  
  - `id` (`string | number`): Chat's unique identifier.
- **Returns:** Chat object.

---

### `createChat(chatData)`
- **Parameters:**  
  - `chatData` (`object`):  
    - `offer_id` (`string | number`, required)  
    - `user1_id` (`string | number`, required)  
    - `user2_id` (`string | number`, required)
- **Returns:** Newly created or existing chat object.

---

## Messages

### `getMessages(chatId)`
- **Parameters:**  
  - `chatId` (`string | number`): Chat's unique identifier.
- **Returns:** Array of messages in the chat.

---

### `sendMessage(messageData)`
- **Parameters:**  
  - `messageData` (`object`):  
    - `chat_id` (`string | number`, required)  
    - `sender_id` (`string | number`, required)  
    - `content` (`string`, required)  
    - `image_url` (`string`, optional)
- **Returns:** Sent message object.

---

### `uploadMessageImage(file, userId, chatId)`
- **Parameters:**  
  - `file` (`File`): Image file (max 10MB, JPEG/PNG/WebP).  
  - `userId` (`string | number`): User's unique identifier.  
  - `chatId` (`string | number`): Chat's unique identifier.
- **Returns:** Object with `path` and `public_url` of the uploaded image.

---

## Error Handling

All methods throw errors on failure.  
**Always use `try/catch` when calling these methods.**

---

Happy coding! 🚀
