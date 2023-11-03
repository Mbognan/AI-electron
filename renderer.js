const { ipcRenderer } = require('electron');




document.addEventListener('DOMContentLoaded', () => {
  console.log('Dom is ready');
// Logic for my Login-------------------------------------------------------
  const messageContainer = document.getElementById('message-container');
  const messageContainerAlert = document.getElementById('message-container-alert');
  const messagelogin = document.getElementById('message-container-login');


  //Register toggle----------------------------

  function toggleContainerAlert(showAlert){
    if (showAlert) {
      
      messageContainerAlert.style.display = 'block'; 
    } else {
      
      messageContainerAlert.style.display = 'none'; 
    }
  }
 toggleContainerAlert(false);


 function toggleContainer(showAlert){
  if (showAlert) {
    
    messageContainer.style.display = 'block'; 
  } else {
    
    messageContainer.style.display = 'none'; 
  }
}
toggleContainer(false);


//--------------------------login toggle
function toggleLogin(showAlert){
  if(showAlert){
    messagelogin.style.display = 'block';
  }else{
    messagelogin.style.display = 'none';
  }
}
toggleLogin(false);


  document.getElementById('submit-button').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username == null|| username.trim() == ''|| password == null || password.trim() == ''){
      ipcRenderer.send('data-to-main', { message: 'Please fill both Username and Password' });
      // toggleContainerAlert();
      return;
    }
    // messageContainer.style.display = 'none';  need improvements modification not complete

    const dataToSend = {
      username,
      password,
    };

    ipcRenderer.send('data-to-main', dataToSend);
  });



  ipcRenderer.on('registration-success', (event, message) => { 
    // const messageContainerAlert = document.getElementById('message-container-alert');
    messageContainerAlert.textContent = message;
    toggleContainerAlert(true);
    toggleContainer(false);
  });

  ipcRenderer.on('invalid', (event, message) => {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    toggleContainer(true);
    toggleContainerAlert(false);
  });

  const loginButton = document.getElementById('login-button');


  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const usernameInput = document.getElementById('username_login');
      const passwordInput = document.getElementById('password_login');

      if (!usernameInput || !passwordInput) {
        console.error('Username or password input elements not found');
        return;
      }

      const username = usernameInput.value;
      const password = passwordInput.value;

      ipcRenderer.send('validate-login', { username, password });
    });
  }

  ipcRenderer.on('login-result', (event, result) => {
    if (result.success) {
      console.log('Login successful');
      window.location.href = 'chat.html';
    } else {
      console.log('Login failed');
      const messageContainerLogin = document.getElementById('message-container-login');
      messageContainerLogin.textContent = result.message;
      toggleLogin(true);
    }
  });
  
//functionality of my UI----------------------------------------------------------------
let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault();

let changeForm = (e) => {
	switchCtn.classList.add("is-gx");
	setTimeout(function () {
		switchCtn.classList.remove("is-gx");
	}, 1500);

	switchCtn.classList.toggle("is-txr");
	switchCircle[0].classList.toggle("is-txr");
	switchCircle[1].classList.toggle("is-txr");

	switchC1.classList.toggle("is-hidden");
	switchC2.classList.toggle("is-hidden");
	aContainer.classList.toggle("is-txl");
	bContainer.classList.toggle("is-txl");
	bContainer.classList.toggle("is-z200");
};

let mainF = (e) => {
	for (var i = 0; i < allButtons.length; i++)
		allButtons[i].addEventListener("click", getButtons);
	for (var i = 0; i < switchBtn.length; i++)
		switchBtn[i].addEventListener("click", changeForm);
};

window.addEventListener("load", mainF);
});
