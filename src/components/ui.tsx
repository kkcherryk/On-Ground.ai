import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './ui.module.css';
export function Asset({ name }: { name: string }) {
  return <img className={styles.asset} src={`/assets/${name}.svg`} alt="" aria-hidden="true" />;
}
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button {...props} className={`${styles.button} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
export function Badge({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'neutral';
}) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`${styles.card} ${className}`}>{children}</section>;
}
export function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className={styles.dialogHeader}>
        <h2 id="dialog-title">{title}</h2>
        <Button variant="ghost" onClick={onClose} aria-label="Close dialog">
          ×
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={styles.empty}>
      <span aria-hidden="true">◇</span>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
