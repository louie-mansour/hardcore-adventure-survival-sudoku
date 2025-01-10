import { EFFECT_LIST } from "@/models/effect";
import { ITEM_LIST } from "@/models/item";
import { howToPlayText } from "@/text";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function HowToPlay() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-row justify-center gap-x-9">
      <p 
        onClick={() => setShowModal(true)} 
        className="cursor-pointer"
      >
        {howToPlayText}
      </p>
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
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div 
      className="modal relative bg-white p-4 border-solid border-2 border-black rounded-2xl"
      >
        <div className="m-4 flex flex-col gap-y-4 align-center justify-center">
          <div>
            <h2><strong>Instructions</strong></h2>
            <p>Hearts ❤️ are your life, if they run out it's game over ☠️.</p>
            <p>The board will catch fire 🔥, lights will dim 🌑, and daggers 🗡️ will stab.</p>
            <p>Items 🛡️ will help you overcome the challenges.</p>
          </div>
          <div>
            <h2><strong>Items Which Help You</strong></h2>
            <p><em>Solve the cell to pick up the item.</em></p>
            <ul>
            { ITEM_LIST.map(item => {
            return (
            <li key={item.name}>
              <p>{item.emoji}: {item.description}</p>
            </li>)
            })}
            </ul>
          </div>
          <div>
            <h2><strong>Effects Which Slow You Down</strong></h2>
            <ul>
            { EFFECT_LIST.map(effect => {
            return (
            <li key={effect.name}>
              <p>{effect.emoji}: {effect.description}</p>
            </li>)
            })}
            </ul>
          </div>
            <p className="text-center"><em>Can you beat the Sudoku before it beats you?</em></p>
        <div className="flex justify-center gap-x-4 mt-4">
          <button 
            disabled
            className="px-4 py-2 bg-gray-500 text-white rounded w-32"
          >
            No
          </button>
          <button
            onClick={onClose} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300 w-32"
          >
            Yes
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}