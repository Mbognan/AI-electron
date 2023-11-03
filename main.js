const { app, BrowserWindow, ipcMain } = require('electron');

const mysql = require('mysql'); 


const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'chat_db',
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  
  } else {
    console.log('Connected to MySQL');
  }
});

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1050,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      // Example allowing Google Fonts and Material Icons
      webSecurity: false
    },
  });

  mainWindow.loadFile('register.html');

  // ipcMain.on('open-next-page', () => {
  //   // Create a new BrowserWindow to open index.html
  //   const nextWindow = new BrowserWindow({
  //     width: 800,
  //     height: 600,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       contextIsolation: false,
  //     },
  //   });
  
  //   nextWindow.loadFile('index.html');
  // });



  


  ipcMain.on('data-to-main', (event, dataReceived) => {
    console.log('Received data in the main process:',  );
    if(!dataReceived.username || !dataReceived.password){
      event.sender.send('invalid', 'Invalid Username and Password, please try again!');
  }else{   
    dbConnection.query(
      'SELECT username FROM chat_login WHERE username = ?',
      [dataReceived.username],
      (err, results) => {
        if (err) {
          console.error('Error checking for existing user:', err);
        } else {
          if (results.length > 0) {
            event.reply('invalid', 'User already exists in the database.');
            console.log('User already exists in the database');
            
          } else {
         
            dbConnection.query(
              'INSERT INTO chat_login (username, password) VALUES (?, ?)',
              [dataReceived.username, dataReceived.password],
              (insertErr, insertResults) => {
                if (insertErr) {
                  console.error('Error inserting user data:', insertErr);
                  event.reply('invalid', 'Error no registered!');
                } else {
                  console.log('User data inserted into the database:', insertResults);
                  event.reply('registration-success', 'User registered successfully!');
                }
              }
            );
          }
        }
      }
    );
  }

  });
  

});

ipcMain.on('validate-login', (event, { username, password }) => {
  const sql = 'SELECT * FROM chat_login WHERE username = ? AND password = ?';
  const values = [username, password];
  dbConnection.query(sql, values, (err, rows) => {
    if (err) {
      
      console.error('Error querying database:', err.message);
      event.reply('login-result', { success: false, message: 'Database error occurred.' });
    } else {
      if (rows.length > 0) {
        event.reply('login-result', { success: true });
      } else {
        event.reply('login-result', { success: false, message: 'Invalid username or password.' });
      }
    }
  });
});
