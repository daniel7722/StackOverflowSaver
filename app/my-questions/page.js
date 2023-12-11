'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './q.module.css';
import Card from '../../components/cards/card';
import FormCard from '@/components/cards/formCard';
import { IoSearch, IoSettingsSharp } from 'react-icons/io5';
import { motion } from 'framer-motion';

export default function QuestionList () {
  const [questions, setQuestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteAcc, setConfirmDeleteAcc] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (confirmDeleteAcc) {
      try {
        const response = await fetch('/api/del_user', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: session?.user })
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = '/';
          setConfirmDeleteAcc(false);
        } else {
          // Handle failure
        }
      } catch (error) {
        console.error('Error deleting question-answer pair', error);
      }
    } else {
      setConfirmDeleteAcc(true);
    }
  };

  return (
        <div>
            <div className={styles.container}>
              <div></div>
            <h1 className={styles.username}>{session?.user}</h1>
            <motion.button
          data-testid="settings-icon"
          className={styles.settingsWrapper}
          whileHover={{ scale: 1.2 }}
          onClick={() => setShowMenu(!showMenu)}
        >
            <IoSettingsSharp className={styles.settings} />
            </motion.button>
            {showMenu && (
          <div className={styles.sidebar}>
            <button className={styles.signOut} onClick={() => signOut()} >Sign Out</button>
            <button className={styles.delete} onClick={() => handleDeleteAccount()}>{confirmDeleteAcc ? 'Confirm Delete' : 'Delete Account' }
            </button>
          </div>
            )}
            </div>
            <div className={styles.searchContainer}>
            <IoSearch className={styles.searchIcon}/>
            <input
        id="searchInput"
        type="text"
        maxLength={70}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.search}
      />
      </div>
            {/* Question List */}
            <div className={styles.App}>
                <div className={styles.properties}>
                    <FormCard data={formCard} setQuestions={setQuestions} />
                    {questions
                      .filter(({ question }) =>
                        question.toLowerCase().trim().includes(searchText.toLowerCase().trim())
                      )
                      .map((question) => (
              <Card data={question} key={question.q_id} setQuestions={setQuestions} questions={questions}/>
                      ))}
                </div>
            </div>
        </div>
  );
}
