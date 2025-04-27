import { useState, useRef, useEffect } from "react";
import {
  Grid2,
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios"; // Axios for making API requests

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const chatEndRef = useRef(null);

  const prompts = [
    "Summarize this text",
    "Explain like I'm five",
    "Translate to Spanish",
    "Give key takeaways",
    "Write a motivational quote",
  ];

  // Accessing the environment variables
  const apiEndpoint = process.env.REACT_APP_GPT_API_ENDPOINT;
  const apiKey = process.env.REACT_APP_GPT_API_KEY;

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    // Display user message
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setInputValue("");

    try {
      // Call GPT-4 API
      const response = await axios.post(
        apiEndpoint, 
        {
          prompt: inputValue,
          max_tokens: 4096, // Adjust max tokens as per your need
          model: "gpt-4o-mini", // Replace with your model if needed
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`, // Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response has GPT-4 output
      if (response.data && response.data.choices && response.data.choices[0].text) {
        const gptResponse = response.data.choices[0].text.trim();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: gptResponse },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, no response from the model." },
        ]);
      }
    } catch (error) {
      console.error("Error calling GPT-4 API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error communicating with the model." },
      ]);
    }
  };

  const handleSelectPrompt = (event) => {
    const value = event.target.value;
    setSelectedPrompt(value);
    setInputValue(value);
  };

  useEffect(() => {
    // Auto-scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", height: "100vh", py: 2 }}>
      
      {/* Dropdown at Top */}
      <Box sx={{ mb: 2 }}>
        <Select
          fullWidth
          value={selectedPrompt}
          displayEmpty
          onChange={handleSelectPrompt}
        >
          <MenuItem value="">
            <em>Select a prompt...</em>
          </MenuItem>
          {prompts.map((prompt, idx) => (
            <MenuItem key={idx} value={prompt}>
              {prompt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Chat Messages Section */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fafafa",
        }}
      >
        {messages.length === 0 ? (
          <Typography color="text.secondary" align="center" mt={10}>
            No messages yet...
          </Typography>
        ) : (
          <List>
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  bgcolor: msg.role === "user" ? "primary.light" : "grey.300",
                  color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                  borderRadius: 2,
                  mb: 1,
                  maxWidth: "80%",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.content}
              </ListItem>
            ))}
            <div ref={chatEndRef} />
          </List>
        )}
      </Paper>

      {/* Input Section at Bottom */}
      <Grid2 container direction={'row'} alignItems={'center'} flexWrap={'nowrap'} gap={'10px'}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          sx={{ height: "fit-content" }}
        >
          Send
        </Button>
        </Grid2>
    </Container>
  );
}




<Grid2 container direction={'row'} alignItems={'center'} flexWrap={'nowrap'} gap={'10px'}></Grid2>