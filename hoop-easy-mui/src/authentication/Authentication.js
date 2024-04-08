import { auth } from "../config/Firebase";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendEmailVerification
} 
from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import axios from 'axios';

async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        if (validateEmail(email) !== null) {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => resolve(userCredential))
                .catch(error => reject(error));
        } else {
            reject(new Error('Invalid email'));
        }
    });
}

async function createNewUser(first, last, username, email, password) {
    return new Promise((resolve, reject) => {
        if (isEmpty([first, last, username, email, password])) {
            reject(new Error("Empty fields"))
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                addNewUserToDatabase(first, last, username, email, password)
                resolve(userCredentials)
                sendEmailVerification(userCredentials.user)
            })
            .catch((err) => {
                reject(new Error("Failed to create new user"))
            })
    })
}

async function addNewUserToDatabase(first, last, username, email, password) {
    const currentDate = Timestamp.now();
    const request = {
        username: username,
        email: email,
        firstName: first,
        lastName: last,
        middleInitial: '',
        heightFt: '',
        heightInches: '',
        gamesAccepted: '0',
        gamesDenied: '0',
        gamesPlayed: '0',
        overall: '60',
        date: currentDate
    }
    axios.post('https://hoop-easy-production.up.railway.app/api/newUser', request)
};


function validateEmail(input) {
    const pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,64}@(?:[a-z0-9-]{1,63}\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (pattern.test(input)) {
        return input;
    } else {
        return null
    }
}

function isEmpty(arrValues) {
    for (let i = 0; i < arrValues.length; i++) {
        if (arrValues[i].trim() === '') {
            return true
        }
    }
    return false
}

export {loginUser, createNewUser}