"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { useSocketContext } from "@/components/providers/SocketProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    sender: {
        id: string;
        name: string;
        photoUrl: string | null;
    };
}

export function CircleChat({ circleId }: { circleId: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const socketData = useSocketContext();
    const socket = (socketData as any)?.socket || socketData;

    useEffect(() => {
        fetchMessages();

        if (socket) {
            // Join room occurs implicitly or we might need to emit 'join-room'
            socket.emit('join-room', circleId);

            const handleNewMessage = (newMessage: Message) => {
                setMessages(prev => {
                    // Prevent duplicates if we already added it optimistically
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
                scrollToBottom();
            };

            socket.on('message:new', handleNewMessage);

            return () => {
                socket.off('message:new', handleNewMessage);
            };
        }
    }, [circleId, socket]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/circles/${circleId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                scrollToBottom();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const content = input;
        setInput("");
        setSending(true);

        // Optimistic UI could go here, but since network is fast, we'll wait or just disable input.
        try {
            const res = await fetch(`/api/circles/${circleId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const sentMsg = await res.json();
            setMessages(prev => [...prev, sentMsg]);
            scrollToBottom();
        } catch (error) {
            toast.error("Could not send message");
            setInput(content); // restore input
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-[500px]">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Circle Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            No messages yet. Say hello!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Avatar className="w-8 h-8 shrink-0">
                                        <AvatarImage src={msg.sender.photoUrl || undefined} />
                                        <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xs font-semibold">{isMe ? 'You' : msg.sender.name}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className={`px-3 py-2 rounded-2xl text-sm ${isMe
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-muted text-foreground rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="p-3 border-t bg-card">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1"
                            disabled={sending}
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || sending}>
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
