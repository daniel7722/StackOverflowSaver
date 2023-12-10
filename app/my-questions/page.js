'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './q.module.css';
import Card from '../../components/cards/card';
import FormCard from '@/components/cards/formCard';

export default function QuestionList () {
  const [questions, setQuestions] = useState([]);

  const { data: session } = useSession(); // Use the session

  const formCard = { question: '+' };

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

  return (
        <div>
            <div className={styles.container}>
            <h1 className="text-3xl font-semibold text-white mb-4">{session?.user}</h1>
            </div>
            {/* Question List */}
            <div className={styles.App}>
                <div className={styles.properties}>
                    <FormCard data={formCard} setQuestions={setQuestions} />
                    {questions.map((question) => (
              <Card data={question} key={question.q_id} setQuestions={setQuestions} questions={questions}/>
                    ))}
                </div>
            </div>
        </div>
  );
}
