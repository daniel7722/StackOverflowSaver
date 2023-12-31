'use client';
import React, { useState } from 'react';
import styles from './modal.module.css';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { FaCheck } from 'react-icons/fa';

const Modal = ({ data, close, setQuestions, questions }) => {
  const { q_id, a_id, question, answer } = data;
  const { data: session } = useSession();
  const { user } = session;
  console.log('Modal data:', data); // Add this line to log the data prop

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    console.log('Delete button clicked'); // Simplified log statement
    console.log('Deleting:', { q_id, a_id, user }); // Log the deletion data
    if (confirmDelete) {
      try {
        console.log('Delete button clicked'); // Simplified log statement
        const response = await fetch('/api/del_from_db', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q_id, a_id, user })
        });

        const result = await response.json();

        console.log('Delete response:', result); // Log the response

        if (result.success) {
          close();
          const updatedQuestions = questions.filter(question => question.q_id !== q_id);
          setQuestions(updatedQuestions);
        } else {
        // Handle failure
        }
      } catch (error) {
        console.error('Error deleting question-answer pair', error);
      }
    } else {
      // Show confirmation modal when the user clicks delete button
      setConfirmDelete(true);
    }
  };
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

  const modalRowVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '10%' }
  };

  return (
    <motion.div
      data-testid="modal-component2"
      className={styles.modal}
      variants={modalVariants}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div className={styles.modal__info} variants={modalInfoVariants}>
        <motion.div className={styles.modal__row} variants={modalRowVariants}>
          <span className={styles.modal__price}>{question}</span>
        </motion.div>
        <motion.div
          className={styles.modal__descriptionwrapper}
          variants={modalRowVariants}
        >
          <p className={styles.modal__description} dangerouslySetInnerHTML={{ __html: answer }} />
        </motion.div>
          <motion.button
          data-testid="delete-button"
          className={styles.modal__closewrapper}
          whileHover={{ scale: 1.2 }}
          onClick={handleDelete} // Changed from 'close' to 'handleDelete'
        >
          {confirmDelete ? <FaCheck className={styles.modal__closeicon}/> : <RiDeleteBin6Fill className={styles.modal__closeicon} />}
        </motion.button>
       </motion.div>
    </motion.div>
  );
};

export default Modal;
