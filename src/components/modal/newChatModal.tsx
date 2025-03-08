'use client';
import React, { useState, useEffect } from 'react'
import { User } from '@/types'
import { getUser, supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Search, X, Plus, Tag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { createChat, addChatTag } from '../../service/chatService';

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onChatCreated: (chatId: string) => void
}

// Define a Tag type that matches the supabase chat_tags table structure
interface Tag {
  type: string
  label: string
}

// Predefined tag types with visual styling
const PREDEFINED_TAGS = [
  { type: 'demo', label: 'Demo', bgClass: 'bg-orange-50', textClass: 'text-orange-600' },
  { type: 'internal', label: 'Internal', bgClass: 'bg-green-50', textClass: 'text-green-600' },
  { type: 'signup', label: 'Signup', bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
  { type: 'content', label: 'Content', bgClass: 'bg-purple-50', textClass: 'text-purple-600' },
];

export default function NewChatModal({ isOpen, onClose, onChatCreated }: NewChatModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [chatName, setChatName] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  // Tag state
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showAddTagForm, setShowAddTagForm] = useState(false)
  const [newTagType, setNewTagType] = useState<string>('demo')
  const [customTagLabel, setCustomTagLabel] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
      
      if (!error && data) {
        // Filter out current user
        const currentUser = await getUser()
        const otherUsers = data.filter(user => user.id !== currentUser?.id)
        setUsers(otherUsers)
        setFilteredUsers(otherUsers)
      }
    }
    
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery) {
      const filtered = users.filter(user => 
        (user.full_name as string).toLowerCase().includes(searchQuery.toLowerCase()) || 
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
      
      // If it's not marked as a group and we're selecting a second user, auto-generate group name
      if (!isGroup && selectedUsers.length === 1) {
        setIsGroup(true)
        setChatName(`${selectedUsers[0].full_name}, ${user.full_name}`)
      }
    }
  }
  
  // Add a new tag to the selected tags
  const addTag = () => {
    // Find the predefined tag to use its label if available
    const predefinedTag = PREDEFINED_TAGS.find(tag => tag.type === newTagType);
    const tagLabel = customTagLabel || predefinedTag?.label || newTagType;
    
    // Check for duplicates
    if (!selectedTags.some(tag => tag.type === newTagType && tag.label === tagLabel)) {
      setSelectedTags([...selectedTags, { type: newTagType, label: tagLabel }]);
    }
    
    // Reset form
    setShowAddTagForm(false);
    setNewTagType('demo');
    setCustomTagLabel('');
  }
  
  // Remove a tag from selection
  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter(tag => 
      !(tag.type === tagToRemove.type && tag.label === tagToRemove.label)
    ));
  }

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return
    
    setIsCreating(true)
    
    let name;
    
    if (selectedUsers.length === 1) {
      // For single user chat, use the user's name
      name = selectedUsers[0].full_name as string;
    } else if (isGroup) {
      // For group chat, use the provided chat name
      name = chatName;
    } else {
      // Default to a comma-separated list of names
      name = selectedUsers.map(user => user.full_name).join(', ');
    }
    
    const participantIds = selectedUsers.map(user => user.id)
    
    try {
      // Pass tags directly to createChat for efficient batch creation
      const newChat = await createChat(
        name, 
        isGroup, 
        participantIds,
        selectedTags // Pass the tags array directly
      );
      
      if (newChat) {
        onChatCreated(newChat.id)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setIsCreating(false)
      onClose()
    }
  }

  const resetForm = () => {
    setSelectedUsers([])
    setSearchQuery('')
    setChatName('')
    setIsGroup(false)
    setSelectedTags([]) // Reset tags
    setShowAddTagForm(false)
    setNewTagType('demo')
    setCustomTagLabel('')
  }

  // Get CSS classes for a tag type
  const getTagClasses = (type: string) => {
    const tag = PREDEFINED_TAGS.find(t => t.type === type);
    return {
      bg: tag?.bgClass || 'bg-gray-50',
      text: tag?.textClass || 'text-gray-600'
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen: boolean) => {
      if (!isOpen) {
        onClose()
        resetForm()
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Select Users</TabsTrigger>
            <TabsTrigger value="details" disabled={selectedUsers.length === 0}>Chat Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-72 overflow-y-auto space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUsers.some(u => u.id === user.id) ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg text-gray-600">{(user.full_name as string).charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{user.full_name}</h3>
                      {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                    </div>
                    
                    {selectedUsers.some(u => u.id === user.id) && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {selectedUsers.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Chat Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isGroup}
                      onChange={() => setIsGroup(false)}
                      className="rounded text-green-500"
                    />
                    <span>Direct Message</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isGroup}
                      onChange={() => setIsGroup(true)}
                      className="rounded text-green-500"
                    />
                    <span>Group Chat</span>
                  </label>
                </div>
              </div>
            )}
            
            {isGroup && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <Input 
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Users ({selectedUsers.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm">{user.full_name}</span>
                    <button onClick={() => toggleUserSelection(user)}>
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tag selection section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Tags</label>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 px-2 py-1 flex items-center gap-1"
                  onClick={() => setShowAddTagForm(!showAddTagForm)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">Add Tag</span>
                </Button>
              </div>
              
              {/* Tag creation form */}
              {showAddTagForm && (
                <div className="p-3 bg-gray-50 rounded-md space-y-3">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs text-gray-500">Tag Type</label>
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_TAGS.map(tag => {
                        const isActive = newTagType === tag.type;
                        return (
                          <button
                            key={tag.type}
                            type="button"
                            className={`text-xs px-2 py-1 rounded-sm ${
                              isActive 
                                ? `${tag.bgClass} ${tag.textClass}` 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => setNewTagType(tag.type)}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs text-gray-500">Custom Label (Optional)</label>
                    <Input
                      placeholder="Leave blank for default label"
                      value={customTagLabel}
                      onChange={(e) => setCustomTagLabel(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <p className="text-xs text-gray-400 italic">
                      Custom label will override the default tag name
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={() => setShowAddTagForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      className="h-8 bg-green-500 hover:bg-green-600 text-white"
                      onClick={addTag}
                    >
                      Add Tag
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Selected tags */}
              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tag, index) => {
                    const classes = getTagClasses(tag.type);
                    return (
                      <div
                        key={`${tag.type}-${index}`}
                        className={`flex items-center gap-1 ${classes.bg} ${classes.text} px-2 py-1 rounded-sm text-xs`}
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag.label}</span>
                        <button 
                          className="ml-1 hover:text-gray-700"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags added yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCreateChat} 
            disabled={selectedUsers.length === 0 || isCreating || (isGroup && !chatName)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isCreating ? 'Creating...' : 'Create Chat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}