const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY ="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";

const createChatli = (message, className) =>{
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className == "outgoing" ? `<p>${message}</p>` : `  <span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`
  chatLi.innerHTML = chatContent;
  return chatLi;
}
const generateResponse = (incomingChat) =>{
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChat.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers:{
      "Content-type":"application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body:JSON.stringify({
      "model": "gpt-3.5-turbo",
    "messages": [{role: "user", content:userMessage }]
    })
  }
  fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
    messageElement.textContent = data.choices[0].message.content;
  }).catch((error) => {
    messageElement.textContent = "Oops! Something went wrong. Please try again";
  }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat =()=>{
  userMessage = chatInput.value.trim();
  if(!userMessage) return; 
  chatInput.value ="";

  chatbox.appendChild(createChatli(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(()=>{
    const incomingChat = createChatli("Thinking...", "incoming")
    chatbox.appendChild(incomingChat);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChat);
  },600);
}

sendChatBtn.addEventListener("click", handleChat);

const logout = document.getElementById('logout');

logout.addEventListener('click', ()=>{
  window.location.href = 'register.html';

});

const logout2 = document.getElementById('logout2');

logout2.addEventListener('click', ()=>{
  window.location.href = 'register.html';

});