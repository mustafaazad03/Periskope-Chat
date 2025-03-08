import { supabase, subscribeToChannel } from "@/lib/supabase";
import { ChatData, Message, MessagePopulated, User } from "@/types";
import { Database } from "@/types/database.types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

type ChatWithParticipants = Database["public"]["Tables"]["chats"]["Row"] & {
  participants: Database["public"]["Tables"]["users"]["Row"][];
  tags: Database["public"]["Tables"]["chat_tags"]["Row"][];
};

// Convert Supabase user to our User type
const mapUser = (user: Database["public"]["Tables"]["users"]["Row"]): User => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
  avatar_url: user.avatar_url || undefined,
  phone: user.phone || undefined,
});

// Convert Supabase chat to our ChatData type
const mapChat = (
  chat: ChatWithParticipants,
  lastMessage: string = "No messages yet",
  lastMessageTime: string = new Date().toISOString(),
  unreadCount: number = 0
): ChatData => ({
  id: chat.id,
  name: chat.name,
  avatar_url: chat.avatar_url || undefined,
  lastMessage,
  lastMessageTime: formatTime(new Date(lastMessageTime)),
  lastMessageStatus: "sent",
  lastMessageType: "text",
  unreadCount,
  phone: chat.participants[0]?.phone || undefined,
  participants: chat.participants.map(mapUser),
  tags: chat.tags?.map((tag) => ({
    type: tag.type,
    label: tag.label,
  })),
});

// Convert Supabase message to our Message type
const mapMessage = (message: any, senderName: string): MessagePopulated => {
  const createdAt = new Date(message.created_at);
  
  return {
    ...message,
    user: {
      id: message.user_id,
      full_name: senderName,
      ...(message.user || {})
    },
    // Format time for display in UI
    time: format(createdAt, "h:mm a")
  } as MessagePopulated;
};


// Format time for display
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format date for display
// const formatDate = (date: Date): string => {
//   return date.toLocaleDateString([], {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// Get all chats for the current user
export const getChats = async (): Promise<ChatData[]> => {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    console.log("user", user);
    if (!user) return [];

    // Get chats the user participates in
    const { data: participantData, error: participantError } = await supabase
      .from("chat_participants")
      .select("chat_id")
      .eq("user_id", user.id);

    if (participantError || !participantData || participantData.length === 0) {
      console.error("Error fetching chat participants:", participantError);
      return [];
    }

    const chatIds = participantData.map((p) => p.chat_id);

    // Get chat details with participants and tags
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select(`
        *,
        chat_participants!chat_id(
          id,
          user_id,
          role,
          users:user_id(*)
        ),
        tags:chat_tags(*)
      `)
      .in("id", chatIds);

    if (chatsError || !chats) {
      console.error("Error fetching chats:", chatsError);
      return [];
    }

    // For each chat, get the last message and unread count
    const mappedChats = await Promise.all(
      chats.map(async (chat: any) => {
        // Extract participants from nested structure
        const participants = chat.chat_participants
          .map((p: any) => p.users)
          .filter((u: any) => u);

        // Get last message
        const { data: lastMessageData } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const lastMessage = lastMessageData && lastMessageData[0];
        
        // Get unread count
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: false })
          .eq("chat_id", chat.id)
          .eq("status", "sent")
          .neq("user_id", user.id);

        // Get chat tags
        const { data: tagsData } = await supabase
          .from("chat_tags")
          .select("*")
          .eq("chat_id", chat.id);
        
        // Find sender name for the last message
        let lastMessageText = "No messages yet";
        let lastMessageSender = "";
        
        if (lastMessage) {
          const sender = participants.find((p: any) => p.id === lastMessage.user_id);
          lastMessageSender = sender ? (sender.full_name || "Unknown") : "Unknown";
          lastMessageText = `${lastMessageSender}: ${lastMessage.text}`;
        }

        // Map to ChatData format
        return {
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar_url || undefined,
          lastMessage: lastMessageText,
          lastMessageTime: lastMessage ? lastMessage.created_at : chat.created_at,
          lastMessageStatus: lastMessage ? lastMessage.status : "sent",
          lastMessageType: lastMessage?.attachment_type ? lastMessage.attachment_type : "text",
          unreadCount: unreadCount || 0,
          phone: participants[0]?.phone || "76437364763",
          participants: participants.map((user: any) => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            avatar_url: user.avatar_url || undefined,
            phone: user.phone || "88764868683"
          })),
          tags: tagsData?.map((tag: any) => ({
            id: tag.id,
            type: tag.type,
            label: tag.label,
            created_at: tag.created_at
          })) || [],
        };
      })
    );

    return mappedChats;
  } catch (error) {
    console.error("Error in getChats:", error);
    return [];
  }
};

// Get messages for a specific chat
export const getMessages = async (chatId: string): Promise<MessagePopulated[]> => {
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      user:users(id, full_name, phone, avatar_url)
    `
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error || !messages) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return messages.map((message: any) => 
    mapMessage(message, message.user?.full_name || "Unknown")
  );
};

// Send a message
export const sendMessage = async (
  chatId: string,
  text: string,
  forwardedFrom?: string,
  attachment?: { url: string; type: string }
): Promise<Message | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  // Get sender details first to ensure we have name
  const { data: userData } = await supabase
    .from("users")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const senderName = userData?.full_name || "Unknown";
  const phone = userData?.phone;

  const messageId = uuidv4();
  const newMessage = {
    id: messageId,
    chat_id: chatId,
    user_id: user.id,
    text,
    created_at: new Date().toISOString(),
    status: "sent",
    forwarded_from: forwardedFrom || null,
    attachment_url: attachment?.url || null,
    attachment_type: attachment?.type || null,
  };

  const { error } = await supabase.from("messages").insert([newMessage]);

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }  

  const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select(`
        *,
        chat_participants!chat_id(
          id,
          user_id,
          role,
          users:user_id(*)
        ),
        tags:chat_tags(*)
      `)
      .eq("id", chatId);

  const currentMessage = {
    ...newMessage,
    user,
    chat: chats && chats[0] ? mapChat(chats[0]) : null, 
  } as MessagePopulated;

  return mapMessage(currentMessage as any, senderName);
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  const { error } = await supabase
    .from("messages")
    .update({ status: "read" })
    .eq("chat_id", chatId)
    .neq("user_id", user.id)
    .neq("status", "read");

  if (error) {
    console.error("Error marking messages as read:", error);
  }
};

export const createChat = async (
  name: string,
  isGroup: boolean,
  participantIds: string[],
  tags?: Array<{ type: string; label: string }>
): Promise<ChatData | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return null;

  try {
    // Create the chat
    const chatId = uuidv4();
    const { error: chatError } = await supabase.from("chats").insert([
      {
        id: chatId,
        name,
        is_group: isGroup,
        created_by: user.id,
      },
    ]);

    if (chatError) {
      console.error("Error creating chat:", chatError);
      return null;
    }

    // Add participants (including the creator)
    const allParticipants = [...new Set([...participantIds, user.id])];
    const participantRecords = allParticipants.map((userId) => ({
      chat_id: chatId,
      user_id: userId,
      role: userId === user.id ? "admin" : "member",
    }));

    const { error: participantError } = await supabase
      .from("chat_participants")
      .insert(participantRecords);

    if (participantError) {
      console.error("Error adding participants:", participantError);
      // Clean up the created chat
      await supabase.from("chats").delete().eq("id", chatId);
      return null;
    }

    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagRecords = tags.map(tag => ({
        id: uuidv4(),
        chat_id: chatId,
        type: tag.type,
        label: tag.label,
        created_at: new Date().toISOString()
      }));
      
      const { error: tagError } = await supabase
        .from("chat_tags")
        .insert(tagRecords);
      
      if (tagError) {
        console.error("Error adding tags to chat:", tagError);
        // Continue despite tag errors - the chat and participants were created successfully
      }
    }

    // Get the created chat with participants and tags
    const { data: chatData } = await supabase
      .from("chats")
      .select(
        `
        *,
        participants:chat_participants(
          user:users(*)
        ),
        tags:chat_tags(*)
      `
      )
      .eq("id", chatId)
      .single();

    if (!chatData) {
      return null;
    }

    // Extract participants from nested structure
    const participants = chatData.participants
      .map((p: any) => p.user)
      .filter((u: any) => u);

    // Restructure chat with participants and tags
    const chatWithParticipants: ChatWithParticipants = {
      ...chatData,
      participants,
      tags: chatData.tags || [],
    };

    return mapChat(chatWithParticipants);
  } catch (error) {
    console.error("Exception creating chat:", error);
    return null;
  }
};

// Add tag to a chat
export const addChatTag = async (
  chatId: string,
  type: string,
  label: string
): Promise<boolean> => {
  const { error } = await supabase.from("chat_tags").insert([
    {
      chat_id: chatId,
      type,
      label,
    },
  ]);

  if (error) {
    console.error("Error adding chat tag:", error);
    return false;
  }

  return true;
};

// Subscribe to new messages
export const subscribeToNewMessages = (
  chatId: string,
  callback: (message: Message) => void
) => {
  return subscribeToChannel(`messages:${chatId}`, async (payload) => {
    if (
      payload.eventType === "INSERT" &&
      payload.new &&
      payload.new.chat_id === chatId
    ) {
      // Get sender name
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", payload.new.user_id)
        .single();

      const message = mapMessage(
        payload.new as any,
        userData?.full_name || "Unknown"
      );
      callback(message);
    }
  });
};

// Subscribe to message status updates
export const subscribeToMessageStatus = (
  chatId: string,
  callback: (messageId: string, status: string) => void
) => {
  return subscribeToChannel(`message_status:${chatId}`, (payload) => {
    if (
      payload.eventType === "UPDATE" &&
      payload.new &&
      payload.new.chat_id === chatId &&
      payload.old.status !== payload.new.status
    ) {
      callback(payload.new.id, payload.new.status);
    }
  });
};

// Subscribe to chat updates (new chats, participants, etc.)
export const subscribeToChats = (callback: () => void) => {
  const unsubChats = subscribeToChannel("chats", callback);
  const unsubParticipants = subscribeToChannel("chat_participants", callback);
  const unsubTags = subscribeToChannel("chat_tags", callback);

  return () => {
    unsubChats();
    unsubParticipants();
    unsubTags();
  }
}