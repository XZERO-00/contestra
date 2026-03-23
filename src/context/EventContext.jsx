import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]); // Cache for users to display participant names

  useEffect(() => {
    // Listen to events
    const unsubscribeEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = [];
      snapshot.forEach(doc => eventsData.push({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    }, (error) => {
      console.error("Error fetching events: ", error);
    });

    // Listen to registrations
    const unsubscribeRegs = onSnapshot(collection(db, 'registrations'), (snapshot) => {
      const regsData = [];
      snapshot.forEach(doc => regsData.push({ id: doc.id, ...doc.data() }));
      setRegistrations(regsData);
    }, (error) => {
      console.error("Error fetching registrations: ", error);
    });
    
    // Listen to users (to resolve participant names/orgs in host dashboard)
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = [];
      snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users: ", error);
    });

    return () => {
        unsubscribeEvents();
        unsubscribeRegs();
        unsubscribeUsers();
    };
  }, []);

  const addEvent = async (eventData) => {
    if (!user || user.role !== 'Host') return null;
    
    // Create reference to get an auto-generated ID
    const newEventRef = doc(collection(db, 'events'));
    
    const newEvent = {
      ...eventData,
      hostId: user.uid, // Note: user.uid in Firebase
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    
    try {
        await setDoc(newEventRef, newEvent);
        return { id: newEventRef.id, ...newEvent };
    } catch (e) {
        console.error("Error adding event: ", e);
        return null;
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
        await updateDoc(doc(db, 'events', id), updatedData);
    } catch (e) {
        console.error("Error updating event: ", e);
    }
  };

  const deleteEvent = async (id) => {
    try {
        await deleteDoc(doc(db, 'events', id));
        
        // Cascade delete registrations associated with this event
        const eventRegs = registrations.filter(reg => reg.eventId === id);
        for (const reg of eventRegs) {
            await deleteDoc(doc(db, 'registrations', reg.id));
        }
    } catch (e) {
        console.error("Error deleting event: ", e);
    }
  };

  const getEventById = (id) => {
    return events.find(ev => ev.id === id);
  };

  const registerForEvent = async (eventId, formData = {}) => {
    if (!user || user.role !== 'Participant') return false;
    
    // Check if already registered
    if (registrations.some(reg => reg.eventId === eventId && reg.participantId === user.uid)) {
      return false; 
    }

    const event = getEventById(eventId);
    if (!event) return false;
    
    if (event.status === 'Paused' || event.status === 'Closed') {
        return false; // Event not accepting new registrations
    }

    // Check limits
    const currentRegCount = registrations.filter(r => r.eventId === eventId).length;
    if (event.participantLimit && currentRegCount >= parseInt(event.participantLimit)) {
        return false; // Limit reached
    }
    
    const regRef = doc(collection(db, 'registrations'));
    const newRegistration = {
      eventId,
      participantId: user.uid,
      registrationDate: new Date().toISOString(),
      ...formData
    };
    
    try {
        await setDoc(regRef, newRegistration);
        return true;
    } catch (e) {
        console.error("Error registering: ", e);
        return false;
    }
  };

  const getMyRegisteredEvents = () => {
    if (!user || user.role !== 'Participant') return [];
    
    const myRegs = registrations.filter(reg => reg.participantId === user.uid);
    const eventIds = myRegs.map(r => r.eventId);
    return events.filter(ev => eventIds.includes(ev.id));
  };

  const getMyHostedEvents = () => {
    if (!user || user.role !== 'Host') return [];
    return events.filter(ev => ev.hostId === user.uid);
  };

  const getEventParticipants = (eventId) => {
    const eventRegs = registrations.filter(reg => reg.eventId === eventId);
    const participantIds = eventRegs.map(reg => reg.participantId);
    
    // Find users whose ID matches participantId
    return users.filter(u => participantIds.includes(u.id));
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      registerForEvent,
      getMyRegisteredEvents,
      getMyHostedEvents,
      getEventParticipants
    }}>
      {children}
    </EventContext.Provider>
  );
};
