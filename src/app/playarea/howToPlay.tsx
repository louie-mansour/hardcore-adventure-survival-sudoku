import { useState } from "react";
import { createPortal } from "react-dom";

export default function HowToPlay() {
  const [showModal, setShowModal] = useState(false);

  console.log('showModal', showModal)

  // Louie - you are here too
  // https://react.dev/reference/react-dom/createPortal
  // Use this to create a modal with the instructions on how to play
  return (
    <div className="flex flex-row justify-center gap-x-9">
      <p onClick={() => setShowModal(true)} >How to play</p>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </div>
  )
}



function ModalContent({ onClose } : { onClose: () => void }) {
  return (
    <div 
      style={{
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255)",
        height: '50%',
        width: '50%',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}