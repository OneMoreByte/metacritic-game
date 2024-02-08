import Home from "./views/home";
import Image from "next/image";
import styles from "./page.module.css";

export default function App() {
  return (
    <main className={styles.main}>
      <Home/>
    </main>
  );
}
