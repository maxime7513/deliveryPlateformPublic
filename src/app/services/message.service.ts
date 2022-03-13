import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: Firestore) { }

  addMessage(message: Message) {
    const messageRef = collection(this.firestore, 'messages'); 
    return addDoc(messageRef, message);
  }
  getMessages(): Observable<Message[]> {
    const messageRef = query(collection(this.firestore, 'messages'), orderBy("date","desc"));
    return collectionData(messageRef, { idField: 'id' }) as Observable<Message[]>;
  }
  getMessagesNonLu(): Observable<Message[]> {
    const messageLuref = query(collection(this.firestore, 'messages'), where("lu", "==", false));
    return collectionData(messageLuref, { idField: 'id' }) as Observable<Message[]>;
  }
  deleteMessage(message: Message) {
    const messageDocRef = doc(this.firestore, `messages/${message.id}`);
    return deleteDoc(messageDocRef);
  }

  updateLuMessage(message: Message, res: boolean){
    const ref = doc(this.firestore, `messages/${message.id}`);
    return updateDoc(ref, {lu : res});
  }
  updateTraiteMessage(message: Message, res: boolean){
    const ref = doc(this.firestore, `messages/${message.id}`);
    return updateDoc(ref, {traite : res});
  }
}
