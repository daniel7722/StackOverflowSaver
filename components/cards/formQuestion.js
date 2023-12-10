'use client';
import React from 'react';
import styles from './question.module.css';
import { motion } from 'framer-motion';

const FormQuestion = ({ data, open }) => {
  const { question } = data;

  return (
    <motion.div
      className={styles.question}
      onClick={open}
      whileHover={{ scale: 1.1 }}
    >
      <div
        data-testid="question-component"
        className={styles.add}
      >
        {question}
      </div>
    </motion.div>
  );
};

export default FormQuestion;
