'use client';
import React, { useState } from 'react';
import FormQuestion from './formQuestion';
import Overlay from './overlay';
import FormModal from './formModal';
import { AnimatePresence } from 'framer-motion';

const FormCard = ({ data, setQuestions }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <FormQuestion data-testid="question-component" data={data} open={openModal} />
      <AnimatePresence>
        {open && (
          <Overlay data-testid="overlay-component2" close={closeModal}>
            <FormModal data-testid="formModal-component" close={closeModal} setQuestions={setQuestions} />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormCard;
