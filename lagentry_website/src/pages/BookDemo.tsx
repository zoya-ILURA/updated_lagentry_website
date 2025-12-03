import React, { useState, useEffect, useRef } from 'react';
import './BookDemo.css';
import { db } from '../lib/firebase';
import { addDoc, collection, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import Calendar from '../components/Calendar';
import { submitFormData, FormSubmissionData } from '../lib/submitFormData';
// import FeatureCards from '../components/FeatureCards';
// import MenaCard from '../components/MenaCard';

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  companySize: string;
  message: string;
  consent: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  companySize: '',
  message: '',
  consent: false,
};

const BookDemo: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [typingText, setTypingText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isReschedule, setIsReschedule] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prompts = [
    'Create a Finance Agent that tracks real-time EBITDA and sends reports on WhatsApp.',
    'Design an HR Agent that shortlists candidates and emails interview summaries.',
    'Deploy a Sales Agent that calls leads in Arabic — instantly.'
  ];

  // Detect reschedule from URL (e.g. /book-demo?reschedule=1&email=user@example.com)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rescheduleFlag = params.get('reschedule');
      const emailFromUrl = params.get('email');

      if (rescheduleFlag === '1') {
        setIsReschedule(true);
        if (emailFromUrl) {
          setForm((prev) => ({ ...prev, email: decodeURIComponent(emailFromUrl) }));
        }
      }
    } catch (err) {
      console.error('Error parsing reschedule URL params:', err);
    }
  }, []);

  // Typing animation effect
  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex];
    const typingSpeed = isDeleting ? 30 : 50; // Faster when deleting
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (typingText.length < currentPrompt.length) {
          setTypingText(currentPrompt.substring(0, typingText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (typingText.length > 0) {
          setTypingText(currentPrompt.substring(0, typingText.length - 1));
        } else {
          // Finished deleting, move to next prompt
          setIsDeleting(false);
          setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingText, currentPromptIndex, isDeleting, prompts]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) {
        // Fallback: use scroll position
        const scrollY = window.scrollY;
        const startScroll = 400;
        const transitionDistance = 800;
        const adjustedScroll = Math.max(0, scrollY - startScroll);
        const progress = Math.min(adjustedScroll / transitionDistance, 1);
        setScrollProgress(progress);
        return;
      }
      
      const cardRect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Get card's top position in viewport
      const cardTop = cardRect.top;
      
      // Start transition when card top enters viewport (at 100% of viewport height)
      // Complete transition when card top reaches 20% of viewport height
      const startPoint = windowHeight; // Card enters from bottom
      const endPoint = windowHeight * 0.2; // Card reaches near top
      
      let progress = 0;
      
      if (cardTop < startPoint) {
        if (cardTop <= endPoint) {
          // Card has scrolled past end point - fully straight
          progress = 1;
        } else {
          // Card is in transition zone - calculate progress
          const distance = startPoint - cardTop;
          const totalDistance = startPoint - endPoint;
          progress = Math.min(Math.max(distance / totalDistance, 0), 1);
        }
      } else {
        // Card hasn't entered viewport yet - fully slanted
        progress = 0;
      }
      
      setScrollProgress(progress);
    };

    const handleClick = (e: MouseEvent) => {
      setScrollProgress(1);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Also check after a delay to catch any late DOM updates
    const initTimer = setTimeout(handleScroll, 100);

    // Add click listener
    if (containerRef.current) {
      containerRef.current.addEventListener('click', handleClick);
    }

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, []);

  // Calculate transform values based on scroll progress
  // Starts slanted (8deg) and becomes straight (0deg) as you scroll slowly
  const rotateX = 8 * (1 - scrollProgress); // From 8deg to 0deg - more visible slant

  // Auto-save draft as user types
  const autoSaveDraft = async (formData: FormState) => {
    try {
      setSavingDraft(true);
      const draftData = {
        ...formData,
        selectedDate: selectedDate?.toISOString() || null,
        selectedTime: selectedTime || null,
        lastSaved: serverTimestamp(),
        isDraft: true,
      };

      if (draftId) {
        // Update existing draft
        await setDoc(doc(db, 'drafts', draftId), draftData);
      } else {
        // Create new draft
        const draftsRef = collection(db, 'drafts');
        const newDraftRef = doc(draftsRef);
        await setDoc(newDraftRef, draftData);
        setDraftId(newDraftRef.id);
      }
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setSavingDraft(false);
    }
  };

  // Load draft and fetch initial bookings count on component mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        // Try to load the most recent draft from localStorage
        const savedDraftId = localStorage.getItem('draftId');
        if (savedDraftId) {
          const draftDoc = await getDoc(doc(db, 'drafts', savedDraftId));
          if (draftDoc.exists()) {
            const draftData = draftDoc.data();
            setDraftId(savedDraftId);
            setForm({
              name: draftData.name || '',
              email: draftData.email || '',
              phone: draftData.phone || '',
              company: draftData.company || '',
              companySize: draftData.companySize || '',
              message: draftData.message || '',
              consent: draftData.consent || false,
            });
            if (draftData.selectedDate) {
              setSelectedDate(new Date(draftData.selectedDate));
            }
            if (draftData.selectedTime) {
              setSelectedTime(draftData.selectedTime);
            }
          }
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    };

    loadDraft();
  }, []);

  // Auto-save on form change (debounced)
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Only auto-save if form has some data
    const hasData = form.name || form.email || form.phone || form.company;
    if (hasData) {
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveDraft(form);
      }, 500); // Save after 500ms of inactivity (faster auto-save)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [form, selectedDate, selectedTime]);

  // Save draft ID to localStorage
  useEffect(() => {
    if (draftId) {
      localStorage.setItem('draftId', draftId);
    }
  }, [draftId]);


  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onToggleConsent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time for your demo.');
      setSubmitting(false);
      return;
    }

    // Prepare form data for Supabase
    const formSubmissionData: FormSubmissionData = {
      full_name: form.name,
      work_email: form.email,
      contact_number: form.phone,
      company_name: form.company,
      company_size: form.companySize,
      demo_request_message: form.message || undefined,
      terms_accepted: form.consent,
      selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
      selected_time: selectedTime,
    };

    // Submit to Supabase
    const result = await submitFormData(formSubmissionData);

    if (result.success) {
      // Show success message
      setSuccess(result.message);
      
      // Reset form
      setForm(initialState);
      setSelectedDate(null);
      setSelectedTime(null);
      setSubmitting(false);

      // Delete draft if exists
      if (draftId) {
        setDoc(doc(db, 'drafts', draftId), { deleted: true }, { merge: true })
          .catch(err => console.error('Error deleting draft:', err));
        localStorage.removeItem('draftId');
        setDraftId(null);
      }

      // Optional: Also save to Firestore for backward compatibility (if needed)
      const bookingDate = selectedDate;
      const bookingTime = selectedTime;
      const bookingDateTime = `${formatDate(selectedDate)} at ${selectedTime}`;
      const bookingDayDate = formatDate(bookingDate);
      const baseUrl = window.location.origin || 'https://lagentry.com';
      const rescheduleUrl = `${baseUrl}/book-demo?reschedule=1&email=${encodeURIComponent(form.email)}`;
      const bookingData = {
        ...form,
        bookingDate: bookingDate.toISOString(),
        bookingTime: bookingTime,
        bookingDateTime: bookingDateTime,
        createdAt: serverTimestamp(),
      };

      // Always attempt to send emails after a successful Supabase submission,
      // regardless of whether Firestore succeeds.
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY as string;
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID as string;
      const templateIdUser = process.env.REACT_APP_EMAILJS_TEMPLATE_USER as string;
      const templateIdAdmin = process.env.REACT_APP_EMAILJS_TEMPLATE_ADMIN as string;

      console.log('EmailJS Config Check:', {
        hasPublicKey: !!publicKey,
        hasServiceId: !!serviceId,
        hasTemplateUser: !!templateIdUser,
        hasTemplateAdmin: !!templateIdAdmin,
      });

      if (publicKey && serviceId && templateIdUser) {
        try {
          emailjs.init(publicKey);
          console.log('EmailJS initialized');

          // Send user confirmation email
          const userEmailPromise = emailjs
            .send(serviceId, templateIdUser, {
              // Common fields our template can use
              to_email: form.email,
              to_name: form.name,
              booking_date: bookingDayDate,
              booking_time: bookingTime,
              booking_datetime: bookingDateTime,
              reschedule_url: rescheduleUrl,
              // Match possible variable names configured in EmailJS (from your other instructions)
              Name: form.name,
              DayDate: bookingDayDate,
              Time: bookingTime,
              PresenterName: 'Lagentry Team',
              email: form.email,
              // Generic fallback message; main content comes from the template
              message: `Your Lagentry demo is confirmed for ${bookingDayDate} at ${bookingTime}.`,
            })
            .then((response) => {
              console.log('User email sent successfully:', response.status, response.text);
              return response;
            })
            .catch((err) => {
              console.error('Error sending user email:', err);
              // Show warning but don't overwrite success
              setTimeout(() => {
                setError(
                  `Note: Email notification may not have been sent. Please check your email: ${form.email}`
                );
              }, 2000);
              return null;
            });

          // Send admin notification email only if admin template is configured
          let adminEmailPromise: Promise<any> | null = null;
          if (templateIdAdmin) {
            adminEmailPromise = emailjs
              .send(serviceId, templateIdAdmin, {
                to_email: 'ilura.ai.tech@gmail.com',
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                company_size: form.companySize,
                message: form.message,
                booking_date: bookingDayDate,
                booking_time: bookingTime,
                booking_datetime: bookingDateTime,
                reschedule_url: rescheduleUrl,
                // Also provide alternative keys in case the admin template expects them
                Name: form.name,
                DayDate: bookingDayDate,
                Time: bookingTime,
              })
              .then((response) => {
                console.log('Admin email sent successfully:', response.status, response.text);
                return response;
              })
              .catch((err) => {
                console.error('Error sending admin email:', err);
                return null;
              });
          } else {
            console.warn('EmailJS admin template ID is missing; admin email will not be sent.');
          }

          // Wait for both emails (admin may be null)
          Promise.all([userEmailPromise, adminEmailPromise])
            .then((results) => {
              if (results[0]) {
                console.log('All emails (user + optional admin) processed');
              } else {
                console.warn('User email failed to send');
              }
            })
            .catch((err) => {
              console.error('Error waiting for email promises:', err);
            });
        } catch (initErr) {
          console.error('Error initializing EmailJS:', initErr);
          setTimeout(() => {
            setError('Note: Email service unavailable. Your booking was saved successfully.');
          }, 2000);
        }
      } else {
        console.warn('EmailJS configuration missing:', {
          publicKey: !!publicKey,
          serviceId: !!serviceId,
          templateIdUser: !!templateIdUser,
          templateIdAdmin: !!templateIdAdmin,
        });
        setTimeout(() => {
          setError('Note: Email configuration missing. Your booking was saved successfully.');
        }, 2000);
      }

      // Save to Firestore in background (optional - remove if not needed)
      addDoc(collection(db, 'bookings'), bookingData).catch((err: any) => {
        // Firestore save failed, but Supabase save and emails succeeded/attempted, so just log
        console.error('Error saving to Firestore (optional):', err);
      });
    } else {
      // Supabase submission failed
      setError(result.message || 'Failed to submit form. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`book-demo-container ${theme === 'light' ? 'light-theme' : ''}`}
    >
      {/* Top Image with Overlay Form */}
      <div className="demo-top-image-container">
        <img src="/images/demo2.png" alt="Demo visual" className="demo-top-background-image" />
        {/* Text Overlay on Image */}
        <div className="demo-top-image-text-overlay">
          <h2 className="demo-top-image-title">Experience the Future of Work with AI Employees.</h2>
          <p className="demo-top-image-subtitle">Meet your next employee — built, trained, and deployed in seconds.</p>
        </div>
        {/* Form Card with Slant Effect - Overlay on Bottom Half */}
        <div className="book-demo-grid-overlay">
        <aside 
          ref={cardRef}
          className="book-demo-card"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {success && <div className="alert success">{success}</div>}
          {error && <div className="alert error">{error}</div>}

          <h2 className="form-section-title">Contact Information</h2>

          <div className="form-calendar-layout">
            <div className="form-section">
              <form className="book-demo-form" onSubmit={onSubmit} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ilura AI"
                      value={form.name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Work Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="info@ilura-ai.com"
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="phone">Contact Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={form.phone}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="company">Company Name</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Ilura AI"
                      value={form.company}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="companySize">Company Size</label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={form.companySize}
                    onChange={onChange}
                    required
                  >
                    <option value="" disabled>Select company size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-1000">201-1000</option>
                    <option value=">1000">1000+</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="message">What would you like to see in the demo?</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your use case..."
                    value={form.message}
                    onChange={onChange}
                    rows={4}
                  />
                </div>

                <label className="consent">
                  <input type="checkbox" checked={form.consent} onChange={onToggleConsent} />
                  I agree to the terms and to be contacted about the demo.
                </label>

                <button
                  className="submit-button gradient"
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedTime}
                >
                  {submitting ? 'Submitting...' : 'Schedule Demo'}
                </button>
              </form>
            </div>

            <div className="calendar-section">
              <h2 className="form-section-title">Select Date & Time</h2>
              <Calendar
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                theme={theme}
              />
            </div>
          </div>
        </aside>
        </div>
      </div>

      {/* Caption text above image */}
      
      
      {/* Top illustrative image with overlay box */}
      <div className="demo-top-image-wrap">
        <img src="/images/demo.png" alt="Demo visual" className="demo-top-image" />
        <div className="demo-top-overlay">
          <div className="overlay-typing">
            <span className="overlay-typing-text">
              {typingText}
              <span className="overlay-typing-cursor">|</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scroll-triggered Features Section */}
      {/* <FeatureCards theme={theme} /> */}

      {/* MENA Card Section */}
      {/* <MenaCard theme={theme} /> */}

      {/* Bottom image */}
      <div className="demo-bottom-image-wrap">
        <img src="/images/demo1.png" alt="Demo visual" className="demo-bottom-image" />
        <div className="demo-bottom-video">
          <video
            src="/demo1.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="demo-bottom-video-caption">
            <h3 className="demo-bottom-video-title">Built for the MENA World</h3>
            <p className="demo-bottom-video-subtitle">Understands Your Market, Language, and Law.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDemo;