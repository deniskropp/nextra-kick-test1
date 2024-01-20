// Example from https://beta.reactjs.org/learn

import { useState } from 'react'
import styles from './generate.module.css'

function MyButton() {
  function handleClick() {
  }

  return (
    <div>
      <button onClick={handleClick} className={styles.generate}>
        Generate
      </button>
    </div>
  )
}

export default function Generate() {
  return <MyButton />
}
