import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppProvider';
import type { Availability } from '../data/types';
import { Asset, Badge, Button, Dialog } from './ui';
import styles from './Shell.module.css';
const groups = [
  {
    title: 'MAIN',
    links: [
      { label: 'Live Workspace', path: '/workspace' },
      { label: 'Work Queue', path: '/queue' },
      { label: 'Follow-ups', path: '/follow-ups' },
    ],
  },
  {
    title: 'WORKFLOWS',
    links: [
      { label: 'Customers (CRM)', path: '/customers' },
      { label: 'Cases & Tickets', path: '/cases' },
      { label: 'Knowledge Base', path: '/knowledge' },
      { label: 'Supervisor View', path: '/supervisor' },
    ],
  },
];
export default function Shell() {
  const { state, dispatch, persistent } = useApp();
  const agent = state.agents.find((a) => a.id === state.currentAgentId)!;
  const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
  const noticeRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setNotificationsOpen(false);
    setSearch('');
    if (window.matchMedia('(max-width: 760px)').matches) setCollapsed(true);
  }, [location.pathname]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const change = (event: MediaQueryListEvent) => setCollapsed(event.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(''), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);
  useEffect(() => {
    if (!notificationsOpen) return;
    const close = (e: PointerEvent) => {
      if (!noticeRef.current?.contains(e.target as Node)) setNotificationsOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotificationsOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [notificationsOpen]);
  const workspacePath = `/workspace/${state.selectedInteractionId}`;
  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      <a href="#main-content" className={styles.skip}>
        Skip to content
      </a>
      <header className={styles.header} data-node-id="8:578">
        <div className={styles.headerLeft}>
          <Link className={styles.brand} to="/queue" aria-label="Xeloro home">
            <span className={styles.logo}>
              <span />
            </span>
            <strong>XELORO</strong>
          </Link>
          <button
            className={styles.menu}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={!collapsed}
            aria-controls="main-navigation"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
          <Button
            className={styles.newButton}
            disabled
            title="Ticket creation is not available in this foundation build"
          >
            <Asset name="header-0" />
            New Ticket / Call
            <Asset name="header-1" />
          </Button>
          <form
            className={styles.search}
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/queue?q=${encodeURIComponent(search)}`);
            }}
          >
            <Asset name="header-2" />
            <input
              aria-label="Search customer, phone, or case ID"
              placeholder="Search customer, phone, case ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Asset name="header-3" />
          </form>
        </div>
        <div className={styles.utilities}>
          <span className={styles.locale}>
            🇺🇸 <span>EN-US</span>
          </span>
          <div ref={noticeRef} className={styles.notificationWrap}>
            <Button
              variant="ghost"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Asset name="header-5" />
              <span className={styles.noticeDot} />
            </Button>
            {notificationsOpen && (
              <div className={styles.notifications}>
                <h3>Notifications</h3>
                {state.notifications.map((n) => (
                  <Link key={n.id} to={n.path}>
                    <strong>{n.title}</strong>
                    <span>{n.detail}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={styles.fullscreen}
            aria-label="Toggle fullscreen"
            onClick={async () => {
              try {
                if (document.fullscreenElement) await document.exitFullscreen();
                else await document.documentElement.requestFullscreen();
              } catch {
                setFeedback('Fullscreen is unavailable in this browser.');
              }
            }}
          >
            <Asset name="header-4" />
          </Button>
          <div className={styles.profile}>
            <span className={styles.avatar}>
              {agent.initials}
              <i data-status={agent.availability} />
            </span>
            <div>
              <div className={styles.profileLine}>
                <strong>{agent.name}</strong>
                <label className={styles.status} data-status={agent.availability}>
                  <span aria-hidden="true">●</span>
                  <select
                    aria-label="Agent availability"
                    value={agent.availability}
                    onChange={(e) =>
                      dispatch({ type: 'availability', value: e.target.value as Availability })
                    }
                  >
                    {['Ready', 'Busy', 'Break', 'Offline'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <Asset name="header-6" />
                </label>
              </div>
              <small>{agent.role}</small>
            </div>
          </div>
        </div>
      </header>
      {!collapsed && (
        <button
          className={styles.scrim}
          aria-label="Close navigation"
          onClick={() => setCollapsed(true)}
        />
      )}
      <aside
        className={styles.sidebar}
        id="main-navigation"
        aria-label="Main navigation"
        data-node-id="8:532"
        inert={collapsed}
        aria-hidden={collapsed}
      >
        <nav>
          {groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path === '/workspace' ? workspacePath : item.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive || (item.path === '/workspace' && location.pathname.startsWith('/workspace/')) ? styles.active : ''}`
                  }
                >
                  <span>{item.label}</span>
                  {item.path === '/queue' && (
                    <span className={styles.count}>
                      {state.interactions.filter((i) => i.status !== 'Ended').length}
                    </span>
                  )}
                  {item.path === '/follow-ups' && (
                    <span className={`${styles.count} ${styles.amber}`}>
                      {state.followUps.filter((f) => !f.completed).length}
                    </span>
                  )}
                  {item.path === '/cases' && (
                    <span className={styles.count}>
                      {state.cases.filter((c) => c.status !== 'Resolved').length}
                    </span>
                  )}
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.copilot}>
            <h3>Agent Copilot AI</h3>
            <p>Sample guidance and policy lookup for your customer interactions.</p>
            <Button onClick={() => dispatch({ type: 'assist' })} aria-pressed={state.assistEnabled}>
              Assist Mode {state.assistEnabled ? 'On' : 'Off'}
              <span className={styles.assistDot} data-active={state.assistEnabled} />
            </Button>
          </div>
          <button className={styles.reset} onClick={() => setResetOpen(true)}>
            Reset demo data
          </button>
        </div>
      </aside>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
        {!persistent && (
          <p className={styles.storageNotice} role="status">
            Browser storage is unavailable. Changes will last for this session.
          </p>
        )}
      </main>
      {feedback && (
        <div className={styles.toast} role="status">
          {feedback}
        </div>
      )}
      {resetOpen && (
        <Dialog title="Reset demo data?" onClose={() => setResetOpen(false)}>
          <p>
            Your availability, selected interaction, and assist preference will return to the sample
            starting state.
          </p>
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: 'reset' });
                setResetOpen(false);
                navigate('/queue');
                setFeedback('Demo data reset.');
              }}
            >
              Reset demo
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
