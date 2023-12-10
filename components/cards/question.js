'use client';
import React from 'react';
import styles from './question.module.css';
import { motion } from 'react-magic-motion';

const Question = ({ data, open }) => {
  const { question } = data;

  return (
    <motion.div
      className={styles.question}
      onClick={open}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1, transition: { scale: { type: 'spring' } } }}
    >
      <div
        data-testid="question-component"
        className={styles.question__content}
      >
        {question}
      </div>
    </motion.div>
  );
};

export default Question;
