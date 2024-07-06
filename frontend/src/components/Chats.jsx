import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import endpoint from "../contants/api-url";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography, Paper, List, ListItem, Box, Popover } from "@mui/material";
import { styled } from "@mui/system";
import Picker from 'emoji-picker-react';

// Custom styles
const ChatContainer = styled(Paper)({
  height: '70vh',
  overflowY: 'scroll',
  padding: '16px',
  marginBottom: '16px',
});

const MessageItem = styled(ListItem)({
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginBottom: '8px',
  position: 'relative',
});

const ReceivedMessageItem = styled(ListItem)({
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: '8px',
  position: 'relative',
});

const MessagePaper = styled(Box)({
  padding: '8px',
  maxWidth: '60%',
  backgroundColor: '#fff',
  position: 'relative',
  borderRadius: '8px',
});

const ReceivedMessagePaper = styled(Box)({
  padding: '8px',
  maxWidth: '60%',
  backgroundColor: '#e0e0e0',
  position: 'relative',
  borderRadius: '8px',
});

const ReactionContainer = styled(Box)({
  position: 'absolute',
  bottom: '-12px',
  right: '-12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
});

const InputContainer = styled('form')({
  display: 'flex',
  justifyContent: 'space-between',
});

const InputField = styled(TextField)({
  flexGrow: 1,
  marginRight: '8px',
});

function Chats() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const socket = useMemo(() => io(endpoint.CHAT_API), []);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      const newMessage = { text: message, type: "sent", username: localStorage.getItem("username"), reactions: [] };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      socket.emit("send-message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected: ", socket.id);
    });

    socket.on("receive-message", (serverMsg) => {
      console.log("Message received from server: ", serverMsg);
      const newMessage = { text: serverMsg.message, type: "received", label: "Bot Respond", reactions: [] };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("chatMessages");
    navigate("/login"); // Redirect to login page
  };

  const handleEmojiClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageIndex(index);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
    setSelectedMessageIndex(null);
  };

  const handleEmojiSelect = (emojiObject, event) => {
    console.log(event)
    const updatedMessages = messages.map((msg, index) => {
      if (index === selectedMessageIndex) {
        const newReactions = msg.reactions ? [...msg.reactions, event.emoji] : [event.emoji];
        return { ...msg, reactions: newReactions };
      }
      return msg;
    });
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    handleEmojiClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to QChat
      </Typography>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
      <ChatContainer>
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              component="div"
              onClick={(e) => handleEmojiClick(e, index)}
              style={{
                display: 'flex',
                justifyContent: msg.type === "sent" ? 'flex-end' : 'flex-start',
                flexDirection: 'column',
                alignItems: msg.type === "sent" ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
                position: 'relative'
              }}
            >
              <Box
                component="div"
                style={{
                  padding: '8px',
                  maxWidth: '60%',
                  backgroundColor: msg.type === "sent" ? '#fff' : '#e0e0e0',
                  position: 'relative',
                  borderRadius: '8px'
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {msg.type === "sent" ? msg.username : msg.label}
                </Typography>
                <Typography variant="body1">{msg.text}</Typography>
                {msg.reactions && msg.reactions.length > 0 && (
                  <ReactionContainer>
                    {msg.reactions.map((reaction, reactionIndex) => (
                      <span key={reactionIndex} style={{ fontSize: '16px' }}>
                        {reaction}
                      </span>
                    ))}
                  </ReactionContainer>
                )}
              </Box>
            </ListItem>
          ))}
          <div ref={chatEndRef} />
        </List>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleEmojiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Picker onEmojiClick={(event, emojiObject) => handleEmojiSelect(emojiObject, event)} />
        </Popover>
      </ChatContainer>
      <InputContainer onSubmit={handleSubmit}>
        <InputField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Type a message"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </InputContainer>
    </Container>
  );
}

export default Chats;
