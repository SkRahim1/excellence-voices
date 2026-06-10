import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import localStudentsData from "../components/data/StudentsData";

// Simple check if Firebase database is loaded and configured
const isFirebaseReady = () => {
  // Config is already provided as fallback, so we assume db is always initialized.
  return true;
};

/**
 * Fetches all items for a class and category (stories, roleplays, skits, etc.)
 */
export const getClassCategoryItems = async (classId, category) => {
  if (!isFirebaseReady()) {
    return localStudentsData[classId]?.[category] || [];
  }
  try {
    const q = query(
      collection(db, "lessons"),
      where("classId", "==", classId),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ docId: doc.id, ...doc.data() });
    });
    // Sort items by numeric id
    return items.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (error) {
    console.error("Error fetching class category items from Firestore:", error);
    // Fallback to local data
    return localStudentsData[classId]?.[category] || [];
  }
};

/**
 * Fetches a single lesson item content
 */
export const getContentItem = async (classId, category, itemId) => {
  if (!isFirebaseReady()) {
    return localStudentsData[classId]?.[category]?.find((i) => i.id === Number(itemId)) || null;
  }
  try {
    const q = query(
      collection(db, "lessons"),
      where("classId", "==", classId),
      where("category", "==", category),
      where("id", "==", Number(itemId))
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { docId: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching content item from Firestore:", error);
    return localStudentsData[classId]?.[category]?.find((i) => i.id === Number(itemId)) || null;
  }
};

/**
 * Searches across all lessons by title (case-insensitive contains)
 * Used by VoiceBot for global voice commands
 */
export const findItemByTitle = async (titleQuery) => {
  const cleanQuery = titleQuery.toLowerCase().trim();
  try {
    const querySnapshot = await getDocs(collection(db, "lessons"));
    let foundItem = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title || "";
      if (title.toLowerCase().includes(cleanQuery) || cleanQuery.includes(title.toLowerCase())) {
        foundItem = { docId: doc.id, ...data };
      }
    });
    if (foundItem) {
      return {
        item: foundItem,
        classKey: foundItem.classId,
        categoryKey: foundItem.category,
      };
    }
  } catch (error) {
    console.error("Error searching item by title in Firestore:", error);
  }

  // Fallback to local search
  let foundItem = null;
  let foundClass = "";
  let foundCategory = "";
  Object.keys(localStudentsData).forEach((clsKey) => {
    Object.keys(localStudentsData[clsKey]).forEach((catKey) => {
      const itemsList = localStudentsData[clsKey][catKey];
      if (Array.isArray(itemsList)) {
        const matched = itemsList.find((i) =>
          i.title.toLowerCase().includes(cleanQuery) ||
          cleanQuery.includes(i.title.toLowerCase())
        );
        if (matched) {
          foundItem = matched;
          foundClass = clsKey;
          foundCategory = catKey;
        }
      }
    });
  });
  return foundItem ? { item: foundItem, classKey: foundClass, categoryKey: foundCategory } : null;
};

/**
 * Adds a new lesson document to Firestore
 */
export const addLesson = async (lessonData) => {
  try {
    const docRef = await addDoc(collection(db, "lessons"), {
      classId: lessonData.classId,
      category: lessonData.category,
      id: Number(lessonData.id),
      title: lessonData.title,
      content: lessonData.content,
    });
    return { docId: docRef.id, ...lessonData };
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};

/**
 * Updates an existing lesson's title and content
 */
export const updateLesson = async (docId, lessonData) => {
  try {
    const docRef = doc(db, "lessons", docId);
    await updateDoc(docRef, {
      title: lessonData.title,
      content: lessonData.content,
    });
    return { docId, ...lessonData };
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};

/**
 * Deletes a lesson document from Firestore
 */
export const deleteLesson = async (docId) => {
  try {
    const docRef = doc(db, "lessons", docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
};

/**
 * Automatically uploads local StudentsData.js contents to Firestore if the db is empty
 */
export const migrateDataToFirestore = async () => {
  try {
    // Check if the collection already contains data
    const testQuery = query(collection(db, "lessons"), limit(1));
    const snapshot = await getDocs(testQuery);
    if (!snapshot.empty) {
      console.log("Migration: Firestore already contains data. Skipping auto-migration.");
      return "skipped";
    }

    console.log("Migration: Firestore is empty. Starting local database seed...");
    let count = 0;
    
    // We run loop for each class, category and items
    for (const [classId, categories] of Object.entries(localStudentsData)) {
      for (const [category, items] of Object.entries(categories)) {
        for (const item of items) {
          await addDoc(collection(db, "lessons"), {
            classId,
            category,
            id: Number(item.id),
            title: item.title,
            content: item.content,
          });
          count++;
        }
      }
    }

    console.log(`Migration: Successfully uploaded ${count} lessons to Firestore!`);
    return `success:${count}`;
  } catch (error) {
    console.error("Migration: Failed during Firestore seed:", error);
    throw error;
  }
};

/**
 * Checks if the lessons collection in Firestore is empty
 */
export const isDatabaseEmpty = async () => {
  try {
    const testQuery = query(collection(db, "lessons"), limit(1));
    const snapshot = await getDocs(testQuery);
    return snapshot.empty;
  } catch (error) {
    console.error("Error checking if database is empty:", error);
    return false;
  }
};
