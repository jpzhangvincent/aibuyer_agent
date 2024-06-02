import React, { useState } from 'react';
import { Drawer, Button, Fab, TextField, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import axios from 'axios'

const ChatUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello, how can I help you?", sender: "responder" }
    ]);
    const [inputText, setInputText] = useState("");

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSend = async () => {
        setLoading(true)
        console.log(true)
        if (inputText.trim()) {
            const newMessage = { id: messages.length + 1, text: inputText, sender: "user" };

            // const responseText = "Based on your query, I understand you're looking for a 3-bedroom single-family house with a good school district. None of the provided listings match your exact criteria, as they are either condos or have a different number of bedrooms.\n\nHowever, I can suggest exploring other options in Cupertino, CA, which is known for its excellent school district. You can try searching on websites like Zillow, Redfin, or Realtor.com using filters like \"3 bedrooms,\" \"single-family home,\" and \"Cupertino, CA\" to find suitable properties.\n\nAdditionally, you can research the Cupertino School District and its ratings to ensure it meets your requirements. Here's a link to get you started: [Cupertino Union School District](https://www.cusdk8.org/).\n\nIf you need more assistance or have further questions, feel free to ask!"

            // const responseMessage = { id: messages.length + 1, text: responseText, sender: "responder" };
            setMessages([...messages, newMessage]);
            setInputText("");
            try {
                const response = await axios.post('http://localhost:9100/askagent', {
                    question: inputText
                })
                setLoading(false)
                const responseText = response.data;
                const responseMessage = { id: messages.length + 1, text: responseText, sender: "responder" };
                setMessages([...messages, newMessage, responseMessage]);
                console.log('false')
                console.log(response)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <Fab color="primary" aria-label="chat" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={toggleDrawer}>
                <ChatIcon />
            </Fab>
            <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
                <div role="presentation" style={{ height: '100%', width: "40vw" }}>
                    <div style={{ height: '100%' }}>
                        <div style={{ height: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Chat with your personal realtor
                        </div>
                        <Divider />
                        <div style={{ height: '80%', overflow: 'auto' }}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{ margin: '5px', padding: '5px', borderRadius: '10px', backgroundColor: `${msg.sender === 'user' ? '#bdbdbd' : '#8eaefb'}` }}>
                                        <div style={{ padding: '5px' }}>{msg.text} </div>
                                        <div> </div>
                                    </div>
                                </div>
                            ))}
                            {loading && <div>Loading...</div>}
                        </div>
                        <Divider />
                        <div style={{ height: '15%', padding: '0 10px' }}>
                            <Grid container spacing={0} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
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
