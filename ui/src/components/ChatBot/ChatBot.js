import React, { useState } from 'react';
import { Drawer, Button, Fab, TextField, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid';

const ChatUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello, how can I help you?", sender: "responder" },
        { id: 2, text: "I have a question about your product.", sender: "user" }
    ]);
    const [inputText, setInputText] = useState("");

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = { id: messages.length + 1, text: inputText, sender: "user" };
            setMessages([...messages, newMessage]);
            setInputText("");
        }
    };

    return (
        <div>
            <Fab color="primary" aria-label="chat" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={toggleDrawer}>
                <ChatIcon />
            </Fab>
            <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
                <div  role="presentation" style={{height: '100%', width:"40vw"}}>
                    <div style={{height: '100%'}}>
                        <div style={{ height: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            Chat with your personal realtor
                        </div>
                        <Divider />
                        <div style={{ height: '80%', overflow: 'auto' }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{margin: '5px', padding:'5px', borderRadius: '10px', backgroundColor: `${msg.sender === 'user' ? '#bdbdbd' : '#8eaefb'}`}}>
                                        <div style={{padding:'5px'}}>{msg.text} </div>
                                        <div> </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Divider />
                        <div style={{ height: '15%', padding: '0 10px'}}>
                            <Grid container spacing={0} style={{height:'100%', display:'flex', alignItems: 'center'}}>
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        value={inputText}
                                        onChange={handleInputChange}
                                        placeholder="Type your message here"
                                        variant="outlined"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                <Button onClick={handleSend} color="primary"> <SendIcon /></Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default ChatUI;
