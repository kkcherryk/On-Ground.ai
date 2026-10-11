import type { ReactNode } from 'react';
import styles from './PageHeading.module.css';
export default function PageHeading({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.heading}>
      <div>
        <div className={styles.breadcrumb}>
          <span>Home</span>
          <span>/</span>
          <span>Workflows</span>
          <span>/</span>
          <strong>{breadcrumb}</strong>
        </div>
        <h1>{title}</h1>
      </div>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
