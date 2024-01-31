import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

const FakeCursorClass = "fake-cursor";

export default function HomeScreen() {
  const cursorRef = useRef(null);
  const btnRef = useRef(null);
  const sectionRef = useRef(null);
  const [end, setEnd] = useState(false);

  const [cursorMultiplier, setCursorMultiplier] = useState(0);

  useEffect(() => {
    trackMousePosition(cursorRef.current);
    btnRandomiser(btnRef.current);
  }, []);

  useEffect(() => {
    btnRandomiser(btnRef.current);
    createNCursors(Math.pow(2, cursorMultiplier) - 1, sectionRef.current);
  }, [cursorMultiplier]);

  function resetGame() {
    setCursorMultiplier(0);
  }

  const score = Math.pow(2, cursorMultiplier);

  return (
    <>
      <section
        className={styles.section}
        id="section"
        ref={sectionRef}
        onClick={() => {
          alert(`You were teriffic. Score was ${score}`);
          resetGame();
        }}
      >
        <div className={styles.customCursor} ref={cursorRef} id="realCursor" />
        <button
          className={styles.btn}
          ref={btnRef}
          onClick={(e) => {
            e.stopPropagation();
            setCursorMultiplier(cursorMultiplier + 1);
          }}
        >
          Click on Me!
        </button>
        <div className={styles.scoreBoard}>
          <span>{score}</span>
        </div>
        {cursorMultiplier === 0 && (
          <h1 className={styles.text}>
            You have to click on the button using cursor and yes, this is indeed
            a game :)
          </h1>
        )}
      </section>
    </>
  );
}

function createNCursors(n, section) {
  deleteFakeCursors();
  while (n > 0) {
    n--;
    const cursor = document.createElement("div");
    const [xPos, yPos] = giveRandomCoords();
    cursor.classList.add(FakeCursorClass);
    cursor.style.position = "absolute";
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    cursor.style.backgroundColor = "white";
    cursor.style.zIndex = 999;
    cursor.style.top = `${yPos}px`;
    cursor.style.left = `${xPos}px`;
    cursor.style.borderRadius = "100%";
    section.appendChild(cursor);
  }
}

function btnRandomiser(btn) {
  const [xPos, yPos] = giveRandomCoords();
  btn.style.top = `${yPos}px`;
  btn.style.left = `${xPos}px`;
}

function trackMousePosition(cursor) {
  document.addEventListener("mousemove", (e) => {
    const xPos = e.clientX;
    const yPos = e.clientY;
    cursor.style.top = `${yPos}px`;
    cursor.style.left = `${xPos}px`;
    console.log(e.movementX, e.movementY);
    moveFakeCursors(
      [e.movementX, e.movementY],
      [window.innerWidth, window.innerHeight],
    );
  });
}

function giveRandomCoords() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const xPos = (Math.random() * 3000) % windowWidth;
  const yPos = (Math.random() * 3000) % windowHeight;
  return [xPos, yPos];
}

function deleteFakeCursors() {
  const fakeCursors = document.querySelectorAll(`.${FakeCursorClass}`);
  fakeCursors.forEach((node) => {
    node.parentNode.removeChild(node);
  });
}

function moveFakeCursors([xPos, yPos], [maxWidth, maxheight]) {
  const fakeCursors = document.querySelectorAll(`.${FakeCursorClass}`);
  fakeCursors.forEach((node) => {
    const newXPos =
      (xPos + maxWidth + parseInt(node.style.left.replace("px", ""))) %
      maxWidth;
    const newYPos =
      (yPos + maxheight + parseInt(node.style.top.replace("px", ""))) %
      maxheight;
    node.style.top = `${newYPos}px`;
    node.style.left = `${newXPos}px`;
  });
}
