import React from 'react';
import styles from './modal.module.css';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const FormModal = ({ close, setQuestions }) => {
  const { data: session } = useSession();

  const modalVariants = {
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.2 }
    },
    closed: { opacity: 0 }
  };

  const modalInfoVariants = {
    open: { opacity: 1, transition: { staggerChildren: 0.2 } },
    closed: { opacity: 0 }
  };

  const extractQuestionId = (url) => {
    const regex = /\/questions\/(\d+)\//;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    const stackoverflowUrl = document.getElementById('stackoverflowUrl').value;
    const questionId = extractQuestionId(stackoverflowUrl);
    const answerRank = document.getElementById('answerRank').value;

    if (!questionId) {
      console.error('Invalid Stack Overflow URL');
      return;
    }

    try {
      const apiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}?order=desc&sort=activity&site=stackoverflow`;
      const apiResponse = await fetch(apiUrl);
      const apiData = await apiResponse.json();
      const title = apiData.items[0]?.title;

      const answersUrl = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=desc&sort=votes&site=stackoverflow&filter=!nNPvSNe7D9`;
      const answersResponse = await fetch(answersUrl);
      const answersData = await answersResponse.json();
      const topAnswer = answersData.items[answerRank - 1];
      const answerBody = topAnswer?.body;
      const answerId = topAnswer?.answer_id;

      if (!topAnswer) {
        console.error('Answer with the provided rank does not exist');
        return;
      }

      if (session && session.user) {
        // Send this data to your backend
        const saveResponse = await fetch('/api/write_to_db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question: {
              q_id: questionId,
              question: title
            },
            answer: {
              a_id: answerId,
              answer: answerBody
            },
            username: session?.user // Using session user's name
          })
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          // Update your questions state to reflect the new data
          setQuestions(prevQuestions => [...prevQuestions, { q_id: questionId, question: title, answer: answerBody }]);
        }
      } else {
        console.error('User not logged in');
      }
    } catch (error) {
      console.error('Error fetching data from Stack Overflow API', error);
    }
    close();
  };

  return (
    <motion.div
      data-testid="modal-component2"
      className={styles.modal}
      variants={modalVariants}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div className={styles.modal__form} variants={modalInfoVariants}>
        <input
            type="text"
            name="stackoverflowUrl"
            id="stackoverflowUrl"
            className="flex-1 block h-10 rounded-md border-0 py-2 pl-7 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter Stack Overflow URL"
        />
        <input
            type="text"
            name="answerRank"
            id="answerRank"
            className="w-16 h-10 rounded-md border-0 py-2 pl-4 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Rank"
        />
        <motion.button
          data-testid="submit-button"
          whileHover={{ scale: 1.2 }}
          onClick={handleSubmit}
        >
            Submit
        </motion.button>
       </motion.div>
    </motion.div>
  );
};

export default FormModal;
