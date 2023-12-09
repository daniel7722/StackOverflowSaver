import React, { useState } from "react";
import Question from "./question";
import Overlay from "./overlay";
import Modal from "./modal";
import { AnimatePresence } from "framer-motion";

const Card = ({ data }) => {
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
            <Modal data-testid="modal-component" data={data} close={closeModal} />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;