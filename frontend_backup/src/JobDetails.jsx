import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function JobDetails() {

  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     🚀 FETCH JOB DETAILS
  ========================= */
  useEffect(() => {

    let isMounted = true;

    async function fetchJob() {

      try {

        setLoading(true);
        setError("");

        // 🔥 MOCK (replace later with API)
        const data = await generateFakeJob(id);

        if (isMounted) {
          setJob(data);
        }

      } catch (err) {

        if (isMounted) {
          setError("Failed to load job");
        }

      } finally {

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchJob();

    /* =========================
       🧹 CLEANUP (AVOID MEMORY LEAKS)
    ========================= */
    return () => {
      isMounted = false;
    };

  }, [id]);

  /* =========================
     🎯 MEMOIZED SKILLS (PERF BOOST)
  ========================= */
  const skills = useMemo(() => {
    return job?.skills || [];
  }, [job]);

  /* =========================
     🚀 APPLY ACTION (READY FOR API)
  ========================= */
  const handleApply = async () => {

    try {

      alert(`Applying for job ${job.id} 🚀`);

      // 🔜 future:
      // await applyJob(job.id)

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     ⏳ LOADING STATE
  ========================= */
  if (loading) {
    return <p style={styles.loading}>Loading AI job analysis...</p>;
  }

  /* =========================
     ❌ ERROR STATE
  ========================= */
  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  if (!job) {
    return <p style={styles.error}>Job not found</p>;
  }

  /* =========================
     🎯 UI RENDER
  ========================= */
  return (
    <div style={styles.container}>

      {/* HEADER */}
      <h1 style={styles.title}>{job.title}</h1>

      <p style={styles.category}>
        Category: {job.category}
      </p>

      <p style={styles.score}>
        AI Match Score: {job.score}
      </p>

      {/* DESCRIPTION */}
      <div style={styles.box}>
        <h3>Description</h3>
        <p>{job.description}</p>
      </div>

      {/* SKILLS */}
      <div style={styles.box}>
        <h3>Required Skills</h3>

        <div style={styles.skills}>
          {skills.map((skill, i) => (
            <span key={skill + i} style={styles.badge}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ACTION */}
      <button style={styles.button} onClick={handleApply}>
        🚀 Apply Now
      </button>

    </div>
  );
}

/* =========================
   MOCK ENGINE (ASYNC READY)
========================= */
async function generateFakeJob(id) {

  return {
    id,
    title: "AI Engineer",
    category: "tech",
    score: 92,
    description:
      "Build intelligent systems using ML, vector search and AI pipelines.",
    skills: ["python", "ml", "ai", "node"]
  };
}

/* =========================
   STYLES (UNCHANGED CLEAN UI)
========================= */
const styles = {

  container: {
    padding: 20,
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    fontSize: 28,
    marginBottom: 5
  },

  category: {
    color: "#9ca3af"
  },

  score: {
    marginTop: 10,
    color: "#22c55e"
  },

  box: {
    marginTop: 20,
    padding: 15,
    background: "#111827",
    borderRadius: 10,
    border: "1px solid #1f2937"
  },

  skills: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  },

  badge: {
    fontSize: 12,
    padding: "4px 8px",
    background: "#1f2937",
    borderRadius: 5
  },

  button: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer"
  },

  loading: {
    color: "#9ca3af"
  },

  error: {
    color: "#ef4444"
  }
};