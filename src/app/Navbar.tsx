import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/search" className={styles.navLink}>
          Search Classes
        </Link>
        <Link href="/tag" className={styles.navLink}>
          Browse by Tag
        </Link>
      </div>
    </nav>
  );
} 