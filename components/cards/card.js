'use client';
import React, { useState } from 'react';
import Question from './question';
import Overlay from './overlay';
import Modal from './modal';
import { AnimatePresence } from 'framer-motion';

const Card = ({ data, setQuestions, questions }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Question data-testid="question-component" data={data} open={openModal} />
      <AnimatePresence>
        {open && (
          <Overlay data-testid="overlay-component2" close={closeModal}>
            <Modal data-testid="modal-component" data={data} close={closeModal} setQuestions={setQuestions} questions={questions}/>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;
