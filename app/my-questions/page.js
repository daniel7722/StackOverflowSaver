'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './q.module.css';
import Card from '../../components/cards/card';

export default function QuestionList () {
  const [questions, setQuestions] = useState([]);

  const { data: session } = useSession(); // Use the session

  // Fetches initial data from the database
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const response = await fetch('/api/read_table', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: session?.user }) // Use username from session
          });

          const result = await response.json();
          setQuestions(result.data || []);
        } catch (error) {
          console.error('Error fetching data from Database', error);
        }
      }
    };

    fetchData();
  }, [session]); // Dependency on session

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
  };
  return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">My Questions</h1>

            <div className="mt-4" />

            {/* Search Bar and Answer Rank Input */}
            <div className="flex items-center">
                <input
                    type="text"
                    name="stackoverflowUrl"
                    id="stackoverflowUrl"
                    className="flex-1 block h-10 rounded-md border-0 py-2 pl-7 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter Stack Overflow URL"
                />

                <div className="ml-2" />

                <input
                    type="text"
                    name="answerRank"
                    id="answerRank"
                    className="w-16 h-10 rounded-md border-0 py-2 pl-4 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Rank"
                />

                <div className="ml-2" />

                <button
                    type="button"
                    className="h-10 rounded-md bg-blue-500 text-white px-3 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            {/* Question List */}
            <div className={styles.App}>
                <div className={styles.properties}>
                    {questions.map((question) => (
                        <Card data={question} key={question.q_id} />
                    ))}
                </div>
            </div>
        </div>
  );
}
