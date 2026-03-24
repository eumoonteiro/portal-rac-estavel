import emailjs from '@emailjs/browser';

const EMAIL_CONFIG = {
  SERVICE_ID: "service_rz4fbpq",
  GENERAL_TEMPLATE_ID: "template_b52i4zc",
  GRADE_TEMPLATE_ID: "template_kri2zpj",
  PUBLIC_KEY: "2WRJe3NbNMqxWU6zV"
};

emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

export const sendGeneralNotification = async (to_name, to_email, message, subject) => {
  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.GENERAL_TEMPLATE_ID,
      {
        to_name,
        to_email,
        message,
        subject
      }
    );
    return response;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};

export const sendGradeNotification = async (student_name, student_email, subject_name, grade) => {
  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.GRADE_TEMPLATE_ID,
      {
        student_name,
        student_email,
        subject_name,
        grade
      }
    );
    return response;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};

export default EMAIL_CONFIG;
