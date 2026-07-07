// src/CoursesList.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Liste des cours disponibles</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.title}</strong> — {course.level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesList;

