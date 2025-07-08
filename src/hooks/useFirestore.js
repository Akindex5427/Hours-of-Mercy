// Custom React hooks for Firestore operations
import { useState, useEffect } from "react";
import {
  staffService,
  eventsService,
  sermonsService,
  prayerRequestsService,
  newsletterService,
  contactService,
  setupRealtimeListener,
} from "../firebase/firestore";

// Hook for staff data
export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const staffData = await staffService.getAllStaff();
        setStaff(staffData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const addStaff = async (staffData) => {
    try {
      const id = await staffService.addStaff(staffData);
      const newStaff = { id, ...staffData };
      setStaff((prev) => [...prev, newStaff]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { staff, loading, error, addStaff };
};

// Hook for events data
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await eventsService.getAllEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
      const id = await eventsService.addEvent(eventData);
      const newEvent = { id, ...eventData };
      setEvents((prev) => [...prev, newEvent]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { events, loading, error, addEvent };
};

// Hook for upcoming events only
export const useUpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await eventsService.getUpcomingEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

// Hook for sermons data
export const useSermons = (limitCount = 10) => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        const sermonsData = await sermonsService.getRecentSermons(limitCount);
        setSermons(sermonsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, [limitCount]);

  const addSermon = async (sermonData) => {
    try {
      const id = await sermonsService.addSermon(sermonData);
      const newSermon = { id, ...sermonData };
      setSermons((prev) => [newSermon, ...prev]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { sermons, loading, error, addSermon };
};

// Hook for prayer requests
export const usePrayerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const requestsData = await prayerRequestsService.getPrayerRequests();
        setRequests(requestsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const submitPrayerRequest = async (requestData) => {
    try {
      const id = await prayerRequestsService.addPrayerRequest(requestData);
      const newRequest = { id, ...requestData, status: "pending" };
      setRequests((prev) => [...prev, newRequest]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { requests, loading, error, submitPrayerRequest };
};

// Hook for newsletter subscription
export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email, name = "") => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await newsletterService.subscribe(email, name);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return { subscribe, loading, error, success, resetStatus };
};

// Hook for real-time updates
export const useRealtimeData = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = setupRealtimeListener(collectionName, (newData) => {
        setData(newData);
        setLoading(false);
        setError(null);
      });

      // Cleanup function
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName]);

  return { data, loading, error };
};

// Hook for contact form submissions
export const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitContactForm = async (contactData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const submissionId = await contactService.submitContactForm(contactData);
      setSuccess(true);
      setLoading(false);
      return submissionId;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    submitContactForm,
    loading,
    error,
    success,
    resetStatus,
  };
};

// Hook for admin contact submissions management
export const useContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const submissionsData = await contactService.getAllContactSubmissions();
        setSubmissions(submissionsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const updateStatus = async (submissionId, status) => {
    try {
      await contactService.updateContactStatus(submissionId, status);
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId
            ? { ...submission, status }
            : submission
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSubmission = async (submissionId) => {
    try {
      await contactService.deleteContactSubmission(submissionId);
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== submissionId)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    submissions,
    loading,
    error,
    updateStatus,
    deleteSubmission,
  };
};
