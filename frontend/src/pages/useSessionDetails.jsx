import { useEffect, useState } from 'react';

function useSessionDetails(session) {
    const [quizDetails, setQuizDetails] = useState(null);
    const [flashcardDetails, setFlashcardDetails] = useState(null);

    useEffect(() => {
        const fetchCategoryContent = async () => {
            if (session.category === 'quiz' && session.quiz) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/chat/quizzes/${session.quiz}`);
                    const data = await response.json();
                    setQuizDetails(data);
                } catch (error) {
                    console.error('Error fetching quiz content:', error);
                }
            } else if (session.category === 'flashcard' && session.flashcards) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/chat/flashcards/${session.flashcards}`);
                    const data = await response.json();
                    setFlashcardDetails(data);
                } catch (error) {
                    console.error('Error fetching flashcard content:', error);
                }
            }
        };

        fetchCategoryContent();
    }, [session]);

    return { quizDetails, flashcardDetails };
}

export default useSessionDetails;
