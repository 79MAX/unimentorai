/**
 * CERTIFICATE TEMPLATE V2 (CLEAN + SCALABLE)
 * - pure function
 * - no side effects
 * - safe defaults
 */

export function buildCertificateTemplate(data = {}) {
  const {
    userName = "Anonymous Student",
    courseName = "Unknown Course",
    date = new Date().toISOString().split("T")[0],
    certificateId = "N/A",
  } = data;

  return {
    meta: {
      title: "UniMentorAI Certificate",
      certificateId,
      generatedAt: new Date().toISOString(),
    },

    content: {
      header: {
        title: "CERTIFICATE OF COMPLETION",
        subtitle: "UniMentorAI Learning Platform",
      },

      body: {
        text: `This certifies that`,
        userName,
        message: `has successfully completed the course`,
        courseName,
        date,
      },

      footer: {
        signature: "UniMentorAI Authority",
        validationText: "This certificate is digitally verified",
      },
    },
  };
}
