// Custom React hooks for Firestore operations
import { useState, useEffect } from "react";
import {
  staffService,
  eventsService,
  sermonsService,
  prayerRequestsService,
  newsletterService,
  contactService,
  memberService,
  ministriesService,
  configService,
  churchInfoService,
  setupRealtimeListener,
} from "../firebase/firestore";
import { authService, getAuthErrorMessage } from "../firebase/auth";

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

// Hook for Firebase Authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await authService.signInWithEmailAndPassword(
        email,
        password
      );
      return userData;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setError(null);
      setLoading(true);
      const newUser = await authService.registerWithEmailAndPassword(
        email,
        password,
        userData
      );
      return newUser;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.sendPasswordResetEmail(email);
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
};

// Hook for member profile management
export const useMemberProfile = (uid) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await memberService.getMemberProfile(uid);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  const updateProfile = async (updateData) => {
    try {
      setError(null);
      await memberService.updateMemberProfile(uid, updateData);
      setProfile((prev) => ({ ...prev, ...updateData }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};

// Hook for admin member management
export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const membersData = await memberService.getAllMembers();
        setMembers(membersData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const updateMemberStatus = async (uid, status) => {
    try {
      await memberService.updateMemberStatus(uid, status);
      setMembers((prev) =>
        prev.map((member) =>
          member.id === uid ? { ...member, membershipStatus: status } : member
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMember = async (uid) => {
    try {
      await memberService.deleteMemberProfile(uid);
      setMembers((prev) => prev.filter((member) => member.id !== uid));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    members,
    loading,
    error,
    updateMemberStatus,
    deleteMember,
  };
};

// Hook for ministries data
export const useMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoading(true);
        const ministriesData = await ministriesService.getAllMinistries();
        setMinistries(ministriesData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  const addMinistry = async (ministryData) => {
    try {
      const id = await ministriesService.addMinistry(ministryData);
      const newMinistry = { id, ...ministryData };
      setMinistries((prev) => [...prev, newMinistry]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { ministries, loading, error, addMinistry };
};

// Hook for configuration data
export const useConfig = (configType) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const configData = await configService.getConfig(configType);
        setConfig(configData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (configType) {
      fetchConfig();
    }
  }, [configType]);

  const updateConfig = async (configData) => {
    try {
      await configService.updateConfig(configType, configData);
      setConfig((prev) => ({ ...prev, ...configData }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { config, loading, error, updateConfig };
};

// Hook for church information
export const useChurchInfo = (section) => {
  const [churchInfo, setChurchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChurchInfo = async () => {
      try {
        setLoading(true);
        const infoData = await churchInfoService.getChurchInfo(section);
        setChurchInfo(infoData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (section) {
      fetchChurchInfo();
    }
  }, [section]);

  const updateChurchInfo = async (infoData) => {
    try {
      await churchInfoService.updateChurchInfo(section, infoData);
      setChurchInfo((prev) => ({ ...prev, ...infoData }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { churchInfo, loading, error, updateChurchInfo };
};

// Hook for recurring events templates
export const useRecurringEvents = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { recurringEventsService } = await import(
          "../firebase/recurringEventsService"
        );
        const templatesData = await recurringEventsService.getTemplates();
        setTemplates(templatesData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const addTemplate = async (templateData) => {
    try {
      const { recurringEventsService } = await import(
        "../firebase/recurringEventsService"
      );
      const id = await recurringEventsService.addTemplate(templateData);
      const newTemplate = { id, ...templateData };
      setTemplates((prev) => [...prev, newTemplate]);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTemplate = async (id, updates) => {
    try {
      const { recurringEventsService } = await import(
        "../firebase/recurringEventsService"
      );
      await recurringEventsService.updateTemplate(id, updates);
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === id ? { ...template, ...updates } : template
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTemplate = async (id) => {
    try {
      const { recurringEventsService } = await import(
        "../firebase/recurringEventsService"
      );
      await recurringEventsService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getActiveTemplates = async () => {
    try {
      const { recurringEventsService } = await import(
        "../firebase/recurringEventsService"
      );
      return await recurringEventsService.getActiveTemplates();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    templates,
    loading,
    error,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getActiveTemplates,
  };
};
