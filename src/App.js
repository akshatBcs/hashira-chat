import React, { useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './App.css';
// import DateTime from 'datetime';
// import { getAuth, signInAnonymously } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDTzBRe2gTFLXNLymTRVGuDFqOQmK1rIxk",
  authDomain: "hashira-chat.firebaseapp.com",
  projectId: "hashira-chat",
  storageBucket: "hashira-chat.appspot.com",
  messagingSenderId: "609012937466",
  appId: "1:609012937466:web:08928071b03004547b0f43"
};

firebase.initializeApp(
  firebaseConfig
);

// const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user, setUser] = useState(null);
  const [dp, setDp] = useState(null);

  function SignIn() {
    let name = '';
    const signIn = (e) => {
      // const provider = new firebase.auth.GoogleAuthProvider();
      // auth.signInWithPopup(provider);

      setUser(name);
      setDp(`https://ui-avatars.com/api/?name=${name}`);

    }
    const handleChange = (e) => {
      name = e.target.value;
      // console.log(name);
    }
    const handleSubmit = (e) => {
      e.preventDefault();

    }

    return (
      <>
        <form onSubmit={handleSubmit}>

          <input type="text" placeholder='name' onChange={handleChange} />
          <button className="sign-in" onClick={signIn}>Sign in</button>
        </form>
      </>
    )

  }

  function SignOut() {
    return (
      <button className="sign-out" onClick={() => setUser(null)}>Sign Out</button>
    )
  }


  return (
    <div className="App">
      <header>
        <h1>ĦȺSĦƗɌȺS ⚔️</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
        {/* <ChatRoom /> */}
      </section>

    </div>
  );


  function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');


    const sendMessage = async (e) => {
      e.preventDefault();

      const uid = user;
      const photoURL = dp;
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
      // console.log(dp);

      await messagesRef.add({
        text: formValue,
        createdAt: timeStamp,
        uid,
        photoURL
      })

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
      <main>

        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>

      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type message" />

        <button type="submit" disabled={!formValue}>🕊️</button>

      </form>
    </>)
  }




  function ChatMessage(props) {
    // const { text, uid} = props.message;
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === user ? 'sent' : 'received';
    // console.log(createdAt.seconds===null?Date.now():createdAt.seconds);
    // console.log(createdAt);
    // const time = Date.now();


    // var dt = new Date(time);
    // var d24 = new Date('dd/MM/yyyy, HH:mm').format(dt); 
    // const showTime = dt.getHours()+':'+dt.getMinutes()

    return (<>
      <div className={`message ${messageClass}`}>

        <img
          // src={`https://ui-avatars.com/api/?name=${uid}`}
          src={photoURL}
          alt={uid} />
        <p>
          {text}
          <sub>
            {/* {time} */}
          </sub>
        </p>
      </div>
    </>)
  }

}


export default App;
